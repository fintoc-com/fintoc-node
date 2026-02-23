import { ManagerMixin } from '../../mixins';
import { PaymentMethod } from '../../resources/v2/paymentMethod';

export class PaymentMethodsManager extends ManagerMixin<PaymentMethod> {
  static resource = 'payment_method';
  static methods = ['list', 'get'];
}
