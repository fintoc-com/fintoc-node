import { ResourceMixin } from '../../lib/mixins';
import { ResourceArguments } from '../../types';

export interface IResourceMixin {
  update: (args?: ResourceArguments) => Promise<ResourceMixin>;
  delete: (args?: ResourceArguments) => Promise<string>;
}
