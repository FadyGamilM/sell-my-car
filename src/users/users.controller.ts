import { Body, Controller, Delete, Param, Post, Get, Patch, Query, Session } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { SerializerInterceptor } from "../interceptors/serializer.interceptor"
import { GetUserDto } from "./dtos/get-user.dto"
import { CustomSerialize } from '../interceptors/serializer.interceptor';
import { AuthService } from './auth.service';
import { log } from 'console';

@Controller('users')
export class UsersController {

    constructor(
        private userService: UsersService,
        private authService: AuthService,
    ) { }

    @CustomSerialize(GetUserDto)
    @Post("/signup")
    async Signup(@Body() req: CreateUserDto, @Session() reqSession: any) {
        const user = await this.authService.Signup(req.email, req.password)
        reqSession.userID = user.id
        return user

    }

    @CustomSerialize(GetUserDto)
    @Post("/signin")
    async Signin(@Body() req: CreateUserDto, @Session() reqSession: any) {
        const user = await this.authService.Signin(req.email, req.password)
        reqSession.userID = user.id
        return user
    }

    @CustomSerialize(GetUserDto)
    @Get("/curr-user")
    async CurrentLoggedInUser(@Session() reqSession: any) {
        const currLoggedInUser = await this.userService.FindByID(reqSession.userID)
        return currLoggedInUser
    }


    @CustomSerialize(GetUserDto)
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

    @CustomSerialize(GetUserDto)
    @Get()
    GetByEmail(@Query("email") email: string) {
        return this.userService.FindByEmail(email)
    }

    @CustomSerialize(GetUserDto)
    @Patch(":id")
    UpdateByID(@Param("id") id: string, @Body() req: UpdateUserDto) {
        return this.userService.UpdateByID(parseInt(id, 10), req)
    }

}
