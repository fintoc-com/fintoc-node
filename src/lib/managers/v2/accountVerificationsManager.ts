import { ManagerMixin } from '../../mixins';
import { AccountVerification } from '../../resources/v2/accountVerification';

export class AccountVerificationsManager extends ManagerMixin<AccountVerification> {
  static resource = 'accountVerification';
  static methods = ['list', 'get', 'create'];
}
