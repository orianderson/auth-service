import { EmailOptions } from '@core/@types';

export interface IEmailService {
  sendEmail(emailOptions: EmailOptions): Promise<void>;
}
