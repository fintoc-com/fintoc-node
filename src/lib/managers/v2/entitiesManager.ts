import { ManagerMixin } from '../../mixins';
import { Entity } from '../../resources/v2/entity';

export class EntitiesManager extends ManagerMixin<Entity> {
  static resource = 'entity';
  static methods = ['list', 'get'];
}