import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import {
  connect,
  NatsConnection,
  JetStreamManager,
  JetStreamClient,
  StringCodec,
  StorageType,
  AckPolicy,
  RetentionPolicy,
} from "nats";

@Injectable()
export class JetStreamProvider implements OnModuleInit, OnModuleDestroy {
  private nc: NatsConnection;
  private jsm: JetStreamManager;
  private js: JetStreamClient;
  private sc = StringCodec();

  async onModuleInit() {
    // Connect to NATS server using env variable or fallback to localhost
    this.nc = await connect({
      servers: process.env.NATS_SERVER || "nats://localhost:4222",
    });

    // Create JetStream Manager (for admin tasks) and JetStream client (for pub/sub)
    this.jsm = await this.nc.jetstreamManager();
    this.js = this.nc.jetstream();

    // Ensure the USERS stream exists
    await this.ensureStream("USERS", ["user.*"]);

    // Ensure AUTH consumer exists for user.created events
    await this.ensureConsumer("USERS", "AUTH", "user.created");
  }

  private async ensureStream(name: string, subjects: string[]) {
    try {
      // Check if stream exists
      await this.jsm.streams.info(name);
    } catch (err) {
      console.log(`[JetStreamProvider] Stream ${name} not found, creating...`);
      // If not, create it
      await this.jsm.streams.add({
        name,
        subjects,
        storage: StorageType.File,   // Use enum directly
        retention: RetentionPolicy.Limits,  // Use enum directly
      });
      console.log(`✅ Stream ${name} created`);
    }
  }

  private async ensureConsumer(
    stream: string,
    durable: string,
    filter: string,
  ) {
    try {
      // Check if consumer exists
      await this.jsm.consumers.info(stream, durable);
    } catch (err) {
      console.log(`[JetStreamProvider] Consumer ${durable} not found, creating...`);
      // If not, create it
      await this.jsm.consumers.add(stream, {
        durable_name: durable,
        filter_subject: filter,
        ack_policy: AckPolicy.Explicit,
      });
      console.log(`✅ Consumer ${durable} created for ${stream}.${filter}`);
    }
  }

  getJetStream(): JetStreamClient {
    return this.js;
  }

  getJetStreamManager(): JetStreamManager {
    return this.jsm;
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
