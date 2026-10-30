import { ResourceArguments } from '../../types';
import { ManagerMixin } from '../mixins';
import { RefreshIntent } from '../resources/refreshIntent';

export class RefreshIntentsManager extends ManagerMixin<RefreshIntent> {
  static resource = 'refresh_intent';
  static methods = ['list', 'get', 'create'];

  /**
   * Create a refresh intent. The API takes `link_token`, `refresh_type` and
   * `result_status` as query parameters, not as a JSON body.
   *
   * @param args - Query parameters of the refresh intent, plus an optional `idempotency_key`
   * @returns The created refresh intent
   */
  create(args?: ResourceArguments): Promise<RefreshIntent> {
    return this._action('post', this.buildPath(), {
      args: args || {},
      methods: RefreshIntentsManager.methods,
      query: true,
    });
  }
}
