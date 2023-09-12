import {Injectable} from "@nestjs/common"
import { UsersService } from "./users.service";
import { randomBytes, scrypt } from "crypto";
import { User } from "./user.entity";
import {BadRequestException} from "@nestjs/common"
import {promisify} from "util"
import { log } from "console";

// make the scrypt hash function returns promise to avoid working with its callback syntax
const hashFunction = promisify(scrypt)

@Injectable()
export class AuthService {
    constructor(private userService : UsersService){}

    // signup a user 
    // @Params => email : string, password : string
    // @Steps =>
    /**
     * 1. Fetch user by email to check if the passed email is already registered or not 
     * 2. Generate a random salt to avoid the rainbow table attack
     * 3. Hash the merge of the password along with the generated salt 
     * 4. Join the hashed result from step.3 with the original salt
     * 5. Create a new user via the user service 
     * 6. Store the result of step.4 into the created user (and specify which the salt and which the password by separating them with any separator like . or / or -)
     * 7. Save the created user into the database and return it 
     */
    async Signup (email :string, password : string){
        // 1.
        const isRegistered : Boolean = await this.userService.CheckIfEmailIsRegistered(email)
        if (!isRegistered) {
            throw new BadRequestException("user already exists")
        }

        // 2.
        const salt : string = randomBytes(8).toString("hex")

        // 3. 
        const hashedPassword = (await hashFunction(password, salt, 32)) as Buffer

        // 4. 
        const dbHashedPassword : string = salt + "*" + hashedPassword.toString("hex")

        // 5. & 6.
        const user : User = await this.userService.Create(email, dbHashedPassword)

        // 6. 
        return user
    }
}
