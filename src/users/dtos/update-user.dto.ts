import { IsOptional, IsString, IsEmail } from "class-validator"
export class UpdateUserDto {
    @IsEmail()
    @IsOptional()
    email: string

    @IsOptional()
    @IsString()
    password: string
}
