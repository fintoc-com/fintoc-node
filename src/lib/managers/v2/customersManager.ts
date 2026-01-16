import { ManagerMixin } from '../../mixins';
import { Customer } from '../../resources/v2/customer';

export class CustomersManager extends ManagerMixin<Customer> {
  static resource = 'customer';
  static methods = ['list', 'get', 'create'];
}
