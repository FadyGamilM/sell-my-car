import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { User } from './user.entity';
import { log } from 'console';
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private repo: Repository<User>
    ) { }

    // method to create and persist an User
    async Create(email: string, password: string) {
        const createdUser: User = this.repo.create({ email, password })
        log("calling the create user service with email => ", email)
        return await this.repo.save(createdUser)
    }

    // find user by id 
    async FindByID(id: number) {
        const foundUser = await this.repo.findOneBy({ id: id })
        if (!foundUser) {
            throw new NotFoundException('user not found')
        }
        return foundUser
    }

    // find user by email (utilized by the user service when the only purpose of the requet is to check if there is an user with this email because it returns an exception if this user is not here)
    async FindByEmail(email: string) {
        const foundUser = await this.repo.findOneBy({ email: email })
        if (!foundUser) {
            throw new NotFoundException('user not found')
        }
        return foundUser
    }

    // find user by email (utilized by auth service and any other service that relies on this method as an internal step in its logic because we don't want to receive an exception, we just want to know if this user exists or not to take actions based on the result)
    async CheckIfEmailIsRegistered(email : string) : Promise<Boolean> {
        const foundUser = await this.repo.findOneBy({ email: email })
        if (!foundUser) {
            return true
        }
        return false
    }

    // update user 
    async UpdateByID(id: number, args: Partial<User>) {
        // so we need to apply hooks to know which i
        const userToUpdate = await this.FindByID(id)
        if (!userToUpdate) {
            throw new NotFoundException('user not found')
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