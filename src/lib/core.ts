import { Client } from './client';
import { API_BASE_URL, API_VERSION } from './constants';
import {
  AccountsManager,
  InvoicesManager,
  LinksManager,
  PaymentIntentsManager,
  RefreshIntentsManager,
  SubscriptionsManager,
  TaxReturnsManager,
  WebhookEndpointsManager,
} from './managers';
import { version } from './version';

export class Fintoc {
  #client: Client;

  accounts: AccountsManager;
  invoices: InvoicesManager;
  links: LinksManager;
  paymentIntents: PaymentIntentsManager;
  refreshIntents: RefreshIntentsManager;
  subscriptions: SubscriptionsManager;
  taxReturns: TaxReturnsManager;
  webhookEndpoints: WebhookEndpointsManager;

  constructor(apiKey: string) {
    this.#client = new Client({
      baseUrl: `${API_BASE_URL}/${API_VERSION}`,
      userAgent: `fintoc-node/${version}`,
      apiKey,
    });
    this.accounts = new AccountsManager('/accounts', this.#client);
    this.invoices = new InvoicesManager('/invoices', this.#client);
    this.links = new LinksManager('/links', this.#client);
    this.paymentIntents = new PaymentIntentsManager('/payment_intents', this.#client);
    this.refreshIntents = new RefreshIntentsManager('/refresh_intents', this.#client);
    this.subscriptions = new SubscriptionsManager('/subscriptions', this.#client);
    this.taxReturns = new TaxReturnsManager('/tax_returns', this.#client);
    this.webhookEndpoints = new WebhookEndpointsManager('/webhook_endpoints', this.#client);
  }
}
