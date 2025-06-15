import { AxiosInstance } from 'axios';

export interface IPaginationOptions {
  client: AxiosInstance,
  path: string,
  headers: Record<string, string>,
  params?: Record<string, string>
}
