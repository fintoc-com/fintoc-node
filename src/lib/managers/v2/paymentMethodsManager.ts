import { MultipartArguments, ResourceArguments } from '../../../types';
import { ManagerMixin } from '../../mixins';
import { GenericFintocResource } from '../../resources/genericFintocResource';
import { PaymentMethod } from '../../resources/v2/paymentMethod';

export class PaymentMethodsManager extends ManagerMixin<PaymentMethod> {
  static resource = 'payment_method';
  static methods = ['list', 'get', 'create', 'cancel', 'mandateDocument'];

  create(args?: MultipartArguments): Promise<PaymentMethod> {
    const { idempotency_key: idempotencyKey, ...fields } = args || {};
    return this._createMultipart(this.buildPath(), fields, idempotencyKey?.toString());
  }

  cancel(paymentMethodId: string, args?: ResourceArguments): Promise<PaymentMethod> {
    const innerArgs = args || {};
    const path = `${this.buildPath()}/${paymentMethodId}/cancel`;
    return this._create({ path_: path, ...innerArgs });
  }

  mandateDocument(
    paymentMethodId: string,
    args?: ResourceArguments,
  ): Promise<GenericFintocResource> {
    const path = `${this.buildPath()}/${paymentMethodId}/mandate_document`;
    return this._action<GenericFintocResource>('get', path, { resource: null, args });
  }
}
