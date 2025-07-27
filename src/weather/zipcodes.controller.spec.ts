import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ZipcodesController } from './zipcodes.controller';
import { WeatherService } from './weather.service';

describe('ZipcodesController (e2e)', () => {
  let app: INestApplication;
  let weatherService: WeatherService;

  const mockWeatherService = {
    validateZipCode: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ZipcodesController],
      providers: [
        {
          provide: WeatherService,
          useValue: mockWeatherService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    weatherService = moduleFixture.get<WeatherService>(WeatherService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /zipcodes/validate/:zipCode', () => {
    it('should return valid result for valid zip code', async () => {
      const mockValidationResult = {
        valid: true,
        latitude: 40.7505,
        longitude: -73.9934,
        timezone: 'America/New_York',
      };

      mockWeatherService.validateZipCode.mockResolvedValue(
        mockValidationResult,
      );

      const response = await request(app.getHttpServer())
        .get('/zipcodes/validate/10001')
        .expect(200);

      expect(response.body).toEqual(mockValidationResult);
      expect(weatherService.validateZipCode).toHaveBeenCalledWith('10001');
    });

    it('should return invalid result for invalid zip code', async () => {
      const mockValidationResult = {
        valid: false,
        message:
          'Zip code "99999" not found. Please enter a valid US zip code.',
      };

      mockWeatherService.validateZipCode.mockResolvedValue(
        mockValidationResult,
      );

      const response = await request(app.getHttpServer())
        .get('/zipcodes/validate/99999')
        .expect(200);

      expect(response.body).toEqual(mockValidationResult);
      expect(weatherService.validateZipCode).toHaveBeenCalledWith('99999');
    });

    it('should handle service errors gracefully', async () => {
      mockWeatherService.validateZipCode.mockRejectedValue(
        new Error('Service error'),
      );

      await request(app.getHttpServer())
        .get('/zipcodes/validate/10001')
        .expect(500);
    });
  });
});
