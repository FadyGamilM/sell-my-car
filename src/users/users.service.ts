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
    async Create(email: string, password: string) {
        const createdUser: User = this.repo.create({ email, password })
        return await this.repo.save(createdUser)
    }

    // find user by id 
    async FindByID(id: number) {
        return await this.repo.findOneBy({ id: id })
    }

    // find user by email 
    async FindByEmail(email: string) {
        return await this.repo.findOneBy({ email: email })
    }

    // update user 
    async UpdateByID(id: number, args: Partial<User>) {
        // so we need to apply hooks to know which i
        const userToUpdate = await this.FindByID(id)
        if (!userToUpdate) {
            throw new Error('user not found')
        }
        // update the props of this user by copying the props of userToUpdate instance first and then override via the properties that are present in the args instance
        const updatedUser = { ...userToUpdate, ...args }
        // call the save method on this updated instance 
        return this.repo.save(updatedUser)
    }

    // remove user 
    async DeleteByID(id: number) {
        const userToDelete = await this.FindByID(id)
        if (!userToDelete) {
            throw new Error("user not found")
        }

        return await this.repo.remove(userToDelete)
    }
}


// this.repo.find({}) ==> will find all records that matches the given criteria
// this.repo.findOne({}) ==> will find only one record that matches the given criteria