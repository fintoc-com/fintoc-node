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
  ) {
    super(client, handlers, methods, path, content);
    this.#movementsManager = undefined;
  }

  /**
   * @deprecated This method is deprecated and will be removed in a future version.
   * Please use the Fintoc client directly to access movements. See: https://github.com/fintoc-com/fintoc-node/pull/34
   */
  get movements() {
    console.warn('Warning: Account.movements is deprecated and will be removed in a future version. Please use the Fintoc client directly to access movements. See: https://github.com/fintoc-com/fintoc-node/pull/34');
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
