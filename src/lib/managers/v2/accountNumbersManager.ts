import { ManagerMixin } from '../../mixins';
import { AccountNumber } from '../../resources/v2/accountNumber';

export class AccountNumbersManager extends ManagerMixin<AccountNumber> {
  static resource = 'account_number';
  static methods = ['list', 'get', 'create', 'update'];
}
