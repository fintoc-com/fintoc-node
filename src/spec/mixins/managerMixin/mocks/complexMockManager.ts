/* eslint-disable no-console, class-methods-use-this, @typescript-eslint/no-unused-vars */

import { ManagerMixin } from '../../../../lib/mixins';
import { ResourceArguments } from '../../../../types';

import { GenericMockResource } from './genericMockResource';

export class ComplexMockManager extends ManagerMixin<GenericMockResource> {
  static resource = 'this_resource_does_not_exist';
  static methods = ['list', 'get', 'create', 'update', 'delete'];

  protected postListHandler(
    objects: GenericMockResource[] | AsyncGenerator<GenericMockResource>,
    args: ResourceArguments,
  ) {
    console.log('Executing the "post list" handler');
    return objects;
  }

  protected postGetHandler(
    object: GenericMockResource,
    identifier: string,
    args: ResourceArguments,
  ) {
    console.log('Executing the "post get" handler');
    return object;
  }

  protected postCreateHandler(object: GenericMockResource, args: ResourceArguments) {
    console.log('Executing the "post create" handler');
    return object;
  }

  protected postUpdateHandler(
    object: GenericMockResource,
    identifier: string,
    args: ResourceArguments,
  ) {
    console.log('Executing the "post update" handler');
    return object;
  }

  protected postDeleteHandler(identifier: string, args: ResourceArguments) {
    console.log('Executing the "post delete" handler');
    return identifier;
  }
}
