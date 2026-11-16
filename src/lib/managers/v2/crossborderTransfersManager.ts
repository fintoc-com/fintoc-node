import { ResourceArguments } from '../../../types';
import { ManagerMixin } from '../../mixins';
import { CrossborderTransfer } from '../../resources/v2/crossborderTransfer';

export class CrossborderTransfersManager extends ManagerMixin<CrossborderTransfer> {
  static resource = 'crossborder_transfer';
  static methods = ['list', 'get', 'create', 'cancel', 'simulateCredit'];

  cancel(identifier: string, args?: ResourceArguments) {
    const innerArgs = args || {};
    const path = `${this.buildPath()}/${identifier}/cancel`;

    return this._create({ path_: path, ...innerArgs });
  }

  simulateCredit(identifier: string, args?: ResourceArguments) {
    const innerArgs = args || {};
    const path = `${this.buildPath()}/${identifier}/simulate_credit`;

    return this._create({ path_: path, ...innerArgs });
  }
}
