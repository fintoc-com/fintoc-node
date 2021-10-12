export class MockResponse {
  constructor(config: Record<string, string>) {
    const {
      method, baseURL, url, params, json,
    } = config;
  }
}
