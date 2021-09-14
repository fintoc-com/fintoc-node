import { ManagerMixin } from '../mixins';
import { Subscription } from '../resources';

export class SubscriptionsManager extends ManagerMixin<Subscription> {
  static resource = 'subscription';
  static methods = ['all', 'get'];
}
