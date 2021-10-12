export function isAsyncGenerator(object: any): boolean {
  return object.toString().includes('[object AsyncGenerator]');
}
