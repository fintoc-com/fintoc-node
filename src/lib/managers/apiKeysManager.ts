import { ManagerMixin } from '../mixins';
import { ApiKey } from '../resources/apiKey';

export class ApiKeysManager extends ManagerMixin<ApiKey> {
  static resource = 'api_key';
  static methods = ['list'];
}
