import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) { }

    @Post("/signup")
    Signup(@Body() req: CreateUserDto) {
        return this.userService.Create(req.email, req.password)
    }
}
