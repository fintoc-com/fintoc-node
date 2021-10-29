import { ResourceMixin } from '../mixins/resourceMixin';

export class Invoice extends ResourceMixin<Invoice> {
  static mappings = {
    issuer: 'taxpayer',
    receiver: 'taxpayer',
  }
}
