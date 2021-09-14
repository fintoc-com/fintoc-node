import { IResourceMixinConstructor } from '../../interfaces/mixins';
import { GenericFunction } from '../../types';
import { Client } from '../client';
import { resourceDelete, resourceUpdate } from '../resourceHandlers';
import {
  canRaiseHTTPError, getResourceClass, objetize, serialize, singularize,
} from '../utils';

export abstract class ResourceMixin {
  static mappings = {};
  static resourceIdentifier = 'id';

  #handlers: Record<string, GenericFunction>;
  #methods: string[];
  #path: string;
  #attributes: string[];

  _client: Client;
  [anyAttribute: string]: any;

  get #originatingClass() {
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
    this.#handlers = handlers;
    this.#methods = methods;
    this.#path = path;
    this.#attributes = [];

    Object.entries(data).forEach(([key, value]) => {
      try {
        const rawResource = this.#originatingClass.mappings[key] || key;
        if (Array.isArray(value)) {
          const resource = singularize(rawResource);
          const element = value.length > 0 ? value[0] : {};
          const klass = getResourceClass(resource, element);
          this[key] = value.map((x) => objetize(klass, client, x));
        } else {
          const klass = getResourceClass(rawResource, value);
          this[key] = objetize(klass, client, value);
        }
        this.#attributes.push(key);
      } catch { } /* eslint-disable-line no-empty */
    });
  }

  serialize() {
    let serialized = {};
    this.#attributes.forEach((attribute) => {
      const element = (
        Array.isArray(this[attribute])
          ? this[attribute].map(serialize)
          : serialize(this[attribute])
      );
      serialized = { ...serialized, [attribute]: element };
    });
    return serialized;
  }

  @canRaiseHTTPError
  async update(args?: Record<string, string>): Promise<ResourceMixin> {
    const innerArgs = args || {};
    const id = this[this.#originatingClass.resourceIdentifier];
    let object = await resourceUpdate(
      this._client,
      this.#path,
      id,
      this.constructor,
      this.#handlers,
      this.#methods,
      innerArgs,
    );
    object = await this.#handlers.update(object, id, innerArgs);
    Object.assign(this, object);
    return this;
  }

  @canRaiseHTTPError
  async delete(args?: Record<string, string>): Promise<string> {
    const innerArgs = args || {};
    const id = this[this.#originatingClass.resourceIdentifier];
    await resourceDelete(
      this._client,
      this.#path,
      id,
      innerArgs,
    );
    return this.#handlers.delete(id, innerArgs);
  }
}
