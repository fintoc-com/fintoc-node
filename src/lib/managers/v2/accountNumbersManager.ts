import { ResourceArguments } from '../../../types';
import { ManagerMixin } from '../../mixins';
import { AccountCertificate } from '../../resources/v2/accountCertificate';
import { AccountNumber } from '../../resources/v2/accountNumber';

export class AccountNumbersManager extends ManagerMixin<AccountNumber> {
  static resource = 'account_number';
  static methods = ['list', 'get', 'create', 'update', 'delete', 'certificate'];

  certificate(accountNumberId: string, args?: ResourceArguments): Promise<AccountCertificate> {
    const path = `${this.buildPath()}/${accountNumberId}/certificate`;
    return this._action<AccountCertificate>('get', path, { resource: 'account_certificate', args });
  }
}
