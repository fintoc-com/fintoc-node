import { ResourceArguments } from '../../types';
import { ManagerMixin } from '../mixins';
import { Link } from '../resources/link';

export class LinksManager extends ManagerMixin<Link> {
  static resource = 'link';
  static methods = ['list', 'get', 'update', 'delete', 'exchange'];

  async exchange(args: ResourceArguments & { exchange_token: string }): Promise<Link> {
    const path = `${this.buildPath()}/exchange`;
    const link = await this._action<Link>('get', path, {
      args,
      methods: LinksManager.methods,
      objectPath: this.buildPath(),
    });
    if (typeof link.link_token === 'string') {
      return this.postGetHandler(link, link.link_token, args);
    }
    return link;
  }

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
