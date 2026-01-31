import 'reflect-metadata';

import { ListProductsByCategoryController } from '@application/controllers/product/ListProductsByCategoryController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(ListProductsByCategoryController);

export const handler = lambdaHttpAdapter(controller);
