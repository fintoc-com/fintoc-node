/* eslint-disable camelcase, no-shadow */
export enum PaymentMethodType {
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
}

export interface PaymentIntentRequest {
  amount: number;
  currency: string;
  payment_method?: PaymentMethodType;
  payment_type?: PaymentMethodType;
}

export interface PaymentAccount {
  type: string;
  number: string;
  holder_id: string;
  institution_id: string;
}

export interface PaymentIntentResponse {
  id: string;
  payment_type: PaymentMethodType;
  amount: number;
  currency: string;
  status: string;
  sender_account?: PaymentAccount;
  recipient_account?: PaymentAccount;
  payment_type_options?: Record<string, any>;
}
/* eslint-enable camelcase, no-shadow */
