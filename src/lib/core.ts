import { Client } from './client';
import { API_BASE_URL, API_VERSION } from './constants';
import { LinksManager, WebhookEndpointsManager } from './managers';
import { ManagerMixin } from './mixins';
import { version } from './version';

export class Fintoc {
  private _client: Client;

  links: ManagerMixin;
  webhookEndpoints: ManagerMixin;

  constructor(apiKey: string) {
    this._client = new Client({
      baseUrl: `${API_BASE_URL}/${API_VERSION}`,
      userAgent: `fintoc-node/${version}`,
      apiKey,
    });
    this.links = new LinksManager('/links', this._client);
    this.webhookEndpoints = new WebhookEndpointsManager('/webhook_endpoints', this._client);
  }
}
