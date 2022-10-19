import { Collection } from 'fireorm'
import { IsArray, IsEmail, IsInt, IsString, Max, Min } from 'class-validator'

@Collection('profiles')
export class Profile {
  @IsString()
  id!: string

  @IsString()
  username: string

  @IsEmail()
  email: string
}
