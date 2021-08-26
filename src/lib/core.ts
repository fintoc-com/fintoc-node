import { Client } from './client';
import { API_BASE_URL, API_VERSION } from './constants';
import { LinksManager, WebhookEndpointsManager } from './managers';
import { ManagerMixin } from './mixins';
import { version } from './version';

export class Fintoc {
  #client: Client;

  links: ManagerMixin;
  webhookEndpoints: ManagerMixin;

  constructor(apiKey: string) {
    this.#client = new Client({
      baseUrl: `${API_BASE_URL}/${API_VERSION}`,
      userAgent: `fintoc-node/${version}`,
      apiKey,
    });
    this.links = new LinksManager('/links', this.#client);
    this.webhookEndpoints = new WebhookEndpointsManager('/webhook_endpoints', this.#client);
  }
}
