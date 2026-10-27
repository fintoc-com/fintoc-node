import { readFileSync } from 'fs';
import { join } from 'path';

import test from 'ava';
import axios from 'axios';
import sinon from 'sinon';

import { Fintoc } from '../lib/core';
import { Recipient } from '../lib/resources/v2/recipient';

test.before((t) => {
  const ctx: any = t.context;
  ctx.create = sinon.stub(axios, 'create');
  ctx.request = sinon.stub();
  ctx.create.returns({ request: ctx.request });
  ctx.fintoc = new Fintoc('sk_test_recipients');
});

test.beforeEach((t) => {
  const ctx: any = t.context;
  ctx.request.reset();
});

test.after((t) => {
  const ctx: any = t.context;
  ctx.create.restore();
});

for (const country of ['mx', 'cl']) {
  const payload = JSON.parse(readFileSync(join(process.cwd(), `src/spec/fixtures/recipient_${country}.json`), 'utf8'));
  const response = (data: any = payload, headers = {}) => ({ data, headers });

  test.serial(`${country}: create and retrieve recipient resources`, async (t) => {
    const ctx: any = t.context;
    ctx.request.resolves(response());
    const params: Record<string, any> = {
      entity_id: 'ent_test',
      account_number: payload.account_number,
      holder_name: payload.holder_name,
    };
    if (country === 'cl') {
      Object.assign(params, {
        account_type: payload.account_type,
        holder_type: payload.holder_type,
        holder_id: payload.holder_id,
        institution_id: payload.institution.id,
      });
    }
    const recipient = await ctx.fintoc.v2.recipients.create({ ...params, idempotency_key: 'recipient-create' });
    t.true(recipient instanceof Recipient);
    t.is(recipient.institution.country, country);
    t.is(recipient.created_at.toISOString(), '2026-03-01T12:00:00.000Z');
    const request = ctx.request.lastCall.args[0];
    t.is(request.method, 'post');
    t.true(request.url.endsWith('/v2/recipients'));
    t.is(request.headers['Idempotency-Key'], 'recipient-create');
    t.like(JSON.parse(request.data), params);

    const fetched = await ctx.fintoc.v2.recipients.get(payload.id);
    t.true(fetched instanceof Recipient);
    t.is(fetched.id, payload.id);
    t.true(ctx.request.lastCall.args[0].url.endsWith(`/v2/recipients/${payload.id}`));
  });

  for (const lazy of [true, false]) {
    test.serial(`${country}: list with filters and pagination, lazy=${lazy}`, async (t) => {
      const ctx: any = t.context;
      ctx.request.onFirstCall().resolves(response([payload], {
        link: `<https://api.fintoc.com/v2/recipients?starting_after=${payload.id}>; rel="next"`,
      }));
      ctx.request.onSecondCall().resolves(response([payload]));
      const filters = {
        entity_id: 'ent_test',
        holder_type: 'person',
        institution_id: payload.institution.id,
        holder_id: payload.holder_id,
        account_number: payload.account_number,
        ending_before: 'rcp_previous',
        limit: 1,
      };
      const result = await ctx.fintoc.v2.recipients.list({ ...filters, lazy });
      const recipients = [];
      for await (const recipient of result) {
        recipients.push(recipient);
      }
      t.is(recipients.length, 2);
      t.true(recipients.every((recipient) => recipient instanceof Recipient));
      t.deepEqual(ctx.request.firstCall.args[0].params, filters);
      t.true(ctx.request.secondCall.args[0].url.includes(`starting_after=${payload.id}`));
    });
  }

  for (const onResource of [false, true]) {
    for (const updates of [{ alias: null, email: null }, { alias: '', email: '' }, { holder_name: 'New name' }]) {
      test.serial(`${country}: update ${JSON.stringify(updates)}, resource=${onResource}`, async (t) => {
        const ctx: any = t.context;
        ctx.request.resolves(response());
        const recipient = await ctx.fintoc.v2.recipients.get(payload.id);
        ctx.request.resolves(response({ ...payload, ...updates }));
        const result = onResource
          ? await recipient.update(updates)
          : await ctx.fintoc.v2.recipients.update(payload.id, updates);
        t.true(result instanceof Recipient);
        t.like(result, updates);
        const request = ctx.request.lastCall.args[0];
        t.is(request.method, 'patch');
        t.true(request.url.endsWith(`/v2/recipients/${payload.id}`));
        t.deepEqual(JSON.parse(request.data), updates);
      });
    }

    test.serial(`${country}: delete with empty response, resource=${onResource}`, async (t) => {
      const ctx: any = t.context;
      ctx.request.resolves(response());
      const recipient = await ctx.fintoc.v2.recipients.get(payload.id);
      ctx.request.resolves(response(''));
      const result = onResource
        ? await recipient.delete()
        : await ctx.fintoc.v2.recipients.delete(payload.id);
      t.is(result, payload.id);
      t.is(ctx.request.lastCall.args[0].method, 'delete');
      t.true(ctx.request.lastCall.args[0].url.endsWith(`/v2/recipients/${payload.id}`));
    });
  }
}
