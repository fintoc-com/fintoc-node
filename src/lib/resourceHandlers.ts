import { GenericFunction } from '../types';

import { Client } from './client';
import { objetize, objetizeGenerator } from './utils';

export async function resourceAll(
  client: Client,
  path: string,
  klass: any,
  handlers: Record<string, GenericFunction> = {},
  methods: string[],
  params: Record<string, any>,
) {
  const { lazy, ...innerParams } = { lazy: true, ...params };
  const data = await client.request({ path, paginated: true, params: innerParams });
  if (lazy) {
    return objetizeGenerator(
      data,
      klass,
      client,
      handlers,
      methods,
      path,
    );
  }
  const elements = [];
  for await (const element of data) {
    elements.push(objetize(
      klass,
      client,
      element,
      handlers,
      methods,
      path,
    ));
  }
  return elements;
}

export async function resourceGet(
  client: Client,
  path: string,
  id: string,
  klass: any,
  handlers: Record<string, GenericFunction> = {},
  methods: string[],
  params: Record<string, any>,
) {
  const data = await client.request({ path: `${path}/${id}`, method: 'get', params });
  return objetize(
    klass,
    client,
    data,
    handlers,
    methods,
    path,
  );
}

export async function resourceCreate(
  client: Client,
  path: string,
  klass: any,
  handlers: Record<string, GenericFunction> = {},
  methods: string[],
  params: Record<string, any>,
) {
  const data = await client.request({ path, method: 'post', json: params });
  return objetize(
    klass,
    client,
    data,
    handlers,
    methods,
    path,
  );
}

export async function resourceUpdate(
  client: Client,
  path: string,
  id: string,
  klass: any,
  handlers: Record<string, GenericFunction> = {},
  methods: string[],
  params: Record<string, any>,
) {
  const data = await client.request({ path: `${path}/${id}`, method: 'patch', json: params });
  return objetize(
    klass,
    client,
    data,
    handlers,
    methods,
    path,
  );
}

export async function resourceDelete(
  client: Client,
  path: string,
  id: string,
  params: Record<string, any>,
) {
  return client.request({ path: `${path}/${id}`, method: 'delete', params });
}
