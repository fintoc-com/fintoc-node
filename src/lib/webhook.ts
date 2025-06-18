import * as crypto from 'crypto';

import { WebhookSignatureError } from './errors';

const DEFAULT_TOLERANCE_SECONDS = 300;

export class WebhookSignature {
  /**
   * Verifies the authenticity of incoming webhooks from Fintoc by validating the signature.
   *
   * @param payload - The raw request body as a string or Buffer
   * @param header - The Fintoc-Signature header value
   * @param secret - Your webhook secret key (found in your Fintoc dashboard)
   * @param tolerance - Number of seconds to tolerate when checking timestamp (default: 300)
   * @throws {WebhookSignatureError} If the signature is invalid or timestamp is outside
   * tolerance window
   */
  public static verifyHeader(
    payload: string | Buffer,
    header: string,
    secret: string,
    tolerance: number = DEFAULT_TOLERANCE_SECONDS,
  ): void {
    if (!header) {
      throw new WebhookSignatureError(
        'Missing Fintoc-Signature header.',
      );
    }

    if (!secret) {
      throw new WebhookSignatureError(
        'Webhook secret is required for verification.',
      );
    }

    const { timestamp, signature } = WebhookSignature.parseHeader(header);

    WebhookSignature.verifyTimestamp(timestamp, tolerance);

    const expectedSignature = WebhookSignature.computeSignature(
      payload,
      timestamp,
      secret,
    );

    if (!WebhookSignature.secureCompare(signature, expectedSignature)) {
      throw new WebhookSignatureError(
        'Signature mismatch. The webhook signature is not valid.',
      );
    }
  }

  private static parseHeader(header: string): { timestamp: number; signature: string } {
    const parts = header.split(',');
    let timestampStr: string | undefined;
    let signature: string | undefined;

    for (const part of parts) {
      const [key, value] = part.split('=');
      if (key === 't') {
        timestampStr = value;
      } else if (key === 'v1') {
        signature = value;
      }
    }

    if (!timestampStr || !signature) {
      throw new WebhookSignatureError(
        'Unable to extract timestamp and signatures from header',
      );
    }

    const timestamp = parseInt(timestampStr, 10);
    if (Number.isNaN(timestamp)) {
      throw new WebhookSignatureError(
        'Unable to extract timestamp and signatures from header',
      );
    }

    return { timestamp, signature };
  }

  private static verifyTimestamp(timestamp: number, toleranceSeconds: number): void {
    const nowSeconds = Math.floor(Date.now() / 1000);
    const timeDifference = Math.abs(nowSeconds - timestamp);

    if (timeDifference > toleranceSeconds) {
      throw new WebhookSignatureError(
        `Timestamp outside the tolerance zone (${timestamp})`,
      );
    }
  }

  private static computeSignature(
    payload: string | Buffer,
    timestamp: number,
    secret: string,
  ): string {
    const signedPayload = `${timestamp}.${payload.toString('utf8')}`;
    return crypto
      .createHmac('sha256', secret)
      .update(signedPayload)
      .digest('hex');
  }

  private static secureCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
  }
}
