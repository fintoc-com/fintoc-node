<h1 align="center">Fintoc meets Node</h1>

<p align="center">
    <em>
        You have just found the Node-flavored client of <a href="https://fintoc.com/" target="_blank">Fintoc</a>.
    </em>
</p>

<p align="center">
<a href="https://www.npmjs.com/package/fintoc" target="_blank">
    <img src="https://img.shields.io/npm/v/fintoc?label=version&logo=nodedotjs&logoColor=%23fff&color=306998" alt="NPM - Version">
</a>

<a href="https://github.com/fintoc-com/fintoc-node/actions?query=workflow%3Atests" target="_blank">
    <img src="https://img.shields.io/github/actions/workflow/status/fintoc-com/fintoc-node/tests.yml?branch=master&label=tests&logo=nodedotjs&logoColor=%23fff" alt="Tests">
</a>

<a href="https://github.com/fintoc-com/fintoc-node/actions?query=workflow%3Alinters" target="_blank">
    <img src="https://img.shields.io/github/actions/workflow/status/fintoc-com/fintoc-node/linters.yml?branch=master&label=linters&logo=github" alt="Tests">
</a>
</p>

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
  - [Quickstart](#quickstart)
  - [Calling endpoints](#calling-endpoints)
    - [all](#all)
    - [get](#get)
    - [create](#create)
    - [update](#update)
    - [delete](#delete)
  - [Webhook Signature Validation](#webhook-signature-validation)
  - [Serialization](#serialization)
- [Acknowledgements](#acknowledgements)

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

To be able to use this SDK, you first need to get your secret API Key from the [Fintoc Dashboard](https://dashboard.fintoc.com/login). Once you have your API key, all you need to do is initialize a `Fintoc` object with it and you're ready to start enjoying Fintoc!

```javascript
import { Fintoc } from 'fintoc';

const fintocClient = new Fintoc('your_api_key');

// List all succeeded payment intents since the beginning of 2025
const paymentIntents = await fintocClient.paymentIntents.all({ since: '2025-01-01' });
for await (const pi of paymentIntents) {
  console.log(pi.created_at, pi.amount, pi.status);
}

// Get a specific payment intent
const paymentIntent = await fintocClient.paymentIntents.get('pi_12312312');
console.log(paymentIntent.created_at, paymentIntent.amount, paymentIntent.status);
```

### Calling endpoints

The SDK provides direct access to Fintoc API resources following the API structure. Simply use the resource name and follow it by the appropriate action you want.

Notice that **not every resource has all of the methods**, as they correspond to the API capabilities.

#### `all`

You can use the `all` method to list all the instances of the resource:

```javascript
const webhookEndpoints = await fintocClient.webhookEndpoints.all();
```

The `all` method returns an **async generator** with all the instances of the resource. This method can also receive the arguments that the API receives for that specific resource. For example, the `PaymentIntent` resource can be filtered using `since` and `until`, so if you wanted to get a range of `payment intents`, all you need to do is to pass the parameters to the method:

```javascript
const paymentIntents = await fintocClient.paymentIntents.all({
  since: '2019-07-24',
  until: '2021-05-12',
});
```

Notice that, in order to iterate over the async generator, you need to `await` the generator itself **and then** each of the instances:

```javascript
const paymentIntents = await fintocClient.paymentIntents.all({
  since: '2019-07-24',
  until: '2021-05-12',
});

for await (const paymentIntent of paymentIntents) {
  console.log(paymentIntent.id);
}
```

You can also pass the `lazy: false` parameter to the method to force the SDK to return a list of all the instances of the resource instead of the generator. **Beware**: this could take **very long**, depending on the amount of instances that exist of said resource:

```javascript
const paymentIntents = await fintocClient.paymentIntents.all({ lazy: false });

Array.isArray(paymentIntents); // true
```

#### `get`

You can use the `get` method to get a specific instance of the resource:

```javascript
const paymentIntent = await fintocClient.paymentIntents.get('pi_8anqVLlBC8ROodem');
```

#### `create`

You can use the `create` method to create an instance of the resource:

```javascript
const webhookEndpoint = await fintocClient.webhookEndpoints.create({
  url: 'https://webhook.site/58gfb429-c33c-20c7-584b-d5ew3y3202a0',
  enabled_events: ['link.credentials_changed'],
  description: 'Fantasting webhook endpoint',
});
```

The `create` method of the managers creates and returns a new instance of the resource. The attributes of the created object are passed as an `options` object, and correspond to the parameters specified by the API documentation for the creation of said resource.

#### `update`

You can use the `update` method to update an instance of the resource:

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

#### `delete`

You can use the `delete` method to delete an instance of the resource:

```javascript
const deletedIdentifier = await fintocClient.webhookEndpoints.delete('we_8anqVLlBC8ROodem');
```

The `delete` method of the managers deletes an existing instance of the resource using its identifier to find it and returns the identifier.

### Webhook Signature Validation

To ensure the authenticity of incoming webhooks from Fintoc, you should always validate the signature. The SDK provides a `WebhookSignature` class to verify the `Fintoc-Signature` header

```javascript
WebhookSignature.verifyHeader(
    req.body,
    req.headers['fintoc-signature'],
    'your_webhook_secret'
)
```

The `verifyHeader` method takes the following parameters:
- `payload`: The raw request body as a string
- `header`: The Fintoc-Signature header value
- `secret`: Your webhook secret key (found in your Fintoc dashboard)
- `tolerance`: Number of seconds to tolerate when checking timestamp (default: 300)

If the signature is invalid or the timestamp is outside the tolerance window, a `WebhookSignatureError` will be raised with a descriptive message.


For a complete example of handling webhooks, see [examples/webhook.js](examples/webhook.js).

### Serialization

Any resource of the SDK can be serialized! To get the serialized resource, just call the `serialize` method!

```javascript
const account = (await link.accounts.all({ lazy: false }))[0];

const serialization = account.serialize();
```

The serialization corresponds to an object with only simple types, that can be JSON-serialized.

## Acknowledgements

The first version of this SDK was originally written by [**@daleal**](https://github.com/daleal) as a port (carbon copy) of [@nebil](https://github.com/nebil)’s (original version of) [fintoc-python](https://github.com/fintoc-com/fintoc-python).
