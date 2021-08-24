import { ManagerMixin } from '../mixins';

export class MovementsManager extends ManagerMixin {
  static resource = 'movement';
  static methods = ['all', 'get'];
}
