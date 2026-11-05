import { ManagerMixin } from '../mixins';
import { Organization } from '../resources/organization';

export class OrganizationsManager extends ManagerMixin<Organization> {
  static resource = 'organization';
  static methods = ['create'];
}
