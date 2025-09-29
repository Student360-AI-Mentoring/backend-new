import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { validate, ValidationError, getMetadataStorage } from 'class-validator';
import { plainToClass, ClassConstructor } from 'class-transformer';
import { camelToSnakeCase } from '@/utils/helpers/string.helper';
import { CommonExceptions } from '../exceptions/custom.exception';
import { ValidationDetail } from '../exceptions/types/validation.type';

@Injectable()
export class CustomValidationPipe implements PipeTransform<unknown> {
  async transform(value: unknown, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const MetatypeCtor = metatype as ClassConstructor<unknown>;
    if (!this.hasValidationMetadata(MetatypeCtor)) {
      return value;
    }

    const object: unknown = plainToClass(MetatypeCtor, value as object);
    const errors = await validate(object as object, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const validationDetails = this.buildValidationDetails(errors);
      throw CommonExceptions.ValidationException('validation failed', validationDetails);
    }

    return object;
  }

  private toValidate(metatype: unknown): boolean {
    const types: Array<unknown> = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private hasValidationMetadata(target: ClassConstructor<unknown>): boolean {
    try {
      const metadataStorage = getMetadataStorage();
      const metadatas = metadataStorage.getTargetValidationMetadatas(target, '', false, false);
      return metadatas.length > 0;
    } catch (error) {
      return false;
    }
  }

  private buildValidationDetails(errors: ValidationError[]): ValidationDetail[] {
    const details: ValidationDetail[] = [];

    for (const err of errors) {
      const property = err.property ?? '';
      const fieldName = camelToSnakeCase(property);

      const constraints = err.constraints ?? {};
      const constraintKeys = Object.keys(constraints);

      for (const key of constraintKeys) {
        let validationDetail: ValidationDetail | null = null;

        const contexts = (err as unknown as Record<string, unknown>).contexts as Record<string, unknown> | undefined;

        if (contexts && contexts[key]) {
          const ctx = contexts[key] as Record<string, unknown>;
          validationDetail = {
            field: fieldName,
            code: String(ctx.code ?? ''),
            message: String(ctx.message ?? ''),
            details: String(ctx.details ?? ''),
          };
        } else {
          validationDetail = this.handleSystemConstraint(key, fieldName, String(constraints[key]));
        }

        if (validationDetail) {
          details.push(validationDetail);
          break; // Only take the first error for each field
        }
      }
    }

    return details;
  }

  private handleSystemConstraint(
    constraintType: string,
    fieldName: string,
    constraintMessage: string,
  ): ValidationDetail | null {
    switch (constraintType) {
      case 'whitelistValidation':
      case 'forbidNonWhitelisted':
        return {
          field: fieldName,
          code: 'ALEM05',
          message: 'This field is not allowed in the request',
          details: `Field '${fieldName}' is not allowed`,
        };

      default:
        return {
          field: fieldName,
          code: 'ALEM02',
          message: 'This field format is invalid',
          details: constraintMessage,
        };
    }
  }
}
