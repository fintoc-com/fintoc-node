import test from 'ava';

import { WebhookSignatureError } from '../lib/errors';
import { WebhookSignature } from '../lib/webhook';

const testPayloadRaw = `{
  "id": "evt_2AaZeLCz0GjOW5zj",
  "type": "payment_intent.succeeded",
  "mode": "test",
  "created_at": "2025-04-05T21:57:31.834Z",
  "data": {
    "id": "pi_2vKOKniSGXRhXTKrJ67VXZxGCVt",
    "mode": "test",
    "amount": 1,
    "object": "payment_intent",
    "status": "succeeded",
    "currency": "MXN",
    "metadata": {},
    "created_at": "2025-04-05T21:57:17Z",
    "expires_at": null,
    "error_reason": null,
    "payment_type": "bank_transfer",
    "reference_id": null,
    "widget_token": null,
    "customer_email": null,
    "sender_account": {
      "type": "checking_account",
      "number": "501514890244223279",
      "holder_id": "mfiu593501oe4",
      "institution_id": "mx_stp"
    },
    "business_profile": null,
    "transaction_date": null,
    "recipient_account": {
      "type": "checking_account",
      "number": "646180357600000000",
      "holder_id": "fsm211008hz9",
      "institution_id": "mx_stp"
    },
    "payment_type_options": {}
  },
  "object": "event"
}`;
const testPayload = testPayloadRaw.replace(/\s+/g, '');
const testSecret = 'whsec_test_secret';
const testTimestamp = 1743890251;
const testHeader = `t=${testTimestamp},v1=11b98dd8f5500109246aa4d9875fad2e97d462560b012a5f50ff924411de0b0f`;

const getCurrentTimestamp = (): number => Math.floor(Date.now() / 1000);

test('WebhookSignature.verifyHeader should succeed for valid signature and recent timestamp', (t) => {
  const largeTolerance = Math.abs(getCurrentTimestamp() - testTimestamp) + 100;
  t.notThrows(() => WebhookSignature.verifyHeader(
    testPayload,
    testHeader,
    testSecret,
    largeTolerance,
  ));
});

test('WebhookSignature.verifyHeader should throw error for signature mismatch', (t) => {
  const badHeader = `t=${testTimestamp},v1=bad_signature`;
  const largeTolerance = Math.abs(getCurrentTimestamp() - testTimestamp) + 100;
  const error = t.throws(() => {
    WebhookSignature.verifyHeader(testPayload, badHeader, testSecret, largeTolerance);
  }, { instanceOf: WebhookSignatureError });
  t.is(error?.message, 'Signature mismatch. The webhook signature is not valid.');
});

test('WebhookSignature.verifyHeader should throw error for old timestamp', (t) => {
  const error = t.throws(() => {
    WebhookSignature.verifyHeader(testPayload, testHeader, testSecret);
  }, { instanceOf: WebhookSignatureError });
  t.true(error?.message.startsWith('Timestamp outside the tolerance zone'));
});

test('WebhookSignature.verifyHeader should throw for empty header string', (t) => {
  const error = t.throws(() => {
    WebhookSignature.verifyHeader(testPayload, '', testSecret);
  }, { instanceOf: WebhookSignatureError });
  t.is(error?.message, 'Missing Fintoc-Signature header.');
});

test('WebhookSignature.verifyHeader should throw for header with empty timestamp and signature values', (t) => {
  const header = 't=,v1=';
  const error = t.throws(() => {
    WebhookSignature.verifyHeader(testPayload, header, testSecret);
  }, { instanceOf: WebhookSignatureError });
  t.is(error?.message, 'Unable to extract timestamp and signatures from header');
});

test('WebhookSignature.verifyHeader should throw for header with non-numeric timestamp', (t) => {
  const header = 't=foo,v1=bar';
  const error = t.throws(() => {
    WebhookSignature.verifyHeader(testPayload, header, testSecret);
  }, { instanceOf: WebhookSignatureError });
  t.is(error?.message, 'Unable to extract timestamp and signatures from header');
});

test('WebhookSignature.verifyHeader should throw for header missing v1 part', (t) => {
  const header = `t=${testTimestamp}`;
  const error = t.throws(() => {
    WebhookSignature.verifyHeader(testPayload, header, testSecret);
  }, { instanceOf: WebhookSignatureError });
  t.is(error?.message, 'Unable to extract timestamp and signatures from header');
});

test('WebhookSignature.verifyHeader should throw for header missing t part', (t) => {
  const signature = '11b98dd8f5500109246aa4d9875fad2e97d462560b012a5f50ff924411de0b0f';
  const header = `v1=${signature}`;
  const error = t.throws(() => {
    WebhookSignature.verifyHeader(testPayload, header, testSecret);
  }, { instanceOf: WebhookSignatureError });
  t.is(error?.message, 'Unable to extract timestamp and signatures from header');
});

test('WebhookSignature.verifyHeader should throw error for missing secret', (t) => {
  const largeTolerance = Math.abs(getCurrentTimestamp() - testTimestamp) + 100;
  const error = t.throws(() => {
    WebhookSignature.verifyHeader(testPayload, testHeader, '', largeTolerance);
  }, { instanceOf: WebhookSignatureError });
  t.is(error?.message, 'Webhook secret is required for verification.');
});

test('WebhookSignature.verifyHeader should handle custom tolerance', (t) => {
  const error = t.throws(() => {
    WebhookSignature.verifyHeader(testPayload, testHeader, testSecret);
  }, { instanceOf: WebhookSignatureError });
  t.true(error?.message.startsWith('Timestamp outside the tolerance zone'));

  const largeTolerance = Math.abs(getCurrentTimestamp() - testTimestamp) + 100;
  t.notThrows(() => WebhookSignature.verifyHeader(
    testPayload,
    testHeader,
    testSecret,
    largeTolerance,
  ));
});
