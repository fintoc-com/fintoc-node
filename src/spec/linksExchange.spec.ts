import test from 'ava';
import axios from 'axios';
import sinon from 'sinon';

import { Fintoc } from '../lib/core';

test('an exchanged link uses its token for update and delete requests', async (t) => {
  const payload = { id: 'link_test', object: 'link', link_token: 'link_test_token' };
  const request = sinon.stub();
  request.onFirstCall().resolves({ data: payload });
  request.onSecondCall().resolves({ data: { ...payload, active: false } });
  request.onThirdCall().resolves({ data: {} });
  const create = sinon.stub(axios, 'create').returns({ request } as any);
  t.teardown(() => create.restore());
  const fintoc = new Fintoc('sk_test_links');

  const link = await fintoc.links.exchange({ exchange_token: 'exchange_token' });
  t.is(link.link_token, payload.link_token);
  t.is(request.firstCall.args[0].method, 'get');
  t.true(request.firstCall.args[0].url.endsWith('/v1/links/exchange'));
  t.deepEqual(request.firstCall.args[0].params, { exchange_token: 'exchange_token' });

  await link.update({ active: false });
  t.is(request.secondCall.args[0].method, 'patch');
  t.true(request.secondCall.args[0].url.endsWith(`/v1/links/${payload.link_token}`));
  t.is(request.secondCall.args[0].params.link_token, payload.link_token);
  t.deepEqual(JSON.parse(request.secondCall.args[0].data), { active: false });

  await link.delete();
  t.is(request.thirdCall.args[0].method, 'delete');
  t.true(request.thirdCall.args[0].url.endsWith(`/v1/links/${payload.link_token}`));
  t.is(request.thirdCall.args[0].params.link_token, payload.link_token);
});
