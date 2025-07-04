import { ManagerMixin } from '../mixins';
import { Charge } from '../resources/charge';

export class ChargesManager extends ManagerMixin<Charge> {
  static resource = 'charge';
  static methods = ['list', 'get', 'create'];
}
