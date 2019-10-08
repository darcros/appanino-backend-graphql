import { registerDecorator, ValidationOptions } from 'class-validator';

const countDecimals = (value: number) => {
  if (Math.floor(value) === value) return 0;
  return value.toString().split('.')[1].length || 0;
};

export const MaxDecimals = (maxDecimals: number, validationOptions?: ValidationOptions) => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'maxDecimals',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate: value => typeof value === 'number' && countDecimals(value) <= maxDecimals,
        defaultMessage: () => `${propertyName} must have no more than ${maxDecimals} decimal digits`,
      },
    });
  };
};
