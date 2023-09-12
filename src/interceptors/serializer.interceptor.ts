import {NestInterceptor, ExecutionContext, CallHandler} from "@nestjs/common"
import { log } from "console"
import {Observable, map } from "rxjs"
import {plainToClass} from "class-transformer"

export class SerializerInterceptor implements NestInterceptor{
    constructor(private outputDto : any){}

    intercept(ctx : ExecutionContext, next: CallHandler) : Observable<any>{
        // ==> this part of code is responsible for any code i want to run before the handler (controller) start working
        log("running before the handler ==>")


        // ==> this part of code is responsible for any code i want to run after the handler (Controller) end its works but before the response go back to the client
        return next.handle().pipe(
            map((data: any)=> {
                log("running after tha handler ==> ", data)
                return plainToClass(this.outputDto, data, {
                    excludeExtraneousValues: true // this is used to tell nestjs that when it transforms our mapped outputDto into a json to return it, only return the fields that are marked with the @Expose() decorator
                })
            })
        ) 
    }
}