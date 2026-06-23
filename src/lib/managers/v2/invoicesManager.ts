import { ResourceArguments } from '../../../types';
import { Client } from '../../client';
import { ManagerMixin } from '../../mixins';
import { Invoice } from '../../resources/v2/invoice';

import { LinesManager } from './linesManager';

export class InvoicesManager extends ManagerMixin<Invoice> {
  static resource = 'invoice';
  static methods = ['list', 'get', 'addLines', 'removeLines'];

  lines: LinesManager;

  constructor(path: string, client: Client) {
    super(path, client);
    this.lines = new LinesManager('/v2/invoices/{invoice_id}/lines', client);
  }

  addLines(invoiceId: string, args?: ResourceArguments): Promise<Invoice> {
    const innerArgs = args || {};
    const path = `${this.buildPath()}/${invoiceId}/add_lines`;
    return this._create({ path_: path, ...innerArgs });
  }

  removeLines(invoiceId: string, args?: ResourceArguments): Promise<Invoice> {
    const innerArgs = args || {};
    const path = `${this.buildPath()}/${invoiceId}/remove_lines`;
    return this._create({ path_: path, ...innerArgs });
  }
}
