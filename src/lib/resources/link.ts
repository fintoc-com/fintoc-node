import { GenericFunction } from '../../types';
import { Client } from '../client';
import {
  AccountsManager, InvoicesManager, RefreshIntentsManager, SubscriptionsManager, TaxReturnsManager,
} from '../managers';
import { ResourceMixin } from '../mixins/resourceMixin';

export class Link extends ResourceMixin<Link> {
  static resourceIdentifier = '_linkToken';

  #accountsManager?: AccountsManager;
  #subscriptionsManager?: SubscriptionsManager;
  #taxReturnsManager?: TaxReturnsManager;
  #invoicesManager?: InvoicesManager;
  #refreshIntentsManager?: RefreshIntentsManager;

  // @ts-ignore: declared but value is never used
  #linkToken?: string;

  constructor(
    client: Client,
    handlers: Record<string, GenericFunction>,
    methods: string[],
    path: string,
    content: Record<string, any>,
  ) {
    super(client, handlers, methods, path, content);
    this.#accountsManager = undefined;
    this.#subscriptionsManager = undefined;
    this.#taxReturnsManager = undefined;
    this.#invoicesManager = undefined;
    this.#refreshIntentsManager = undefined;
  }

  protected _setLinkToken(newLinkToken: string) {
    this.#linkToken = newLinkToken;
  }

  protected get _linkToken() {
    return this.#linkToken;
  }

  get accounts() {
    if (this.#accountsManager === undefined) {
      this.#accountsManager = new AccountsManager(
        '/accounts', this._useClient(),
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
        '/subscriptions', this._useClient(),
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
        '/tax_returns', this._useClient(),
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
        '/invoices', this._useClient(),
      );
    }
    return this.#invoicesManager;
  }

  set invoices(newValue) { /* eslint-disable-line class-methods-use-this */
    throw new ReferenceError('Attribute name corresponds to a manager');
  }

  get refreshIntents() {
    if (this.#refreshIntentsManager === undefined) {
      this.#refreshIntentsManager = new RefreshIntentsManager(
        '/refresh_intents', this._useClient(),
      );
    }
    return this.#refreshIntentsManager;
  }

  set refreshIntents(newValue) { /* eslint-disable-line class-methods-use-this */
    throw new ReferenceError('Attribute name corresponds to a manager');
  }
}
