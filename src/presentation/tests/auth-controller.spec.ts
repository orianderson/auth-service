import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../controllers';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from '../dtos';

describe('AuthController', () => {
  let controller: AuthController;
  let userService: Partial<AuthService>;

  beforeEach(async () => {
    userService = {
      register: jest.fn().mockResolvedValue({
        id: '1',
        email: 'test@email.com',
        message: 'User created',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: userService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should register a user and return response', async () => {
    const dto: CreateUserDto = {
      email: 'test@email.com',
      password: 'Abcdef1!',
    } as CreateUserDto;
    const send = jest.fn();
    const code = jest.fn(() => ({ send }));

    await controller.registerUser(dto);

    expect(userService.register).toHaveBeenCalledWith(dto);
    expect(code).toHaveBeenCalledWith(201);
    expect(send).toHaveBeenCalledWith({
      id: '1',
      email: 'test@email.com',
      message: 'User created',
    });
  });
});
