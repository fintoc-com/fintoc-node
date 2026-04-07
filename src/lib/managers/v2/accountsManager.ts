import { Client } from '../../client';
import { ManagerMixin } from '../../mixins';
import { Account } from '../../resources/v2/account';

import { AccountStatementsManager } from './accountStatementsManager';
import { MovementsManager } from './movementsManager';

export class AccountsManager extends ManagerMixin<Account> {
  static resource = 'account';
  static methods = ['list', 'get', 'create', 'update'];

  accountStatements: AccountStatementsManager;
  movements: MovementsManager;

  constructor(path: string, client: Client) {
    super(path, client);
    this.accountStatements = new AccountStatementsManager('/v2/accounts/{account_id}/account_statements', client);
    this.movements = new MovementsManager('/v2/accounts/{account_id}/movements', client);
  }
}
