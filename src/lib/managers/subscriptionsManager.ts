import { ManagerMixin } from '../mixins';
import { Subscription } from '../resources/subscription';

export class SubscriptionsManager extends ManagerMixin<Subscription> {
  static resource = 'subscription';
  static methods = ['list', 'get'];
}
