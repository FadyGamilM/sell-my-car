import { Body, Controller, Delete, Param, Post, Get, Patch, Query } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) { }

    @Post("/signup")
    Signup(@Body() req: CreateUserDto) {
        return this.userService.Create(req.email, req.password)
    }

    @Delete("/:id")
    // nest will parse all params as string so we have to receive it as a string and then parse it to integer and pass it to our service layer
    Delete(@Param("id") id: string) {
        return this.userService.DeleteByID(parseInt(id, 10))
    }

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
