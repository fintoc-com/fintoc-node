import axios from 'axios';
import sinon, { SinonStub } from 'sinon';

import { createAxiosInstance } from './client/axiosInstance';

export function mockAxios() {
  // @ts-ignore: return type is not assignable
  const mockedAxios = sinon.stub(axios, 'create').callsFake(createAxiosInstance);
  return mockedAxios;
}

export function restoreAxios(stub: SinonStub) {
  stub.restore();
}
