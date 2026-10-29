import { ManagerMixin } from '../mixins';
import { Institution } from '../resources/institution';

export class InstitutionsManager extends ManagerMixin<Institution> {
  static resource = 'institution';
  static methods = ['list'];
}
