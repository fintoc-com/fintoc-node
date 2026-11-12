import { ManagerMixin } from '../../mixins';
import { CrossborderTransfer } from '../../resources/v2/crossborderTransfer';

export class CrossborderTransfersManager extends ManagerMixin<CrossborderTransfer> {
  static resource = 'crossborder_transfer';
  static methods = ['list', 'get', 'create'];
}
