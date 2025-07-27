import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

export interface LocationData {
  latitude: number;
  longitude: number;
  timezone: string;
}

@Injectable()
export class WeatherService {
  private readonly apiKey = '7afa46f2e91768e7eeeb9001ce40de19';
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

  async getLocationData(zipCode: string): Promise<LocationData> {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          zip: `${zipCode},us`,
          appid: this.apiKey,
        },
      });

      const { coord, timezone } = response.data as {
        coord: { lat: number; lon: number };
        timezone: number;
      };

      return {
        latitude: coord.lat,
        longitude: coord.lon,
        timezone: this.getTimezoneOffset(timezone),
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new HttpException(
            `Zip code "${zipCode}" not found. Please enter a valid US zip code.`,
            HttpStatus.BAD_REQUEST,
          );
        }
        if (error.response?.status === 401) {
          throw new HttpException(
            'Weather service authentication failed. Please contact support.',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }

      throw new HttpException(
        `Failed to fetch location data for zip code "${zipCode}". Please try again or contact support.`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async validateZipCode(zipCode: string): Promise<{
    valid: boolean;
    latitude?: number;
    longitude?: number;
    timezone?: string;
    message?: string;
  }> {
    try {
      const location = await this.getLocationData(zipCode);
      return {
        valid: true,
        latitude: location.latitude,
        longitude: location.longitude,
        timezone: location.timezone,
      };
    } catch (error: unknown) {
      let message = 'Invalid zip code';
      if (typeof error === 'object' && error !== null && 'message' in error) {
        message = String((error as { message?: unknown }).message);
      }
      return {
        valid: false,
        message,
      };
    }
  }

  private getTimezoneOffset(timezoneOffset: number): string {
    // Convert timezone offset to timezone string
    const hours = Math.abs(timezoneOffset) / 3600;
    const sign = timezoneOffset >= 0 ? '+' : '-';
    return `UTC${sign}${hours.toString().padStart(2, '0')}:00`;
  }
}
