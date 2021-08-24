import { ManagerMixin } from '../mixins';

export class InvoicesManager extends ManagerMixin {
  static resource = 'invoice';
  static methods = ['all'];
}
