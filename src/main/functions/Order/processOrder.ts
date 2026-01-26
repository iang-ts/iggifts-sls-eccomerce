import 'reflect-metadata';

import { OrdersQueuesConsumer } from '@application/queues/OrdersQueuesConsumer';
import { Registry } from '@kernel/di/Registry';
import { lambdaSQSAdapter } from '@main/adapters/lambdaSQSAdapter';

const consumer = Registry.getInstance().resolve(OrdersQueuesConsumer);

export const handler = lambdaSQSAdapter(consumer);
