import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

const start = async () => {
  console.log('Starting up...');

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
  } catch (err) {
    console.log(err);
  }
};

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
};

start();
