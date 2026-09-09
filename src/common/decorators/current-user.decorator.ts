import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const userId = request.headers['user-id'] || request.headers['x-user-id'];
    
    return { id: userId ? Number(userId) : null };
  },
);