import { PaymentStatus } from '@application/entities/PaymentStatus';

export class MockPayClient {
  private static readonly SUCCESS_RATE = 0.9;
  private static readonly DECLINED_RATE = 0.05;
  private static readonly PROCESSING_DELAY_MS = 7_000;

  static async mockPay(
    _params: MockPayClient.MockPayParams,
  ): Promise<MockPayClient.MockPayResponse> {
    console.log('Payment being processed');

    await new Promise(resolve => setTimeout(resolve, this.PROCESSING_DELAY_MS));

    const paymentStatus = this.determinePaymentStatus();

    console.log(`Payment ${paymentStatus}`);

    return { paymentStatus };
  }

  private static determinePaymentStatus(): PaymentStatus {
    const random = Math.random();

    if (random < this.SUCCESS_RATE) {
      return PaymentStatus.SUCCESS;
    }

    if (random < this.SUCCESS_RATE + this.DECLINED_RATE) {
      return PaymentStatus.DECLINED;
    }

    return PaymentStatus.SUSPECT_FRAUD;
  }
}

export namespace MockPayClient {
  export type MockPayResponse = {
    paymentStatus: PaymentStatus;
  }

  export type MockPayParams = {
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
