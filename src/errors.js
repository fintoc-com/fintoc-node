/* eslint-disable max-classes-per-file */

const { DOCUMENTATION_URL } = require('./constants.js');


class FintocError extends Error {
  constructor(error) {
    super();
    this.message = error.message || 'An error occurred!';
    this.docUrl = error.doc_url || DOCUMENTATION_URL;
  }

  toString() {
    return `\n${this.message}\nPlease check the docs at: ${this.docUrl}`;
  }
}

class InvalidRequestError extends FintocError { }

class LinkError extends FintocError { }

class AuthenticationError extends FintocError { }

class InstitutionError extends FintocError { }

class ApiError extends FintocError { }

class MissingResourceError extends FintocError { }

class InvalidLinkTokenError extends FintocError { }

class InvalidUsernameError extends FintocError { }

class InvalidHolderTypeError extends FintocError { }

class MissingParameterError extends FintocError { }

class EmptyStringError extends FintocError { }

class UnrecognizedRequestError extends FintocError { }

class InvalidDateError extends FintocError { }

class InvalidCredentialsError extends FintocError { }

class LockedCredentialsError extends FintocError { }

class InvalidApiKeyError extends FintocError { }

class UnavailableInstitutionError extends FintocError { }

class InternalServerError extends FintocError { }


module.exports = {
  FintocError,
  InvalidRequestError,
  LinkError,
  AuthenticationError,
  InstitutionError,
  ApiError,
  MissingResourceError,
  InvalidLinkTokenError,
  InvalidUsernameError,
  InvalidHolderTypeError,
  MissingParameterError,
  EmptyStringError,
  UnrecognizedRequestError,
  InvalidDateError,
  InvalidCredentialsError,
  LockedCredentialsError,
  InvalidApiKeyError,
  UnavailableInstitutionError,
  InternalServerError,
};
