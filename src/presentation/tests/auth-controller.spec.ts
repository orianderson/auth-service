import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../controllers';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos';
import { FastifyReply } from 'fastify';

describe('AuthController', () => {
  let controller: AuthController;
  let userService: Partial<UserService>;

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
      providers: [{ provide: UserService, useValue: userService }],
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
    const reply = { code } as unknown as FastifyReply;

    await controller.registerUser(dto, reply);

    expect(userService.register).toHaveBeenCalledWith(dto);
    expect(code).toHaveBeenCalledWith(201);
    expect(send).toHaveBeenCalledWith({
      id: '1',
      email: 'test@email.com',
      message: 'User created',
    });
  });
});
