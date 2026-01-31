import 'reflect-metadata';

import { ListOrdersByAccountController } from '@application/controllers/order/ListOrdersByAccountController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

const consumer = Registry.getInstance().resolve(ListOrdersByAccountController);

export const handler = lambdaHttpAdapter(consumer);
