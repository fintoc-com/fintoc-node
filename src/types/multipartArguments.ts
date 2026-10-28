import { UploadFile } from './uploadFile';

export type MultipartArguments = {
  [key: string]: MultipartArguments | UploadFile | string | number | boolean | string[]
}
