import { createReadStream, readFileSync } from 'fs';
import { basename, resolve } from 'path';
import { PassThrough } from 'stream';

import test from 'ava';

import { buildForm } from '../lib/resourceHandlers';
import { MultipartArguments } from '../types';

test('multipart infers the filename of a file stream without traversing its properties', async (t) => {
  const filePath = resolve('src/spec/fixtures/recipient_cl.json');
  const file = createReadStream(filePath);
  t.teardown(() => file.destroy());
  const form = buildForm({ file: { data: file } } as unknown as MultipartArguments);
  const output = new PassThrough();
  form.on('error', (error) => output.destroy(error));
  form.pipe(output);
  const chunks: Buffer[] = [];
  for await (const chunk of output) {
    chunks.push(Buffer.from(chunk));
  }
  const body = Buffer.concat(chunks).toString();

  t.true(body.includes(`name="file"; filename="${basename(filePath)}"`));
  t.true(body.includes(readFileSync(filePath, 'utf8')));
  t.false(body.includes('name="file[data]'));
});

test('multipart sends a buffer without a filename as one part', (t) => {
  const data = Buffer.from('pdf bytes');
  const form = buildForm({ file: { data } } as unknown as MultipartArguments);
  const body = form.getBuffer().toString();

  t.is(body.split('Content-Disposition: form-data;').length - 1, 1);
  t.true(body.includes('name="file"'));
  t.true(body.includes('pdf bytes'));
  t.false(body.includes('file[data]'));
});

test('multipart rejects unsupported objects instead of traversing them', (t) => {
  for (const value of [Buffer.from('raw bytes'), new Date(), new PassThrough()]) {
    t.throws(() => buildForm({ nested: { value } } as unknown as MultipartArguments), {
      instanceOf: TypeError,
      message: 'Unsupported multipart value for "nested[value]"',
    });
  }
});
