import { ManagerMixin } from '../../mixins';
import { Recipient } from '../../resources/v2/recipient';

export class RecipientsManager extends ManagerMixin<Recipient> {
  static resource = 'recipient';
  static methods = ['list', 'get', 'create', 'update', 'delete'];
}
