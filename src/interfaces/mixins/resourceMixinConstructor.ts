export interface IResourceMixinConstructor {
  name: string,
  mappings: Record<string, string>;
  resourceIdentifier: string;
}
