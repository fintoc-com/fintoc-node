import { ManagerMixin } from '../../mixins';
import { Line } from '../../resources/v2/line';

export class LinesManager extends ManagerMixin<Line> {
  static resource = 'line';
  static methods = ['update'];
}
