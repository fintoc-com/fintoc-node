import { ManagerMixin } from '../../mixins';
import { Movement } from '../../resources/v2/movement';

export class MovementsManager extends ManagerMixin<Movement> {
  static resource = 'movement';
  static methods = ['list', 'get'];
}
