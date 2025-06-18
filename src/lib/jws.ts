import * as crypto from 'crypto';
import * as fs from 'fs';

/**
 * Class to handle JWS signature generation for Fintoc API requests.
 */
export class JWSSignature {
  private privateKey: crypto.KeyObject;

  /**
   * Create a new JWSSignature instance with a private key.
   *
   * @param privateKey - The private key in one of these formats:
   *   - String containing PEM-formatted key
   *   - Buffer containing PEM-formatted key
   *   - String path to a PEM key file
   */
  constructor(privateKey: string | Buffer) {
    this.privateKey = JWSSignature.loadPrivateKey(privateKey);
  }

  /**
   * Generate a JWS signature header for the given payload
   * @param rawBody - The request body as a string
   * @returns The JWS signature header to be used in 'Fintoc-JWS-Signature' header.
   */
  public generateHeader(rawBody: string): string {
    const headers = {
      alg: 'RS256',
      nonce: JWSSignature.generateNonce(),
      ts: Math.floor(Date.now() / 1000),
      crit: ['ts', 'nonce'],
    };

    const protectedBase64 = Buffer.from(JSON.stringify(headers)).toString('base64url');
    const payloadBase64 = Buffer.from(rawBody).toString('base64url');
    const signingInput = `${protectedBase64}.${payloadBase64}`;

    const signature = this.createSignature(signingInput);
    const signatureBase64 = Buffer.from(signature).toString('base64url');

    return `${protectedBase64}.${signatureBase64}`;
  }

  private static loadPrivateKey(keyInput: string | Buffer): crypto.KeyObject {
    let keyMaterial: string | Buffer;

    if (Buffer.isBuffer(keyInput)) {
      keyMaterial = keyInput;
    } else if (typeof keyInput === 'string') {
      if (JWSSignature.isFilePath(keyInput)) {
        try {
          keyMaterial = fs.readFileSync(keyInput, 'utf8');
        } catch (error) {
          throw new Error(`Failed to read private key file: ${keyInput}. ${error}`);
        }
      } else {
        keyMaterial = keyInput;
      }
    } else {
      throw new Error('Private key must be a string (PEM content or file path) or Buffer');
    }

    try {
      return crypto.createPrivateKey(keyMaterial);
    } catch (error) {
      throw new Error(`Invalid private key format: ${error}`);
    }
  }

  private static isFilePath(input: string): boolean {
    if (!input || typeof input !== 'string') {
      return false;
    }

    const trimmedInput = input.trim();

    if (trimmedInput.includes('-----BEGIN') && trimmedInput.includes('-----END')) {
      return false;
    }

    if (trimmedInput.includes('\n') || trimmedInput.includes('\r')) {
      return false;
    }

    if (trimmedInput.length > 1000) {
      return false;
    }

    const hasPathSeparators = trimmedInput.includes('/') || trimmedInput.includes('\\');
    const hasFileExtension = /\.[a-zA-Z0-9]{1,10}$/.test(trimmedInput);
    const looksLikeAbsolutePath = /^\/|^[a-zA-Z]:[\\\\//]|^~/.test(trimmedInput);

    return hasPathSeparators || (hasFileExtension && looksLikeAbsolutePath);
  }

  private static generateNonce(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  private createSignature(data: string): Buffer {
    return crypto.createSign('sha256')
      .update(data)
      .sign({ key: this.privateKey, padding: crypto.constants.RSA_PKCS1_PADDING });
  }
}
