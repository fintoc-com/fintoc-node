const axios = require('axios');
const linkHeaderParser = require('parse-link-header');

const { Link } = require('./resources');
const {
  fieldsubs, pick, renameProperties, snakeToPascal,
} = require('./utils');
const errors = require('./errors');

const { SCHEME, BASE_URL, USER_AGENT } = require('./constants');


module.exports = class Fintoc {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.userAgent = USER_AGENT;

    this.headers = {
      Authorization: this.apiKey,
      'User-Agent': this.userAgent,
    };

    this._client = axios.create({
      baseURL: SCHEME + BASE_URL,
      headers: this.headers,
    });

    this.get = this._request('get');
    this.post = this._request('post');
    this.delete = this._request('delete');

    this.linkHeaders = null;

    this._nextFetcher = this._createFetcher();
  }

  * _createFetcher() {
    let { next } = this.linkHeaders;
    while (next) {
      // Yield next relative path
      yield this.get(next.url.replace(`${SCHEME}${BASE_URL}`, ''));
      next = this.linkHeaders.next;
    }
  }

  async fetchNext() {
    return this._nextFetcher.next().value;
  }

  // eslint-disable-next-line class-methods-use-this
  _getErrorClass(snakeCode) {
    const pascal = snakeToPascal(snakeCode);
    const className = `${pascal.replace(/Error$/, '')}Error`;
    return errors[className] || errors.FintocError;
  }

  // eslint-disable-next-line class-methods-use-this
  _request(method) {
    async function wrapper(resource, kwargs) {
      try {
        const response = await this._client.request({
          method,
          url: resource,
          data: kwargs,
        });

        const content = (
          response.statusText && fieldsubs.reduce(renameProperties, response.data)
        );

        this.linkHeaders = linkHeaderParser(response.headers.link);

        return content;
      } catch (exception) {
        const error = exception.response.data.error || {};
        const code = error.code || '';
        throw new (this._getErrorClass(code))(error);
      }
    }
    return wrapper;
  }

  _getLink(linkToken) {
    return this.get(`links/${linkToken}`);
  }

  _getLinks() {
    return this.get('links');
  }

  _postLink(credentials) {
    return this.post('links', { data: credentials, timeout: 30 });
  }

  _buildLink(data) {
    const param = pick(data, 'link_token');
    this._client.defaults.params = { ...this._client.defaults.params, ...param };
    return new Link(data, this);
  }

  async getLink(linkToken) {
    const data = { ...(await this._getLink(linkToken)), link_token: linkToken };
    return this._buildLink(data);
  }

  async getLinks() {
    return (await this._getLink()).map(this._buildLink);
  }

  async createLink(username, password, holderType, institutionId) {
    const credentials = {
      username,
      password,
      holder_type: holderType,
      institution_id: institutionId,
    };
    const data = await this._postLink(credentials);
    return this._buildLink(data);
  }

  deleteLink(linkId) {
    this.delete(`links/${linkId}`);
  }

  async getAccount(linkToken, accountId) {
    return (await this.getLink(linkToken)).find({ id: accountId });
  }

  toString() {
    const visibleChars = 4;
    const hiddenPart = '*'.repeat(this.apiKey.length - visibleChars);
    const visibleKey = this.apiKey.slice(-visibleChars);
    return `Client(🔑=${hiddenPart + visibleKey})`;
  }
};
