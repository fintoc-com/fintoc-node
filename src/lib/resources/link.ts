import { GenericFunction } from '../../types';
import { Client } from '../client';
import {
  AccountsManager, InvoicesManager, SubscriptionsManager, TaxReturnsManager,
} from '../managers';
import { ResourceMixin } from '../mixins/resourceMixin';

export class Link extends ResourceMixin {
  static resourceIdentifier = '_linkToken';

  #accountsManager?: AccountsManager;
  #subscriptionsManager?: SubscriptionsManager;
  #taxReturnsManager?: TaxReturnsManager;
  #invoicesManager?: InvoicesManager;

  // @ts-ignore: declared but value is never used
  private _linkToken?: string;

  constructor(
    client: Client,
    handlers: Record<string, GenericFunction>,
    methods: string[],
    path: string,
    data: Record<string, any>,
  ) {
    super(client, handlers, methods, path, data);
    this.#accountsManager = undefined;
    this.#subscriptionsManager = undefined;
    this.#taxReturnsManager = undefined;
    this.#invoicesManager = undefined;
  }

  get accounts() {
    if (this.#accountsManager === undefined) {
      this.#accountsManager = new AccountsManager(
        '/accounts', this._client,
      );
    }
    return this.#accountsManager;
  }

  set accounts(newValue) { /* eslint-disable-line class-methods-use-this */
    throw new ReferenceError('Attribute name corresponds to a manager');
  }

  get subscriptions() {
    if (this.#subscriptionsManager === undefined) {
      this.#subscriptionsManager = new SubscriptionsManager(
        '/subscriptions', this._client,
      );
    }
    return this.#subscriptionsManager;
  }

  set subscriptions(newValue) { /* eslint-disable-line class-methods-use-this */
    throw new ReferenceError('Attribute name corresponds to a manager');
  }

  get taxReturns() {
    if (this.#taxReturnsManager === undefined) {
      this.#taxReturnsManager = new TaxReturnsManager(
        '/tax_returns', this._client,
      );
    }
    return this.#taxReturnsManager;
  }

  set taxReturns(newValue) { /* eslint-disable-line class-methods-use-this */
    throw new ReferenceError('Attribute name corresponds to a manager');
  }

  get invoices() {
    if (this.#invoicesManager === undefined) {
      this.#invoicesManager = new InvoicesManager(
        '/invoices', this._client,
      );
    }
    return this.#invoicesManager;
  }

  set invoices(newValue) { /* eslint-disable-line class-methods-use-this */
    throw new ReferenceError('Attribute name corresponds to a manager');
  }
}
