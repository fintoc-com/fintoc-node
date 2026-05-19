import { ResourceArguments } from '../../types';
import { ManagerMixin } from '../mixins';
import { Dispute } from '../resources/dispute';

export class DisputesManager extends ManagerMixin<Dispute> {
  static resource = 'dispute';
  static methods = ['list', 'get', 'submitForReview', 'createDocument'];

  submitForReview(disputeId: string, args?: ResourceArguments): Promise<Dispute> {
    const innerArgs = args || {};
    const path = `${this.buildPath()}/${disputeId}/submit_for_review`;
    return this._create({ path_: path, ...innerArgs });
  }

  createDocument(disputeId: string, args?: ResourceArguments): Promise<Dispute> {
    const innerArgs = args || {};
    const path = `${this.buildPath()}/${disputeId}/documents`;
    return this._create({ path_: path, ...innerArgs });
  }
}
