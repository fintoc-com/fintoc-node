import { GenericFunction } from '../../types';
import { Client } from '../client';
import {
  AccountsManager, InvoicesManager, SubscriptionsManager, TaxReturnsManager,
} from '../managers';
import { ResourceMixin } from '../mixins/resourceMixin';

export class Link extends ResourceMixin {
  static resourceIdentifier = '_linkToken';

  constructor(
    client: Client,
    handlers: Record<string, GenericFunction>,
    methods: string[],
    path: string,
    data: Record<string, any>,
  ) {
    super(client, handlers, methods, path, data);
    this.__accountsManager = undefined;
    this.__subscriptionsManager = undefined;
    this.__tax_returnsManager = undefined;
    this.__invoicesManager = undefined;
  }

  get accounts() {
    if (this.__accountsManager === undefined) {
      this.__accountsManager = new AccountsManager(
        '/accounts', this._client,
      );
    }
    return this.__accountsManager;
  }

  set accounts(newValue) { /* eslint-disable-line class-methods-use-this */
    throw new ReferenceError('Attribute name corresponds to a manager');
  }

  get subscriptions() {
    if (this.__subscriptionsManager === undefined) {
      this.__subscriptionsManager = new SubscriptionsManager(
        '/subscriptions', this._client,
      );
    }
    return this.__subscriptionsManager;
  }

  set subscriptions(newValue) { /* eslint-disable-line class-methods-use-this */
    throw new ReferenceError('Attribute name corresponds to a manager');
  }

  get taxReturns() {
    if (this.__taxReturnsManager === undefined) {
      this.__taxReturnsManager = new TaxReturnsManager(
        '/tax_returns', this._client,
      );
    }
    return this.__taxReturnsManager;
  }

  set taxReturns(newValue) { /* eslint-disable-line class-methods-use-this */
    throw new ReferenceError('Attribute name corresponds to a manager');
  }

  get invoices() {
    if (this.__invoicesManager === undefined) {
      this.__invoicesManager = new InvoicesManager(
        '/invoices', this._client,
      );
    }
    return this.__invoicesManager;
  }

  set invoices(newValue) { /* eslint-disable-line class-methods-use-this */
    throw new ReferenceError('Attribute name corresponds to a manager');
  }
}
