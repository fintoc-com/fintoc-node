import { IResourceMixinConstructor } from '../../interfaces/mixins';
import { GenericFunction, ResourceArguments } from '../../types';
import { Client } from '../client';
import { resourceDelete, resourceUpdate } from '../resourceHandlers';
import {
  canRaiseHTTPError, getResourceClass, objetize, serialize, singularize,
} from '../utils';

export abstract class ResourceMixin<ResourceType> {
  static mappings = {};
  static resourceIdentifier = 'id';

  #handlers: Record<string, GenericFunction>;
  #methods: string[];
  #path: string;
  #attributes: string[];
  #client: Client;

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
    this.#client = client;
    this.#handlers = handlers;
    this.#methods = methods;
    this.#path = path;
    this.#attributes = [];

    Object.entries(data).forEach(async ([key, value]) => {
      try {
        const rawResource = this.#originatingClass.mappings[key] || key;
        if (Array.isArray(value)) {
          const resource = singularize(rawResource);
          const element = value.length > 0 ? value[0] : {};
          const klass = await getResourceClass(resource, element);
          this[key] = value.map((x) => objetize(klass, client, x));
        } else {
          const klass = await getResourceClass(rawResource, value);
          this[key] = objetize(klass, client, value);
        }
        this.#attributes.push(key);
      } catch { } /* eslint-disable-line no-empty */
    });
  }

  protected _useClient(): Client {
    return this.#client;
  }

  protected _updateClient(newClient: Client) {
    this.#client = newClient;
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

  /**
   * Update this instance of the resource.
   *
   * @param args - Data to be passed for the object to be updated with, as specified by the API
   * @returns The updated instance of the object
   */
  update(args?: ResourceArguments) {
    if (!this.#methods.includes('update')) {
      throw new TypeError(`${this.#originatingClass.name}.update is not a valid function of of this resource`);
    }
    return this._update(args);
  }

  /**
   * Delete this instance of the resource.
   *
   * @param args - Object with the arguments to filter the query, using the API parameters
   * @returns The identifier of the deleted object
   */
  delete(args?: ResourceArguments) {
    if (!this.#methods.includes('delete')) {
      throw new TypeError(`${this.#originatingClass.name}.delete is not a valid function of of this resource`);
    }
    return this._delete(args);
  }

  @canRaiseHTTPError
  private async _update(args?: ResourceArguments): Promise<ResourceType> {
    const innerArgs = args || {};
    const id = this[this.#originatingClass.resourceIdentifier];
    let object = await resourceUpdate<ResourceType>(
      this.#client,
      this.#path,
      id,
      this.constructor,
      this.#handlers,
      this.#methods,
      innerArgs,
    );
    object = await this.#handlers.update(object, id, innerArgs);
    Object.assign(this, object);
    return object;
  }

  @canRaiseHTTPError
  private async _delete(args?: ResourceArguments): Promise<string> {
    const innerArgs = args || {};
    const id = this[this.#originatingClass.resourceIdentifier];
    await resourceDelete(
      this.#client,
      this.#path,
      id,
      innerArgs,
    );
    return this.#handlers.delete(id, innerArgs);
  }
}
