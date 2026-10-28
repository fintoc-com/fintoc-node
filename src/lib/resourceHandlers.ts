import FormData from 'form-data';

import { GenericFunction, MultipartArguments, UploadFile } from '../types';

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
    elements.push(await objetize(
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
  idempotencyKey?: string,
): Promise<ResourceType> {
  const data = await client.request({
    path, method: 'post', json: params, idempotencyKey,
  });
  return objetize(
    klass,
    client,
    data,
    handlers,
    methods,
    path,
  );
}

type MultipartFile = Omit<UploadFile, 'filename'> & { filename?: string };

function isUploadFile(value: unknown): value is MultipartFile {
  return (
    typeof value === 'object'
    && value !== null
    && 'data' in value
    && (
      typeof (value as MultipartFile).filename === 'string'
      || Buffer.isBuffer((value as MultipartFile).data)
      || typeof (value as { data?: NodeJS.ReadableStream }).data?.pipe === 'function'
    )
  );
}

function appendFormValue(form: FormData, key: string, value: unknown) {
  if (value === undefined || value === null) {
    return;
  }
  if (isUploadFile(value)) {
    form.append(key, value.data, {
      filename: value.filename,
      contentType: value.contentType,
    });
  } else if (Array.isArray(value)) {
    value.forEach((element) => appendFormValue(form, `${key}[]`, element));
  } else if (typeof value === 'object') {
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) {
      throw new TypeError(`Unsupported multipart value for "${key}"`);
    }
    Object.entries(value as Record<string, unknown>).forEach(([innerKey, innerValue]) => {
      appendFormValue(form, `${key}[${innerKey}]`, innerValue);
    });
  } else {
    form.append(key, String(value));
  }
}

export function buildForm(fields: MultipartArguments) {
  const form = new FormData();
  Object.entries(fields).forEach(([key, value]) => appendFormValue(form, key, value));
  return form;
}

export async function resourceMultipart<ResourceType>(
  client: Client,
  path: string,
  klass: any,
  fields: MultipartArguments,
  handlers: Record<string, GenericFunction> = {},
  methods: string[] = [],
  method: 'post' | 'put' = 'post',
  idempotencyKey?: string,
): Promise<ResourceType> {
  const form = buildForm(fields);
  const data = await client.request({
    path, method, form, idempotencyKey,
  });
  return objetize(
    klass,
    client,
    data,
    handlers,
    methods,
    path,
  );
}

export async function resourceUpload<ResourceType>(
  client: Client,
  path: string,
  klass: any,
  file: UploadFile,
  handlers: Record<string, GenericFunction> = {},
  methods: string[] = [],
  method: 'post' | 'put' = 'put',
): Promise<ResourceType> {
  return resourceMultipart<ResourceType>(
    client,
    path,
    klass,
    { file },
    handlers,
    methods,
    method,
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
  customPath?: string,
): Promise<ResourceType> {
  const updatePath = customPath || `${path}/${id}`;
  const data = await client.request({ path: updatePath, method: 'patch', json: params });
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
