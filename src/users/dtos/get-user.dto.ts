import {Expose} from "class-transformer"
export class GetUserDto {
    @Expose()
    id : number;

    @Expose()
    email : string;
}