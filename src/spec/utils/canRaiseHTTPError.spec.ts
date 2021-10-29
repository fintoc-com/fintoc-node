/* eslint-disable class-methods-use-this */

import test from 'ava';

import { FintocError } from '../../lib/errors';
import { canRaiseHTTPError } from '../../lib/utils';

class Errors {
  @canRaiseHTTPError
  noError() { } /* eslint-disable-line @typescript-eslint/no-empty-function */

  @canRaiseHTTPError
  throwHTTPError() {
    const error = new Error();
    // @ts-ignore: property does not exist
    error.isAxiosError = true;
    // @ts-ignore: property does not exist
    error.response = {};
    // @ts-ignore: property does not exist
    error.response.data = {
      error: {
        type: 'api_error',
        message: 'This is a test error message',
      },
    };
    throw error;
  }

  @canRaiseHTTPError
  throwGenericError() {
    throw new Error();
  }
}

test.beforeEach((t) => {
  const ctx: any = t.context;

  ctx.errors = new Errors();
});

test('"canRaiseHTTPError" no error', async (t) => {
  const ctx: any = t.context;

  await t.notThrowsAsync(ctx.errors.noError);
});

test('"canRaiseHTTPError" HTTP error', async (t) => {
  const ctx: any = t.context;

  await t.throwsAsync(ctx.errors.throwHTTPError, { instanceOf: FintocError });
});

test('"canRaiseHTTPError" generic error', async (t) => {
  const ctx: any = t.context;

  await t.throwsAsync(ctx.errors.throwGenericError, { instanceOf: Error });
});
