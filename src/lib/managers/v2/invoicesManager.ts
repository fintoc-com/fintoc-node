import { ResourceArguments } from '../../../types';
import { ManagerMixin } from '../../mixins';
import { Invoice } from '../../resources/v2/invoice';

export class InvoicesManager extends ManagerMixin<Invoice> {
  static resource = 'invoice';
  static methods = ['list', 'get', 'addLines'];

  addLines(invoiceId: string, args?: ResourceArguments): Promise<Invoice> {
    const innerArgs = args || {};
    const path = `${this.buildPath()}/${invoiceId}/add_lines`;
    return this._create({ path_: path, ...innerArgs });
  }
}
