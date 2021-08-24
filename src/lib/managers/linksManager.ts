/* eslint-disable no-param-reassign, @typescript-eslint/no-unused-vars */
import { ManagerMixin, ResourceMixin } from '../mixins';

export class LinksManager extends ManagerMixin {
  static resource = 'link';
  static methods = ['all', 'get', 'update', 'delete'];

  postGetHandler(object: ResourceMixin, identifier: string, args: Record<string, string>) {
    object._client = this._client.extend({ params: { link_token: identifier } });
    object._linkToken = identifier;
    return object;
  }

  postUpdateHandler(object: ResourceMixin, identifier: string, args: Record<string, string>) {
    object._client = this._client.extend({ params: { link_token: identifier } });
    object._linkToken = identifier;
    return object;
  }
}
