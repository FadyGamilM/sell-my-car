import {Injectable, NotFoundException} from "@nestjs/common"
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


    async Signin(email: string, password: string ) {
        // 1. check if there is an user registered with this email in our system or not
        const foundUser : User = await this.userService.FindByEmail(email)
        if (!foundUser) {
            throw new NotFoundException("user not found")
        }

        // 2. extract the hashed stored password in our db 
        const dbHashedPassword : string = foundUser.password

        // 3. split to get the [salt + hashing(passowrd + salt)]
        const  salt : string = dbHashedPassword.split("*")[0]
        const HashedPassWithSalt : string = dbHashedPassword.split("*")[1]

        // 4. hash the signin password with the same scrypt method and with the same salt 
        const signinHashedPassword : string  = ((await hashFunction(password, salt, 32)) as Buffer).toString("hex")

        // 5. compare the signin hashed combination password with the db hashed combination password 
        if (signinHashedPassword !== HashedPassWithSalt) {
            throw new BadRequestException("invalid credentials")
        }

        return foundUser
    }
}
