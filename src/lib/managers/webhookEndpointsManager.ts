import { ManagerMixin } from '../mixins';
import { WebhookEndpoint } from '../resources/webhookEndpoint';

export class WebhookEndpointsManager extends ManagerMixin<WebhookEndpoint> {
  static resource = 'webhook_endpoint';
  static methods = ['list', 'get', 'create', 'update', 'delete', 'test'];

  test(webhookEndpointId: string, args: { type: string }): Promise<WebhookEndpoint> {
    const path = `${this.buildPath()}/${webhookEndpointId}/test`;
    return this._create({ path_: path, ...args });
  }
}
