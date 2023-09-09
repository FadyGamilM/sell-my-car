import { log } from "console"
import { PrimaryGeneratedColumn, Column, Entity, AfterInsert, AfterRemove, AfterUpdate } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    @Column()
    password: string


    @AfterInsert()
    LogAfterInsert() {
        log(`new user has been persisted with id = ${this.id} and email = ${this.email}`)
    }

    @AfterUpdate()
    LogAfterUpdate() {
        log(`user has been updated with id = ${this.id} and email = ${this.email}`)
    }

    @AfterRemove()
    LogAfterRemove() {
        log(`user has been removed with id = ${this.id} and email = ${this.email}`)
    }
}