import { ManagerMixin } from '../../mixins';
import { Event } from '../../resources/event';

export class EventsManager extends ManagerMixin<Event> {
  static resource = 'event';
  static methods = ['list', 'get'];
}
