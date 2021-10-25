import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';

const start = async () => {
  console.log('Starting up...');

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }

  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  try {
    await configureNats(
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL,
      process.env.NATS_CLUSTER_ID
    );
    await configureMongoDb(process.env.MONGO_URI);
  } catch (err) {
    console.log(err);
  }
};

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

const configureNats = async (
  natsClientId: string,
  natsUrl: string,
  natsCluserId: string
) => {
  await natsWrapper.connect(natsCluserId, natsClientId, natsUrl);

  natsWrapper.client.on('close', () => {
    console.log('NATS connection closed');
    process.exit();
  });

  process.on('SIGINT', () => {
    natsWrapper.client.close();
  });
  process.on('SIGTERM', () => {
    natsWrapper.client.close();
  });

  new TicketCreatedListener(natsWrapper.client).listen();
  new TicketUpdatedListener(natsWrapper.client).listen();
  new ExpirationCompleteListener(natsWrapper.client).listen();
};

const configureMongoDb = async (mongoUri: string) => {
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');
};

start();
