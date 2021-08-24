import { ResourceMixin } from '../mixins/resourceMixin';

export class Movement extends ResourceMixin {
  static mappings = {
    recipient_account: 'transferAccount',
    sernder_account: 'transferAccount',
  }
}
