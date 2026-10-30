import test from 'ava';
import axios from 'axios';
import sinon, { SinonStub } from 'sinon';

import { Fintoc } from '../lib/core';

// The client caches its axios instance, so every test shares one stubbed request
const request: SinonStub = sinon.stub();
let create: SinonStub;

test.before(() => {
  create = sinon.stub(axios, 'create').returns({ request } as any);
});

test.after.always(() => create.restore());

test.beforeEach(() => {
  request.reset();
  request.resolves({ data: {} });
});

test.serial('manager delete sends no query parameters', async (t) => {
  await new Fintoc('sk_test_delete').v2.recipients.delete('rcp_123');

  const config = request.firstCall.args[0];
  t.is(config.method, 'delete');
  t.true(config.url.endsWith('/v2/recipients/rcp_123'));
  t.deepEqual(config.params, {});
});

test.serial('nested delete resolves the path without sending its placeholders', async (t) => {
  await new Fintoc('sk_test_delete').v2.subscriptions.items.delete('si_123', {
    subscription_id: 'sub_123',
  });

  const config = request.firstCall.args[0];
  t.true(config.url.endsWith('/v2/subscriptions/sub_123/items/si_123'));
  t.deepEqual(config.params, {});
});

test.serial('nested update sends only the body fields', async (t) => {
  await new Fintoc('sk_test_update').v2.invoices.lines.update('il_123', {
    invoice_id: 'in_123',
    quantity: 2,
  });

  const config = request.firstCall.args[0];
  t.is(config.method, 'patch');
  t.true(config.url.endsWith('/v2/invoices/in_123/lines/il_123'));
  t.deepEqual(JSON.parse(config.data), { quantity: 2 });
});

test.serial('actions send neither path_ nor idempotency_key in the body', async (t) => {
  await new Fintoc('sk_test_cancel').refunds.cancel('re_123', { idempotency_key: 'idem_123' });

  const config = request.firstCall.args[0];
  t.true(config.url.endsWith('/v1/refunds/re_123/cancel'));
  t.deepEqual(JSON.parse(config.data), {});
  t.is(config.headers['Idempotency-Key'], 'idem_123');
});

test.serial('payment link cancel is a PATCH with an empty body', async (t) => {
  await new Fintoc('sk_test_cancel').paymentLinks.cancel('pl_123');

  const config = request.firstCall.args[0];
  t.is(config.method, 'patch');
  t.true(config.url.endsWith('/v1/payment_links/pl_123/cancel'));
  t.deepEqual(JSON.parse(config.data), {});
});
