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

  protected originatingClass() {
    return this.constructor as unknown as IManagerMixinConstructor;
  }

  @canRaiseHTTPError
  async all(
    args?: Record<string, string>,
  ): Promise<ResourceMixin[] | AsyncGenerator<ResourceMixin>> {
    const innerArgs = args || {};
    const klass = getResourceClass(this.originatingClass().resource);
    const objects = await resourceAll(
      this._client,
      this.#path,
      klass,
      this.#handlers,
      this.originatingClass().methods,
      innerArgs,
    );
    return this.postAllHandler(objects, innerArgs);
  }

  @canRaiseHTTPError
  async get(identifier: string, args?: Record<string, string>): Promise<ResourceMixin> {
    const innerArgs = args || {};
    const klass = getResourceClass(this.originatingClass().resource);
    const object = await resourceGet(
      this._client,
      this.#path,
      identifier,
      klass,
      this.#handlers,
      this.originatingClass().methods,
      innerArgs,
    );
    return this.postGetHandler(object, identifier, innerArgs);
  }

  @canRaiseHTTPError
  async create(args?: Record<string, string>): Promise<ResourceMixin> {
    const innerArgs = args || {};
    const klass = getResourceClass(this.originatingClass().resource);
    const object = await resourceCreate(
      this._client,
      this.#path,
      klass,
      this.#handlers,
      this.originatingClass().methods,
      innerArgs,
    );
    return this.postCreateHandler(object, innerArgs);
  }

  @canRaiseHTTPError
  async update(identifier: string, args?: Record<string, string>): Promise<ResourceMixin> {
    const innerArgs = args || {};
    const object = await this.get(identifier);
    return object.update(innerArgs);
  }

  @canRaiseHTTPError
  async delete(identifier: string, args?: Record<string, string>): Promise<string> {
    const innerArgs = args || {};
    const object = await this.get(identifier);
    return object.delete(innerArgs);
  }

  /* eslint-disable class-methods-use-this, @typescript-eslint/no-unused-vars */
  postAllHandler(
    objects: ResourceMixin[] | AsyncGenerator<ResourceMixin>,
    args: Record<string, string>,
  ) {
    return objects;
  }

  postGetHandler(
    object: ResourceMixin, identifier: string, args: Record<string, string>,
  ) {
    return object;
  }

  postCreateHandler(object: ResourceMixin, args: Record<string, string>) {
    return object;
  }

  postUpdateHandler(
    object: ResourceMixin, identifier: string, args: Record<string, string>,
  ) {
    return object;
  }

  postDeleteHandler(identifier: string, args: Record<string, string>) {
    return identifier;
  }
  /* eslint-enable class-methods-use-this, @typescript-eslint/no-unused-vars */
}
