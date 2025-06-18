import { ManagerMixin } from '../mixins';
import { WebhookEndpoint } from '../resources/webhookEndpoint';

export class WebhookEndpointsManager extends ManagerMixin<WebhookEndpoint> {
  static resource = 'webhook_endpoint';
  static methods = ['list', 'get', 'create', 'update', 'delete'];
}
