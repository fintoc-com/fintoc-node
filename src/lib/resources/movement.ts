import { ResourceMixin } from '../mixins/resourceMixin';

export class Movement extends ResourceMixin<Movement> {
  static mappings = {
    recipient_account: 'transfer_account',
    sernder_account: 'transfer_account',
  }
}
