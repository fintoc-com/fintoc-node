import { ManagerMixin } from '../mixins';

export class AccountsManager extends ManagerMixin {
  static resource = 'account';
  static methods = ['all', 'get'];
}
