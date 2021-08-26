import { Method } from 'axios';

export interface IRequestOptions {
  path: string,
  paginated?: boolean,
  method?: Method,
  params?: Record<string, any>,
  json?: Record<string, string>,
}
