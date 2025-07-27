import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { WeatherService } from '../weather/weather.service';
import { database } from '../config/firebase.config';

@Injectable()
export class UsersService {
  private readonly usersRef = database.ref('users');

  constructor(private readonly weatherService: WeatherService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const locationData = await this.weatherService.getLocationData(
      createUserDto.zipCode,
    );

    const user: User = {
      id: this.generateId(),
      name: createUserDto.name,
      zipCode: createUserDto.zipCode,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      timezone: locationData.timezone,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to Firebase
    await this.usersRef.child(user.id).set(user);
    return user;
  }

  async findAll(): Promise<User[]> {
    const snapshot = await this.usersRef.once('value');
    const users = snapshot.val() as Record<string, User> | null;
    return users ? Object.values(users) : [];
  }

  async findOne(id: string): Promise<User> {
    const snapshot = await this.usersRef.child(id).once('value');
    const user = snapshot.val() as User | null;

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Check if user exists
    const existingUser = await this.findOne(id);

    // If zip code is being updated, fetch new location data
    if (
      updateUserDto.zipCode &&
      updateUserDto.zipCode !== existingUser.zipCode
    ) {
      const locationData = await this.weatherService.getLocationData(
        updateUserDto.zipCode,
      );
      existingUser.latitude = locationData.latitude;
      existingUser.longitude = locationData.longitude;
      existingUser.timezone = locationData.timezone;
      existingUser.zipCode = updateUserDto.zipCode;
    }

    // Update other fields
    if (updateUserDto.name) {
      existingUser.name = updateUserDto.name;
    }

    existingUser.updatedAt = new Date();

    // Update in Firebase
    await this.usersRef.child(id).update(existingUser);
    return existingUser;
  }

  async remove(id: string): Promise<void> {
    // Check if user exists
    await this.findOne(id);

    // Delete from Firebase
    await this.usersRef.child(id).remove();
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
