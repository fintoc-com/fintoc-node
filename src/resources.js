/* eslint-disable max-classes-per-file */

const {
  invertedFieldsubs, flatten, pluralize, renameProperties,
} = require('./utils');


class ResourceMixin {
  isEqualTo(other) {
    return this.id_ === other.id_;
  }

  toString() {
    return `<${this.constructor.name} @id=${this.id_}>`;
  }

  toJSON() {
    if ('serialize' in this) {
      return this.serialize();
    }

    if (this instanceof Date) {
      return this.toISOString();
    }

    try {
      return this.toString();
    } catch (error) {
      return this;
    }
  }

  serialize() {
    const serialized = {};
    Object.entries(this).forEach(([attr, field]) => {
      if (attr.charAt(0) !== '_') {
        if (typeof field === 'object' && field !== null && 'serialize' in field) {
          serialized[attr] = field.serialize();
        } else {
          serialized[attr] = field;
        }
      }
    });
    return invertedFieldsubs.reduce(renameProperties, serialized);
  }
}

class Movement extends ResourceMixin {
  /* eslint-disable camelcase */
  constructor({
    id_,
    amount,
    currency,
    description,
    post_date,
    transaction_date,
  }) {
    super();
    this.id_ = id_;
    this.amount = amount;
    this.currency = currency;
    this.description = description;
    this.postDate = post_date && new Date(post_date);
    this.transactionDate = transaction_date && new Date(transaction_date);
  }
  /* eslint-enable camelcase */

  get localDate() {
    return this.postDate.toLocaleDateString();
  }

  toString() {
    return `${this.amount.toLocaleString()} (${this.description} @ ${this.localDate})`;
  }
}

class Balance extends ResourceMixin {
  constructor({
    available,
    current,
    limit,
  }) {
    super();
    this.id_ = Balance._getId();
    this.available = available;
    this.current = current;
    this.limit = limit;
  }

  toString() {
    return `${this.available.toLocaleString()} / ${this.current.toLocaleString()}`;
  }

  static _getId() {
    if (!this._idGenerator) {
      this._idGenerator = 1;
    } else {
      this._idGenerator += 1;
    }
    return this._idGenerator;
  }
}

class Institution extends ResourceMixin {
  constructor({
    id_,
    name,
    country,
  }) {
    super();
    this.id_ = id_;
    this.name = name;
    this.country = country;
  }

  toString() {
    return `🏦 ${this.name}`;
  }
}

class Account extends ResourceMixin {
  /* eslint-disable camelcase */
  constructor({
    id_,
    name,
    official_name,
    number,
    holder_id,
    holder_name,
    type_,
    currency,
    balance = null,
    movements = null,
  }, _client = null) {
    super();
    this.id_ = id_;
    this.name = name;
    this.officialName = official_name;
    this.number = number;
    this.holderId = holder_id;
    this.holderName = holder_name;
    this.type_ = type_;
    this.currency = currency;
    this.balance = balance ? new Balance(balance) : null;
    this.movements = movements || [];
    this._client = _client;

    return new Proxy(this, {
      get(target, prop) {
        // eslint-disable-next-line eqeqeq
        if ((Number(prop) == prop) && !(prop in target)) {
          return target.movements[prop];
        }
        return target[prop];
      },
    });
  }
  /* eslint-enable camelcase */

  get length() {
    return this.movements.length || 0;
  }

  _getAccount() {
    return this._client.get(`accounts/${this.id_}`);
  }

  async _getMovements(params) {
    const first = await this._client.get(`accounts/${this.id_}/movements`, params);
    return first.concat(params ? flatten(await this._client.fetchNext() || []) : []);
  }

  async updateBalance() {
    const data = (await this._getAccount()).balance;
    this.balance = new Balance(data);
  }

  async getMovements(params) {
    return (await this._getMovements(params)).map((movement) => new Movement(movement));
  }

  async updateMovements(params) {
    this.movements.concat(await this.getMovements(params));

    this.movements = Array.from(new Set(this.movements)).sort((a, b) => a.postDate < b.postDate);
  }

  showMovements(rows = 5) {
    function getRow(index, movement) {
      return {
        '#': index,
        Amount: movement.amount.toLocaleString(),
        Currency: movement.currency,
        Description: movement.description,
        Date: movement.localDate,
      };
    }

    /* eslint-disable no-console */
    console.log(`This account has ${pluralize(this.length, 'movement')}`);

    if (this.length > 0) {
      const movements = this.movements.slice(0, rows).map(
        (movement, index) => getRow(index, movement),
      );
      const formatted = movements.reduce((prev, next) => {
        const { '#': key, ...newValue } = next;
        return { ...prev, [key]: newValue };
      }, {});
      console.table(formatted);
    }

    /* eslint-enable no-console */
  }

  toString() {
    return `💰 ${this.holderName}’s ${this.name}`;
  }
}

class Link extends ResourceMixin {
  /* eslint-disable camelcase */
  constructor({
    id_,
    username,
    holder_type,
    institution,
    created_at,
    accounts = null,
    link_token = null,
  }, _client = null) {
    super();
    this.id_ = id_;
    this.username = username;
    this.holderType = holder_type;
    this.institution = new Institution(institution);
    this.createdAt = new Date(created_at);
    this.accounts = (accounts || []).map((data) => new Account(data, _client));
    this._token = link_token;
    this._client = _client;

    return new Proxy(this, {
      get(target, prop) {
        // eslint-disable-next-line eqeqeq
        if ((Number(prop) == prop) && !(prop in target)) {
          return target.accounts[prop];
        }
        return target[prop];
      },
    });
  }
  /* eslint-enable camelcase */

  get length() {
    return this.accounts.length || 0;
  }

  findAll(kwargs) {
    if (Object.keys(kwargs).length !== 1) {
      throw new Error('You must provide *exactly one* account field.');
    }

    const [[field, value]] = Object.entries(kwargs);
    return this.accounts.filter((account) => account[field] === value);
  }

  find(kwargs) {
    return this.findAll(kwargs)[0] || null;
  }

  showAccounts(rows = 5) {
    function getRow(index, account) {
      return {
        '#': index,
        Name: account.name,
        Holder: account.holderName,
        Currency: account.currency,
      };
    }

    /* eslint-disable no-console */
    console.log(`This link has ${pluralize(this.length, 'account')}`);

    if (this.length > 0) {
      const accounts = this.accounts.slice(0, rows).map((account, index) => getRow(index, account));
      const formatted = accounts.reduce((prev, next) => {
        const { '#': key, ...newValue } = next;
        return { ...prev, [key]: newValue };
      }, {});
      console.table(formatted);
    }

    /* eslint-enable no-console */
  }

  updateAccounts() {
    this.accounts.forEach((account) => {
      account.updateBalance();
      account.updateMovements();
    });
  }

  _delete() {
    this._client.deleteLink(this.id_);
  }

  toString() {
    return `<${this.username}@${this.institution.name}> 🔗 <Fintoc>`;
  }
}

module.exports = {
  Link,
  Account,
  Institution,
  Balance,
  Movement,
};
