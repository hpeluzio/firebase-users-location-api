import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock axios.isAxiosError
jest.spyOn(axios, 'isAxiosError').mockImplementation((error: any) => {
  return error && error.isAxiosError === true;
});

describe('WeatherService', () => {
  let service: WeatherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeatherService],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getLocationData', () => {
    it('should fetch location data for valid zip code', async () => {
      const mockResponse = {
        data: {
          coord: {
            lat: 40.7505,
            lon: -73.9934,
          },
          timezone: -18000, // UTC-5
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await service.getLocationData('10001');

      expect(result).toEqual({
        latitude: 40.7505,
        longitude: -73.9934,
        timezone: 'UTC-05:00',
      });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.openweathermap.org/data/2.5/weather',
        {
          params: {
            zip: '10001,us',
            appid: '7afa46f2e91768e7eeeb9001ce40de19',
          },
        },
      );
    });

    it('should handle positive timezone offset', async () => {
      const mockResponse = {
        data: {
          coord: {
            lat: 34.0901,
            lon: -118.4065,
          },
          timezone: 28800, // UTC+8
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await service.getLocationData('90210');

      expect(result).toEqual({
        latitude: 34.0901,
        longitude: -118.4065,
        timezone: 'UTC+08:00',
      });
    });

    it('should throw error for invalid zip code (404)', async () => {
      const mockError = {
        isAxiosError: true,
        response: {
          status: 404,
        },
      };

      mockedAxios.get.mockRejectedValue(mockError);

      await expect(service.getLocationData('99999')).rejects.toThrow(
        'Zip code "99999" not found. Please enter a valid US zip code.',
      );
    });

    it('should throw error for API authentication failure (401)', async () => {
      const mockError = {
        isAxiosError: true,
        response: {
          status: 401,
        },
        message: 'Request failed with status code 401',
      };

      mockedAxios.get.mockRejectedValue(mockError);

      await expect(service.getLocationData('10001')).rejects.toThrow(
        'Weather service authentication failed. Please contact support.',
      );
    });

    it('should throw generic error for other failures', async () => {
      const mockError = new Error('Network error');

      mockedAxios.get.mockRejectedValue(mockError);

      await expect(service.getLocationData('10001')).rejects.toThrow(
        'Failed to fetch location data for zip code "10001". Please try again or contact support.',
      );
    });
  });

  describe('validateZipCode', () => {
    it('should return valid result for valid zip code', async () => {
      const mockResponse = {
        data: {
          coord: {
            lat: 40.7505,
            lon: -73.9934,
          },
          timezone: -18000,
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await service.validateZipCode('10001');

      expect(result).toEqual({
        valid: true,
        latitude: 40.7505,
        longitude: -73.9934,
        timezone: 'UTC-05:00',
      });
    });

    it('should return invalid result for invalid zip code', async () => {
      const mockError = {
        isAxiosError: true,
        response: {
          status: 404,
        },
        message:
          'Zip code "99999" not found. Please enter a valid US zip code.',
      };

      mockedAxios.get.mockRejectedValue(mockError);

      const result = await service.validateZipCode('99999');

      expect(result).toEqual({
        valid: false,
        message:
          'Zip code "99999" not found. Please enter a valid US zip code.',
      });
    });

    it('should return generic error message for unknown errors', async () => {
      const mockError = new Error('Network error');

      mockedAxios.get.mockRejectedValue(mockError);

      const result = await service.validateZipCode('10001');

      expect(result).toEqual({
        valid: false,
        message:
          'Failed to fetch location data for zip code "10001". Please try again or contact support.',
      });
    });
  });

  describe('getTimezoneOffset', () => {
    it('should convert positive timezone offset correctly', () => {
      const result = service['getTimezoneOffset'](28800); // UTC+8
      expect(result).toBe('UTC+08:00');
    });

    it('should convert negative timezone offset correctly', () => {
      const result = service['getTimezoneOffset'](-18000); // UTC-5
      expect(result).toBe('UTC-05:00');
    });

    it('should handle zero timezone offset', () => {
      const result = service['getTimezoneOffset'](0); // UTC
      expect(result).toBe('UTC+00:00');
    });
  });
});
