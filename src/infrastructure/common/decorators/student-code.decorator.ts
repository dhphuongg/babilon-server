import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsStudentCode(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStudentCode',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') {
            return false;
          }

          // ktra 10 kí tự
          if (value.length !== 10) {
            return false;
          }

          // bắt đầu bằng 2024
          if (!value.startsWith('2024')) {
            return false;
          }

          // các kí tự phải là số
          return /^\d+$/.test(value);
        },
        defaultMessage() {
          return `Mã sinh viên không hợp lệ`;
        },
      },
    });
  };
}
