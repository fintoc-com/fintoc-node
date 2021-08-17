import axios, { AxiosInstance } from 'axios';

export default class Client {
  baseUrl: string;
  apiKey: string;
  userAgent: string;
  params: Record<string, string>;
  __client?: AxiosInstance;

  constructor(constructorParams: {
    baseUrl: string,
    apiKey: string,
    userAgent: string,
    params?: Record<string, string>,
  }) {
    const {
      baseUrl, apiKey, userAgent, params,
    } = constructorParams;
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.userAgent = userAgent;
    this.params = params || {};
    this.__client = undefined;
  }

  get client() {
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

  extend(extenderParams: {
    baseUrl?: string,
    apiKey?: string,
    userAgent?: string,
    params?: Record<string, string>,
  }) {
    const {
      baseUrl, apiKey, userAgent, params,
    } = extenderParams;
    return new Client({
      baseUrl: baseUrl || this.baseUrl,
      apiKey: apiKey || this.apiKey,
      userAgent: userAgent || this.userAgent,
      params: params ? { ...this.params, ...params } : { ...this.params },
    });
  }
}
