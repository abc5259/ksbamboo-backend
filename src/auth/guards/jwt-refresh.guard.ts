import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable() //RefreshToken이 유효한지 확인 Guard
export class JwtRefreshGuard extends AuthGuard('jwt-refresh-token') {}
