/* eslint-disable @typescript-eslint/no-unused-vars */
import { ResourceArguments } from '../../types';
import { ManagerMixin, ResourceMixin } from '../mixins';

export class LinksManager extends ManagerMixin {
  static resource = 'link';
  static methods = ['all', 'get', 'update', 'delete'];

  protected postGetHandler(
    object: ResourceMixin, identifier: string, args: ResourceArguments,
  ) {
    object._updateClient(this._client.extend({ params: { link_token: identifier } }));
    object._setLinkToken(identifier);
    return object;
  }

  protected postUpdateHandler(
    object: ResourceMixin, identifier: string, args: ResourceArguments,
  ) {
    object._updateClient(this._client.extend({ params: { link_token: identifier } }));
    object._setLinkToken(identifier);
    return object;
  }
}
