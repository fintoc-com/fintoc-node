import { Client } from '../client';
import { ManagerMixin } from '../mixins';
import { Account } from '../resources/account';

import { MovementsManager } from './movementsManager';

export class AccountsManager extends ManagerMixin<Account> {
  static resource = 'account';
  static methods = ['all', 'get'];

  movements: MovementsManager;

  constructor(path: string, client: Client) {
    super(path, client);
    this.movements = new MovementsManager('/accounts/{account_id}/movements', client);
  }
}
