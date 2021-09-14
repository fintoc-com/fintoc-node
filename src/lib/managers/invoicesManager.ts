import { ManagerMixin } from '../mixins';
import { Invoice } from '../resources';

export class InvoicesManager extends ManagerMixin<Invoice> {
  static resource = 'invoice';
  static methods = ['all'];
}
