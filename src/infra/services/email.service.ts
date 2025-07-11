import { ConfigService } from '@nestjs/config';
import { EmailOptions } from '@core/@types';
import { IEmailService } from '@core/services';
import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService implements IEmailService {
  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: Number(this.configService.get('SMTP_PORT')) || 465,
      secure: false,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASSWORD'),
      },
    });
  }
  private transporter: nodemailer.Transporter;

  async sendEmail(emailOptions: EmailOptions): Promise<void> {
    const { to, subject, text } = emailOptions;
    await this.transporter.sendMail({
      from: this.configService.get('SMTP_FROM'),
      to,
      subject,
      text,
    });
  }
}
