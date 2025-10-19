import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private isConfigured: boolean;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');

    this.isConfigured = !!(smtpUser && smtpPass);

    if (this.isConfigured) {
      this.transporter = nodemailer.createTransport({
        host: this.configService.get<string>('SMTP_HOST') || 'smtp.ethereal.email',
        port: this.configService.get<number>('SMTP_PORT') || 587,
        secure: false,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
      this.logger.log('Email service configured successfully');
    } else {
      this.logger.warn('Email service not configured - SMTP credentials are missing. Email notifications will be skipped.');
    }
  }

  async sendMovieReleaseEmail(userEmail: string, userName: string, movieTitle: string, releaseDate: Date) {
    if (!this.isConfigured) {
      this.logger.warn(`Email not sent (SMTP not configured): Movie "${movieTitle}" release notification for ${userEmail}`);
      return null;
    }

    const mailOptions = {
      from: this.configService.get<string>('SMTP_FROM') || 'noreply@movieapp.com',
      to: userEmail,
      subject: `Lembrete: ${movieTitle} estreia hoje!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Olá ${userName}!</h2>
          <p>Este é um lembrete de que o filme <strong>${movieTitle}</strong> que você cadastrou estreia hoje, ${releaseDate.toLocaleDateString('pt-BR')}!</p>
          <p>Não perca a oportunidade de assistir!</p>
          <br>
          <p>Atenciosamente,<br>Equipe Movie App</p>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent successfully: ${info.messageId} to ${userEmail}`);
      return info;
    } catch (error) {
      this.logger.error(`Failed to send email to ${userEmail}:`, error);
      return null;
    }
  }
}
