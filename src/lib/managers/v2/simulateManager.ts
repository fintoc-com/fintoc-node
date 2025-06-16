import { ResourceArguments } from '../../../types';
import { ManagerMixin } from '../../mixins';
import { Transfer } from '../../resources/v2';

export class SimulateManager extends ManagerMixin<Transfer> {
  static resource = 'transfer';
  static methods = ['receiveTransfer'];

  receiveTransfer(args?: ResourceArguments) {
    const innerArgs = args || {};
    const path = `${this.buildPath()}/receive_transfer`;
    return this._create({ path_: path, ...innerArgs });
  }
}
