import { MockPayClient } from '@infra/clients/mockPayClient';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class PaymentGateway {
  async pay({ cardDetails, totalAmount, billingAddress }: PaymentGateway.PayParams) {
    return await MockPayClient.mockPay({
      cardDetails,
      totalAmount,
      billingAddress,
    });
  }
}

export namespace PaymentGateway {
  export type PayParams = {
    cardDetails: {
      cardNumber: string;
      cardMonth: string;
      cardYear: string;
      cardCvv: string;
    },
    totalAmount: number;
    billingAddress: {
      name: string;
      street: string;
      number: string;
      state: string;
      postalCode: string;
    }
  }
}
