export function isAsyncGenerator(object: any): boolean {
  return object.toString().includes('[object AsyncGenerator]');
}

export function isDictLike(object: any): boolean {
  return object.constructor === Object;
}
