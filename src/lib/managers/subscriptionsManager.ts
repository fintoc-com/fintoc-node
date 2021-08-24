import { ManagerMixin } from '../mixins';

export class SubscriptionsManager extends ManagerMixin {
  static resource = 'subscription';
  static methods = ['all', 'get'];
}
