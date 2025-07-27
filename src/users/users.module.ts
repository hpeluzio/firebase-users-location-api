import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { WeatherService } from '../weather/weather.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, WeatherService],
  exports: [UsersService],
})
export class UsersModule {}
