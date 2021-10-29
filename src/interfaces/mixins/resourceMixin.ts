import { ResourceArguments } from '../../types';

export interface IResourceMixin {
  update: (args?: ResourceArguments) => Promise<any>;
  delete: (args?: ResourceArguments) => Promise<string>;
}
