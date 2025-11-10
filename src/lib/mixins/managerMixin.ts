import { IManagerMixinConstructor, IResourceMixin } from '../../interfaces/mixins';
import { GenericFunction, ResourceArguments } from '../../types';
import { Client } from '../client';
import {
  resourceAll,
  resourceCreate,
  resourceDelete,
  resourceGet,
  resourceUpdate,
} from '../resourceHandlers';
import { canRaiseHTTPError, getResourceClass } from '../utils';

export abstract class ManagerMixin<ResourceType extends IResourceMixin> {
  static resource: string;
  static methods: string[];

  #path: string;
  #handlers: Record<string, GenericFunction>

  protected _client: Client;

  constructor(path: string, client: Client) {
    this.#path = path;
    this._client = client;
    this.#handlers = {
      update: this.postUpdateHandler.bind(this),
      delete: this.postDeleteHandler.bind(this),
    };
  }

  get #originatingClass() {
    return this.constructor as unknown as IManagerMixinConstructor;
  }

  /**
   * Return all the instances of the resource being handled by the manager.
   *
   * @param args - Object with the arguments to filter the query, using the API parameters
   * @returns All the instances of the resource
   */
  list(args?: ResourceArguments & { lazy: true }): Promise<AsyncGenerator<ResourceType>>;
  list(args?: ResourceArguments & { lazy: false }): Promise<ResourceType[]>;
  list(args?: ResourceArguments): Promise<AsyncGenerator<ResourceType>>;
  list(args?: ResourceArguments): Promise<ResourceType[] | AsyncGenerator<ResourceType>> {
    if (!this.#originatingClass.methods.includes('list')) {
      throw new TypeError(`${this.#originatingClass.name}.list is not a valid function of of this manager`);
    }
    return this._list(args);
  }

  /**
   * Return all the instances of the resource being handled by the manager.
   *
   * @deprecated Use list() instead
   * @param args - Object with the arguments to filter the query, using the API parameters
   * @returns All the instances of the resource
   */
  all(args?: ResourceArguments & { lazy: true }): Promise<AsyncGenerator<ResourceType>>;
  all(args?: ResourceArguments & { lazy: false }): Promise<ResourceType[]>;
  all(args?: ResourceArguments): Promise<AsyncGenerator<ResourceType>>;
  all(args?: ResourceArguments): Promise<ResourceType[] | AsyncGenerator<ResourceType>> {
    console.warn("Warning: The 'all()' method is deprecated. Please use 'list()' instead.");
    if (!this.#originatingClass.methods.includes('list')) {
      throw new TypeError(`${this.#originatingClass.name}.all is not a valid function of of this manager`);
    }
    return this._list(args);
  }

  /**
   * Return an instance of the resource being handled by the manager.
   *
   * @param identifier - The identifier of the resource to get
   * @param args - Object with the arguments to filter the query, using the API parameters
   * @returns An instance of the resource
   */
  get(identifier: string, args?: ResourceArguments) {
    if (!this.#originatingClass.methods.includes('get')) {
      throw new TypeError(`${this.#originatingClass.name}.get is not a valid function of of this manager`);
    }
    return this._get(identifier, args);
  }

  /**
   * Create an instance of the resource being handled by the manager.
   *
   * @param args - Data to be passed for the object creation, as specified by the API
   * @returns The created instance of the object
   */
  create(args?: ResourceArguments) {
    if (!this.#originatingClass.methods.includes('create')) {
      throw new TypeError(`${this.#originatingClass.name}.create is not a valid function of of this manager`);
    }
    return this._create(args);
  }

  /**
   * Update an instance of the resource being handled by the manager.
   *
   * @param identifier - The identifier of the resource to update
   * @param args - Data to be passed for the object to be updated with, as specified by the API
   * @returns The updated instance of the object
   */
  update(identifier: string, args?: ResourceArguments) {
    if (!this.#originatingClass.methods.includes('update')) {
      throw new TypeError(`${this.#originatingClass.name}.update is not a valid function of of this manager`);
    }
    return this._update(identifier, args);
  }

  /**
   * Delete an instance of the resource being handled by the manager.
   *
   * @param identifier - The identifier of the resource to delete
   * @param args - Object with the arguments to filter the query, using the API parameters
   * @returns The identifier of the deleted object
   */
  delete(identifier: string, args?: ResourceArguments) {
    if (!this.#originatingClass.methods.includes('delete')) {
      throw new TypeError(`${this.#originatingClass.name}.delete is not a valid function of of this manager`);
    }
    return this._delete(identifier, args);
  }

  @canRaiseHTTPError
  protected async _list(
    args?: ResourceArguments,
  ): Promise<ResourceType[] | AsyncGenerator<ResourceType>> {
    const innerArgs = args || {};
    const klass = await getResourceClass(this.#originatingClass.resource);
    const objects = await resourceAll<ResourceType>(
      this._client,
      this.buildPath(innerArgs),
      klass,
      this.#handlers,
      this.#originatingClass.methods,
      innerArgs,
    );
    return this.postListHandler(objects, innerArgs);
  }

  @canRaiseHTTPError
  protected async _get(identifier: string, args?: ResourceArguments): Promise<ResourceType> {
    const innerArgs = args || {};
    const klass = await getResourceClass(this.#originatingClass.resource);
    const object = await resourceGet<ResourceType>(
      this._client,
      this.buildPath(innerArgs),
      identifier,
      klass,
      this.#handlers,
      this.#originatingClass.methods,
      innerArgs,
    );
    return this.postGetHandler(object, identifier, innerArgs);
  }

  @canRaiseHTTPError
  protected async _create(args?: ResourceArguments): Promise<ResourceType> {
    const innerArgs = args || {};
    const { path_ = this.buildPath(), idempotency_key: idempotencyKey } = innerArgs;
    const klass = await getResourceClass(this.#originatingClass.resource);
    const object = await resourceCreate<ResourceType>(
      this._client,
      path_.toString(),
      klass,
      this.#handlers,
      this.#originatingClass.methods,
      innerArgs,
      idempotencyKey?.toString(),
    );
    return this.postCreateHandler(object, innerArgs);
  }

  @canRaiseHTTPError
  protected async _update(identifier: string, args?: ResourceArguments): Promise<ResourceType> {
    const innerArgs = args || {};
    const { path_ } = innerArgs;
    const klass = await getResourceClass(this.#originatingClass.resource);
    const object = await resourceUpdate<ResourceType>(
      this._client,
      this.buildPath(innerArgs),
      identifier,
      klass,
      this.#handlers,
      this.#originatingClass.methods,
      innerArgs,
      path_?.toString(),
    );
    return this.postUpdateHandler(object, identifier, innerArgs);
  }

  @canRaiseHTTPError
  protected async _delete(identifier: string, args?: ResourceArguments): Promise<string> {
    const innerArgs = args || {};
    await resourceDelete(
      this._client,
      this.buildPath(innerArgs),
      identifier,
      this.#handlers,
    );
    return this.postDeleteHandler(identifier, innerArgs);
  }

  /* eslint-disable class-methods-use-this, @typescript-eslint/no-unused-vars */
  protected postListHandler(
    objects: ResourceType[] | AsyncGenerator<ResourceType>,
    args: ResourceArguments,
  ) {
    return objects;
  }

  protected postGetHandler(object: ResourceType, identifier: string, args: ResourceArguments) {
    return object;
  }

  protected postCreateHandler(object: ResourceType, args: ResourceArguments) {
    return object;
  }

  protected postUpdateHandler(object: ResourceType, identifier: string, args: ResourceArguments) {
    return object;
  }

  protected postDeleteHandler(identifier: string, args: ResourceArguments) {
    return identifier;
  }

  protected buildPath(args?: ResourceArguments) {
    let path = this.#path;
    for (const [key, value] of Object.entries(args || {})) {
      path = path.replace(`{${key}}`, value.toString());
    }
    return path;
  }
  /* eslint-enable class-methods-use-this, @typescript-eslint/no-unused-vars */
}
