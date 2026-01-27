import { IEmailGateway, ISendEmailParams } from '@application/contracts/IEmailGateway';
import { SendEmailCommand } from '@aws-sdk/client-ses';
import { sesClient } from '@infra/clients/sesClient';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class EmailGateway implements IEmailGateway {
  async sendEmail(params: ISendEmailParams): Promise<void> {
    const command = new SendEmailCommand({
      Source: params.from,
      Destination: {
        ToAddresses: params.to,
      },
      Message: {
        Subject: {
          Charset: 'utf-8',
          Data: params.subject,
        },
        Body: {
          Html: {
            Charset: 'utf-8',
            Data: params.html,
          },
        },
      },
    });

    await sesClient.send(command);
  }
}
