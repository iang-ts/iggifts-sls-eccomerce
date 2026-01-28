import 'reflect-metadata';

import { ListRolesController } from '@application/controllers/roles/ListRolesController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(ListRolesController);

export const handler = lambdaHttpAdapter(controller);
