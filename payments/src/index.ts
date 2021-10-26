import mongoose from 'mongoose';
import { app } from './app';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  console.log('Starting up.....');

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

  new OrderCreatedListener(natsWrapper.client).listen();
  new OrderCancelledListener(natsWrapper.client).listen();
};

const configureMongoDb = async (mongoUri: string) => {
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');
};

start();
