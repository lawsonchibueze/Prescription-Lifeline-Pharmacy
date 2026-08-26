import { Controller, Get } from '@nestjs/common';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';

@Controller('users')
export class UsersController {
  // Protected by the global AuthGuard — requires a valid Better Auth
  // session cookie/token. Returns the signed-in user's own profile.
  @Get('me')
  getProfile(@Session() session: UserSession) {
    return session.user;
  }
}
