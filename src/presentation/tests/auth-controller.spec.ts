import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../controllers';
import { AuthService } from '../services/auth.service';
import { CreateUserDto, CreateUserResponseDto } from '../dtos';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: Partial<AuthService>;

  beforeEach(async () => {
    authService = {
      register: jest.fn().mockResolvedValue({
        id: '1',
        email: 'test@email.com',
        message: 'User created',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should register a user and return response', async () => {
    const dto: CreateUserDto = {
      email: 'test@email.com',
      password: 'Abcdef1!',
    } as CreateUserDto;

    const result = await controller.registerUser(dto);

    expect(authService.register).toHaveBeenCalledWith(dto);
    expect(result).toEqual({
      id: '1',
      email: 'test@email.com',
      message: 'User created',
    });
  });

  it('should throw if register fails', async () => {
    (authService.register as jest.Mock).mockRejectedValueOnce(
      new Error('Register failed'),
    );
    const dto: CreateUserDto = {
      email: 'fail@email.com',
      password: 'Abcdef1!',
    } as CreateUserDto;

    await expect(controller.registerUser(dto)).rejects.toThrow(
      'Register failed',
    );
  });
});
