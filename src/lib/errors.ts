/* eslint-disable max-classes-per-file */

export class FintocError extends Error {
  constructor(errorData: Record<string, string>) {
    const errorType = errorData.type;
    const errorCode = errorData.code;
    const errorMessage = errorData.message;
    const errorParam = errorData.param;
    const errorDocURL = errorData.doc_url;
    let message = errorType;
    message += errorCode ? `: ${errorCode}` : '';
    message += errorParam ? ` (${errorParam})` : '';
    message += `\n${errorMessage}`;
    message += errorDocURL ? `\nCheck the docs for more info: ${errorDocURL}` : '';
    super(message);
  }
}

export class ApiError extends FintocError {}

export class AuthenticationError extends FintocError {}

export class LinkError extends FintocError {}

export class InstitutionError extends FintocError {}

export class InvalidRequestError extends FintocError {}
