import { ManagerMixin } from '../mixins';
import { WebhookEndpoint } from '../resources';

export class WebhookEndpointsManager extends ManagerMixin<WebhookEndpoint> {
  static resource = 'webhook_endpoint';
  static methods = ['all', 'get', 'create', 'update', 'delete'];
}
