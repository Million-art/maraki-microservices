import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { LoggerService } from '../../shared/logs/logger.service';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor(private readonly loggerService: LoggerService) {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendInviteEmail({
    to,
    inviteLink,
    userName,
    expiryHours = 24,
  }: {
    to: string;
    inviteLink: string;
    userName?: string;
    expiryHours?: number;
  }) {
    const mailOptions = {
      from: process.env.RESEND_FROM_EMAIL || 'noreply@ymarakiai.com',
      to,
      subject: 'Welcome to Maraki - Set Your Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">Welcome to Maraki!</h2>
          <p>Hello ${userName || 'there'},</p>
          <p>Your account has been created successfully. To get started, please set your password by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteLink}" style="background: #ff9500ff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Set Your Password
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">This invitation link will expire in ${expiryHours} hours.</p>
          <p style="color: #666; font-size: 14px;">If you didn't expect this invitation, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            Thanks,<br>Maraki Team
          </p>
        </div>
      `,
      text: `Hello ${userName || 'there'},\n\nYour account has been created successfully. To get started, please set your password by clicking this link: ${inviteLink}\n\nThis invitation link will expire in ${expiryHours} hours.\n\nIf you didn't expect this invitation, please ignore this email.\n\nThanks,\nMaraki Team`,
    };

    try {
      console.log('Attempting to send invite email to:', to);
      console.log('Using from email:', mailOptions.from);

      const result = await this.resend.emails.send(mailOptions);
      console.log('Invite email sent successfully:', result);
      return result;
    } catch (error) {
      console.error('Failed to send invite email via Resend:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        status: error.status
      });
      throw error;
    }
  }

  async sendPasswordResetEmail({
    to,
    resetLink,
    userName,
    expiryHours = 24,
  }: {
    to: string;
    resetLink: string;
    userName?: string;
    expiryHours?: number;
  }) {
    const mailOptions = {
      from: process.env.RESEND_FROM_EMAIL || 'noreply@ymarakiai.com',
      to,
      subject: 'Reset Your Maraki Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
          <p>Hello ${userName || to},</p>
          <p>You requested to reset your password for your Maraki account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">This link will expire in ${expiryHours} hours.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            Thanks,<br>Maraki Team
          </p>
        </div>
      `,
      text: `Hello ${userName || to},\n\nYou requested to reset your password for your Maraki account.\n\nClick this link to reset your password: ${resetLink}\n\nThis link will expire in ${expiryHours} hours.\n\nIf you didn't request this, please ignore this email.\n\nThanks,\nMaraki Team`,
    };

    try {
      console.log('Attempting to send password reset email to:', to);
      console.log('Using from email:', mailOptions.from);

      const result = await this.resend.emails.send(mailOptions);
      console.log('Password reset email sent successfully:', result);
      return result;
    } catch (error) {
      console.error('Failed to send password reset email via Resend:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        status: error.status
      });
      throw error;
    }
  }
}
