import KSUID from 'ksuid';

export class Account {
  readonly id: string;

  readonly email: string;
  readonly name: string;

  externalId: string | undefined;
  addresses: Account.Address[] | [];

  readonly createdAt: Date;

  constructor(attr: Account.Attributes) {
    this.id = attr.id ?? KSUID.randomSync().string;
    this.email = attr.email;
    this.name = attr.name;
    this.externalId = attr.externalId;
    this.addresses = attr.addresses ?? [];
    this.createdAt = attr.createdAt ?? new Date();
  }
}

export namespace Account {
  export type Attributes = {
    email: string;
    name: string;
    externalId?: string;
    addresses?: Address[];
    id?: string;
    createdAt?: Date;
  };

  export type Address = {
    name: string;
    street: string;
    number: string;
    state: string;
    postalCode?: string;
  }
}
