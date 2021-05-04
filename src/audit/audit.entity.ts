import 'reflect-metadata';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import JSON from 'graphql-type-json';

@ObjectType()
export class Audit {
    @Field(type => ID)
    audit_id: number

    @Field(type => String, {nullable: true})
    login_id?: number

    @Field(type => String, {nullable: true})
    status?: string 

    @Field(type => Date, {nullable: true})
    created_at?: Date

    @Field(type => String, {nullable: true})
    type?: string

    @Field(type => String, {nullable: true})
    username?: string

    @Field(type => String, {nullable: true})
    role?: string

    @Field(type => String, {nullable: true})
    has_twofactor?: number
}