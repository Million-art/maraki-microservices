import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendInviteEmail(email: string, token: string): Promise<void> {
    const inviteLink = `http://localhost:3000/auth/set-password?token=${token}`;

    await this.resend.emails.send({
      from: 'noreply@yourapp.com',
      to: email,
      subject: 'Set Your Password',
      html: `<p>Click <a href="${inviteLink}">here</a> to set your password. This link expires in 24 hours.</p>`,
    });
  }
}
