import { ResourceMixin } from '../mixins/resourceMixin';

export class Movement extends ResourceMixin<Movement> {
  static mappings = {
    recipient_account: 'transferAccount',
    sernder_account: 'transferAccount',
  }
}
