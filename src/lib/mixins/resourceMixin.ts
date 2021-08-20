import { IResourceMixinConstructor } from '../../interfaces';
import { GenericFunction } from '../../types';
import { Client } from '../client';
import { singularize } from '../utils';

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
      try {
        const rawResource = this.originatingClass().mappings[key] || key;
        if (Array.isArray(value)) {
          const resource = singularize(rawResource);
          const element = value.length > 0 ? value[0] : {};
          this[key] = value;
        } else {
          this[key] = value;
        }
        this._attributes.push(key);
      } catch (error) {
        console.log('F');
      }
    });
  }
}
