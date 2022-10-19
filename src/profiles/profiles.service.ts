import { Injectable } from '@nestjs/common'
import { CreateProfileDto } from './dto/create-profile.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { BaseFirestoreRepository, getRepository } from 'fireorm'
import { Profile } from './entities/profile.entity'
import { getFirebaseApp } from '../utils/firebase'
import { getAuth, UserRecord } from 'firebase-admin/lib/auth'

@Injectable()
export class ProfilesService {
  profileRepository: BaseFirestoreRepository<Profile>

  constructor() {
    this.profileRepository = getRepository(Profile)
  }

  async create(createProfileDto: CreateProfileDto) {
    // return this.profileRepository.create(createProfileDto)
    const { email, password, username } = createProfileDto
    let userFirebase: UserRecord | null

    try {
      // save to firebase
      userFirebase = await getAuth().createUser({
        email,
        emailVerified: false,
        password,
        displayName: username,
        disabled: false
      })
      // save local
      return await this.profileRepository.create({
        ...createProfileDto,
        id: userFirebase.uid
      })
    } catch (err) {
      if (userFirebase) {
        await getAuth().deleteUser(userFirebase.uid)
      }
      throw err
    }
  }

  findAll() {
    return `This action returns all profiles`
  }

  findOne(id: string) {
    return this.profileRepository.findById(id)
  }

  async update(id: string, updateProfileDto: UpdateProfileDto) {
    const target = await this.profileRepository.findById(id)
    Object.assign(target, updateProfileDto)
    try {
      await getAuth().updateUser(id, updateProfileDto)
      return await this.profileRepository.update(target)
    } catch (e) {
      console.error('Error updating user:', e)
      throw e
    }
  }

  async remove(id: string) {
    try {
      await getAuth().deleteUser(id)
      return await this.profileRepository.delete(id)
    } catch (e) {
      console.error('Error deleting user:', e)
      throw e
    }
  }
}
