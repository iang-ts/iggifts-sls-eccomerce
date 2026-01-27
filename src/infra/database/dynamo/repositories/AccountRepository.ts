import { Account } from '@application/entities/Account';
import { GetCommand, PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoClient } from '@infra/clients/dynamoClient';
import { Injectable } from '@kernel/decorators/Injectable';
import { AppConfig } from '@shared/config/AppConfig';
import { AccountItem } from '../items/AccountItem';

@Injectable()
export class AccountRepository {
  constructor(private readonly config: AppConfig) {}

  async findById(accountId: string): Promise<Account | null> {
    const command = new GetCommand({
      TableName: this.config.db.dynamodb.mainTable,
      Key: {
        PK: AccountItem.getPK(accountId),
        SK: AccountItem.getSK(accountId),
      },
    });

    const { Item: accountItem } = await dynamoClient.send(command);

    if (!accountItem) {
      return null;
    }

    return AccountItem.toEntity(accountItem as AccountItem.ItemType);
  }

  async findEmail(email: string): Promise<Account | null> {
    const command = new QueryCommand({
      IndexName: 'GSI1',
      TableName: this.config.db.dynamodb.mainTable,
      Limit: 1,
      KeyConditionExpression: '#GSI1PK = :GSI1PK AND #GSI1SK = :GSI1SK',
      ExpressionAttributeNames: {
        '#GSI1PK': 'GSI1PK',
        '#GSI1SK': 'GSI1SK',
      },
      ExpressionAttributeValues: {
        ':GSI1PK': AccountItem.getGSI1PK(email),
        ':GSI1SK': AccountItem.getGSI1SK(email),
      },
    });

    const { Items = [] } = await dynamoClient.send(command);
    const account = Items[0] as AccountItem.ItemType | undefined;

    if (!account) {
      return null;
    }

    return AccountItem.toEntity(account);
  }

  async newAddress({ accountId, address }: AccountRepository.newAddressParams) {
    const command = new UpdateCommand({
      TableName: this.config.db.dynamodb.mainTable,
      Key: {
        PK: AccountItem.getPK(accountId),
        SK: AccountItem.getSK(accountId),
      },
      UpdateExpression: `
        SET #addresses = list_append(
          if_not_exists(#addresses, :emptyList),
          :newAddress
        )
      `,
      ExpressionAttributeNames: {
        '#addresses': 'addresses',
      },
      ExpressionAttributeValues: {
        ':newAddress': [address],
        ':emptyList': [],
      },
      ConditionExpression: 'attribute_exists(PK)',
      ReturnValues: 'ALL_NEW',
    });

    return dynamoClient.send(command);
  }

  async create(account: Account): Promise<void> {
    const accountItem = AccountItem.fromEntity(account);

    const command = new PutCommand({
      TableName: this.config.db.dynamodb.mainTable,
      Item: accountItem.toItem(),
    });

    await dynamoClient.send(command);
  }
}

export namespace AccountRepository {
  export type newAddressParams = {
    accountId: string;
    address: {
      name: string;
      street: string;
      number: string;
      state: string;
      postalCode: string;
    }
  }
}
