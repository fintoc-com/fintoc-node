import { Client } from './client';
import { API_BASE_URL, API_VERSION } from './constants';
import { LinksManager, PaymentIntentsManager, WebhookEndpointsManager } from './managers';
import { version } from './version';

export class Fintoc {
  #client: Client;

  links: LinksManager;
  paymentIntents: PaymentIntentsManager;
  webhookEndpoints: WebhookEndpointsManager;

  constructor(apiKey: string) {
    this.#client = new Client({
      baseUrl: `${API_BASE_URL}/${API_VERSION}`,
      userAgent: `fintoc-node/${version}`,
      apiKey,
    });
    this.links = new LinksManager('/links', this.#client);
    this.paymentIntents = new PaymentIntentsManager('/payment_intents', this.#client);
    this.webhookEndpoints = new WebhookEndpointsManager('/webhook_endpoints', this.#client);
  }
}
