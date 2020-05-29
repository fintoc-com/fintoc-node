# Fintoc meets Node

You have just found the [Node](https://nodejs.org/en/)-flavored client of [Fintoc](https://fintoc.com). It mainly consists of a port (more of a carbon copy, really) of [fintoc-python](https://github.com/fintoc-com/fintoc-python).

## Why?

You can think of [Fintoc API](https://fintoc.com/docs) as a piscola.
And the key ingredient to a properly made piscola are the ice cubes.  
Sure, you can still have a [piscola without ice cubes](https://curl.haxx.se/).
But hey… that’s not enjoyable -- why would you do that?  
Do yourself a favor: go grab some ice cubes by installing this refreshing library.

---

## Table of contents

- [Fintoc meets Node](#fintoc-meets-node)
  - [Table of contents](#table-of-contents)
  - [How to install](#how-to-install)
  - [Quickstart](#quickstart)
  - [Documentation](#documentation)
  - [Examples](#examples)
    - [Get accounts](#get-accounts)
    - [Get movements](#get-movements)
  - [Dependencies](#dependencies)
  - [How to test…](#how-to-test)
  - [Roadmap](#roadmap)
  - [Acknowledgements](#acknowledgements)

## How to install

Install it with your favorite dependency manager.

```
# Using npm
npm add fintoc-node

# Using yarn
yarn add fintoc-node
```

## Quickstart

1. Get your API key and link your bank account using the [Fintoc dashboard](https://app.fintoc.com/login).
2. Open your command-line interface.
3. Write a few lines of JavaScript to see your bank movements.

```js
const Fintoc = require('fintoc-node');

const client = new Fintoc('api_key');

client.getLink('link_token')
  .then((link) => link.find({ type_: 'checking_account' }))
  .then((account) => account.getMovements({ since: '2020-01-01' }))
  .then(console.log)
  .catch(console.log);
```

And that’s it!

## Documentation

This client supports all Fintoc API endpoints. For complete information about the API, head to the [docs](https://fintoc.com/docs).

## Examples

### Get accounts

```js
const Fintoc = require('fintoc-node');

const client = new Fintoc('api_key');

client.getLink('link_token')
  .then((link) => {
    link.accounts.forEach((account) => {
      console.log(account);
    });
  })
  .catch(console.log);

// Or... you can pretty print all the accounts in a Link
client.getLink('link_token')
  .then((link) => link.showAccounts())
  .catch(console.log);
```

If you want to find a specific account in a link, you can use **find**. You can search by any account field:

```js
const Fintoc = require('fintoc-node');

const client = new Fintoc('api_key');

client.getLink('link_token')
  .then((link) => link.find({ type_: 'checking_account' }))
  .then(console.log)
  .catch(console.log);

client.getLink('link_token')
  .then((link) => link.find({ number: '1111111' }))
  .then(console.log)
  .catch(console.log);

client.getLink('link_token')
  .then((link) => link.find({ id_: 'sdfsdf234' }))
  .then(console.log)
  .catch(console.log);
```

You can also search for multiple accounts matching a specific criteria with **findAll**:

```js
const Fintoc = require('fintoc-node');

const client = new Fintoc('api_key');

client.getLink('link_token')
  .then((link) => link.findAll({ currency: 'CLP' }))
  .then(console.log)
  .catch(console.log);
```

To update the account balance you can use **updateBalance**:

```js
const Fintoc = require('fintoc-node');

const client = new Fintoc('api_key');

client.getLink('link_token')
  .then((link) => link.find({ type_: 'checking_account' }))
  .then((account) => account.updateBalance())
  .catch(console.log);
```

### Get movements

```js
const Fintoc = require('fintoc-node');

const client = new Fintoc('api_key');

// You can get the account movements since a specific Date
client.getLink('link_token')
  .then((link) => link.find({ type_: 'checking_account' }))
  .then((account) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return account.getMovements({ since: yesterday });
  })
  .then(console.log)
  .catch(console.log);

// Or... you can use an ISO 8601 formatted string representation of the Date
client.getLink('link_token')
  .then((link) => link.find({ type_: 'checking_account' }))
  .then((account) => account.getMovements({ since: '2020-01-01' }))
  .then(console.log)
  .catch(console.log);
```

Calling **getMovements** without arguments gets the last 30 movements of the account.

## Dependencies

This project relies on the following packages:

- [**axios**](https://github.com/axios/axios)
- [**parse-link-header**](https://github.com/thlorenz/parse-link-header)

## How to test…

You can run all the tests just by running:

```
# Using npm
npm run test

# Using yarn
yarn test
```

## Roadmap

- Document the library more thoroughly
- Add **way** more unit tests

## Acknowledgements

This library was initially written by [**@daleal**](https://github.com/daleal) as a port (carbon copy) of [@nebil](https://github.com/nebil)’s [fintoc-python](https://github.com/fintoc-com/fintoc-python), so compliments for design choices should somehow get to the designer of the original library.
