import { IResourceMixinConstructor } from '../../interfaces';
import { GenericFunction } from '../../types';
import { Client } from '../client';
/* eslint-disable-next-line import/no-cycle */
import { getResourceClass, objetize, singularize } from '../utils';

export abstract class ResourceMixin {
  _client: Client;
  _handlers: Record<string, GenericFunction>;
  _methods: string[];
  _path: string;
  _attributes: string[];
  [anyAttribute: string]: any;

  static mappings = {};
  static resourceIdentifier = 'id';

  private originatingClass() {
    return this.constructor as unknown as IResourceMixinConstructor;
  }

  constructor(
    client: Client,
    handlers: Record<string, GenericFunction>,
    methods: string[],
    path: string,
    data: Record<string, any>,
  ) {
    this._client = client;
    this._handlers = handlers;
    this._methods = methods;
    this._path = path;
    this._attributes = [];

    Object.entries(data).forEach(([key, value]) => {
      const rawResource = this.originatingClass().mappings[key] || key;
      if (Array.isArray(value)) {
        const resource = singularize(rawResource);
        const element = value.length > 0 ? value[0] : {};
        const klass = getResourceClass(resource, element);
        this[key] = value.map((x) => objetize(klass, client, x));
      } else {
        const klass = getResourceClass(rawResource, value);
        this[key] = objetize(klass, client, value);
      }
      this._attributes.push(key);
    });
  }
}
