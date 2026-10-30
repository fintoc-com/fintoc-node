import { MultipartArguments, ResourceArguments, UploadFile } from '../../types';
import { ManagerMixin } from '../mixins';
import { Dispute } from '../resources/dispute';
import { DisputeDocument } from '../resources/disputeDocument';

export class DisputesManager extends ManagerMixin<Dispute> {
  static resource = 'dispute';
  static methods = ['list', 'get', 'submitForReview', 'createDocument'];

  submitForReview(disputeId: string, args?: ResourceArguments): Promise<Dispute> {
    const innerArgs = args || {};
    const path = `${this.buildPath()}/${disputeId}/submit_for_review`;
    return this._create({ path_: path, ...innerArgs });
  }

  /**
   * Upload a document to a dispute, as `multipart/form-data`.
   *
   * @param disputeId - The dispute the document is uploaded to
   * @param args - Must include `file`, and may include an `idempotency_key`
   * @returns The created dispute document
   */
  createDocument(
    disputeId: string,
    args: MultipartArguments & { file: UploadFile },
  ): Promise<DisputeDocument> {
    const { idempotency_key: idempotencyKey, ...fields } = args;
    const path = `${this.buildPath()}/${disputeId}/documents`;
    return this._createMultipart(
      path,
      fields,
      idempotencyKey?.toString(),
      'dispute_document',
    ) as unknown as Promise<DisputeDocument>;
  }
}
