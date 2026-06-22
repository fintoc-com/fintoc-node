import { ResourceArguments, UploadFile } from '../../../types';
import { ManagerMixin } from '../../mixins';
import { resourceUpload } from '../../resourceHandlers';
import { Onboarding } from '../../resources/v2/onboarding';
import { canRaiseHTTPError, getResourceClass } from '../../utils';

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
    return this.uploadFile(path, file);
  }

  uploadShareholderDocument(
    id: string,
    shareholderId: string,
    file: UploadFile,
    args?: ResourceArguments,
  ): Promise<Onboarding> {
    const innerArgs = args || {};
    const path = `${this.buildPath(innerArgs)}/${id}/shareholders/${shareholderId}/document`;
    return this.uploadFile(path, file);
  }

  @canRaiseHTTPError
  private async uploadFile(path: string, file: UploadFile): Promise<Onboarding> {
    const klass = await getResourceClass(
      (this.constructor as typeof OnboardingsManager).resource,
    );
    return resourceUpload<Onboarding>(this._client, path, klass, file);
  }
}
