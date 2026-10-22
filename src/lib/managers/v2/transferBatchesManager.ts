import { ManagerMixin } from '../../mixins';
import { TransferBatch } from '../../resources/v2/transferBatch';

export class TransferBatchesManager extends ManagerMixin<TransferBatch> {
  static resource = 'transferBatch';
  static methods = ['list', 'get', 'create'];
}
