import { AccountRepository } from '@infra/database/dynamo/repositories/AccountRepository';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class CreateAddressUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute({ accountId, address }: CreateAddressUseCase.Input): Promise<void> {
    await this.accountRepository.newAddress({
      accountId,
      address,
    });
  }
}

export namespace CreateAddressUseCase {
  export type Input = {
    accountId: string;
    address: {
      name: string;
      street: string;
      number: string;
      state: string;
      postalCode: string;
    }
  };
}
