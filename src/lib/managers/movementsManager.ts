import { ManagerMixin } from '../mixins';
import { Movement } from '../resources/movement';

export class MovementsManager extends ManagerMixin<Movement> {
  static resource = 'movement';
  static methods = ['all', 'get'];
}
