const express = require('express');
const { WebhookSignature, WebhookSignatureError } = require('../build/main');

const app = express();
const PORT = process.env.PORT || 3000;

// Find your endpoint's secret in your webhook settings in the Fintoc Dashboard
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

app.use('/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

/**
 * Handle incoming webhooks from Fintoc.
 *
 * Validates the webhook signature and processes the payload if valid.
 */
app.post('/webhook', (req, res) => {
  const payload = req.body;
  const signature = req.headers['fintoc-signature'];

  try {
    // Verify the webhook signature
    WebhookSignature.verifyHeader(
      payload,
      signature,
      WEBHOOK_SECRET
    );

    // If verification passes, process the webhook
    const event = JSON.parse(payload.toString());

    if (event.type === 'payment_intent.succeeded') {
      console.log('Payment intent succeeded!');
    } else if (event.type === 'payment_intent.failed') {
      console.log('Payment intent failed!');
    }
    // Add more event types as needed

    res.status(200).json({ received: true });

  } catch (error) {
    if (error instanceof WebhookSignatureError) {
      console.error('Webhook signature verification failed');
      res.status(400).json({
        error: 'Invalid signature',
        message: error.message
      });
    } else {
      res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
  }
});

app.listen(PORT, () => {
  console.log('Webhook handler example server started');
  console.log(`Server running on port ${PORT}`);
  console.log(`Webhook endpoint: http://localhost:${PORT}/webhook`);
});
