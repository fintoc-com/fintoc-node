export interface IConstructorOptions {
  baseUrl: string,
  apiKey: string,
  userAgent: string,
  params?: Record<string, string>,
  jwsPrivateKey?: string | Buffer,
}
