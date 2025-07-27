import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { WeatherService } from '../weather/weather.service';

@Injectable()
export class UsersService {
  private users: User[] = [];

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

    this.users.push(user);
    return user;
  }

  findAll(): Promise<User[]> {
    return Promise.resolve(this.users);
  }

  findOne(id: string): Promise<User> {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return Promise.resolve(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const user = this.users[userIndex];

    // If zip code is being updated, fetch new location data
    if (updateUserDto.zipCode && updateUserDto.zipCode !== user.zipCode) {
      const locationData = await this.weatherService.getLocationData(
        updateUserDto.zipCode,
      );
      user.latitude = locationData.latitude;
      user.longitude = locationData.longitude;
      user.timezone = locationData.timezone;
      user.zipCode = updateUserDto.zipCode;
    }

    // Update other fields
    if (updateUserDto.name) {
      user.name = updateUserDto.name;
    }

    user.updatedAt = new Date();
    this.users[userIndex] = user;

    return user;
  }

  remove(id: string): Promise<void> {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    this.users.splice(userIndex, 1);
    return Promise.resolve();
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
