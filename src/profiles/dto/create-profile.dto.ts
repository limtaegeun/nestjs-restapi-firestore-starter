export class CreateProfileDto {
  username: string
  email: string
  password: string
  aboutMe: string
  events: string[]
  gender: string
  lookFor: string
  age: number
  tags: string[]
}
