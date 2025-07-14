import { Injectable } from '@nestjs/common';

import { IEmailTemplateService } from '@core/services';
import { confirmEmail } from './confirm-email';

// TODO - enviar link to open web view com confirmação de email

@Injectable()
export class EmailTemplate implements IEmailTemplateService {
  public confirmEmailTemplate(name: string, link?: string): string {
    return confirmEmail(name, link);
  }
}
