import 'reflect-metadata';

import { CreateOrderController } from '@application/controllers/order/CreateOrderController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(CreateOrderController);

export const handler = lambdaHttpAdapter(controller);
