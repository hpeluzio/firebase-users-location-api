import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { WeatherService } from '../weather/weather.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let usersService: UsersService;

  const mockWeatherService = {
    getLocationData: jest.fn(),
  };

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: WeatherService,
          useValue: mockWeatherService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    usersService = moduleFixture.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /users', () => {
    it('should create a user', async () => {
      const createUserDto = {
        name: 'John Doe',
        zipCode: '10001',
      };

      const mockUser = {
        id: 'abc123',
        name: 'John Doe',
        zipCode: '10001',
        latitude: 40.7505,
        longitude: -73.9934,
        timezone: 'America/New_York',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.create.mockResolvedValue(mockUser);

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      // Check that the response contains the expected fields (dates will be serialized)
      expect(response.body).toMatchObject({
        id: 'abc123',
        name: 'John Doe',
        zipCode: '10001',
        latitude: 40.7505,
        longitude: -73.9934,
        timezone: 'America/New_York',
      });
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should return 400 for invalid data', async () => {
      const invalidUserDto = {
        name: '',
        zipCode: 'invalid',
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(invalidUserDto)
        .expect(400);
    });
  });

  describe('GET /users', () => {
    it('should return all users', async () => {
      const mockUsers = [
        {
          id: 'abc123',
          name: 'John Doe',
          zipCode: '10001',
          latitude: 40.7505,
          longitude: -73.9934,
          timezone: 'America/New_York',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockUsersService.findAll.mockResolvedValue(mockUsers);

      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      // Check that the response contains the expected fields
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject({
        id: 'abc123',
        name: 'John Doe',
        zipCode: '10001',
        latitude: 40.7505,
        longitude: -73.9934,
        timezone: 'America/New_York',
      });
      expect(response.body[0].createdAt).toBeDefined();
      expect(response.body[0].updatedAt).toBeDefined();
      expect(usersService.findAll).toHaveBeenCalled();
    });
  });

  describe('GET /users/:id', () => {
    it('should return a user by id', async () => {
      const mockUser = {
        id: 'abc123',
        name: 'John Doe',
        zipCode: '10001',
        latitude: 40.7505,
        longitude: -73.9934,
        timezone: 'America/New_York',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.findOne.mockResolvedValue(mockUser);

      const response = await request(app.getHttpServer())
        .get('/users/abc123')
        .expect(200);

      // Check that the response contains the expected fields
      expect(response.body).toMatchObject({
        id: 'abc123',
        name: 'John Doe',
        zipCode: '10001',
        latitude: 40.7505,
        longitude: -73.9934,
        timezone: 'America/New_York',
      });
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
      expect(usersService.findOne).toHaveBeenCalledWith('abc123');
    });

    it('should return 404 for non-existent user', async () => {
      mockUsersService.findOne.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await request(app.getHttpServer()).get('/users/non-existent').expect(404);
    });
  });

  describe('PATCH /users/:id', () => {
    it('should update a user', async () => {
      const updateUserDto = {
        name: 'Jane Doe',
        zipCode: '90210',
      };

      const mockUpdatedUser = {
        id: 'abc123',
        name: 'Jane Doe',
        zipCode: '90210',
        latitude: 34.0901,
        longitude: -118.4065,
        timezone: 'America/Los_Angeles',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.update.mockResolvedValue(mockUpdatedUser);

      const response = await request(app.getHttpServer())
        .patch('/users/abc123')
        .send(updateUserDto)
        .expect(200);

      // Check that the response contains the expected fields
      expect(response.body).toMatchObject({
        id: 'abc123',
        name: 'Jane Doe',
        zipCode: '90210',
        latitude: 34.0901,
        longitude: -118.4065,
        timezone: 'America/Los_Angeles',
      });
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
      expect(usersService.update).toHaveBeenCalledWith('abc123', updateUserDto);
    });

    it('should return 404 for non-existent user', async () => {
      const updateUserDto = {
        name: 'Jane Doe',
      };

      mockUsersService.update.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await request(app.getHttpServer())
        .patch('/users/non-existent')
        .send(updateUserDto)
        .expect(404);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete a user', async () => {
      mockUsersService.remove.mockResolvedValue(undefined);

      await request(app.getHttpServer()).delete('/users/abc123').expect(200);

      expect(usersService.remove).toHaveBeenCalledWith('abc123');
    });

    it('should return 404 for non-existent user', async () => {
      mockUsersService.remove.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await request(app.getHttpServer())
        .delete('/users/non-existent')
        .expect(404);
    });
  });
});
