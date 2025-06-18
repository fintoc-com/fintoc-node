import test from 'ava';
import axios from 'axios';

import { request } from '../../lib/paginator';
import { mockAxios, restore } from '../mocks/initializers';

test.before((t) => {
  const ctx: any = t.context;
  ctx.axiosMock = mockAxios();
});

test.after((t) => {
  const ctx: any = t.context;
  restore(ctx.axiosMock);
});

test('"Request" request response', async (t) => {
  const client = axios.create({ baseURL: 'https://test.com' });
  const data = await request({ client, path: '/movements', headers: {} });

  t.assert('next' in data);
  t.assert('elements' in data);
  t.assert(Array.isArray(data.elements));
});

test('"Request" request params get passed to next URL', async (t) => {
  const client = axios.create({ baseURL: 'https://test.com' });
  const data = await request({
    client, path: '/movements', headers: {}, params: { link_token: 'sample_link_token' },
  });

  t.assert('next' in data);
  t.assert(data.next && data.next.includes('link_token=sample_link_token'));
});
