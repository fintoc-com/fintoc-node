import { ManagerMixin } from '../mixins';
import { Account } from '../resources/account';

export class AccountsManager extends ManagerMixin<Account> {
  static resource = 'account';
  static methods = ['all', 'get'];
}
