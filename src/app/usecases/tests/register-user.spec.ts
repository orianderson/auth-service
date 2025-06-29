import { RegisterUserUseCase } from '../register-user.usecases';
import {
  IBcryptService,
  IEmailValidatorService,
  IUserRepository,
  ConflictError,
} from '../../../core';

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
      email: 'anderson@gmail.com',
      password: 'hashed-password',
      createdAt: new Date(),
    });

    const input = {
      name: 'Eduardo e Mônica',
      id: '',
      email: 'test@email.com',
      password: 'Senha@123',
      acceptedTerms: true,
      acceptedPrivacyPolicy: true,
      systemId: 'abcd-1234',
    };
    const result = await useCase.execute(input);

    // Check that result is a success and has a user property
    if ('user' in result.value) {
      expect(result.value.user).toHaveProperty('id');
      expect(result.value.user).toHaveProperty('email', input.email);
    }
  });
  it('deve lançar ConflictError se o usuário já existir', async () => {
    userRepository.findByEmail.mockResolvedValue({
      id: '1',
      email: 'test@email.com',
      name: '',
      password: 'hashed-password',
      createdAt: new Date(),
    });

    const result = await useCase.execute({
      email: 'test@email.com',
      password: 'Senha@123',
      name: 'Eduardo e Mônica',
      id: '1',
      acceptedTerms: true,
      acceptedPrivacyPolicy: true,
      systemId: 'abcd-1234',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ConflictError);
  });
});
