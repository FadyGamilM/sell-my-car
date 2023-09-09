import { Injectable } from '@nestjs/common';

import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { User } from './user.entity';
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private repo: Repository<User>
    ) { }

    // method to create and persist an User
    Create(email: string, password: string) {
        const createdUser: User = this.repo.create({ email, password })
        return this.repo.save(createdUser)
    }
}


