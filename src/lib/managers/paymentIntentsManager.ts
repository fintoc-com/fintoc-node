import { ResourceArguments } from '../../types';
import { ManagerMixin } from '../mixins';
import { PaymentIntent } from '../resources/paymentIntent';

export class PaymentIntentsManager extends ManagerMixin<PaymentIntent> {
  static resource = 'payment_intent';
  static methods = ['list', 'get', 'create'];

  protected async _create(args?: ResourceArguments): Promise<PaymentIntent> {
    const transformedArgs = PaymentIntentsManager.transformCreateArgs(args);
    return super._create(transformedArgs);
  }

  private static transformCreateArgs(args?: ResourceArguments): ResourceArguments {
    if (!args) return {};

    const transformedArgs = { ...args };

    if ('payment_method' in transformedArgs) {
      transformedArgs.payment_type = transformedArgs.payment_method;
      delete transformedArgs.payment_method;
    }

    return transformedArgs;
  }
}
