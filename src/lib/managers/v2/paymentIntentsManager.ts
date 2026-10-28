import { ResourceArguments } from '../../../types';
import { ManagerMixin } from '../../mixins';
import { GenericFintocResource } from '../../resources/genericFintocResource';
import { PaymentIntent } from '../../resources/v2/paymentIntent';

export class PaymentIntentsManager extends ManagerMixin<PaymentIntent> {
  static resource = 'payment_intent';
  static methods = ['list', 'get', 'create', 'cancel', 'checkEligibility', 'voucherUrl'];

  cancel(paymentIntentId: string, args?: ResourceArguments): Promise<PaymentIntent> {
    const innerArgs = args || {};
    const path = `${this.buildPath()}/${paymentIntentId}/cancel`;
    return this._create({ path_: path, ...innerArgs });
  }

  checkEligibility(args?: ResourceArguments): Promise<GenericFintocResource> {
    const path = `${this.buildPath()}/check_eligibility`;
    return this._action<GenericFintocResource>('post', path, { resource: null, args });
  }

  voucherUrl(paymentIntentId: string, args?: ResourceArguments): Promise<GenericFintocResource> {
    const path = `${this.buildPath()}/${paymentIntentId}/voucher_url`;
    return this._action<GenericFintocResource>('get', path, { resource: null, args });
  }
}
