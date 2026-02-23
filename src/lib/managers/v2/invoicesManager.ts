import { ManagerMixin } from '../../mixins';
import { Invoice } from '../../resources/v2/invoice';

export class InvoicesManager extends ManagerMixin<Invoice> {
  static resource = 'invoice';
  static methods = ['list', 'get'];
}
