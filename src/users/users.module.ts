import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from './user.entity';
import { AuthService } from './auth.service';

@Module({
  // this will make nestjs and typeorm works togeather to generate a repo class for us
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, AuthService]
})
export class UsersModule { }
