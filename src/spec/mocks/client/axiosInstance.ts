import { Axios, AxiosRequestConfig } from 'axios';

import { MockResponse } from './response';

export class MockAxiosInstance extends Axios {
  method: string | undefined;
  baseURL: string | undefined;
  params: Record<string, any>;
  data: Record<string, any>;

  constructor(config?: AxiosRequestConfig) {
    super(config);
    const {
      method, url, params, data,
    } = config || {};
    this.method = method;
    this.baseURL = url;
    this.params = params;
    this.data = data;
  }

  // @ts-ignore: return type is not assignable
  async request(config: AxiosRequestConfig) {
    const {
      method, url, params, data, headers,
    } = config;
    const usingMethod = method || 'get';
    const usingBaseURL = this.baseURL || '';
    const query = url?.includes('?') ? url.split('?').slice(-1)[0].split('&') : [];
    const innerParams = Object.fromEntries(query.map((x) => x.split('=')));
    const completeParams = { ...innerParams, ...(params === undefined ? {} : params) };
    const usableURL = url?.split('//').slice(-1)[0].split('/').slice(1).join('/').split('?')[0] || '';
    return new MockResponse({
      method: usingMethod,
      baseURL: usingBaseURL,
      url: usableURL,
      params: completeParams,
      json: JSON.parse(data || '{}'),
      headers: headers || {},
    });
  }
}

export function createAxiosInstance(config?: AxiosRequestConfig) {
  return new MockAxiosInstance(config);
}
