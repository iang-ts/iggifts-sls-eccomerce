import { Injectable } from '@kernel/decorators/Injectable';
import { env } from './env';

@Injectable()
export class AppConfig {
  readonly auth: AppConfig.Auth;

  readonly db: AppConfig.Database;

  readonly storage: AppConfig.Storage;

  readonly cdns: AppConfig.Cdns;

  readonly queues: AppConfig.Queues;

  readonly email: AppConfig.Email;

  constructor() {
    this.auth = {
      cognito: {
        userPool: {
          id: env.COGNITO_USERPOOL_ID,
        },
        client: {
          id: env.COGNITO_CLIENT_ID,
          secret: env.COGNITO_CLIENT_SECRET,
        },
      },
    };

    this.db = {
      dynamodb: {
        mainTable: env.MAIN_TABLE_NAME,
      },
    };

    this.storage = {
      productsBucket: env.PRODUCTS_BUCKET,
    };

    this.cdns = {
      productsCDN: env.PRODUCTS_CDN_DOMAIN_NAME,
    };

    this.queues = {
      ordersQueueUrl: env.ORDERS_QUEUE,
    };

    this.email = {
      emailFrom: env.EMAIL_FROM,
    };
  }
}

export namespace AppConfig {
  export type Auth = {
    cognito: {
      userPool: {
        id: string;
      };
      client: {
        id: string;
        secret: string;
      },
    };
  };

  export type Database = {
    dynamodb: {
      mainTable: string;
    };
  };

  export type Storage = {
    productsBucket: string;
  }

  export type Cdns = {
    productsCDN: string;
  }

  export type Queues = {
    ordersQueueUrl: string;
  }

  export type Email = {
    emailFrom: string;
  }
}
