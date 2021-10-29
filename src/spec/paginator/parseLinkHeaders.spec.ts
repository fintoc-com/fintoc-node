import test from 'ava';

import { parseLinkHeaders } from '../../lib/paginator';
import { isDictLike } from '../shared/utils';

test('"parseLinkHeaders" null header', (t) => {
  const parsed = parseLinkHeaders(null);
  t.assert(parsed === null);
});

test('"parseLinkHeaders" undefined header', (t) => {
  const parsed = parseLinkHeaders(undefined);
  t.assert(parsed === undefined);
});

test('"parseLinkHeaders" parse header', (t) => {
  const nextURL = 'https://api.fintoc.com/v1/links?page=2';
  const lastURL = 'https://api.fintoc.com/v1/links?page=13';
  const linkHeader = `<${nextURL}>; rel="next", <${lastURL}>; rel="last"`;
  const parsed = parseLinkHeaders(linkHeader);
  t.assert(isDictLike(parsed));
  t.assert('last' in parsed);
  t.assert('next' in parsed);
  t.assert(Object.keys(parsed).length === 2);
  t.assert(parsed.last === lastURL);
  t.assert(parsed.next === nextURL);
});
