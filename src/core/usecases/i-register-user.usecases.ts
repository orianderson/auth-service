export interface IRegisterUserUseCase {
  execute(input: RegisterUserInput): Promise<RegisterUserOutput>;
}

export type RegisterUserInput = {
  email: string;
  password: string;
};

export type RegisterUserOutput = {
  id?: string;
  email: string;
  createdAt?: Date;
};
