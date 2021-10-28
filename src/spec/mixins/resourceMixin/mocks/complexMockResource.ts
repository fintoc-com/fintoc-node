import { ResourceMixin } from '../../../../lib/mixins';

export class ComplexMockResource extends ResourceMixin<ComplexMockResource> {
  static resourceIdentifier = 'identifier';
  static mappings = { resource: 'link' }
}
