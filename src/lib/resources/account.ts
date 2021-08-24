import { GenericFunction } from '../../types';
import { Client } from '../client';
import { MovementsManager } from '../managers';
import { ResourceMixin } from '../mixins/resourceMixin';

export class Account extends ResourceMixin {
  constructor(
    client: Client,
    handlers: Record<string, GenericFunction>,
    methods: string[],
    path: string,
    data: Record<string, any>,
  ) {
    super(client, handlers, methods, path, data);
    this.__movementsManager = undefined;
  }

  get movements() {
    if (this.__movementsManager === undefined) {
      this.__movementsManager = new MovementsManager(
        `/accounts/${this.id}/movements`, this._client,
      );
    }
    return this.__movementsManager;
  }

  set movements(newValue) { /* eslint-disable-line class-methods-use-this */
    throw new ReferenceError('Attribute name corresponds to a manager');
  }
}
