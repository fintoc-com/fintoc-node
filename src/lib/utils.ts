import { IModule } from '../interfaces';
import { GenericFunction } from '../types';

import { Client } from './client';
import * as resources from './resources';

export function toTitle(rawString: string) {
  return rawString[0].toUpperCase() + rawString.substr(1).toLowerCase();
}

export function snakeToPascal(snakeString: string) {
  return snakeString.split('_').map(toTitle).join('');
}

export function singularize(rawString: string) {
  return rawString.replace(/s$/, '');
}

export function isISODate(rawDate: string) {
  return !Number.isNaN(Date.parse(rawDate));
}

export function getResourcesModule() {
  return resources as IModule;
}

export function getResourceClass(snakeResourceName: string, value: any = {}) {
  const klass = value.constructor;
  if (klass === Object) {
    const resourcesModule = getResourcesModule();
    const resourceName = snakeToPascal(snakeResourceName);
    return resourcesModule[resourceName] || resourcesModule.GenericFintocResource;
  }
  if ((klass === String) && isISODate(value)) {
    return Date;
  }
  return klass;
}

export function canRaiseHTTPError(
  _: unknown, __: string, descriptor: TypedPropertyDescriptor<any>,
) {
  const newDescriptor = { ...descriptor };

  newDescriptor.value = function wrapper(...args: any[]) {
    try {
      return descriptor.value.apply(this, args);
    } catch (error) {
      throw new Error('F');
    }
  };

  return newDescriptor;
}

export function serialize(object: any) {
  if (typeof object.serialize === 'function') {
    return object.serialize();
  }
  if (object?.constructor === Date) {
    return object.toISOString();
  }
  return object;
}

export function objetize(
  Klass: any,
  client: Client,
  data: Record<string, any> | null,
  handlers: Record<string, GenericFunction> = {},
  methods: string[] = [],
  path: string | null = null,
) {
  if (data === null) {
    return null;
  }
  if ([String, Number, Object, Boolean, Date].includes(Klass)) {
    return new Klass(data);
  }
  return new Klass(client, handlers, methods, path, data);
}

export async function* objetizeGenerator(
  generator: AsyncGenerator<Record<string, any>>,
  klass: any,
  client: Client,
  handlers: Record<string, GenericFunction> = {},
  methods: string[] = [],
  path: string | null = null,
) {
  for await (const element of generator) {
    yield objetize(klass, client, element, handlers, methods, path);
  }
}
