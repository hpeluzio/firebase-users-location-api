import { Controller, Get, Param } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('zipcodes')
export class ZipcodesController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('validate/:zipCode')
  async validate(@Param('zipCode') zipCode: string) {
    return this.weatherService.validateZipCode(zipCode);
  }
}
