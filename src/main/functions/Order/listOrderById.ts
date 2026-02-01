import 'reflect-metadata';

import { ListOrderByIdController } from '@application/controllers/order/ListOrdersByIdController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

const consumer = Registry.getInstance().resolve(ListOrderByIdController);

export const handler = lambdaHttpAdapter(consumer);
