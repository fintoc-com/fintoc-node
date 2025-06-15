import test from 'ava';
import axios from 'axios';

import { paginate } from '../../lib/paginator';
import { mockAxios, restore } from '../mocks/initializers';
import { isAsyncGenerator, isDictLike } from '../shared/utils';

test.before((t) => {
  const ctx: any = t.context;
  ctx.axiosMock = mockAxios();
});

test.after((t) => {
  const ctx: any = t.context;
  restore(ctx.axiosMock);
});

test('"Paginate" pagination', async (t) => {
  const client = axios.create({ baseURL: 'https://test.com' });
  const data = paginate({ client, path: '/movements', headers: {} });

  t.assert(isAsyncGenerator(data));

  const array = [];

  for await (const element of data) {
    t.assert(isDictLike(element));
    array.push(element);
  }

  t.assert(array.length === 100);
});
