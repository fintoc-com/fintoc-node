import { GenericFunction } from '../types';

import { Client } from './client';
import { objetize, objetizeGenerator } from './utils';

/**
 * Fetch all instances of a resource.
 *
 * @param client - The Client object passed to the retrieved objects
 * @param path - The path within the API server for the resource
 * @param klass - Class that will wrap the instances of the resource
 * @param handlers - The post-request handlers
 * @param methods - An array of the methods that the objects can execute
 * @param params - The parameters passed to the request
 * @returns - A generator (or an array, depending on the `lazy` param) of objects of class `klass`
 */
export async function resourceAll<ResourceType>(
  client: Client,
  path: string,
  klass: any,
  handlers: Record<string, GenericFunction> = {},
  methods: string[],
  params: Record<string, any>,
): Promise<ResourceType[] | AsyncGenerator<ResourceType>> {
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

/**
 * Fetch a specific instance of a resource.
 *
 * @param client - The Client object passed to the retrieved object
 * @param path - The path within the API server for the resource
 * @param id - The identifier value of the object to retrieve
 * @param klass - Class that will wrap the instance of the resource
 * @param handlers - The post-request handlers
 * @param methods - An array of the methods that the object can execute
 * @param params - The parameters passed to the request
 * @returns - An object of class `klass`
 */
export async function resourceGet<ResourceType>(
  client: Client,
  path: string,
  id: string,
  klass: any,
  handlers: Record<string, GenericFunction> = {},
  methods: string[],
  params: Record<string, any>,
): Promise<ResourceType> {
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

/**
 * Create a new instance of a resource.
 *
 * @param client - The Client object passed to the created object
 * @param path - The path within the API server for the resource
 * @param klass - Class that will wrap the instance of the resource
 * @param handlers - The post-request handlers
 * @param methods - An array of the methods that the object can execute
 * @param params - The parameters passed to the request
 * @returns - An object of class `klass`
 */
export async function resourceCreate<ResourceType>(
  client: Client,
  path: string,
  klass: any,
  handlers: Record<string, GenericFunction> = {},
  methods: string[],
  params: Record<string, any>,
): Promise<ResourceType> {
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

/**
 * Update a specific instance of a resource.
 *
 * @param client - The Client object passed to the updated object
 * @param path - The path within the API server for the resource
 * @param id - The identifier value of the object to update
 * @param klass - Class that will wrap the instance of the resource
 * @param handlers - The post-request handlers
 * @param methods - An array of the methods that the object can execute
 * @param params - The parameters passed to the request for the resource to be updated
 * @returns - An object of class `klass`
 */
export async function resourceUpdate<ResourceType>(
  client: Client,
  path: string,
  id: string,
  klass: any,
  handlers: Record<string, GenericFunction> = {},
  methods: string[],
  params: Record<string, any>,
): Promise<ResourceType> {
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

/**
 * Delete an instance of a resource.
 *
 * @param client - The Client object passed to the updated object
 * @param path - The path within the API server for the resource
 * @param id - The identifier value of the object to update
 * @param params - The parameters passed to the request
 * @returns The request response
 */
export async function resourceDelete(
  client: Client,
  path: string,
  id: string,
  params: Record<string, any>,
): Promise<Record<string, string>> {
  return client.request({ path: `${path}/${id}`, method: 'delete', params });
}
