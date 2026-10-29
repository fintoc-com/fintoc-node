import { ManagerMixin } from '../mixins';
import { TaxStatement } from '../resources/taxStatement';

export class TaxStatementsManager extends ManagerMixin<TaxStatement> {
  static resource = 'tax_statement';
  static methods = ['list', 'get'];
}
