import test from 'ava';

import { ApiError, FintocError } from '../../lib/errors';
import { getErrorClass } from '../../lib/utils';

test('"getErrorClass" valid error', (t) => {
  const errorName = 'api_error';
  const error = getErrorClass(errorName);
  t.is(error, ApiError);
});

test('"getErrorClass" invalid error', (t) => {
  const errorName = 'this_error_does_not_exist';
  const error = getErrorClass(errorName);
  t.is(error, FintocError);
});
