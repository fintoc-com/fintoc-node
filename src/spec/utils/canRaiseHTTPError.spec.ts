import test from 'ava';

import { FintocError, InvalidRequestError } from '../../lib/errors';
import { canRaiseHTTPError } from '../../lib/utils';

class Errors {
  @canRaiseHTTPError
  noError() { }

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

  @canRaiseHTTPError
  throwAxiosError(error: Error) {
    throw error;
  }
}

function buildAxiosError(data: unknown) {
  const error = new Error('Request failed with status code 400');
  // @ts-ignore: property does not exist
  error.isAxiosError = true;
  // @ts-ignore: property does not exist
  error.response = { status: 400, data };
  return error;
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

test('"canRaiseHTTPError" typed API error body', async (t) => {
  const ctx: any = t.context;
  const original = buildAxiosError({
    error: { type: 'invalid_request_error', message: 'Bad param' },
  });

  await t.throwsAsync(() => ctx.errors.throwAxiosError(original), {
    instanceOf: InvalidRequestError,
  });
});

const bodiesWithoutErrorType: [string, unknown][] = [
  ['string body', '400 Bad Request'],
  ['HTML body', '<html><body><h1>400 Bad Request</h1></body></html>'],
  ['empty object body', {}],
  ['object body without error.type', { error: {} }],
  ['non-object error', { error: 'Bad Request' }],
  ['undefined body', undefined],
  ['null body', null],
];

bodiesWithoutErrorType.forEach(([description, data]) => {
  test(`"canRaiseHTTPError" re-throws the original error with ${description}`, async (t) => {
    const ctx: any = t.context;
    const original = buildAxiosError(data);

    const thrown = await t.throwsAsync(() => ctx.errors.throwAxiosError(original));

    t.is(thrown, original);
  });
});
