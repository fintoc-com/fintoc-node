import { IManagerMixinConstructor, IResourceMixin } from '../../interfaces/mixins';
import { GenericFunction, ResourceArguments } from '../../types';
import { Client } from '../client';
import { resourceAll, resourceCreate, resourceGet } from '../resourceHandlers';
import { canRaiseHTTPError, getResourceClass } from '../utils';

export abstract class ManagerMixin<ResourceType extends IResourceMixin> {
  static resource: string;
  static methods: string[];

  #path: string;
  #handlers: Record<string, GenericFunction>

  protected _client: Client;

  constructor(path: string, client: Client) {
    this.#path = path;
    this._client = client.extend();
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
  all(args?: ResourceArguments & { lazy: true }): Promise<AsyncGenerator<ResourceType>>;
  all(args?: ResourceArguments & { lazy: false }): Promise<ResourceType[]>;
  all(args?: ResourceArguments): Promise<AsyncGenerator<ResourceType>>;
  all(args?: ResourceArguments): Promise<ResourceType[] | AsyncGenerator<ResourceType>> {
    if (!this.#originatingClass.methods.includes('all')) {
      throw new TypeError(`${this.#originatingClass.name}.all is not a valid function of of this manager`);
    }
    return this._all(args);
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
  private async _all(
    args?: ResourceArguments,
  ): Promise<ResourceType[] | AsyncGenerator<ResourceType>> {
    const innerArgs = args || {};
    const klass = getResourceClass(this.#originatingClass.resource);
    const objects = await resourceAll<ResourceType>(
      this._client,
      this.#path,
      klass,
      this.#handlers,
      this.#originatingClass.methods,
      innerArgs,
    );
    return this.postAllHandler(objects, innerArgs);
  }

  @canRaiseHTTPError
  private async _get(identifier: string, args?: ResourceArguments): Promise<ResourceType> {
    const innerArgs = args || {};
    const klass = getResourceClass(this.#originatingClass.resource);
    const object = await resourceGet<ResourceType>(
      this._client,
      this.#path,
      identifier,
      klass,
      this.#handlers,
      this.#originatingClass.methods,
      innerArgs,
    );
    return this.postGetHandler(object, identifier, innerArgs);
  }

  @canRaiseHTTPError
  private async _create(args?: ResourceArguments): Promise<ResourceType> {
    const innerArgs = args || {};
    const klass = getResourceClass(this.#originatingClass.resource);
    const object = await resourceCreate<ResourceType>(
      this._client,
      this.#path,
      klass,
      this.#handlers,
      this.#originatingClass.methods,
      innerArgs,
    );
    return this.postCreateHandler(object, innerArgs);
  }

  @canRaiseHTTPError
  private async _update(identifier: string, args?: ResourceArguments): Promise<ResourceType> {
    const innerArgs = args || {};
    const object = await this.get(identifier);
    return object.update(innerArgs);
  }

  @canRaiseHTTPError
  private async _delete(identifier: string, args?: ResourceArguments): Promise<string> {
    const innerArgs = args || {};
    const object = await this.get(identifier);
    return object.delete(innerArgs);
  }

  /* eslint-disable class-methods-use-this, @typescript-eslint/no-unused-vars */
  protected postAllHandler(
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
  /* eslint-enable class-methods-use-this, @typescript-eslint/no-unused-vars */
}
