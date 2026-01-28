import 'reflect-metadata';

import { CreateRoleController } from '@application/controllers/roles/CreateRoleController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(CreateRoleController);

export const handler = lambdaHttpAdapter(controller);
