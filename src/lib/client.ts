import axios, { AxiosInstance } from 'axios';

import { IConstructorOptions } from '../interfaces/client';
import { IExtendOptions } from '../interfaces/client/extensionOptions';
import { IRequestOptions } from '../interfaces/client/requestOptions';

import { paginate } from './paginator';

export class Client {
  static #client?: AxiosInstance;

  baseUrl: string;
  apiKey: string;
  userAgent: string;
  params: Record<string, any>;

  constructor(options: IConstructorOptions) {
    const {
      baseUrl, apiKey, userAgent, params = {},
    } = options;
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.userAgent = userAgent;
    this.params = params || {};
  }

  private get client() {
    if (Client.#client === undefined) {
      Client.#client = axios.create({
        baseURL: this.baseUrl,
        headers: this.headers,
        params: this.params,
      });
    }
    return Client.#client;
  }

  get headers() {
    return { Authorization: this.apiKey, 'User-Agent': this.userAgent };
  }

  // Promise<Record<string, string> | AsyncGenerator<any, void, unknown>>
  async request(options: IRequestOptions & { paginated: false }): Promise<Record<string, string>>;
  async request(
    options: IRequestOptions & { paginated: true }
  ): Promise<AsyncGenerator<Record<string, string>, void, unknown>>;
  async request(options: IRequestOptions): Promise<Record<string, string>>;
  async request(
    options: IRequestOptions,
  ): Promise<Record<string, string> | AsyncGenerator<Record<string, string>, void, unknown>> {
    const {
      path, json, paginated = false, method = 'get', params = {},
    } = options;
    const url = `${this.baseUrl}${path}`;
    const allParams = { ...this.params, ...params };
    if (paginated) {
      return paginate({
        client: this.client,
        path: url,
        headers: this.headers,
        params: allParams,
      });
    }
    const response = await this.client.request({
      method, url, params: allParams, data: json, headers: this.headers,
    });
    return response.data;
  }

  extend(extension?: IExtendOptions) {
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
