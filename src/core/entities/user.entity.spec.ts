import { UserEntity, UserProps } from './user.entity';
import { IBcryptService, IEmailValidatorService } from '../services';
import { left } from '../helpers';
import { InvalidEmailError, InvalidPasswordError } from '../errors';

const mockBcryptService: IBcryptService = {
  hash: jest.fn(async (pw: string) => Promise.resolve(`hashed-${pw}`)),
  compare: jest.fn(async (pw: string, hash: string) =>
    Promise.resolve(hash === `hashed-${pw}`),
  ),
};

const mockEmailValidator: IEmailValidatorService = {
  isEmailValid: jest.fn((email: string) => email.includes('@')),
};

describe('UserEntity', () => {
  it('deve criar usuário válido', async () => {
    const props: UserProps = { email: 'test@email.com', password: 'Abc@1234' };
    const result = await UserEntity.create(
      props,
      mockEmailValidator,
      mockBcryptService,
    );
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value).toBeInstanceOf(UserEntity);
    }
  });

  it('deve falhar com email inválido', async () => {
    (mockEmailValidator.isEmailValid as jest.Mock).mockReturnValueOnce(false);
    const props: UserProps = { email: 'invalid', password: 'Abc@1234' };
    const result = await UserEntity.create(
      props,
      mockEmailValidator,
      mockBcryptService,
    );
    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InvalidEmailError);
    }
  });

  it('deve falhar com senha fraca', async () => {
    const props: UserProps = { email: 'test@email.com', password: 'weak' };
    const result = await UserEntity.create(
      props,
      mockEmailValidator,
      mockBcryptService,
    );
    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InvalidPasswordError);
    }
  });

  it('deve validar credenciais corretamente', async () => {
    const props: UserProps = { email: 'test@email.com', password: 'Abc@1234' };
    const userResult = await UserEntity.create(
      props,
      mockEmailValidator,
      mockBcryptService,
    );
    if (userResult.isRight()) {
      const user = userResult.value;
      const isValid = await user.validateCredentials(
        'Abc@1234',
        mockBcryptService,
      );
      expect(isValid).toBe(true);
    }
  });
});
