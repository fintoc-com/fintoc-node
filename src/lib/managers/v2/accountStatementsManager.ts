import { ManagerMixin } from '../../mixins';
import { AccountStatement } from '../../resources/v2/accountStatement';

export class AccountStatementsManager extends ManagerMixin<AccountStatement> {
  static resource = 'account_statement';
  static methods = ['list'];
}
