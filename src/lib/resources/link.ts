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

  /**
   * @deprecated This method is deprecated and will be removed in a future version.
   * Please use the Fintoc client directly to access accounts. See: https://github.com/fintoc-com/fintoc-node/pull/34
   */
  get accounts() {
    console.warn('Warning: Link.accounts is deprecated and will be removed in a future version. Please use the Fintoc client directly to access accounts. See: https://github.com/fintoc-com/fintoc-node/pull/34');
    if (this.#accountsManager === undefined) {
      this.#accountsManager = new AccountsManager(
        '/v1/accounts', this._useClient(),
      );
    }
    return this.#accountsManager;
  }

  set accounts(newValue) { /* eslint-disable-line class-methods-use-this */
    throw new ReferenceError('Attribute name corresponds to a manager');
  }

  /**
   * @deprecated This method is deprecated and will be removed in a future version.
   * Please use the Fintoc client directly to access subscriptions. See: https://github.com/fintoc-com/fintoc-node/pull/34
   */
  get subscriptions() {
    console.warn('Warning: Link.subscriptions is deprecated and will be removed in a future version. Please use the Fintoc client directly to access subscriptions. See: https://github.com/fintoc-com/fintoc-node/pull/34');
    if (this.#subscriptionsManager === undefined) {
      this.#subscriptionsManager = new SubscriptionsManager(
        '/v1/subscriptions', this._useClient(),
      );
    }
    return this.#subscriptionsManager;
  }

  set subscriptions(newValue) { /* eslint-disable-line class-methods-use-this */
    throw new ReferenceError('Attribute name corresponds to a manager');
  }

  /**
   * @deprecated This method is deprecated and will be removed in a future version.
   * Please use the Fintoc client directly to access taxReturns. See: https://github.com/fintoc-com/fintoc-node/pull/34
   */
  get taxReturns() {
    console.warn('Warning: Link.taxReturns is deprecated and will be removed in a future version. Please use the Fintoc client directly to access taxReturns. See: https://github.com/fintoc-com/fintoc-node/pull/34');
    if (this.#taxReturnsManager === undefined) {
      this.#taxReturnsManager = new TaxReturnsManager(
        '/v1/tax_returns', this._useClient(),
      );
    }
    return this.#taxReturnsManager;
  }

  set taxReturns(newValue) { /* eslint-disable-line class-methods-use-this */
    throw new ReferenceError('Attribute name corresponds to a manager');
  }

  /**
   * @deprecated This method is deprecated and will be removed in a future version.
   * Please use the Fintoc client directly to access invoices. See: https://github.com/fintoc-com/fintoc-node/pull/34
   */
  get invoices() {
    console.warn('Warning: Link.invoices is deprecated and will be removed in a future version. Please use the Fintoc client directly to access invoices. See: https://github.com/fintoc-com/fintoc-node/pull/34');
    if (this.#invoicesManager === undefined) {
      this.#invoicesManager = new InvoicesManager(
        '/v1/invoices', this._useClient(),
      );
    }
    return this.#invoicesManager;
  }

  set invoices(newValue) { /* eslint-disable-line class-methods-use-this */
    throw new ReferenceError('Attribute name corresponds to a manager');
  }

  /**
   * @deprecated This method is deprecated and will be removed in a future version.
   * Please use the Fintoc client directly to access refreshIntents. See: https://github.com/fintoc-com/fintoc-node/pull/34
   */
  get refreshIntents() {
    console.warn('Warning: Link.refreshIntents is deprecated and will be removed in a future version. Please use the Fintoc client directly to access refreshIntents. See: https://github.com/fintoc-com/fintoc-node/pull/34');
    if (this.#refreshIntentsManager === undefined) {
      this.#refreshIntentsManager = new RefreshIntentsManager(
        '/v1/refresh_intents', this._useClient(),
      );
    }
    return this.#refreshIntentsManager;
  }

  set refreshIntents(newValue) { /* eslint-disable-line class-methods-use-this */
    throw new ReferenceError('Attribute name corresponds to a manager');
  }
}
