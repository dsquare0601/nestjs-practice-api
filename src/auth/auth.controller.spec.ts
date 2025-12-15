import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    refreshTokens: jest.fn(),
    logout: jest.fn(),
  };

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
    getOrThrow: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto = {
        email: 'test@test.com',
        password: 'password123',
        name: 'Test User',
        confirmPassword: 'password123',
      };

      const mockUser = {
        id: 1,
        email: 'test@test.com',
        name: 'Test User',
      };

      mockAuthService.register.mockResolvedValue(mockUser);

      const result = await controller.register(registerDto);

      expect(service.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('login', () => {
    it('should login user and return tokens', async () => {
      const loginDto = {
        email: 'test@test.com',
        password: 'password123',
      };

      const mockTokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      mockAuthService.login.mockResolvedValue(mockTokens);

      const result = await controller.login(loginDto);

      expect(service.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(mockTokens);
    });
  });

  describe('refresh', () => {
    it('should refresh tokens', async () => {
      const req = { user: { userId: 1 } };
      const refreshToken = 'old-refresh-token';

      const mockTokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      mockAuthService.refreshTokens.mockResolvedValue(mockTokens);

      const result = await controller.refresh(req, refreshToken);

      expect(service.refreshTokens).toHaveBeenCalledWith(1, refreshToken);
      expect(result).toEqual(mockTokens);
    });
  });

  describe('logout', () => {
    it('should logout user', async () => {
      const req = { user: { userId: 1 } };

      mockAuthService.logout.mockResolvedValue(undefined);

      await controller.logout(req);

      expect(service.logout).toHaveBeenCalledWith(1);
    });
  });
});
