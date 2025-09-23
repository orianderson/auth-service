import { Injectable } from '@nestjs/common';

import { RecoveryPasswordUseCase } from '@app/usecases';
import { UserNotFoundError } from '@core/errors';
import { UserUnAuthorizedException, BadRequestException } from '../exceptions';
import { EmailService, EmailTemplate } from '@infra/services';

@Injectable()
export class UpdateService {
  constructor(
    private readonly recoveryPasswordUseCase: RecoveryPasswordUseCase,
    private readonly emailService: EmailService,
    private readonly emailTemplate: EmailTemplate,
  ) {}

  async verifyEmail(email: string): Promise<void> {
    const result = await this.recoveryPasswordUseCase.execute(email);

    if (result.isLeft()) {
      const error = result.value;
      if (error instanceof UserNotFoundError) {
        throw new UserNotFoundError();
      }
      throw new BadRequestException('An unexpected error occurred');
    }
    await this.emailService.sendEmail({
      to: email,
      subject: 'Confirm your email',
      html: this.emailTemplate.recoveryPasswordTemplate(
        result.value.name,
        result.value.token,
      ),
    });
  }

  updatePassword(): Promise<void> {
    // Implementation for updating the password
    // This method should handle the logic for updating the user's password
    // and possibly sending a confirmation email.
    throw new BadRequestException(
      'Update password functionality not implemented',
    );
  }
}
