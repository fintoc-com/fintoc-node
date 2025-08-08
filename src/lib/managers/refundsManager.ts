import { ResourceArguments } from '../../types';
import { ManagerMixin } from '../mixins';
import { Refund } from '../resources/refund';

export class RefundsManager extends ManagerMixin<Refund> {
  static resource = 'refund';
  static methods = ['list', 'get', 'create', 'cancel'];

  cancel(refundId: string, args?: ResourceArguments): Promise<Refund> {
    const innerArgs = args || {};
    const path = `${this.buildPath()}/${refundId}/cancel`;
    return this._create({ path_: path, ...innerArgs });
  }
}
