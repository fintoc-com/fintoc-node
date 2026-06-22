/**
 * Descriptor for a file to be sent through a multipart/form-data request.
 */
export interface UploadFile {
  data: Buffer | NodeJS.ReadableStream | Blob;
  filename: string;
  contentType?: string;
}
