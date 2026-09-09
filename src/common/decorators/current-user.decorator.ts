import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_parameter: unknown, executionContext: ExecutionContext): number => {
    const httpRequest = executionContext.switchToHttp().getRequest();

    const identityToken = httpRequest.headers['user-id'] || httpRequest.headers['x-user-id'];

    if (!identityToken) {
      throw new UnauthorizedException('Authentication credentials were not provided in the headers.');
    }

    const parsedUserId = parseInt(identityToken as string, 10);
    
    if (Number.isNaN(parsedUserId)) {
      throw new UnauthorizedException('The provided identification token is invalid.');
    }

    return parsedUserId;
  },
);