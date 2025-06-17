import crypto from 'crypto';

import axios, { AxiosInstance } from 'axios';

import { IConstructorOptions } from '../interfaces/client';
import { IExtendOptions } from '../interfaces/client/extensionOptions';
import { IRequestOptions } from '../interfaces/client/requestOptions';

import { JWSSignature } from './jws';
import { paginate } from './paginator';

export class Client {
  static #client?: AxiosInstance;

  baseUrl: string;
  apiKey: string;
  userAgent: string;
  params: Record<string, any>;
  jws?: JWSSignature;

  constructor(options: IConstructorOptions) {
    const {
      baseUrl, apiKey, userAgent, params = {}, jwsPrivateKey,
    } = options;
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.userAgent = userAgent;
    this.params = params || {};
    if (jwsPrivateKey) {
      this.jws = new JWSSignature(jwsPrivateKey);
    }
  }

  private get client() {
    if (Client.#client === undefined) {
      Client.#client = axios.create({
        baseURL: this.baseUrl,
        headers: this.staticHeaders,
        params: this.params,
      });
    }
    return Client.#client;
  }

  get staticHeaders() {
    return { Authorization: this.apiKey, 'User-Agent': this.userAgent, 'Content-Type': 'application/json' };
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
      path, json, paginated = false, method = 'get', params = {}, idempotencyKey,
    } = options;
    const url = `${this.baseUrl}${path}`;
    const allParams = { ...this.params, ...params };
    if (paginated) {
      return paginate({
        client: this.client,
        path: url,
        headers: this.staticHeaders,
        params: allParams,
      });
    }
    const rawBody = JSON.stringify(json);
    const headers = this.buildHeaders(method, rawBody, idempotencyKey);
    const response = await this.client.request({
      method, url, params: allParams, data: rawBody, headers,
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

  private buildHeaders(
    method: string,
    rawBody: string,
    idempotencyKey?: string,
  ): Record<string, string> {
    const headers: Record<string, string> = {
      ...this.staticHeaders,
      ...this.buildJWSHeaders(method, rawBody),
    };

    if (method === 'post') {
      headers['Idempotency-Key'] = idempotencyKey || crypto.randomUUID();
    }
    return headers;
  }

  private buildJWSHeaders(method: string, rawBody: string): Record<string, string> {
    if (this.jws && (method === 'post' || method === 'put' || method === 'patch')) {
      const signature = this.jws.generateHeader(rawBody);
      return { 'Fintoc-JWS-Signature': signature };
    }

    return {};
  }
}
