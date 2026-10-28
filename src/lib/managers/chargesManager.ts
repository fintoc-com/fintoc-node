import { ResourceArguments } from '../../types';
import { ManagerMixin } from '../mixins';
import { Charge } from '../resources/charge';

export class ChargesManager extends ManagerMixin<Charge> {
  static resource = 'charge';
  static methods = ['list', 'get', 'create', 'update', 'cancel'];

  cancel(chargeId: string, args?: ResourceArguments): Promise<Charge> {
    const path = `${this.buildPath()}/${chargeId}/cancel`;
    return this._action<Charge>('post', path, {
      args, methods: ChargesManager.methods, objectPath: this.buildPath(),
    });
  }
}
