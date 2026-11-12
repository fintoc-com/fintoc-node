import { ManagerMixin } from '../../mixins';
import { CrossborderBeneficiary } from '../../resources/v2/crossborderBeneficiary';

export class CrossborderBeneficiariesManager extends ManagerMixin<CrossborderBeneficiary> {
  static resource = 'crossborder_beneficiary';
  static methods = ['list', 'get', 'create', 'delete'];
}
