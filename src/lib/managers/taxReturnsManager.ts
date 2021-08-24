import { ManagerMixin } from '../mixins';

export class TaxReturnsManager extends ManagerMixin {
  static resource = 'tax_return';
  static methods = ['all', 'get'];
}
