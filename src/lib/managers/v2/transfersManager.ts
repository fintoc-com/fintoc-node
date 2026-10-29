import { ResourceArguments } from '../../../types';
import { ManagerMixin } from '../../mixins';
import { Transfer } from '../../resources/v2/transfer';
import { TransferReceipt } from '../../resources/v2/transferReceipt';

export class TransfersManager extends ManagerMixin<Transfer> {
  static resource = 'transfer';
  static methods = ['list', 'get', 'create', 'return', 'receipt'];

  return(args?: ResourceArguments) {
    const innerArgs = args || {};
    const path = `${this.buildPath()}/return`;
    return this._create({ path_: path, ...innerArgs });
  }

  receipt(transferId: string, args?: ResourceArguments): Promise<TransferReceipt> {
    const path = `${this.buildPath()}/${transferId}/receipt`;
    return this._action<TransferReceipt>('get', path, { resource: 'transfer_receipt', args });
  }
}
