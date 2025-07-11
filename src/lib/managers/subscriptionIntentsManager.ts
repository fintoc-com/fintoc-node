import { ManagerMixin } from '../mixins';
import { SubscriptionIntent } from '../resources/subscriptionIntent';

export class SubscriptionIntentsManager extends ManagerMixin<SubscriptionIntent> {
  static resource = 'subscription_intent';
  static methods = ['list', 'get', 'create'];
}
