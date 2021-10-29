import { ManagerMixin } from '../../../../lib/mixins';

import { GenericMockResource } from './genericMockResource';

export class IncompleteMockManager extends ManagerMixin<GenericMockResource> {
  static resource = 'this_resource_does_not_exist';
  static methods = ['get', 'update'];
}
