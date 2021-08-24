import { Client } from './client';
import { API_BASE_URL, API_VERSION } from './constants';
import { LinksManager } from './managers';
import { ManagerMixin } from './mixins';
import { version } from './version';

export class Fintoc {
  _client: Client;
  links: ManagerMixin;

  constructor(apiKey: string) {
    this._client = new Client({
      baseUrl: `${API_BASE_URL}/${API_VERSION}`,
      userAgent: `fintoc-node/${version}`,
      apiKey,
    });
    this.links = new LinksManager('/links', this._client);
  }
}
