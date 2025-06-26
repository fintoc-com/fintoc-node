import { ResourceArguments } from '../../../types';
import { ManagerMixin } from '../../mixins';
import { Transfer } from '../../resources/v2/transfer';

export class TransfersManager extends ManagerMixin<Transfer> {
  static resource = 'transfer';
  static methods = ['list', 'get', 'create', 'return'];

  return(args?: ResourceArguments) {
    const innerArgs = args || {};
    const path = `${this.buildPath()}/return`;
    return this._create({ path_: path, ...innerArgs });
  }
}
