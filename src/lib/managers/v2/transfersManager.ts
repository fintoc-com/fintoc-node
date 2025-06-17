import { ManagerMixin } from '../../mixins';
import { Transfer } from '../../resources/v2/transfer';

export class TransfersManager extends ManagerMixin<Transfer> {
  static resource = 'transfer';
  static methods = ['list', 'get', 'create'];
}
