import 'reflect-metadata';

import { GetOrderStatusController } from '@application/controllers/order/GetOrderStatusController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

const consumer = Registry.getInstance().resolve(GetOrderStatusController);

export const handler = lambdaHttpAdapter(consumer);
