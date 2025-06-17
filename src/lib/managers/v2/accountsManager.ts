import { ManagerMixin } from '../../mixins';
import { Account } from '../../resources/v2/account';

export class AccountsManager extends ManagerMixin<Account> {
  static resource = 'account';
  static methods = ['all', 'get', 'create'];
}
