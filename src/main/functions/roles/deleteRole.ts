import 'reflect-metadata';

import { DeleteRoleController } from '@application/controllers/roles/DeleteRoleController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(DeleteRoleController);

export const handler = lambdaHttpAdapter(controller);
