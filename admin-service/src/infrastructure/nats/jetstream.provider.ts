import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import {
  connect,
  NatsConnection,
  JetStreamManager,
  JetStreamClient,
  StringCodec,
  StorageType,
  RetentionPolicy,
} from 'nats';

@Injectable()
export class JetStreamProvider implements OnModuleInit, OnModuleDestroy {
  private nc: NatsConnection;
  private jsm: JetStreamManager;
  private js: JetStreamClient;
  private sc = StringCodec();

  async onModuleInit() {
    // Connect to NATS server
    this.nc = await connect({ servers: process.env.NATS_SERVER || 'nats://localhost:4222' });

    // Create JetStream admin and client
    this.jsm = await this.nc.jetstreamManager();
    this.js = this.nc.jetstream();

    // Ensure streams exist
    await this.ensureStream('QUIZZES', ['quiz.*']);
    await this.ensureStream('MATERIALS', ['material.*']);
    await this.ensureStream('USERS', ['user.*']);
  }

  private async ensureStream(name: string, subjects: string[]) {
    try {
      // Check if stream exists
      await this.jsm.streams.info(name);
    } catch {
      // Create stream if it does not exist
      await this.jsm.streams.add({
        name,
        subjects,
        storage: 'file' as StorageType,        // Type-safe cast
        retention: 'limits' as RetentionPolicy, // Type-safe cast
      });
      console.log(`✅ Stream ${name} created`);
    }
  }

  getJetStream(): JetStreamClient {
    return this.js;
  }

  getCodec() {
    return this.sc;
  }

  getConnection(): NatsConnection {
    return this.nc;
  }

  async onModuleDestroy() {
    // Gracefully close NATS connection
    await this.nc?.drain();
  }
}
