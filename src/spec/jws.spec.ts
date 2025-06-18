import * as crypto from 'crypto';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import test from 'ava';

import { JWSSignature } from '../lib/jws';

function generateTestKeyPair() {
  return crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
}

function createTempKeyFile(privateKey: string): string {
  const tempDir = os.tmpdir();
  const tempFile = path.join(tempDir, `test-key-${Date.now()}.pem`);
  fs.writeFileSync(tempFile, privateKey);
  return tempFile;
}

function parseJWSHeader(jwsHeader: string) {
  const [protectedHeaderBase64] = jwsHeader.split('.');
  const protectedHeader = JSON.parse(Buffer.from(protectedHeaderBase64, 'base64url').toString());
  return protectedHeader;
}

function verifyJWSSignature(jwsHeader: string, payload: string, publicKey: string): boolean {
  const [protectedHeaderBase64, signatureBase64] = jwsHeader.split('.');
  const payloadBase64 = Buffer.from(payload).toString('base64url');
  const signingInput = `${protectedHeaderBase64}.${payloadBase64}`;

  const signature = Buffer.from(signatureBase64, 'base64url');

  const verifier = crypto.createVerify('sha256');
  verifier.update(signingInput);
  return verifier.verify(publicKey, signature);
}

test.beforeEach((t) => {
  const ctx: any = t.context;
  const keyPair = generateTestKeyPair();
  ctx.privateKey = keyPair.privateKey;
  ctx.publicKey = keyPair.publicKey;
  ctx.testPayload = '{"test": "data"}';
});

test.afterEach((t) => {
  const ctx: any = t.context;
  if (ctx.tempKeyFile && fs.existsSync(ctx.tempKeyFile)) {
    fs.unlinkSync(ctx.tempKeyFile);
  }
});

test('JWSSignature initialization with PEM string', (t) => {
  const ctx: any = t.context;
  const jws = new JWSSignature(ctx.privateKey);
  t.truthy(jws);
});

test('JWSSignature initialization with PEM buffer', (t) => {
  const ctx: any = t.context;
  const keyBuffer = Buffer.from(ctx.privateKey, 'utf8');
  const jws = new JWSSignature(keyBuffer);
  t.truthy(jws);
});

test('JWSSignature initialization with file path', (t) => {
  const ctx: any = t.context;
  const tempKeyFile = createTempKeyFile(ctx.privateKey);
  ctx.tempKeyFile = tempKeyFile;

  const jws = new JWSSignature(tempKeyFile);
  t.truthy(jws);
});

test('JWSSignature throws error with invalid input type', (t) => {
  t.throws(() => {
    // eslint-disable-next-line no-new
    new JWSSignature(123 as any);
  }, { message: /Private key must be a string/ });
});

test('JWSSignature throws error with non-existent file path', (t) => {
  t.throws(() => {
    // eslint-disable-next-line no-new
    new JWSSignature('/non/existent/path.pem');
  }, { message: /Failed to read private key file/ });
});

test('JWSSignature throws error with invalid key format', (t) => {
  t.throws(() => {
    // eslint-disable-next-line no-new
    new JWSSignature('invalid-key-content');
  }, { message: /Invalid private key format/ });
});

test('generateHeader creates valid JWS header structure', (t) => {
  const ctx: any = t.context;
  const jws = new JWSSignature(ctx.privateKey);
  const header = jws.generateHeader(ctx.testPayload);

  t.is(header.split('.').length, 2);

  const protectedHeader = parseJWSHeader(header);
  t.is(protectedHeader.alg, 'RS256');
  t.truthy(protectedHeader.nonce);
  t.truthy(protectedHeader.ts);
  t.deepEqual(protectedHeader.crit, ['ts', 'nonce']);
});

test('generateHeader creates valid cryptographic signature', (t) => {
  const ctx: any = t.context;
  const jws = new JWSSignature(ctx.privateKey);
  const header = jws.generateHeader(ctx.testPayload);

  const isValid = verifyJWSSignature(header, ctx.testPayload, ctx.publicKey);
  t.true(isValid);
});

test('generateHeader timestamp is current', (t) => {
  const ctx: any = t.context;
  const jws = new JWSSignature(ctx.privateKey);
  const header = jws.generateHeader(ctx.testPayload);

  const protectedHeader = parseJWSHeader(header);
  const headerTimestamp = protectedHeader.ts;
  const currentTimestamp = Math.floor(Date.now() / 1000);

  t.true(Math.abs(currentTimestamp - headerTimestamp) <= 10);
});

test('generateHeader creates unique nonces', (t) => {
  const ctx: any = t.context;
  const jws = new JWSSignature(ctx.privateKey);

  const header1 = jws.generateHeader(ctx.testPayload);
  const header2 = jws.generateHeader(ctx.testPayload);

  const protectedHeader1 = parseJWSHeader(header1);
  const protectedHeader2 = parseJWSHeader(header2);

  t.not(protectedHeader1.nonce, protectedHeader2.nonce);
});

test('generateHeader works with empty payload', (t) => {
  const ctx: any = t.context;
  const jws = new JWSSignature(ctx.privateKey);
  const header = jws.generateHeader('');

  const isValid = verifyJWSSignature(header, '', ctx.publicKey);
  t.true(isValid);
});

test('generateHeader works with complex JSON payload', (t) => {
  const ctx: any = t.context;
  const complexPayload = JSON.stringify({
    user: 'test@example.com',
    data: { nested: { value: 123 }, array: [1, 2, 3] },
    timestamp: Date.now(),
  });

  const jws = new JWSSignature(ctx.privateKey);
  const header = jws.generateHeader(complexPayload);

  const isValid = verifyJWSSignature(header, complexPayload, ctx.publicKey);
  t.true(isValid);
});

test('nonce is hexadecimal string of correct length', (t) => {
  const ctx: any = t.context;
  const jws = new JWSSignature(ctx.privateKey);
  const header = jws.generateHeader(ctx.testPayload);

  const protectedHeader = parseJWSHeader(header);
  const { nonce } = protectedHeader;

  t.is(nonce.length, 32);
  t.regex(nonce, /^[0-9a-f]+$/);
});
