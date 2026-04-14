import { ManagerMixin } from '../../mixins';
import { Product } from '../../resources/v2/product';

export class ProductsManager extends ManagerMixin<Product> {
  static resource = 'product';
  static methods = ['create', 'get', 'list'];
}
