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
    content: Record<string, any>,
    attributes: string[],
  ) {
    super(client, handlers, methods, path, content, attributes);
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
