import { ManagerMixin } from '../../mixins';
import { SetupIntent } from '../../resources/v2/setupIntent';

export class SetupIntentsManager extends ManagerMixin<SetupIntent> {
  static resource = 'setup_intent';
  static methods = ['get'];
}
