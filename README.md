<h1 align="center">Fintoc meets Node</h1>

<p align="center">
    <em>
        You have just found the Node-flavored client of <a href="https://fintoc.com/" target="_blank">Fintoc</a>.
    </em>
</p>

<p align="center">
<a href="https://pypi.org/project/fintoc" target="_blank">
    <img src="https://img.shields.io/npm/v/fintoc?label=version&logo=nodedotjs&logoColor=%23fff&color=306998" alt="PyPI - Version">
</a>

<a href="https://github.com/fintoc-com/fintoc-node/actions?query=workflow%3Atests" target="_blank">
    <img src="https://img.shields.io/github/workflow/status/fintoc-com/fintoc-node/tests?label=tests&logo=nodedotjs&logoColor=%23fff" alt="Tests">
</a>

<a href="https://codecov.io/gh/fintoc-com/fintoc-node" target="_blank">
    <img src="https://img.shields.io/codecov/c/gh/fintoc-com/fintoc-node?label=coverage&logo=codecov&logoColor=ffffff" alt="Coverage">
</a>

<a href="https://github.com/fintoc-com/fintoc-node/actions?query=workflow%3Alinters" target="_blank">
    <img src="https://img.shields.io/github/workflow/status/fintoc-com/fintoc-node/linters?label=linters&logo=github" alt="Linters">
</a>
</p>

## Why?

You can think of [Fintoc API](https://fintoc.com/docs) as a piscola.
And the key ingredient to a properly made piscola are the ice cubes.
Sure, you can still have a [piscola without ice cubes](https://curl.haxx.se/).
But hey… that’s not enjoyable -- why would you do that?
Do yourself a favor: go grab some ice cubes by installing this refreshing library.

## Installation

Install using npm! (or your favourite package manager)

```sh
# Using npm
npm install fintoc

# Using yarn
yarn add fintoc
```

**Note:** This SDK requires [**Node 10+**](https://nodejs.org/en/blog/release/v10.0.0).

## Usage

The idea behind this SDK is to stick to the API design as much as possible, so that it feels ridiculously natural to use even while only reading the raw API documentation.

### Quickstart

To be able to use this SDK, you first need to have a [Fintoc](https://app.fintoc.com/login) account. You will need to get your secret API key from the dashboard to be able to use the SDK. Once you have your API key, all you need to do is initialize a `Fintoc` object with it and you're ready to start enjoying Fintoc!

```javascript
import { Fintoc } from 'fintoc';

const fintocClient = new Fintoc('your_api_key');
```

Now you can start using the SDK!

### Managers

To make the usage of the SDK feel natural, resources are managed by **managers** (_wow_). These **managers** correspond to objects with some methods that allow you to get the resources that you want. Each manager is _attached_ to another resource, following the API structure. For example, the `Fintoc` object has `links` and `webhookEndpoints` managers, while `Link` objects have an `accounts` manager (we will see more examples soon). Notice that **not every manager has all of the methods**, as they correspond to the API capabilities. The methods of the managers are the following (we will use the `webhookEndpoints` manager as an example):

#### `all`

You can use the `all` method of the managers as follows:

```javascript
const webhookEndpoints = await fintocClient.webhookEndpoints.all();
```

The `all` method of the managers returns **an async generator** with all the instances of the resource. This method can also receive an `options` object! The arguments that can be passed are the arguments that the API receives for that specific resource! For example, the `Movement` resource can be filtered using `since` and `until`, so if you wanted to get a range of `movements` from an `account`, all you need to do is to pass the parameters to the method!

```javascript
const movements = await account.movements.all({
  since: '2019-07-24',
  until: '2021-05-12',
});
```

Notice that, in order to iterate over the async generator, you need to `await` the generator itself **and then** each of the instances:

```javascript
const movements = await account.movements.all();

for await (const movement of movements) {
  console.log(movement.id);
}
```

Or you can abbreviate it a bit:

```javascript
for await (const movement of await account.movements.all()) {
  console.log(movement.id);
}
```

You can also pass the `lazy: false` parameter to the method to force the SDK to return a list of all the instances of the resource instead of the generator. **Beware**: this could take **very long**, depending on the amount of instances that exist of said resource:

```javascript
const webhookEndpoints = await fintocClient.webhookEndpoints.all({ lazy: false });

Array.isArray(webhookEndpoints); // true
```

#### `get`

You can use the `get` method of the managers as follows:

```javascript
const webhookEndpoint = await fintocClient.webhookEndpoints.get('we_8anqVLlBC8ROodem');
```

The `get` method of the managers returns an existing instance of the resource using its identifier to find it.

#### `create`

You can use the `create` method of the managers as follows:

```javascript
const webhookEndpoint = await fintocClient.webhookEndpoints.create({
  url: 'https://webhook.site/58gfb429-c33c-20c7-584b-d5ew3y3202a0',
  enabled_events: ['link.credentials_changed'],
  description: 'Fantasting webhook endpoint',
});
```

The `create` method of the managers creates and returns a new instance of the resource. The attributes of the created object are passed as an `options` object, and correspond to the parameters specified by the API documentation for the creation of said resource.

#### `update`

You can use the `update` method of the managers as follows:

```javascript
const webhookEndpoint = await fintocClient.webhookEndpoints.update(
  'we_8anqVLlBC8ROodem',
  {
    enabled_events: ['account.refresh_intent.succeeded'],
    disabled: true,
  },
);
```

The `update` method of the managers updates and returns an existing instance of the resource using its identifier to find it. The first parameter of the method corresponds to the identifier being used to find the existing instance of the resource. The attributes to be modified are passed as an `options` object, and correspond to the parameters specified by the API documentation for the update action of said resource.

Notice that using the manager to update an instance of a resource is equivalent (in terms of outcome) to calling the `update` directly on the object itself:


```javascript
// Using the manager
const webhookEndpoint = await fintocClient.webhookEndpoints.update(
  'we_8anqVLlBC8ROodem',
  {
    enabled_events: ['account.refresh_intent.succeeded'],
    disabled: true,
  },
);

// Using the object
const webhookEndpoint = await fintocClient.webhookEndpoints.get('we_8anqVLlBC8ROodem');
webhookEndpoint.update({
  enabled_events: ['account.refresh_intent.succeeded'],
  disabled: true,
});
```

When using the SDK, you will probably almost always want to use the object directly to update, just because it is way less verbose if you already have the object itself. Also, using the `update` method from the manager first needs to `get` the resource and then updates it, so it translates to 2 API calls. If you already have the object to update, using the `update` method directly from the object just updates it, so it translates to just 1 API call.

#### `delete`

You can use the `delete` method of the managers as follows:

```javascript
const deletedIdentifier = await fintocClient.webhookEndpoints.delete('we_8anqVLlBC8ROodem');
```

The `delete` method of the managers deletes an existing instance of the resource using its identifier to find it and returns the identifier.

Notice that using the manager to delete an instance of a resource is equivalent (in terms of outcome) to calling the `delete` directly on the object itself:


```javascript
// Using the manager
const deletedIdentifier = await fintocClient.webhookEndpoints.delete('we_8anqVLlBC8ROodem');

// Using the object
const webhookEndpoint = await fintocClient.webhookEndpoints.get('we_8anqVLlBC8ROodem');
const deletedIdentifier = await webhookEndpoint.delete();
```

When using the SDK, you will probably almost always want to use the object directly to delete, just because it is way less verbose if you already have the object itself. Also, using the `delete` method from the manager first needs to `get` the resource and then deletes it, so it translates to 2 API calls. If you already have the object to delete, using the `delete` method directly from the object just deletes it, so it translates to just 1 API call.

### The shape of the SDK

For complete information about the API, head to [the docs](https://fintoc.com/docs). You will notice that the shape of the SDK is very similar to the shape of the API. Let's start with the `Fintoc` object.

#### The `Fintoc` object

To create a `Fintoc` object, instantiate it using your secret API key:

```javascript
import { Fintoc } from 'fintoc';

const fintocClient = new Fintoc('your_api_key');
```

This gives us access to a bunch of operations already. The object created using this _snippet_ contains two [managers](#managers): `links` and `webhookEndpoints`.

#### The `webhookEndpoints` manager

Available methods: `all`, `get`, `create`, `update`, `delete`.

From the Fintoc client, you can manage your webhook endpoints swiftly! Start by creating a new Webhook Endpoint!

```javascript
const webhookEndpoint = await fintocClient.webhookEndpoints.create({
  url: 'https://webhook.site/58gfb429-c33c-20c7-584b-d5ew3y3202a0',
  enabled_events: ['account.refresh_intent.succeeded'],
  disabled: true,
});

console.log(webhookEndpoint.id); // we_8anqVLlBC8ROodem
```

You can update this webhook endpoint any time you want! Just run the following command:

```javascript
const webhookEndpoint = await fintocClient.webhookEndpoints.update(
  'we_8anqVLlBC8ROodem',
  {
    enabled_events: ['link.credentials_changed'],
    description: 'Fantasting webhook endpoint',
  },
);

console.log(webhookEndpoint.status); // disabled
```

Maybe you no longer want this webhook endpoint. Let's delete it!

```javascript
fintocClient.webhookEndpoints.delete('we_8anqVLlBC8ROodem');
```

Now, let's list every webhook endpoint we have:

```javascript
for await (const webhookEndpoint of await fintocClient.webhookEndpoints.all()) {
  console.log(webhookEndpoint.id);
}
```

If you see a webhook endpoint you want to use, just use the `get` method!

```javascript
const webhookEndpoint = await fintocClient.webhookEndpoints.get('we_8anqVLlBC8ROodem');

console.log(webhookEndpoint.id); // we_8anqVLlBC8ROodem
```

#### The `links` manager

Available methods: `all`, `get`, `update`, `delete`.

Links are probably the most importat resource. Let's list them!

```javascript
console.log((await fintocClient.links.all({ lazy: false })).length); // 3

for await (const link of await fintocClient.links.all()) {
  console.log(link.id);
}
```

Links are a bit different than the rest of the resources, because their identifier is not really their `id`, but their `link_token`. This means that, in order to `get`, `update` or `delete` a link, you need to pass the `link_token`, not the `link_id`!

```javascript
const link = await fintocClient.links.get('link_Y75EXAKiIVj7w489_token_NCqjwRVoTX3cmnx8pnbpqd11');
```

Notice that the Link objects generated from the `all` method will won't be able to execute `update` or `delete` operations, while any Link object generated from `get` or `update` will have permission to `update` or `delete` (given that the link token is necessary to `get` or `update` in the first place).

The Link resource has a lot of **managers**!

```javascript
const invoices = await link.invoices.all(); // Invoices
const taxReturns = await link.taxReturns.all(); // Tax Returns
const subscriptions = await link.subscriptions.all(); // Subscriptions
const accounts = await link.accounts.all(); // Accounts
```

#### The `invoices` manager

Available methods: `all`.

Once you have a Link, you can use the `invoices` manager to get all the invoices associated to a link!

```javascript
for await (const invoice of await link.invoices.all()) {
  console.log(invoice.id);
}
```

#### The `taxReturns` manager

Available methods: `all`, `get`.

Once you have a Link, you can use the `taxReturns` manager to get all the tax returns associated to a link!

```javascript
for await (const taxReturn of await link.taxReturns.all()) {
  console.log(taxReturn.id);
}
```

#### The `subscriptions` manager

Available methods: `all`, `get`.

Once you have a Link, you can use the `subscriptions` manager to get all the subscriptions associated to a link!

```javascript
for await (const subscription of await link.subscriptions.all()) {
  console.log(subscription.id);
}
```

#### The `accounts` manager

Available methods: `all`, `get`.

Once you have a Link, you can use the `accounts` manager to get all the accounts associated to a link!

```javascript
for await (const account of await link.accounts.all()) {
  console.log(account.id);
}
```

Notice that accounts also have a `movements` manager, to get all of the movements of an account:

```javascript
const account = (await link.accounts.all({ lazy: false }))[0];

const movements = await account.movements.all({ lazy: false });
```

#### The `movements` manager

Available methods: `all`, `get`.

Once you have an Account, you can use the `movements` manager to get all the movements associated to that account!

```javascript
for await (const movement of await account.movements.all()) {
  console.log(movement.id);
}
```

### Serialization

Any resource of the SDK can be serialized! To get the serialized resource, just call the `serialize` method!

```javascript
const account = (await link.accounts.all({ lazy: false }))[0];

const serialization = account.serialize();
```

The serialization corresponds to an object with only simple types, that can be JSON-serialized.

## Acknowledgements

The first version of this SDK was originally written by [**@daleal**](https://github.com/daleal) as a port (carbon copy) of [@nebil](https://github.com/nebil)’s (original version of) [fintoc-python](https://github.com/fintoc-com/fintoc-python).
