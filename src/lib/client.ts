import axios, { AxiosInstance } from 'axios';

import { IConstructorOptions } from '../interfaces/client';
import { IExtendOptions } from '../interfaces/client/extensionOptions';
import { IRequestOptions } from '../interfaces/client/requestOptions';

import { paginate } from './paginator';

export class Client {
  #client?: AxiosInstance;

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
    this.#client = undefined;
  }

  private get client() {
    if (this.#client === undefined) {
      this.#client = axios.create({
        baseURL: this.baseUrl,
        headers: this.headers,
        params: this.params,
      });
    }
    return this.#client;
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
      path, paginated = false, method = 'get', params = {}, json = {},
    } = options;
    if (paginated) {
      return paginate({
        client: this.client,
        path,
        params,
      });
    }
    const response = await this.client.request({
      method, url: path, params, data: json,
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
