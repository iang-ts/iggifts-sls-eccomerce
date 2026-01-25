import 'reflect-metadata';

import { CreateProductController } from '@application/controllers/product/CreateProductController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(CreateProductController);

export const handler = lambdaHttpAdapter(controller);
