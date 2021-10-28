import { IModule } from '../interfaces/module';
import { GenericFunction } from '../types';

import { Client } from './client';
import * as errors from './errors';
import { GenericFintocResource } from './resources/genericFintocResource';

/**
 * Transform a string into title case.
 *
 * @param rawString - String to be transformed into a title
 * @returns Transformed title string
 */
export function toTitle(rawString: string) {
  return rawString[0].toUpperCase() + rawString.substr(1).toLowerCase();
}

/**
 * Transforms a snake-cased string into a pascal-cased one.
 *
 * @param snakeString - Snake-cased string to be transformed
 * @returns Pascal-cased string
 */
export function snakeToPascal(snakeString: string) {
  return snakeString.split('_').map(toTitle).join('');
}

/**
 * Remove the last 's' from a string if exists.
 *
 * @param rawString - String to be singularized
 * @returns The singularized string
 */
export function singularize(rawString: string) {
  return rawString.replace(/s$/, '');
}

/**
 * Tries to parse an ISO formatted string to check if it is parseable as a Date object.
 *
 * @param rawDate - ISO formatted string to be checked
 * @returns A boolean that represents if `rawDate` is parseable as a Date object
 */
export function isISODate(rawDate: string) {
  return !Number.isNaN(Date.parse(rawDate));
}

/**
 * Gets and returns the resources module interfaced as an IModule.
 *
 * @param resourceName - Pascal cased string with the name of the resource
 * @returns The resources module interfaced as an IModule
 */
export async function getResourcesModule(resourceName: string) {
  const camelCaseName = resourceName.charAt(0).toLowerCase() + resourceName.slice(1);
  try {
    const resources = await import(`./resources/${camelCaseName}`);
    return resources as IModule;
  } catch {
    return {};
  }
}

/**
 * Gets and returns the errors module interfaced as an IModule.
 *
 * @returns The errors module interfaced as an IModule
 */
export function getErrorsModule() {
  return errors as IModule;
}

/**
 * Get the class corresponding to the the resource name and value.
 *
 * @param snakeResourceName - Name of the resource in snake case
 * @param value - Value of the resource from which to get the corresponding class
 * @returns The class corresponding to the resource
 */
export async function getResourceClass(snakeResourceName: string, value: any = {}) {
  const klass = value?.constructor;
  if (klass === Object) {
    const resourceName = snakeToPascal(snakeResourceName);
    const resourcesModule = await getResourcesModule(resourceName);
    return resourcesModule[resourceName] || GenericFintocResource;
  }
  if ((klass === String) && isISODate(value)) {
    return Date;
  }
  return klass;
}

/**
 * Get the error corresponding to the error name.
 *
 * @param snakeErrorName - Name of the error in snake case
 * @returns The class corresponding to the error
 */
export function getErrorClass(snakeErrorName: string) {
  const errorsModule = getErrorsModule();
  const errorName = snakeToPascal(snakeErrorName);
  return errorsModule[errorName] || errorsModule.FintocError;
}

/**
 * Decorator designed for an instance method. It tries tp execute the function,
 * catches exceptions and re-rises the adequate Fintoc exception.
 *
 * @example
 * ```ts
 * class SampleClass {
 *   @canRaiseHTTPError
 *   myFunction() {
 *     console.log('This method is decorated by the function.');
 *   }
 * }
 * ```
 */
export function canRaiseHTTPError(
  _: unknown, __: string, descriptor: TypedPropertyDescriptor<any>,
) {
  const newDescriptor = { ...descriptor };

  newDescriptor.value = async function wrapper(...args: any[]) {
    try {
      return await descriptor.value.apply(this, args);
    } catch (exc) {
      const errorData = exc.response.data;
      const ErrorKlass = getErrorClass(errorData.error.type);
      throw new ErrorKlass(errorData.error);
    }
  };

  return newDescriptor;
}

/**
 * Serializes an object.
 *
 * @param object - Object to be serialized
 * @returns The serialized object (object with only JSON-serializable fields)
 */
export function serialize(object: any) {
  if (typeof object?.serialize === 'function') {
    return object.serialize();
  }
  if (object?.constructor === Date) {
    return object.toISOString();
  }
  return object;
}

/**
 * Wraps some data with a class.
 *
 * @param Klass - Class that will wrap the data
 * @param client - The Client object passed to the newly created object
 * @param data - The data that the new object will contain
 * @param handlers - The post-request handlers
 * @param methods - An array of the methods that the object can execute
 * @param path - The path within the API server for the resource
 * @returns The data wrapped on the corresponding class
 */
export function objetize(
  Klass: any,
  client: Client,
  data: any,
  handlers: Record<string, GenericFunction> = {},
  methods: string[] = [],
  path: string | null = null,
) {
  if (data === null) {
    return null;
  }
  if ([String, Number, Object, Boolean].includes(Klass)) {
    return Klass(data);
  }
  if (Klass === Date) {
    return new Klass(data);
  }
  return new Klass(client, handlers, methods, path, data);
}

/**
 * Wraps and yields some data (from a generator) with a class.
 *
 * @param generator - The generator that yields elements to be wrapped
 * @param klass - Class that will wrap the data
 * @param client - The Client object passed to the newly created objects
 * @param handlers - The post-request handlers
 * @param methods - An array of the methods that the objects can execute
 * @param path - The path within the API server for the resource
 * @returns A generator producing a sequence of data wrapped with the class
 */
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
