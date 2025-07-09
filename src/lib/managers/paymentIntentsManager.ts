import { ManagerMixin } from '../mixins';
import { PaymentIntent } from '../resources/paymentIntent';

export class PaymentIntentsManager extends ManagerMixin<PaymentIntent> {
  static resource = 'payment_intent';
  static methods = ['list', 'get', 'create'];
}
