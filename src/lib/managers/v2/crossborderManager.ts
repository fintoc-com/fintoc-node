import { Client } from '../../client';

import { CrossborderBeneficiariesManager } from './crossborderBeneficiariesManager';
import { CrossborderQuotesManager } from './crossborderQuotesManager';
import { CrossborderTransfersManager } from './crossborderTransfersManager';

export class CrossborderManager {
  quotes: CrossborderQuotesManager;
  beneficiaries: CrossborderBeneficiariesManager;
  transfers: CrossborderTransfersManager;

  constructor(path: string, client: Client) {
    this.quotes = new CrossborderQuotesManager(`${path}/quotes`, client);
    this.beneficiaries = new CrossborderBeneficiariesManager(`${path}/beneficiaries`, client);
    this.transfers = new CrossborderTransfersManager(`${path}/transfers`, client);
  }
}
