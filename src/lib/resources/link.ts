import { GenericFunction } from '../../types';
import { Client } from '../client';
import {
  AccountsManager, InvoicesManager, SubscriptionsManager, TaxReturnsManager,
} from '../managers';
import { ResourceMixin } from '../mixins/resourceMixin';

export class Link extends ResourceMixin {
  static resourceIdentifier = '_linkToken';

  private _accountsManager?: AccountsManager;
  private _subscriptionsManager?: SubscriptionsManager;
  private _taxReturnsManager?: TaxReturnsManager;
  private _invoicesManager?: InvoicesManager;

  constructor(
    client: Client,
    handlers: Record<string, GenericFunction>,
    methods: string[],
    path: string,
    data: Record<string, any>,
  ) {
    super(client, handlers, methods, path, data);
    this._accountsManager = undefined;
    this._subscriptionsManager = undefined;
    this._taxReturnsManager = undefined;
    this._invoicesManager = undefined;
  }

  get accounts() {
    if (this._accountsManager === undefined) {
      this._accountsManager = new AccountsManager(
        '/accounts', this._client,
      );
    }
    return this._accountsManager;
  }

  set accounts(newValue) { /* eslint-disable-line class-methods-use-this */
    throw new ReferenceError('Attribute name corresponds to a manager');
  }

  get subscriptions() {
    if (this._subscriptionsManager === undefined) {
      this._subscriptionsManager = new SubscriptionsManager(
        '/subscriptions', this._client,
      );
    }
    return this._subscriptionsManager;
  }

  set subscriptions(newValue) { /* eslint-disable-line class-methods-use-this */
    throw new ReferenceError('Attribute name corresponds to a manager');
  }

  get taxReturns() {
    if (this._taxReturnsManager === undefined) {
      this._taxReturnsManager = new TaxReturnsManager(
        '/tax_returns', this._client,
      );
    }
    return this._taxReturnsManager;
  }

  set taxReturns(newValue) { /* eslint-disable-line class-methods-use-this */
    throw new ReferenceError('Attribute name corresponds to a manager');
  }

  get invoices() {
    if (this._invoicesManager === undefined) {
      this._invoicesManager = new InvoicesManager(
        '/invoices', this._client,
      );
    }
    return this._invoicesManager;
  }

  set invoices(newValue) { /* eslint-disable-line class-methods-use-this */
    throw new ReferenceError('Attribute name corresponds to a manager');
  }
}
