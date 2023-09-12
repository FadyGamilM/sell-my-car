import { createParamDecorator, ExecutionContext } from "@nestjs/common"
export const CurrentLoggedUser = createParamDecorator(
    (data: never, ctx: ExecutionContext) => {
        // wherever we return from this funnction will be the param that we marked it with this decorator "CurrentLoggedUser" function
        return "fady gamil mahrous"
    }
)