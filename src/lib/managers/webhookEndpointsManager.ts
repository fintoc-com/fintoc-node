import { ManagerMixin } from '../mixins';
import { WebhookEndpoint } from '../resources/webhookEndpoint';
import { WebhookEvent } from '../resources/webhookEvent';
import { canRaiseHTTPError, objetize } from '../utils';

export class WebhookEndpointsManager extends ManagerMixin<WebhookEndpoint> {
  static resource = 'webhook_endpoint';
  static methods = ['list', 'get', 'create', 'update', 'delete', 'test'];

  @canRaiseHTTPError
  async test(webhookEndpointId: string, args: { type: string }): Promise<WebhookEvent> {
    const path = `${this.buildPath()}/${webhookEndpointId}/test`;
    const data = await this._client.request({ path, method: 'post', json: args });
    return objetize(WebhookEvent, this._client, data);
  }
}
