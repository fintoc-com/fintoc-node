import { ResourceArguments } from '../../types';
import { ManagerMixin } from '../mixins';
import { PaymentLink } from '../resources/paymentLink';

export class PaymentLinksManager extends ManagerMixin<PaymentLink> {
  static resource = 'payment_link';
  static methods = ['list', 'get', 'create'];

  cancel(paymentLinkId: string, args?: ResourceArguments): Promise<PaymentLink> {
    const innerArgs = args || {};
    const path = `${this.buildPath()}/${paymentLinkId}/cancel`;
    return this._update(paymentLinkId,{ path_: path, ...innerArgs });
  }
}
