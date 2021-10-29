import { ManagerMixin } from '../mixins';
import { RefreshIntent } from '../resources/refreshIntent';

export class RefreshIntentsManager extends ManagerMixin<RefreshIntent> {
  static resource = 'refresh_intent';
  static methods = ['all', 'get', 'create'];
}
