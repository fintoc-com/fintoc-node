import axios, { AxiosInstance } from 'axios';

import { IConstructorOptions } from '../interfaces/client';
import { IExtendOptions } from '../interfaces/client/extensionOptions';
import { IRequestOptions } from '../interfaces/client/requestOptions';

import { paginate } from './paginator';

export class Client {
  baseUrl: string;
  apiKey: string;
  userAgent: string;
  params: Record<string, any>;
  __client?: AxiosInstance;

  constructor(options: IConstructorOptions) {
    const {
      baseUrl, apiKey, userAgent, params = {},
    } = options;
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

  async request(options: IRequestOptions) {
    const {
      path, paginated = false, method = 'get', params = {}, json = {},
    } = options;
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
