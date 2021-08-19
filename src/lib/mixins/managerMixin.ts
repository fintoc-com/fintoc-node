import { GenericFunction } from '../../types';
import Client from '../client';
import { canRaiseHTTPError } from '../utils';

export default abstract class ManagerMixin {
  _path: string;
  _client: Client;
  _handlers: Record<string, GenericFunction>

  static resource: string;
  static methods: string[];

  constructor(path: string, client: Client) {
    this._path = path;
    this._client = client.extend();
    this._handlers = {};
  }

  @canRaiseHTTPError
  all(args: Record<string, string>) {
    return this;
  }

  @canRaiseHTTPError
  get(args: Record<string, string>) {
    return this;
  }

  @canRaiseHTTPError
  create(args: Record<string, string>) {
    return this;
  }

  @canRaiseHTTPError
  update(args: Record<string, string>) {
    return this;
  }

  @canRaiseHTTPError
  delete(args: Record<string, string>) {
    return this;
  }

  /* eslint-disable class-methods-use-this, @typescript-eslint/no-unused-vars */
  postAllHandler(objects: Record<string, unknown>[], args: Record<string, string>) {
    return objects;
  }

  postGetHandler(
    object: Record<string, unknown>, identifier: string, args: Record<string, string>,
  ) {
    return object;
  }

  postCreateHandler(object: Record<string, unknown>, args: Record<string, string>) {
    return object;
  }

  postUpdateHandler(
    object: Record<string, unknown>, identifier: string, args: Record<string, string>,
  ) {
    return object;
  }

  postDeleteHandler(identifier: string, args: Record<string, string>) {
    return identifier;
  }
  /* eslint-enable class-methods-use-this, @typescript-eslint/no-unused-vars */
}
