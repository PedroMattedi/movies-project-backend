import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;
  private readonly logger = new Logger(MailService.name);
  private isConfigured: boolean;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.isConfigured = !!apiKey;

    if (this.isConfigured) {
      this.resend = new Resend(apiKey);
      this.logger.log('Resend configured successfully');
    } else {
      this.logger.warn('Resend not configured - RESEND_API_KEY missing');
    }
  }

  async sendMovieReleaseEmail(
    userEmail: string,
    userName: string,
    movieTitle: string,
    releaseDate: Date,
  ) {
    if (!this.isConfigured) {
      this.logger.warn(
        `Email not sent (Resend not configured): ${movieTitle} → ${userEmail}`,
      );
      return null;
    }

    try {
      const result = await this.resend.emails.send({
        from:
          this.configService.get<string>('SMTP_FROM') || 'noreply@movieapp.com',
        to: userEmail,
        subject: `Lembrete: ${movieTitle} estreia hoje!`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Olá ${userName}!</h2>
        <p>O filme <strong>${movieTitle}</strong> que você cadastrou estreia hoje, ${releaseDate.toLocaleDateString('pt-BR')}!</p>
        <p>Corre pra assistir!</p>
        <br>
        <p>Atenciosamente,<br>Equipe Movie App</p>
      </div>
    `,
      });

      if (result.error) {
        this.logger.error(
          `Erro ao enviar e-mail via Resend: ${result.error.message}`,
        );
        return null;
      }

      this.logger.log(
        `E-mail enviado com sucesso via Resend: ${result.data?.id ?? 'sem ID retornado'}`,
      );
      return result.data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.logger.error(
          `Falha ao enviar e-mail para ${userEmail}: ${err.message}`,
        );
      } else {
        this.logger.error(`Erro desconhecido ao enviar e-mail`, err);
      }
      return null;
    }
  }
}
