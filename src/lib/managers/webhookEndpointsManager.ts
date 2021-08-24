import { ManagerMixin } from '../mixins';

export class WebhookEndpointsManager extends ManagerMixin {
  static resource = 'webhook_endpoint';
  static methods = ['all', 'get', 'create', 'update', 'delete'];
}
