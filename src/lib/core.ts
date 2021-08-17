import Client from './client';
import { API_BASE_URL, API_VERSION } from './constants';
import version from './version';

export default class Fintoc {
  _client: Client;

  constructor(apiKey: string) {
    this._client = new Client({
      baseUrl: `${API_BASE_URL}/${API_VERSION}`,
      userAgent: `fintoc-node/${version}`,
      apiKey,
    });
  }
}
