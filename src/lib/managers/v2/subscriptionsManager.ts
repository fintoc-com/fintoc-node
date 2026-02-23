import { ResourceArguments } from '../../../types';
import { ManagerMixin } from '../../mixins';
import { Subscription } from '../../resources/v2/subscription';

export class SubscriptionsManager extends ManagerMixin<Subscription> {
  static resource = 'subscription';
  static methods = ['list', 'get', 'cancel'];

  cancel(subscriptionId: string, args?: ResourceArguments): Promise<Subscription> {
    const innerArgs = args || {};
    const path = `${this.buildPath()}/${subscriptionId}/cancel`;
    return this._create({ path_: path, ...innerArgs });
  }
}
