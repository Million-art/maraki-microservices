import { Injectable, OnModuleInit } from '@nestjs/common';
import { JetStreamProvider } from '../jetstream.provider';
import { EmailService } from 'src/infrastructure/services/email.service';
import { randomBytes } from 'crypto';

@Injectable()
export class UserCreatedSubscriber implements OnModuleInit {
  constructor(
    private readonly jetStream: JetStreamProvider,
    private readonly emailService: EmailService
  ) {}

  private generateToken(): string {
    return randomBytes(32).toString('hex');
  }

  async onModuleInit() {
    const js = this.jetStream.getJetStream();
    const sc = this.jetStream.getCodec();

    const consumer = await js.consumers.get('USERS', 'AUTH');
    const iter = await consumer.consume();

    (async () => {
      for await (const m of iter) {
        const data = JSON.parse(sc.decode(m.data));
        console.log('📩 Auth received user.created:', data);

        // Generate a token for invite email
        const token = this.generateToken();

        // send invite email with token
        await this.emailService.sendInviteEmail(data.email, token);

        m.ack(); // Explicit acknowledgment
      }
    })();
  }
}
