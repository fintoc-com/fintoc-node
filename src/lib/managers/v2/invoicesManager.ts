import { ResourceArguments } from '../../../types';
import { Client } from '../../client';
import { ManagerMixin } from '../../mixins';
import { Invoice } from '../../resources/v2/invoice';

import { LinesManager } from './linesManager';

export class InvoicesManager extends ManagerMixin<Invoice> {
  static resource = 'invoice';
  static methods = [
    'list',
    'get',
    'create',
    'update',
    'addLines',
    'removeLines',
    'finalize',
    'markUncollectible',
    'pay',
    'void',
  ];

  lines: LinesManager;

  constructor(path: string, client: Client) {
    super(path, client);
    this.lines = new LinesManager('/v2/invoices/{invoice_id}/lines', client);
  }

  addLines(invoiceId: string, args?: ResourceArguments): Promise<Invoice> {
    return this.#postAction(invoiceId, 'add_lines', args);
  }

  removeLines(invoiceId: string, args?: ResourceArguments): Promise<Invoice> {
    return this.#postAction(invoiceId, 'remove_lines', args);
  }

  finalize(invoiceId: string, args?: ResourceArguments): Promise<Invoice> {
    return this.#postAction(invoiceId, 'finalize', args);
  }

  markUncollectible(invoiceId: string, args?: ResourceArguments): Promise<Invoice> {
    return this.#postAction(invoiceId, 'mark_uncollectible', args);
  }

  pay(invoiceId: string, args?: ResourceArguments): Promise<Invoice> {
    return this.#postAction(invoiceId, 'pay', args);
  }

  void(invoiceId: string, args?: ResourceArguments): Promise<Invoice> {
    return this.#postAction(invoiceId, 'void', args);
  }

  #postAction(invoiceId: string, action: string, args?: ResourceArguments): Promise<Invoice> {
    const path = `${this.buildPath()}/${invoiceId}/${action}`;
    return this._action<Invoice>('post', path, {
      args, methods: InvoicesManager.methods, objectPath: this.buildPath(),
    });
  }
}
