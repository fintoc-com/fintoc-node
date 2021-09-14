import { IManagerMixinConstructor } from '../../interfaces/mixins';
import { GenericFunction } from '../../types';
import { Client } from '../client';
import { resourceAll, resourceCreate, resourceGet } from '../resourceHandlers';
import { canRaiseHTTPError, getResourceClass } from '../utils';

import { ResourceMixin } from './resourceMixin';

export abstract class ManagerMixin {
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

  all(args?: Record<string, string>) {
    if (!this.#originatingClass.methods.includes('all')) {
      throw new TypeError(`${this.#originatingClass.name}.all is not a valid function of of this manager`);
    }
    return this._all(args);
  }

  get(identifier: string, args?: Record<string, string>) {
    if (!this.#originatingClass.methods.includes('get')) {
      throw new TypeError(`${this.#originatingClass.name}.get is not a valid function of of this manager`);
    }
    return this._get(identifier, args);
  }

  create(args?: Record<string, string>) {
    if (!this.#originatingClass.methods.includes('create')) {
      throw new TypeError(`${this.#originatingClass.name}.create is not a valid function of of this manager`);
    }
    return this._create(args);
  }

  update(identifier: string, args?: Record<string, string>) {
    if (!this.#originatingClass.methods.includes('update')) {
      throw new TypeError(`${this.#originatingClass.name}.update is not a valid function of of this manager`);
    }
    return this._update(identifier, args);
  }

  delete(identifier: string, args?: Record<string, string>) {
    if (!this.#originatingClass.methods.includes('delete')) {
      throw new TypeError(`${this.#originatingClass.name}.delete is not a valid function of of this manager`);
    }
    return this._delete(identifier, args);
  }

  @canRaiseHTTPError
  private async _all(
    args?: Record<string, string>,
  ): Promise<ResourceMixin[] | AsyncGenerator<ResourceMixin>> {
    const innerArgs = args || {};
    const klass = getResourceClass(this.#originatingClass.resource);
    const objects = await resourceAll(
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
  private async _get(identifier: string, args?: Record<string, string>): Promise<ResourceMixin> {
    const innerArgs = args || {};
    const klass = getResourceClass(this.#originatingClass.resource);
    const object = await resourceGet(
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
  private async _create(args?: Record<string, string>): Promise<ResourceMixin> {
    const innerArgs = args || {};
    const klass = getResourceClass(this.#originatingClass.resource);
    const object = await resourceCreate(
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
  private async _update(
    identifier: string, args?: Record<string, string>,
  ): Promise<ResourceMixin> {
    const innerArgs = args || {};
    const object = await this.get(identifier);
    return object.update(innerArgs);
  }

  @canRaiseHTTPError
  private async _delete(identifier: string, args?: Record<string, string>): Promise<string> {
    const innerArgs = args || {};
    const object = await this.get(identifier);
    return object.delete(innerArgs);
  }

  /* eslint-disable class-methods-use-this, @typescript-eslint/no-unused-vars */
  protected postAllHandler(
    objects: ResourceMixin[] | AsyncGenerator<ResourceMixin>,
    args: Record<string, string>,
  ) {
    return objects;
  }

  protected postGetHandler(
    object: ResourceMixin, identifier: string, args: Record<string, string>,
  ) {
    return object;
  }

  protected postCreateHandler(object: ResourceMixin, args: Record<string, string>) {
    return object;
  }

  protected postUpdateHandler(
    object: ResourceMixin, identifier: string, args: Record<string, string>,
  ) {
    return object;
  }

  protected postDeleteHandler(identifier: string, args: Record<string, string>) {
    return identifier;
  }
  /* eslint-enable class-methods-use-this, @typescript-eslint/no-unused-vars */
}
