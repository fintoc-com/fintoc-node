import { ResourceArguments } from '../../../types';
import { Client } from '../../client';
import { ManagerMixin } from '../../mixins';
import { Subscription } from '../../resources/v2/subscription';

import { SubscriptionItemsManager } from './subscriptionItemsManager';

export class SubscriptionsManager extends ManagerMixin<Subscription> {
  static resource = 'subscription';
  static methods = ['list', 'get', 'create', 'update', 'cancel'];

  items: SubscriptionItemsManager;

  constructor(path: string, client: Client) {
    super(path, client);
    this.items = new SubscriptionItemsManager('/v2/subscriptions/{subscription_id}/items', client);
  }

  cancel(subscriptionId: string, args?: ResourceArguments): Promise<Subscription> {
    const innerArgs = args || {};
    const path = `${this.buildPath()}/${subscriptionId}/cancel`;
    return this._create({ path_: path, ...innerArgs });
  }
}
