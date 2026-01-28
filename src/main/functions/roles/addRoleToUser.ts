import 'reflect-metadata';

import { AddRoleToUserController } from '@application/controllers/roles/AddRoleToUserController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(AddRoleToUserController);

export const handler = lambdaHttpAdapter(controller);
