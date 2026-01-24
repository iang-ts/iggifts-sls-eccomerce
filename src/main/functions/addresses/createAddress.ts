import 'reflect-metadata';

import { CreateAddressController } from '@application/controllers/addresses/CreateAddressController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(CreateAddressController);

export const handler = lambdaHttpAdapter(controller);
