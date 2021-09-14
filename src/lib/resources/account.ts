import { GenericFunction } from '../../types';
import { Client } from '../client';
import { MovementsManager } from '../managers';
import { ResourceMixin } from '../mixins/resourceMixin';

export class Account extends ResourceMixin<Account> {
  #movementsManager?: MovementsManager;

  constructor(
    client: Client,
    handlers: Record<string, GenericFunction>,
    methods: string[],
    path: string,
    data: Record<string, any>,
  ) {
    super(client, handlers, methods, path, data);
    this.#movementsManager = undefined;
  }

  get movements() {
    if (this.#movementsManager === undefined) {
      this.#movementsManager = new MovementsManager(
        `/accounts/${this.id}/movements`, this._client,
      );
    }
    return this.#movementsManager;
  }

  set movements(newValue) { /* eslint-disable-line class-methods-use-this */
    throw new ReferenceError('Attribute name corresponds to a manager');
  }
}
