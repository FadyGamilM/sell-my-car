import { Body, Controller, Delete, Param, Post, Get, Patch, Query, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import {SerializerInterceptor} from "../interceptors/serializer.interceptor"
import {GetUserDto} from "./dtos/get-user.dto"
import { CustomSerialize } from '../interceptors/serializer.interceptor';
import { AuthService } from './auth.service';
import { log } from 'console';

@Controller('users')
export class UsersController {

    constructor(
        private userService: UsersService,
        private authService : AuthService,
        ) { }

    @Post("/signup")
    Signup(@Body() req: CreateUserDto) {
        return this.authService.Signup(req.email, req.password)
    }

    @Post("/signin") 
    Signin(@Body() req : CreateUserDto){
        return this.authService.Signin(req.email, req.password)
    }

    @Delete("/:id")
    // nest will parse all params as string so we have to receive it as a string and then parse it to integer and pass it to our service layer
    Delete(@Param("id") id: string) {
        return this.userService.DeleteByID(parseInt(id, 10))
    }

    // @UseInterceptors(new SerializerInterceptor(GetUserDto))
    @CustomSerialize(GetUserDto)
    @Get("/:id")
    GetByID(@Param("id") id: string) {
        return this.userService.FindByID(parseInt(id, 10))
    }

    @Get()
    GetByEmail(@Query("email") email: string) {
        return this.userService.FindByEmail(email)
    }

    @Patch(":id")
    UpdateByID(@Param("id") id: string, @Body() req: UpdateUserDto) {
        return this.userService.UpdateByID(parseInt(id, 10), req)
    }

}
