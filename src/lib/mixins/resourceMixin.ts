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

  protected _client: Client;

  [anyAttribute: string]: any;

  get #originatingClass() {
    return this.constructor as unknown as IResourceMixinConstructor;
  }

  constructor(
    client: Client,
    handlers: Record<string, GenericFunction>,
    methods: string[],
    path: string,
    content: Record<string, any>,
  ) {
    this._client = client;
    this.#handlers = handlers;
    this.#methods = methods;
    this.#path = path;
    this.#attributes = [];

    Object.entries(content).forEach(([key, value]) => {
      try {
        this[key] = value;
        this.#attributes.push(key);
      } catch { } /* eslint-disable-line no-empty */
    });
  }

  protected static async _build(
    client: Client,
    handlers: Record<string, GenericFunction>,
    methods: string[],
    path: string,
    data: Record<string, any>,
  ) {
    const content: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      /* eslint-disable no-await-in-loop */
      const rawResource = (this.mappings as Record<string, any>)[key] || key;
      if (value !== undefined) {
        if (Array.isArray(value)) {
          const resource = singularize(rawResource);
          const element = value.length > 0 ? value[0] : {};
          const klass = await getResourceClass(resource, element);
          content[key] = await Promise.all(value.map((x) => objetize(klass, client, x)));
        } else {
          const klass = await getResourceClass(rawResource, value);
          content[key] = await objetize(klass, client, value);
        }
      }
      /* eslint-enable no-await-in-loop */
    }
    // console.log(content);
    // @ts-ignore: cannot create an instance of an abstract class
    return new this(client, handlers, methods, path, content);
  }

  protected _useClient(): Client {
    return this._client;
  }

  protected _updateClient(newClient: Client) {
    this._client = newClient;
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
    return object;
  }

  @canRaiseHTTPError
  private async _delete(args?: ResourceArguments): Promise<string> {
    const innerArgs = args || {};
    const identifier = this[this.#originatingClass.resourceIdentifier];
    await resourceDelete(
      this._client,
      this.#path,
      this.id,
      innerArgs,
    );
    return this.#handlers.delete(identifier, innerArgs);
  }
}
