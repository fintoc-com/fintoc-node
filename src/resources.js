/* eslint-disable max-classes-per-file */

const { invertedFieldsubs, renameProperties } = require('./utils');


class ResourceMixin {
  isEqualTo(other) {
    return this.id === other.id;
  }

  toString() {
    return `<${this.constructor.name} @id=${this.id}>`;
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
  constructor({
    id,
    amount,
    currency,
    description,
    postDate,
    transactionDate,
  }) {
    super();
    this.id = id;
    this.amount = amount;
    this.currency = currency;
    this.description = description;
    this.postDate = Date(postDate);
    this.transactionDate = transactionDate && Date(postDate);
  }

  get localDate() {
    return this.postDate.toLocaleDateString();
  }

  toString() {
    // In the Python repo, the amount variable was appended with a `:n`. Why?
    return `${this.amount} (${this.description} @ ${this.localDate})`;
  }
}

class Balance extends ResourceMixin {
  constructor({
    available,
    current,
    limit,
  }) {
    super();
    this.id = Balance._getId();
    this.available = available;
    this.current = current;
    this.limit = limit;
  }

  toString() {
    // In the Python repo, these variables are appended with a `:n`. Why?
    return `${this.available} / ${this.current}`;
  }

  // eslint-disable-next-line class-methods-use-this
  _getId() {
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
    id,
    name,
    country,
  }) {
    super();
    this.id = id;
    this.name = name;
    this.country = country;
  }

  toString() {
    return `🏦 ${this.name}`;
  }
}

class Account extends ResourceMixin {

}

class Link extends ResourceMixin {
  constructor({
    id,
    username,
    holderType,
    institution,
    createdAt,
    accounts = null,
    linkToken = null,
    _client = null,
  }) {
    super();
    this.id = id;
    this.username = username;
    this.holderType = holderType;
    this.institution = new Institution(institution);
    this.createdAt = Date.parse(createdAt);
    this.accounts = (accounts || []).map((data) => new Account(data, _client));
    this.linkToken = linkToken;
    this._client = _client;
  }

  findAll(kwargs) {
    if (Object.keys(kwargs).length !== 1) {
      throw new Error('You must provide *exactly one* account field.');
    }

    const [[field, value]] = Object.entries(kwargs);
    return this.accounts.filter((account) => account[field] === value);
  }
}

module.exports = {
  Link,
  Account,
  Institution,
  Balance,
  Movement,
};
