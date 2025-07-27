import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { WeatherModule } from './weather/weather.module';

@Module({
  imports: [UsersModule, WeatherModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
