import { Client } from '../../client';
import { ManagerMixin } from '../../mixins';
import { Entity } from '../../resources/v2/entity';

import { OnboardingsManager } from './onboardingsManager';

export class EntitiesManager extends ManagerMixin<Entity> {
  static resource = 'entity';
  static methods = ['list', 'get', 'create'];

  onboardings: OnboardingsManager;

  constructor(path: string, client: Client) {
    super(path, client);
    this.onboardings = new OnboardingsManager('/v2/entities/{entity_id}/onboardings', client);
  }
}
