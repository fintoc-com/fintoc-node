import { ResourceArguments } from '../../types';
import { ManagerMixin } from '../mixins';
import { Event } from '../resources/event';

export class EventsManager extends ManagerMixin<Event> {
  static resource = 'event';
  static methods = ['trigger'];

  trigger(args: { type: string; overrides?: ResourceArguments }): Promise<Event> {
    const path = `${this.buildPath()}/trigger`;
    return this._create({ path_: path, ...args });
  }
}
