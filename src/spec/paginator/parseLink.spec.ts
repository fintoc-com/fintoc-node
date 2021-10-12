import test from 'ava';

import { parseLink } from '../../lib/paginator';
import { isDictLike } from '../shared/utils';

test('"parseLink" link over empty object', (t) => {
  const nextURL = 'https://api.fintoc.com/v1/links?page=2';
  const object = {};
  const link = `<${nextURL}>; rel="next"`;
  const parsed = parseLink(object, link);
  t.assert(isDictLike(parsed));
  t.assert('next' in parsed);
  t.assert(Object.keys(parsed).length === 1);
  t.assert(parsed.next === nextURL);
});

test('"parseLink" link over used object', (t) => {
  const nextURL = 'https://api.fintoc.com/v1/links?page=2';
  const lastURL = 'https://api.fintoc.com/v1/links?page=13';
  const object = { last: lastURL };
  const link = `<${nextURL}>; rel="next"`;
  const parsed = parseLink(object, link);
  t.assert(isDictLike(parsed));
  t.assert('last' in parsed);
  t.assert('next' in parsed);
  t.assert(Object.keys(parsed).length === 2);
  t.assert(parsed.last === lastURL);
  t.assert(parsed.next === nextURL);
});

test('"parseLink" overwrite object', (t) => {
  const currentURL = 'https://api.fintoc.com/v1/links?page=2';
  const nextURL = 'https://api.fintoc.com/v1/links?page=4';
  const lastURL = 'https://api.fintoc.com/v1/links?page=13';
  const object = { next: currentURL, last: lastURL };
  const link = `<${nextURL}>; rel="next"`;
  const parsed = parseLink(object, link);
  t.assert(isDictLike(parsed));
  t.assert('last' in parsed);
  t.assert('next' in parsed);
  t.assert(Object.keys(parsed).length === 2);
  t.assert(parsed.last === lastURL);
  t.assert(parsed.next !== currentURL);
  t.assert(parsed.next === nextURL);
});
