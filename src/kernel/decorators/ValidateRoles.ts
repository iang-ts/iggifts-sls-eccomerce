const ROLES_METADATA_KEY = 'custom:roles';

export function ValidateRoles(allowedRoles: string[]): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(ROLES_METADATA_KEY, allowedRoles, target);
  };
}

export function getAllowedRoles(target: any): string[] | undefined {
  return Reflect.getMetadata(ROLES_METADATA_KEY, target.constructor);
}
