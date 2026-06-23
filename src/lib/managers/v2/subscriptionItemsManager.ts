import { ResourceArguments } from '../../../types';
import { ManagerMixin } from '../../mixins';
import { SubscriptionItem } from '../../resources/v2/subscriptionItem';

export class SubscriptionItemsManager extends ManagerMixin<SubscriptionItem> {
  static resource = 'subscription_item';
  static methods = ['create'];

  create(args?: ResourceArguments): Promise<SubscriptionItem> {
    const innerArgs = args || {};
    const path = this.buildPath(innerArgs);
    return this._create({ path_: path, ...innerArgs });
  }
}
