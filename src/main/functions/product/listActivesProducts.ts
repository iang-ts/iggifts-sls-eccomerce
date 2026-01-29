import 'reflect-metadata';

import { ListProductsController } from '@application/controllers/product/ListProductsController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(ListProductsController);

export const handler = lambdaHttpAdapter(controller);
