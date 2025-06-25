import { RegisterUserUseCase } from '../register-user.usecases';
import {
  IBcryptService,
  IEmailValidatorService,
  IUserRepository,
} from '../../../core';
import { ConflictException, BadRequestException } from '../../helpers';

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let bcrypt: jest.Mocked<IBcryptService>;
  let emailValidator: jest.Mocked<IEmailValidatorService>;

  const mockBcryptService: IBcryptService = {
    hash: jest.fn(async (pw: string) => Promise.resolve(`hashed-${pw}`)),
    compare: jest.fn(async (pw: string, hash: string) =>
      Promise.resolve(hash === `hashed-${pw}`),
    ),
  };

  const mockEmailValidator: IEmailValidatorService = {
    isEmailValid: jest.fn((email: string) => email.includes('@')),
  };
  const mockUserRepository: IUserRepository = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    useCase = new RegisterUserUseCase(
      mockBcryptService,
      mockEmailValidator,
      mockUserRepository,
    );
    userRepository = mockUserRepository as jest.Mocked<IUserRepository>;
    bcrypt = mockBcryptService as jest.Mocked<IBcryptService>;
    emailValidator = mockEmailValidator as jest.Mocked<IEmailValidatorService>;
  });

  it('deve registrar um novo usuário com sucesso', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    emailValidator.isEmailValid.mockReturnValue(true);
    bcrypt.hash.mockResolvedValue('hashed-password');
    userRepository.create.mockResolvedValue({
      id: '1',
      email: 'test@email.com',
      password: 'hashed-password',
      createdAt: new Date(),
    });

    const input = { email: 'test@email.com', password: 'Senha@123' };
    const result = await useCase.execute(input);

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('email', input.email);
  });

  it('deve lançar ConflictException se o usuário já existir', async () => {
    userRepository.findByEmail.mockResolvedValue({
      id: '1',
      email: 'test@email.com',
      password: 'hashed-password',
      createdAt: new Date(),
    });

    await expect(
      useCase.execute({ email: 'test@email.com', password: 'Senha@123' }),
    ).rejects.toThrow(ConflictException);
  });
});
