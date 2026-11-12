import { ManagerMixin } from '../../mixins';
import { CrossborderQuote } from '../../resources/v2/crossborderQuote';

export class CrossborderQuotesManager extends ManagerMixin<CrossborderQuote> {
  static resource = 'crossborder_quote';
  static methods = ['get', 'create'];
}
