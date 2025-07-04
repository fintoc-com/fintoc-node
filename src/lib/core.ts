/* eslint-disable max-classes-per-file */
import { Client } from './client';
import { API_BASE_URL } from './constants';
import {
  AccountsManager,
  ChargesManager,
  CheckoutSessionsManager,
  InvoicesManager,
  LinksManager,
  PaymentIntentsManager,
  RefreshIntentsManager,
  SubscriptionIntentsManager,
  SubscriptionsManager,
  TaxReturnsManager,
  WebhookEndpointsManager,
} from './managers';
import {
  AccountNumbersManager,
  AccountVerificationsManager,
  EntitiesManager,
  SimulateManager,
  TransfersManager,
  AccountsManager as V2AccountsManager,
} from './managers/v2';
import { version } from './version';

class FintocV2 {
  accounts: V2AccountsManager;
  transfers: TransfersManager;
  accountNumbers: AccountNumbersManager;
  simulate: SimulateManager;
  entities: EntitiesManager;
  accountVerifications: AccountVerificationsManager;

  constructor(client: Client) {
    this.accounts = new V2AccountsManager('/v2/accounts', client);
    this.transfers = new TransfersManager('/v2/transfers', client);
    this.accountNumbers = new AccountNumbersManager('/v2/account_numbers', client);
    this.simulate = new SimulateManager('/v2/simulate', client);
    this.entities = new EntitiesManager('/v2/entities', client);
    this.accountVerifications = new AccountVerificationsManager('/v2/account_verifications', client);
  }
}

export class Fintoc {
  #client: Client;

  accounts: AccountsManager;
  charges: ChargesManager;
  checkoutSessions: CheckoutSessionsManager;
  invoices: InvoicesManager;
  links: LinksManager;
  paymentIntents: PaymentIntentsManager;
  refreshIntents: RefreshIntentsManager;
  subscriptions: SubscriptionsManager;
  subscriptionIntents: SubscriptionIntentsManager;
  taxReturns: TaxReturnsManager;
  webhookEndpoints: WebhookEndpointsManager;
  v2: FintocV2;

  constructor(apiKey: string, jwsPrivateKey?: string) {
    this.#client = new Client({
      baseUrl: `${API_BASE_URL}`,
      userAgent: `fintoc-node/${version}`,
      apiKey,
      jwsPrivateKey,
    });
    this.accounts = new AccountsManager('/v1/accounts', this.#client);
    this.charges = new ChargesManager('/v1/charges', this.#client);
    this.checkoutSessions = new CheckoutSessionsManager('/v1/checkout_sessions', this.#client);
    this.invoices = new InvoicesManager('/v1/invoices', this.#client);
    this.links = new LinksManager('/v1/links', this.#client);
    this.paymentIntents = new PaymentIntentsManager('/v1/payment_intents', this.#client);
    this.refreshIntents = new RefreshIntentsManager('/v1/refresh_intents', this.#client);
    this.subscriptions = new SubscriptionsManager('/v1/subscriptions', this.#client);
    this.subscriptionIntents = new SubscriptionIntentsManager('/v1/subscription_intents', this.#client);
    this.taxReturns = new TaxReturnsManager('/v1/tax_returns', this.#client);
    this.webhookEndpoints = new WebhookEndpointsManager('/v1/webhook_endpoints', this.#client);

    this.v2 = new FintocV2(this.#client);
  }
}
