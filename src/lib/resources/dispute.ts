import { ResourceMixin } from '../mixins/resourceMixin';

export class Dispute extends ResourceMixin<Dispute> {
  static mappings = {
    documents: 'dispute_document',
  }
}
