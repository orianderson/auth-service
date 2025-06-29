import { UserProps } from './user-props';

export class UserEntity {
  private props: UserProps;

  constructor(props: UserProps) {
    this.props = { ...props };
  }

  get id() {
    return this.props.id;
  }
  get email() {
    return this.props.email;
  }
  get name() {
    return this.props.name;
  }
  get acceptedTerms() {
    return this.props.acceptedTerms;
  }
  get acceptedPrivacyPolicy() {
    return this.props.acceptedPrivacyPolicy;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  setPassword(hash: string) {
    this.props.password = hash;
    this.props.updatedAt = new Date();
  }

  acceptTermsAndPrivacy() {
    this.props.acceptedTerms = true;
    this.props.acceptedPrivacyPolicy = true;
    this.props.updatedAt = new Date();
  }

  getPasswordForPersistence() {
    return this.props.password;
  }

  toJSON() {
    const {
      password,
      acceptedPrivacyPolicy,
      acceptedTerms,
      updatedAt,
      ...rest
    } = this.props;
    return rest;
  }
}
