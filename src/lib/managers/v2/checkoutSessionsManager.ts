import { ResourceArguments } from '../../../types';
import { ManagerMixin } from '../../mixins';
import { CheckoutSession } from '../../resources/v2/checkoutSession';

export class CheckoutSessionsManager extends ManagerMixin<CheckoutSession> {
  static resource = 'checkout_session';
  static methods = ['list', 'get', 'create', 'expire'];

  expire(identifier: string, args?: ResourceArguments) {
    const innerArgs = args || {};
    const path = `${this.buildPath()}/${identifier}/expire`;

    return this._create({ path_: path, ...innerArgs });
  }
}
