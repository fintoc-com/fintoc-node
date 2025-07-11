import { ResourceMixin } from '../mixins/resourceMixin';

export class PaymentIntent extends ResourceMixin<PaymentIntent> {
  static mappings = {
    recipient_account: 'transfer_account',
    sender_account: 'transfer_account',
  }
}
