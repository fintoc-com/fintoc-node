import { ManagerMixin } from '../mixins';
import { TaxReturn } from '../resources/taxReturn';

export class TaxReturnsManager extends ManagerMixin<TaxReturn> {
  static resource = 'tax_return';
  static methods = ['all', 'get'];
}
