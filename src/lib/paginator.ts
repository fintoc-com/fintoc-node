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

export async function request({ client, path, params = {} }: {
  client: AxiosInstance,
  path: string,
  params?: Record<string, string>
}) {
  const response = await client.request({ method: 'get', url: path, params: params || {} });
  const headers = parseLinkHeaders(response.headers.link);
  const next = headers && headers.next;
  const elements = response.data;
  return { next, elements };
}

export async function* paginate({ client, path, params = {} }: {
  client: AxiosInstance,
  path: string,
  params?: Record<string, string>
}) {
  let response = await request({ client, path, params });
  /* eslint-disable no-restricted-syntax, no-await-in-loop */
  for (const element of response.elements) {
    yield element;
  }
  while (response.next) {
    response = await request({ client, path: response.next });
    for (const element of response.elements) {
      yield element;
    }
  }
  /* eslint-enable no-restricted-syntax, no-await-in-loop */
}