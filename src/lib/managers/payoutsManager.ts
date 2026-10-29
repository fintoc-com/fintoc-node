import { ResourceArguments } from '../../types';
import { ManagerMixin } from '../mixins';
import { Payout } from '../resources/payout';

export class PayoutsManager extends ManagerMixin<Payout> {
  static resource = 'payout';
  static methods = ['list', 'get', 'listResources'];

  listResources(
    payoutId: string,
    args: ResourceArguments & { resource_type: string },
  ): Promise<any[] | AsyncGenerator<any>> {
    const path = `${this.buildPath()}/${payoutId}/resources`;
    return this._listAction(path, String(args.resource_type), args);
  }
}
