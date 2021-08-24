import { ResourceMixin } from '../mixins/resourceMixin';

export class Invoice extends ResourceMixin {
  static mappings = {
    issuer: 'taxpayer',
    receiver: 'taxpayer',
  }
}
