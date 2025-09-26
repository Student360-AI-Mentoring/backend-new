import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

type MaybeRecordType = Record<string, unknown> | undefined;

export const CurrentUser = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request | undefined>();
  const user = request?.user as MaybeRecordType | undefined;

  if (!user) {
    return undefined;
  }

  if (data) {
    return user[data];
  }

  return user;
});
