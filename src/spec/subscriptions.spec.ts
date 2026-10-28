import test from 'ava';
import axios from 'axios';
import sinon from 'sinon';

import { Fintoc } from '../lib/core';

test('a detached subscription can attach a replacement payment method through update()', async (t) => {
  const payload = {
    id: 'sub_test', object: 'subscription', status: 'active', payment_method: null,
  };
  const request = sinon.stub();
  request.onFirstCall().resolves({ data: payload });
  request.onSecondCall().resolves({ data: { ...payload, payment_method: 'pm_replacement' } });
  const create = sinon.stub(axios, 'create').returns({ request } as any);
  t.teardown(() => create.restore());
  const fintoc = new Fintoc('sk_test_subscriptions');

  const subscription = await fintoc.v2.subscriptions.detachPaymentMethod(payload.id);
  t.is(subscription.payment_method, null);
  t.is(request.firstCall.args[0].method, 'delete');
  t.true(request.firstCall.args[0].url.endsWith('/v2/subscriptions/sub_test/payment_method'));

  const updated = await subscription.update({ payment_method: 'pm_replacement' });

  t.is(request.secondCall.args[0].method, 'patch');
  t.true(request.secondCall.args[0].url.endsWith('/v2/subscriptions/sub_test'));
  t.deepEqual(JSON.parse(request.secondCall.args[0].data), { payment_method: 'pm_replacement' });
  t.is(updated.payment_method, 'pm_replacement');
  t.is(subscription.payment_method, 'pm_replacement');
});
