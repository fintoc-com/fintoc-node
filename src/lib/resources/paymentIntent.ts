import { ResourceMixin } from '../mixins/resourceMixin';

export class PaymentIntent extends ResourceMixin<PaymentIntent> {
  static mappings = {
    recipient_account: 'transfer_account',
    sernder_account: 'transfer_account',
  }
}
