import { AxiosInstance } from 'axios';

export interface IPaginationOptions {
  client: AxiosInstance,
  path: string,
  params?: Record<string, string>
}
