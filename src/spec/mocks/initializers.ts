import axios from 'axios';
import sinon, { SinonStub } from 'sinon';

import { createAxiosInstance } from './client/axiosInstance';

export function mockAxios() {
  const mockedAxios = sinon.stub(axios, 'create');
  // @ts-ignore: return type is not assignable
  mockedAxios.callsFake(createAxiosInstance);
  return mockedAxios;
}

export function mockConsoleLog() {
  return sinon.stub(console, 'log');
}

export function restore(stub: SinonStub) {
  stub.restore();
}
