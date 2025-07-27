import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { ZipcodesController } from './zipcodes.controller';

@Module({
  providers: [WeatherService],
  controllers: [ZipcodesController],
  exports: [WeatherService],
})
export class WeatherModule {}
