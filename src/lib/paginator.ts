import { IPaginationOptions } from '../interfaces/paginator';

import { LINK_HEADER_PATTERN } from './constants';

/**
 * Parse a link string and return an object with previous parsed links and the new one.
 *
 * @param object - Object containing already parsed links
 * @param link - String with the link header to parse
 * @returns Object that corresponds to the destructured `object` object and the parsed `link` string
 */
export function parseLink(object: Record<string, string>, link: string) {
  const data = LINK_HEADER_PATTERN.exec(link);
  if (data === null || data.groups === undefined) {
    return object;
  }
  const { groups } = data;
  return { ...object, [groups.rel]: groups.url };
}

/**
 * Parse the 'link' header into an object.
 *
 * @param linkHeader - String containing the 'link' header of an HTTP request
 * @returns An object with the link headers parsed link headers
 */
export function parseLinkHeaders(linkHeader: null): null;
export function parseLinkHeaders(linkHeader: undefined): undefined;
export function parseLinkHeaders(linkHeader: string): Record<string, string>;
export function parseLinkHeaders(linkHeader: any): Record<string, string> | null | undefined;
export function parseLinkHeaders(
  linkHeader: string | null | undefined,
): Record<string, string> | null | undefined {
  if (linkHeader === null || linkHeader === undefined) {
    return linkHeader;
  }
  return linkHeader.split(',').reduce(parseLink, {});
}

export async function request(options: IPaginationOptions) {
  const { client, path, params = {} } = options;
  const response = await client.request({ method: 'get', url: path, params: params || {} });
  const headers = parseLinkHeaders(response.headers.link);
  const next = headers && headers.next;
  const elements = response.data;
  return { next, elements };
}

export async function* paginate(options: IPaginationOptions) {
  const { client, path, params = {} } = options;
  let response = await request({ client, path, params });
  /* eslint-disable no-await-in-loop */
  for (const element of response.elements) {
    yield element;
  }
  while (response.next) {
    response = await request({ client, path: response.next });
    for (const element of response.elements) {
      yield element;
    }
  }
  /* eslint-enable no-await-in-loop */
}
