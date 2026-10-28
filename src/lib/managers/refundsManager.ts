import { ResourceArguments } from '../../types';
import { ManagerMixin } from '../mixins';
import { GenericFintocResource } from '../resources/genericFintocResource';
import { Refund } from '../resources/refund';

export class RefundsManager extends ManagerMixin<Refund> {
  static resource = 'refund';
  static methods = ['list', 'get', 'create', 'cancel', 'voucherUrl'];

  cancel(refundId: string, args?: ResourceArguments): Promise<Refund> {
    const innerArgs = args || {};
    const path = `${this.buildPath()}/${refundId}/cancel`;
    return this._create({ path_: path, ...innerArgs });
  }

  voucherUrl(refundId: string, args?: ResourceArguments): Promise<GenericFintocResource> {
    const path = `${this.buildPath()}/${refundId}/voucher_url`;
    return this._action<GenericFintocResource>('get', path, { resource: null, args });
  }
}
