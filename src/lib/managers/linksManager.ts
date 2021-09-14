/* eslint-disable @typescript-eslint/no-unused-vars */
import { ResourceArguments } from '../../types';
import { ManagerMixin } from '../mixins';
import { Link } from '../resources';

export class LinksManager extends ManagerMixin<Link> {
  static resource = 'link';
  static methods = ['all', 'get', 'update', 'delete'];

  protected postGetHandler(
    object: Link, identifier: string, args: ResourceArguments,
  ) {
    // @ts-ignore: property is protected
    object._updateClient(this._client.extend({ params: { link_token: identifier } }));

    // @ts-ignore: property is protected
    object._setLinkToken(identifier);

    return object;
  }

  protected postUpdateHandler(
    object: Link, identifier: string, args: ResourceArguments,
  ) {
    // @ts-ignore: property is protected
    object._updateClient(this._client.extend({ params: { link_token: identifier } }));

    // @ts-ignore: property is protected
    object._setLinkToken(identifier);

    return object;
  }
}
