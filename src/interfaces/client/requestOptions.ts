import { Method } from 'axios';
import FormData from 'form-data';

export interface IRequestOptions {
  path: string,
  paginated?: boolean,
  method?: Method,
  params?: Record<string, any>,
  json?: Record<string, string>,
  idempotencyKey?: string,
  form?: FormData,
}
