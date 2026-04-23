import { ManagerMixin } from '../mixins';
import { Whoami } from '../resources/whoami';

export class WhoamiManager extends ManagerMixin<Whoami> {
  static resource = 'whoami';
  static methods = ['get'];
}
