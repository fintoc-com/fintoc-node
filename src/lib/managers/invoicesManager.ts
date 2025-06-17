import { ManagerMixin } from '../mixins';
import { Invoice } from '../resources/invoice';

export class InvoicesManager extends ManagerMixin<Invoice> {
  static resource = 'invoice';
  static methods = ['list'];
}
