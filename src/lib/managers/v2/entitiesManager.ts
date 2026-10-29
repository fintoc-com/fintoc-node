import { ResourceArguments } from '../../../types';
import { Client } from '../../client';
import { ManagerMixin } from '../../mixins';
import { Entity } from '../../resources/v2/entity';
import { SettlementAccount } from '../../resources/v2/settlementAccount';

import { OnboardingsManager } from './onboardingsManager';

export class EntitiesManager extends ManagerMixin<Entity> {
  static resource = 'entity';
  static methods = ['list', 'get', 'create', 'settlementAccount'];

  onboardings: OnboardingsManager;

  constructor(path: string, client: Client) {
    super(path, client);
    this.onboardings = new OnboardingsManager('/v2/entities/{entity_id}/onboardings', client);
  }

  settlementAccount(entityId: string, args?: ResourceArguments): Promise<SettlementAccount> {
    const path = `${this.buildPath()}/${entityId}/settlement_account`;
    return this._action<SettlementAccount>('get', path, { resource: 'settlement_account', args });
  }
}
