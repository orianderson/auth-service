export interface UserProps {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt?: Date;
  acceptedTerms: boolean;
  acceptedPrivacyPolicy: boolean;
  systemId: string;
  roleId: string;
}

// Para criação de usuário (quase todos os campos)
export type CreateUserProps = Omit<
  UserProps,
  'id' | 'createdAt' | 'updatedAt' | 'roleid'
>;

// Para atualização de senha (apenas email e senha)
export type UpdatePasswordProps = Pick<UserProps, 'email' | 'password'>;
