import { APP_FILTER } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { MeModule } from './me/me.module';
import { ProjectModule } from './project/project.module';
import { UserModule } from './user/user.module';
import { AllExceptionsFilter } from './@common/filters/all-exceptions.filter';

@Module({
  imports: [AuthModule, MeModule, ProjectModule, TypeOrmModule.forRoot(), UserModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
