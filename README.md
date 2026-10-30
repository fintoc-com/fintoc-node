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
    - [list](#list)
    - [get](#get)
    - [create](#create)
    - [update](#update)
    - [delete](#delete)
  - [Entity onboardings](#entity-onboardings)
  - [Transfer batches](#transfer-batches)
  - [Recipients](#recipients)
  - [Payment methods](#payment-methods)
  - [Payouts](#payouts)
  - [Disputes](#disputes)
  - [Links](#links)
  - [Refresh intents](#refresh-intents)
  - [Webhook Signature Validation](#webhook-signature-validation)
  - [Idempotency Keys](#idempotency-keys)
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
const paymentIntents = await fintocClient.paymentIntents.list({ since: '2025-01-01' });
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

#### `list`

You can use the `list` method to list all the instances of the resource:

```javascript
const webhookEndpoints = await fintocClient.webhookEndpoints.list();
```

The `list` method returns an **async generator** with all the instances of the resource. This method can also receive the arguments that the API receives for that specific resource. For example, the `PaymentIntent` resource can be filtered using `since` and `until`, so if you wanted to get a range of `payment intents`, all you need to do is to pass the parameters to the method:

```javascript
const paymentIntents = await fintocClient.paymentIntents.list({
  since: '2019-07-24',
  until: '2021-05-12',
});
```

Notice that, in order to iterate over the async generator, you need to `await` the generator itself **and then** each of the instances:

```javascript
const paymentIntents = await fintocClient.paymentIntents.list({
  since: '2019-07-24',
  until: '2021-05-12',
});

for await (const paymentIntent of paymentIntents) {
  console.log(paymentIntent.id);
}
```

You can also pass the `lazy: false` parameter to the method to force the SDK to return a list of all the instances of the resource instead of the generator. **Beware**: this could take **very long**, depending on the amount of instances that exist of said resource:

```javascript
const paymentIntents = await fintocClient.paymentIntents.list({ lazy: false });

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

### Entity onboardings

[Entity onboardings](https://docs.fintoc.com/reference/entity-onboardings) are nested under an entity, so every call takes the `entity_id` of the entity that owns them.

```javascript
const entityId = 'ent_8anBwgZktbZH6ydyHa6Tm0eM';

const onboardings = await fintocClient.v2.entities.onboardings.list({ entity_id: entityId });
const onboarding = await fintocClient.v2.entities.onboardings.get(
  'onbprc_0ujsswThIGTUYm2K8FjOOfXtY1K',
  { entity_id: entityId },
);
```

To create one, pass the `type` of onboarding to run (`account_holder` or `settlement_recipient`) and the onboarding `data`:

```javascript
const onboarding = await fintocClient.v2.entities.onboardings.create({
  entity_id: entityId,
  type: 'account_holder',
  data: {
    company_information: {
      incorporation_date: '2020-01-15',
      business_activity: 'Servicios financieros',
      fiscal_address: 'Av. Reforma 123, CDMX',
      business_address: 'Av. Insurgentes 456, CDMX',
      settlement_account: '646180357600000013',
      phone: '+521111111111',
    },
    legal_representatives: [
      {
        first_name: 'Ada',
        last_name: 'Lovelace',
        email: 'ada@example.com',
        nationality: 'mx',
        identification_number: 'AAAA010101HDFAAA01',
        position: 'Director General',
      },
    ],
    transactional_profile: {
      resource_origins: ['trusts', 'investments'],
      monthly_amount_range: '1_500000',
      monthly_operations_range: '1_15000',
    },
    shareholders: [
      {
        type: 'natural_person',
        name: 'Ada',
        last_name: 'Lovelace',
        nationality: 'mx',
        percentage: 100,
        holder_id: 'AAAA010101AAA',
      },
    ],
  },
});
```

Documents are uploaded one slot at a time, as `multipart/form-data`:

```javascript
const file = {
  data: fs.readFileSync('csf.pdf'),
  filename: 'csf.pdf',
  contentType: 'application/pdf',
};
const onboardingId = 'onbprc_0ujsswThIGTUYm2K8FjOOfXtY1K';

await fintocClient.v2.entities.onboardings.uploadDocument(
  onboardingId, 'tax_registration_certificate', file, { entity_id: entityId },
);
await fintocClient.v2.entities.onboardings.uploadShareholderDocument(
  onboardingId, 'onbsh_0ujsswThIGTUYm2K8FjOOfXtY1K', file, { entity_id: entityId },
);
await fintocClient.v2.entities.onboardings.uploadLegalRepresentativeDocument(
  onboardingId, 'onblr_0ujsswThIGTUYm2K8FjOOfXtY1K', 'identification', file,
  { entity_id: entityId },
);
```

`uploadDocument` replaces the documents of a slot. To add a document while keeping the ones already in the slot, or to delete one of them:

```javascript
await fintocClient.v2.entities.onboardings.addDocument(
  onboardingId, 'tax_registration_certificate', file, { entity_id: entityId },
);
await fintocClient.v2.entities.onboardings.deleteDocument(
  onboardingId, 'tax_registration_certificate', 'onbdoc_0ujsswThIGTUYm2K8FjOOfXtY1K',
  { entity_id: entityId },
);
```

Once every required field and document is complete, `submittable` turns `true` and the onboarding can be sent for review:

```javascript
const submitted = await fintocClient.v2.entities.onboardings.submit(
  onboardingId,
  { entity_id: entityId },
);
```

### Transfer batches

Creating a transfer batch requires a JWS private key, just like transfers:

```javascript
const fintocClient = new Fintoc('your_api_key', 'path/to/private_key.pem');

const transferBatch = await fintocClient.v2.transferBatches.create({
  idempotency_key: '12345678',
  description: 'Payroll',
  currency: 'MXN',
  transfers: [
    {
      amount: 54123,
      account_id: 'acc_12345678',
      counterparty: {
        account_number: '012969100000000026',
      },
    },
  ],
});
```

You can list batches filtering by `status`, `since` and `until`:

```javascript
const transferBatches = await fintocClient.v2.transferBatches.list({
  status: ['succeeded', 'partially_succeeded'],
  since: '2025-01-01',
});
```

### Recipients

Recipients are saved bank accounts that belong to an entity:

```javascript
const recipient = await fintocClient.v2.recipients.create({
  entity_id: 'ent_12345678',
  account_number: '012969100000000026',
  holder_name: 'Jon Snow',
  holder_type: 'person',
});

const fetchedRecipient = await fintocClient.v2.recipients.get(recipient.id);

const recipients = await fintocClient.v2.recipients.list({
  entity_id: 'ent_12345678',
  holder_type: 'company',
});

const updatedRecipient = await fintocClient.v2.recipients.update(recipient.id, {
  alias: 'Payroll account',
});

await fintocClient.v2.recipients.delete(recipient.id);
```

### Payment methods

Mexican direct debit mandates are created as `multipart/form-data`. Nested fields are sent as `parent[child]` and the consent documents are passed as file descriptors:

```javascript
const document = (path) => ({
  data: fs.readFileSync(path),
  filename: path,
  contentType: 'application/pdf',
});

const paymentMethod = await fintocClient.v2.paymentMethods.create({
  type: 'mx_direct_debit',
  customer: 'cus_0ujsswThIGTUYm2K8FjOOfXtY1K',
  mx_direct_debit: {
    account_number: '000000000000000000',
    account_type: 'clabe',
    interval: 'month',
    max_amount: 100000,
    consent_documents: {
      contract: document('contract.pdf'),
      selfie: document('selfie.pdf'),
      id_front: document('id_front.pdf'),
      id_back: document('id_back.pdf'),
    },
  },
});

const mandate = await fintocClient.v2.paymentMethods.mandateDocument(paymentMethod.id);
console.log(mandate.download_url);
```

A payment method can be canceled by its id:

```javascript
const canceledPaymentMethod = await fintocClient.v2.paymentMethods.cancel(paymentMethod.id);
```

### Payouts

The resources of a payout are listed by `resource_type` (`payment_intent`, `charge`, `refund` or `refund_adjustment`):

```javascript
const refunds = await fintocClient.payouts.listResources('po_0ujsswThIGTUYm2K8FjOOfXtY1K', {
  resource_type: 'refund',
});
for await (const refund of refunds) {
  console.log(refund.id, refund.amount);
}
```

### Disputes

Upload evidence and receive the created dispute document. Files must be PDF, JPEG or PNG, smaller than 10 MB. The dispute must be in `waiting_documentation` and within its upload deadline:

```javascript
import fs from 'node:fs';

const document = await fintocClient.disputes.createDocument('cb_8anBm9YpVwXzK2qLr4TjNdUe', {
  file: {
    data: fs.readFileSync('evidence.pdf'),
    filename: 'evidence.pdf',
    contentType: 'application/pdf',
  },
});
```

### Links

After the widget finishes, exchange the `exchange_token` for the link. The returned link carries its `link_token`:

```javascript
const link = await fintocClient.links.exchange({ exchange_token: 'exchange_token' });
console.log(link.link_token);
```

### Refresh intents

Request an account refresh using the link’s `link_token`. Results arrive through webhooks:

```javascript
const refreshIntent = await fintocClient.refreshIntents.create({
  link_token: 'link_token',
  refresh_type: 'only_last',
});
```

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

### Idempotency Keys

You can provide an [Idempotency Key](https://docs.fintoc.com/reference/idempotent-requests) using the `idempotency_key` argument. For example:

```javascript
const transfer = await fintoc.v2.transfers.create({
    idempotency_key: '12345678',
    amount: 54123,
    currency: 'mxn',
    account_id: 'acc_12345678',
    counterparty: {
      account_number: '012969100000000026',
    },
    metadata: {
      customer_id: '19385014'
    }
  });
```

### Serialization

Any resource of the SDK can be serialized! To get the serialized resource, just call the `serialize` method!

```javascript
const account = (await link.accounts.list({ lazy: false }))[0];

const serialization = account.serialize();
```

The serialization corresponds to an object with only simple types, that can be JSON-serialized.

## Acknowledgements

The first version of this SDK was originally written by [**@daleal**](https://github.com/daleal) as a port (carbon copy) of [@nebil](https://github.com/nebil)’s (original version of) [fintoc-python](https://github.com/fintoc-com/fintoc-python).
