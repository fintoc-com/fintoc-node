import { AxiosInstance } from 'axios';

import { LINK_HEADER_PATTERN } from './constants';

export function parseLink(object: Record<string, string>, link: string) {
  const data = LINK_HEADER_PATTERN.exec(link);
  if (data === null || data.groups === undefined) {
    return object;
  }
  const { groups } = data;
  return { ...object, [groups.rel]: groups.url };
}

export function parseLinkHeaders(linkHeader: string) {
  if (linkHeader === null || linkHeader === undefined) {
    return linkHeader;
  }
  return linkHeader.split(',').reduce(parseLink, {});
}

export async function request(methodParams: {
  client: AxiosInstance,
  path: string,
  params?: Record<string, string>
}) {
  const { client, path, params } = methodParams;
  const response = await client.request({ method: 'get', url: path, params });
  const headers = parseLinkHeaders(response.headers.link);
  const next = headers && headers.next;
  const elements = response.data();
  return { next, elements };
}

export async function* paginate(methodParams: {
  client: AxiosInstance,
  path: string,
  params: Record<string, string>
}) {
  const { client, path, params } = methodParams;
  let response = await request({ client, path, params });
  let { elements } = response;
  /* eslint-disable no-restricted-syntax, no-await-in-loop */
  for (const element of elements) {
    yield element;
  }
  while (response.next) {
    response = await request({ client, path: response.next });
    elements = response.elements;
    for (const element of elements) {
      yield element;
    }
  }
  /* eslint-enable no-restricted-syntax, no-await-in-loop */
}
