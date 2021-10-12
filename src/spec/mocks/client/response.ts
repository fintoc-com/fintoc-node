export class MockResponse {
  baseURL: string;
  params: Record<string, any>;
  page: number | undefined;
  method: string;
  url: string;
  json: Record<string, any> | undefined;

  constructor(config: Record<string, any>) {
    const {
      method, baseURL, url, params, json,
    } = config;

    this.baseURL = baseURL;
    this.params = params;

    let page;
    if (method === 'get' && url.charAt(url.length - 1) === 's') {
      page = this.params.page || 1;
      delete this.params.page;
    }

    this.page = page;
    this.method = method;
    this.url = url;
    this.json = json;
  }

  get data() {
    if (this.method === 'delete') {
      return {};
    }
    if (this.method === 'get' && this.url.charAt(this.url.length - 1) === 's') {
      return Array(10).map(() => ({
        id: 'idx',
        method: this.method,
        url: this.url,
        params: this.params,
        json: this.json,
        page: this.page,
      }));
    }
    return {
      id: 'idx',
      method: this.method,
      url: this.url,
      params: this.params,
      json: this.json,
    };
  }
}
