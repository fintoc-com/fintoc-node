import { ResourceArguments, UploadFile } from '../../../types';
import { ManagerMixin } from '../../mixins';
import { Onboarding } from '../../resources/v2/onboarding';

export class OnboardingsManager extends ManagerMixin<Onboarding> {
  static resource = 'onboarding';
  static methods = ['list', 'get'];

  create(args?: ResourceArguments): Promise<Onboarding> {
    const innerArgs = args || {};
    const path = this.buildPath(innerArgs);
    return this._create({ path_: path, ...innerArgs });
  }

  submit(id: string, args?: ResourceArguments): Promise<Onboarding> {
    const innerArgs = args || {};
    const path = `${this.buildPath(innerArgs)}/${id}/submit`;
    return this._create({ path_: path, ...innerArgs });
  }

  uploadDocument(
    id: string,
    slotKey: string,
    file: UploadFile,
    args?: ResourceArguments,
  ): Promise<Onboarding> {
    const innerArgs = args || {};
    const path = `${this.buildPath(innerArgs)}/${id}/documents/${slotKey}`;
    return this._upload(path, file);
  }

  addDocument(
    id: string,
    slotKey: string,
    file: UploadFile,
    args?: ResourceArguments,
  ): Promise<Onboarding> {
    const { idempotency_key: idempotencyKey, ...innerArgs } = args || {};
    const path = `${this.buildPath(innerArgs)}/${id}/documents/${slotKey}`;
    return this._createMultipart(path, { file }, idempotencyKey?.toString());
  }

  deleteDocument(
    id: string,
    slotKey: string,
    documentId: string,
    args?: ResourceArguments,
  ): Promise<Onboarding> {
    const { entity_id: entityId, ...innerArgs } = args || {};
    const path = `${this.buildPath({ entity_id: entityId })}/${id}/documents/${slotKey}/${documentId}`;
    return this._action<Onboarding>('delete', path, { args: innerArgs });
  }

  uploadShareholderDocument(
    id: string,
    shareholderId: string,
    file: UploadFile,
    args?: ResourceArguments,
  ): Promise<Onboarding> {
    const innerArgs = args || {};
    const path = `${this.buildPath(innerArgs)}/${id}/shareholders/${shareholderId}/document`;
    return this._upload(path, file);
  }

  uploadLegalRepresentativeDocument(
    id: string,
    legalRepresentativeId: string,
    slotKey: string,
    file: UploadFile,
    args?: ResourceArguments,
  ): Promise<Onboarding> {
    const innerArgs = args || {};
    const path = `${this.buildPath(innerArgs)}/${id}/legal_representatives/${legalRepresentativeId}/documents/${slotKey}`;
    return this._upload(path, file);
  }
}
