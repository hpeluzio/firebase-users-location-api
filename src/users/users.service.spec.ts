import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { WeatherService } from '../weather/weather.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;

  const mockWeatherService = {
    getLocationData: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: WeatherService,
          useValue: mockWeatherService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a user with location data', async () => {
      const createUserDto = {
        name: 'John Doe',
        zipCode: '10001',
      };

      const mockLocationData = {
        latitude: 40.7505,
        longitude: -73.9934,
        timezone: 'America/New_York',
      };

      mockWeatherService.getLocationData.mockResolvedValue(mockLocationData);

      const result = await service.create(createUserDto);

      expect(result).toMatchObject({
        name: 'John Doe',
        zipCode: '10001',
        latitude: 40.7505,
        longitude: -73.9934,
        timezone: 'America/New_York',
      });
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(mockWeatherService.getLocationData).toHaveBeenCalledWith('10001');
    });

    it('should throw error when weather service fails', async () => {
      const createUserDto = {
        name: 'John Doe',
        zipCode: '99999',
      };

      mockWeatherService.getLocationData.mockRejectedValue(
        new Error('Invalid zip code'),
      );

      await expect(service.create(createUserDto)).rejects.toThrow(
        'Invalid zip code',
      );
    });
  });

  describe('update', () => {
    it('should update user name only', async () => {
      const updateUserDto = {
        name: 'Jane Doe',
      };

      // Mock the findOne method to return a user
      const mockUser = {
        id: 'test-id',
        name: 'John Doe',
        zipCode: '10001',
        latitude: 40.7505,
        longitude: -73.9934,
        timezone: 'America/New_York',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the service methods
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);

      const result = await service.update('test-id', updateUserDto);

      expect(result).toMatchObject({
        id: 'test-id',
        name: 'Jane Doe',
        zipCode: '10001',
      });
      expect(mockWeatherService.getLocationData).not.toHaveBeenCalled();
    });

    it('should update user zip code and re-fetch location data', async () => {
      const updateUserDto = {
        zipCode: '90210',
      };

      const mockUser = {
        id: 'test-id',
        name: 'John Doe',
        zipCode: '10001',
        latitude: 40.7505,
        longitude: -73.9934,
        timezone: 'America/New_York',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const newLocationData = {
        latitude: 34.0901,
        longitude: -118.4065,
        timezone: 'America/Los_Angeles',
      };

      // Mock the service methods
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);
      mockWeatherService.getLocationData.mockResolvedValue(newLocationData);

      const result = await service.update('test-id', updateUserDto);

      expect(result).toMatchObject({
        id: 'test-id',
        name: 'John Doe',
        zipCode: '90210',
        latitude: 34.0901,
        longitude: -118.4065,
        timezone: 'America/Los_Angeles',
      });
      expect(mockWeatherService.getLocationData).toHaveBeenCalledWith('90210');
    });

    it('should throw NotFoundException for non-existent user', async () => {
      const updateUserDto = {
        name: 'Jane Doe',
      };

      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new NotFoundException('User not found'));

      await expect(
        service.update('non-existent-id', updateUserDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const mockUser = {
        id: 'test-id',
        name: 'John Doe',
        zipCode: '10001',
        latitude: 40.7505,
        longitude: -73.9934,
        timezone: 'America/New_York',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the service methods
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);

      await expect(service.remove('test-id')).resolves.toBeUndefined();
    });

    it('should throw NotFoundException for non-existent user', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new NotFoundException('User not found'));

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
