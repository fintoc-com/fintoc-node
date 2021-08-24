import axios, { AxiosInstance, Method } from 'axios';

import { paginate } from './paginator';

export class Client {
  baseUrl: string;
  apiKey: string;
  userAgent: string;
  params: Record<string, any>;
  __client?: AxiosInstance;

  constructor({
    baseUrl, apiKey, userAgent, params = {},
  }: {
    baseUrl: string,
    apiKey: string,
    userAgent: string,
    params?: Record<string, string>,
  }) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.userAgent = userAgent;
    this.params = params || {};
    this.__client = undefined;
  }

  get _client() {
    if (this.__client === undefined) {
      this.__client = axios.create({
        baseURL: this.baseUrl,
        headers: this.headers,
        params: this.params,
      });
    }
    return this.__client;
  }

  get headers() {
    return { Authorization: this.apiKey, 'User-Agent': this.userAgent };
  }

  async request({
    path, paginated = false, method = 'get', params = {}, json = {},
  }: {
    path: string,
    paginated?: boolean,
    method?: Method,
    params?: Record<string, any>,
    json?: Record<string, string>,
  }) {
    if (paginated) {
      return paginate({
        client: this._client,
        path,
        params,
      });
    }
    const response = await this._client.request({
      method, url: path, params, data: json,
    });
    return response.data;
  }

  extend(extension?: {
    baseUrl?: string,
    apiKey?: string,
    userAgent?: string,
    params?: Record<string, string>,
  }) {
    const {
      baseUrl, apiKey, userAgent, params,
    } = (extension || {});
    return new Client({
      baseUrl: baseUrl || this.baseUrl,
      apiKey: apiKey || this.apiKey,
      userAgent: userAgent || this.userAgent,
      params: params ? { ...this.params, ...params } : { ...this.params },
    });
  }
}
