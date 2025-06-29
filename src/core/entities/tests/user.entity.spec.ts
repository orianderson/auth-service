import { UserEntity } from '../user.entity';
import { UserProps } from '../user-props';

describe('UserEntity', () => {
  const baseProps: UserProps = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword',
    createdAt: new Date('2024-01-01T00:00:00Z'),
    acceptedTerms: false,
    acceptedPrivacyPolicy: false,
    systemId: 'system-xyz',
  };

  it('should_return_correct_properties_after_instantiation', () => {
    const user = new UserEntity(baseProps);

    expect(user.id).toBe(baseProps.id);
    expect(user.email).toBe(baseProps.email);
    expect(user.name).toBe(baseProps.name);
    expect(user.acceptedTerms).toBe(baseProps.acceptedTerms);
    expect(user.acceptedPrivacyPolicy).toBe(baseProps.acceptedPrivacyPolicy);
    expect(user.createdAt).toEqual(baseProps.createdAt);
    expect(user.updatedAt).toBeUndefined();
  });

  it('should_update_password_and_updatedAt_when_setPassword_is_called', () => {
    const user = new UserEntity(baseProps);
    const oldUpdatedAt = user.updatedAt;
    const newPassword = 'newHashedPassword';

    user.setPassword(newPassword);

    expect(user.getPasswordForPersistence()).toBe(newPassword);
    expect(user.updatedAt).toBeInstanceOf(Date);
    if (oldUpdatedAt) {
      expect(user.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
    } else {
      expect(user.updatedAt).not.toBeUndefined();
    }
  });

  it('should_accept_terms_and_privacy_and_update_updatedAt', () => {
    const user = new UserEntity(baseProps);
    user.acceptTermsAndPrivacy();

    expect(user.acceptedTerms).toBe(true);
    expect(user.acceptedPrivacyPolicy).toBe(true);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  it('should_omit_password_field_in_toJSON_output', () => {
    const user = new UserEntity(baseProps);
    const json = user.toJSON();

    expect(json).not.toHaveProperty('password');
    expect(json).toMatchObject({
      id: baseProps.id,
      email: baseProps.email,
      name: baseProps.name,
      createdAt: baseProps.createdAt,
      acceptedTerms: baseProps.acceptedTerms,
      acceptedPrivacyPolicy: baseProps.acceptedPrivacyPolicy,
      systemId: baseProps.systemId,
    });
  });

  it('should_return_undefined_for_updatedAt_if_not_set', () => {
    const user = new UserEntity(baseProps);
    expect(user.updatedAt).toBeUndefined();
  });

  it('should_initialize_updatedAt_when_mutation_methods_are_called_and_it_was_undefined', () => {
    const user = new UserEntity(baseProps);

    user.setPassword('anotherPassword');
    expect(user.updatedAt).toBeInstanceOf(Date);

    // Reset updatedAt to undefined and test acceptTermsAndPrivacy
    const { updatedAt, ...propsWithoutUpdatedAt } = baseProps;
    const user2 = new UserEntity(propsWithoutUpdatedAt as UserProps);

    user2.acceptTermsAndPrivacy();
    expect(user2.updatedAt).toBeInstanceOf(Date);
  });
});
