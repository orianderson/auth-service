import { Injectable } from '@nestjs/common';

import { IEmailTemplateService } from '@core/services';
import { confirmEmail } from './confirm-email';
import { recoveryPassword } from './recovery-password-email';

@Injectable()
export class EmailTemplate implements IEmailTemplateService {
  public confirmEmailTemplate(name: string, token?: string): string {
    return confirmEmail(name, token);
  }

  public recoveryPasswordTemplate(name: string, token?: string): string {
    return recoveryPassword(name, token);
  }
}
