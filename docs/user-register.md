Excelente! Vamos implementar um fluxo completo de registro de usuário utilizando as entidades e domínios que definimos.

## **Fluxo de Registro de Usuário**

### **1. Eventos de Domínio para Registro**

```typescript
// domain/events/user-registration-events.ts
class UserRegistrationStartedEvent implements DomainEvent {
  constructor(
    public readonly userId: UserId,
    public readonly email: Email,
    public readonly occurredOn: Date = new Date(),
  ) {}
}

class UserRegisteredEvent implements DomainEvent {
  constructor(
    public readonly userId: UserId,
    public readonly email: Email,
    public readonly occurredOn: Date = new Date(),
  ) {}
}

class EmailVerificationSentEvent implements DomainEvent {
  constructor(
    public readonly userId: UserId,
    public readonly email: Email,
    public readonly tokenId: TokenId,
    public readonly occurredOn: Date = new Date(),
  ) {}
}
```

### **2. Value Objects Específicos para Registro**

```typescript
// domain/authentication/value-objects/registration-data.vo.ts
class RegistrationData extends ValueObject {
  constructor(
    public readonly email: Email,
    public readonly password: string,
    public readonly ipAddress: string,
    public readonly userAgent: string,
    public readonly deviceInfo: DeviceInfo,
  ) {
    super();
  }
}

class DeviceInfo extends ValueObject {
  constructor(
    public readonly deviceType: string,
    public readonly os: string,
    public readonly browser: string,
  ) {
    super();
  }

  static fromUserAgent(userAgent: string): DeviceInfo {
    // Lógica simplificada para extrair info do user agent
    const browser = this.extractBrowser(userAgent);
    const os = this.extractOS(userAgent);
    const deviceType = this.extractDeviceType(userAgent);

    return new DeviceInfo(deviceType, os, browser);
  }

  private static extractBrowser(ua: string): string {
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    return 'Unknown';
  }

  private static extractOS(ua: string): string {
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'MacOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  private static extractDeviceType(ua: string): string {
    if (ua.includes('Mobile')) return 'Mobile';
    if (ua.includes('Tablet')) return 'Tablet';
    return 'Desktop';
  }
}
```

### **3. Serviço de Domínio para Registro**

```typescript
// domain/authentication/services/user-registration.service.ts
interface UserRegistrationService {
  registerUser(registrationData: RegistrationData): Promise<RegistrationResult>;
  confirmEmail(verificationToken: string): Promise<EmailConfirmationResult>;
}

class UserRegistrationServiceImpl implements UserRegistrationService {
  constructor(
    private userRepository: UserRepository,
    private tokenRepository: TokenRepository,
    private passwordHasher: PasswordHasher,
    private emailService: EmailService,
    private domainEventPublisher: DomainEventPublisher,
    private idGenerator: IdGenerator,
  ) {}

  async registerUser(
    registrationData: RegistrationData,
  ): Promise<RegistrationResult> {
    try {
      // 1. Validar se o email já existe
      await this.ensureEmailIsUnique(registrationData.email);

      // 2. Validar força da senha
      this.validatePasswordStrength(registrationData.password);

      // 3. Criar o usuário
      const user = await this.createUser(registrationData);

      // 4. Criar token de verificação
      const verificationToken = await this.createVerificationToken(user);

      // 5. Publicar eventos de domínio
      await this.publishRegistrationEvents(user, verificationToken);

      // 6. Enviar email de verificação (side effect)
      await this.sendVerificationEmail(user, verificationToken);

      return RegistrationResult.success(user.id);
    } catch (error) {
      return RegistrationResult.failure(error.message);
    }
  }

  async confirmEmail(
    verificationToken: string,
  ): Promise<EmailConfirmationResult> {
    try {
      // 1. Buscar e validar token
      const token =
        await this.tokenRepository.findByTokenValue(verificationToken);
      if (!token || token.tokenType !== TokenType.VERIFICATION_TOKEN) {
        throw new InvalidVerificationTokenError('Invalid verification token');
      }

      if (!token.isValid()) {
        throw new TokenExpiredError('Verification token has expired');
      }

      // 2. Buscar usuário
      const user = await this.userRepository.findById(token.userId);
      if (!user) {
        throw new UserNotFoundError('User not found');
      }

      // 3. Marcar email como verificado
      user.markAsVerified();
      await this.userRepository.save(user);

      // 4. Marcar token como usado
      token.markAsUsed();
      await this.tokenRepository.save(token);

      // 5. Publicar evento de confirmação
      await this.domainEventPublisher.publish(
        new EmailVerifiedEvent(user.id, new Date()),
      );

      return EmailConfirmationResult.success();
    } catch (error) {
      return EmailConfirmationResult.failure(error.message);
    }
  }

  private async ensureEmailIsUnique(email: Email): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new EmailAlreadyExistsError('Email is already registered');
    }
  }

  private validatePasswordStrength(password: string): void {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      throw new WeakPasswordError(
        `Password must be at least ${minLength} characters long`,
      );
    }

    if (!hasUpperCase || !hasLowerCase) {
      throw new WeakPasswordError(
        'Password must contain both uppercase and lowercase letters',
      );
    }

    if (!hasNumbers) {
      throw new WeakPasswordError('Password must contain at least one number');
    }

    if (!hasSpecialChar) {
      throw new WeakPasswordError(
        'Password must contain at least one special character',
      );
    }
  }

  private async createUser(registrationData: RegistrationData): Promise<User> {
    const passwordHash = await this.passwordHasher.hash(
      registrationData.password,
    );
    const userId = new UserId(this.idGenerator.generate());

    const user = new User(
      userId,
      registrationData.email,
      passwordHash,
      true, // isActive
      false, // isVerified (false até confirmar email)
    );

    // Atribuir role padrão (ex: 'user')
    // const defaultRole = await this.roleRepository.findDefaultRole();
    // if (defaultRole) {
    //     user.assignRole(defaultRole);
    // }

    await this.userRepository.save(user);
    return user;
  }

  private async createVerificationToken(user: User): Promise<Token> {
    const tokenId = new TokenId(this.idGenerator.generate());
    const tokenValue = this.generateVerificationToken();

    const verificationToken = new Token(
      tokenId,
      user.id,
      TokenType.VERIFICATION_TOKEN,
      tokenValue,
      ['verify_email'],
      24 * 60, // Expira em 24 horas
    );

    await this.tokenRepository.save(verificationToken);
    return verificationToken;
  }

  private generateVerificationToken(): string {
    // Gerar token seguro
    return crypto.randomBytes(32).toString('hex');
  }

  private async publishRegistrationEvents(
    user: User,
    token: Token,
  ): Promise<void> {
    await this.domainEventPublisher.publish(
      new UserRegistrationStartedEvent(user.id, user.email),
    );

    await this.domainEventPublisher.publish(
      new EmailVerificationSentEvent(user.id, user.email, token.id),
    );
  }

  private async sendVerificationEmail(user: User, token: Token): Promise<void> {
    const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token.tokenValue}`;

    await this.emailService.sendVerificationEmail(
      user.email.value,
      verificationUrl,
      token.expiresAt,
    );
  }
}
```

### **4. Caso de Uso de Registro**

```typescript
// application/use-cases/register-user.use-case.ts
interface RegisterUserUseCase {
  execute(command: RegisterUserCommand): Promise<RegisterUserResponse>;
}

class RegisterUserUseCaseImpl implements RegisterUserUseCase {
  constructor(
    private userRegistrationService: UserRegistrationService,
    private passwordPolicyService: PasswordPolicyService,
  ) {}

  async execute(command: RegisterUserCommand): Promise<RegisterUserResponse> {
    // 1. Validar command
    this.validateCommand(command);

    // 2. Criar value objects
    const email = new Email(command.email);
    const deviceInfo = DeviceInfo.fromUserAgent(command.userAgent);
    const registrationData = new RegistrationData(
      email,
      command.password,
      command.ipAddress,
      command.userAgent,
      deviceInfo,
    );

    // 3. Executar registro
    const result =
      await this.userRegistrationService.registerUser(registrationData);

    if (result.isSuccess) {
      return RegisterUserResponse.success(result.userId);
    } else {
      return RegisterUserResponse.failure(result.error);
    }
  }

  private validateCommand(command: RegisterUserCommand): void {
    if (!command.email || !command.password) {
      throw new ValidationError('Email and password are required');
    }

    if (command.password !== command.passwordConfirmation) {
      throw new ValidationError('Password confirmation does not match');
    }
  }
}
```

### **5. DTOs e Commands**

```typescript
// application/dtos/register-user.dto.ts
class RegisterUserCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly passwordConfirmation: string,
    public readonly ipAddress: string,
    public readonly userAgent: string,
    public readonly acceptTerms: boolean,
  ) {}
}

class RegisterUserResponse {
  private constructor(
    public readonly success: boolean,
    public readonly userId?: string,
    public readonly error?: string,
  ) {}

  static success(userId: string): RegisterUserResponse {
    return new RegisterUserResponse(true, userId);
  }

  static failure(error: string): RegisterUserResponse {
    return new RegisterUserResponse(false, undefined, error);
  }
}

class VerifyEmailCommand {
  constructor(public readonly token: string) {}
}

class VerifyEmailResponse {
  private constructor(
    public readonly success: boolean,
    public readonly error?: string,
  ) {}

  static success(): VerifyEmailResponse {
    return new VerifyEmailResponse(true);
  }

  static failure(error: string): VerifyEmailResponse {
    return new VerifyEmailResponse(false, error);
  }
}
```

### **6. Controller/API Layer**

```typescript
// infrastructure/controllers/registration.controller.ts
@Controller('auth')
class RegistrationController {
  constructor(
    private registerUserUseCase: RegisterUserUseCase,
    private verifyEmailUseCase: VerifyEmailUseCase,
  ) {}

  @Post('register')
  async register(
    @Body() body: RegisterUserRequestDto,
    @Req() request: Request,
  ) {
    try {
      if (!body.acceptTerms) {
        return Response.badRequest('You must accept the terms of service');
      }

      const command = new RegisterUserCommand(
        body.email,
        body.password,
        body.passwordConfirmation,
        request.ip,
        request.headers['user-agent'],
        body.acceptTerms,
      );

      const result = await this.registerUserUseCase.execute(command);

      if (result.success) {
        return Response.created({
          message:
            'Registration successful. Please check your email for verification.',
          userId: result.userId,
        });
      } else {
        return Response.badRequest(result.error);
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        return Response.badRequest(error.message);
      }

      return Response.internalError('Registration failed');
    }
  }

  @Post('verify-email')
  async verifyEmail(@Body() body: VerifyEmailRequestDto) {
    try {
      const command = new VerifyEmailCommand(body.token);
      const result = await this.verifyEmailUseCase.execute(command);

      if (result.success) {
        return Response.ok({
          message: 'Email verified successfully',
        });
      } else {
        return Response.badRequest(result.error);
      }
    } catch (error) {
      return Response.internalError('Email verification failed');
    }
  }
}

// DTOs para a API
class RegisterUserRequestDto {
  email: string;
  password: string;
  passwordConfirmation: string;
  acceptTerms: boolean;
}

class VerifyEmailRequestDto {
  token: string;
}
```

### **7. Handlers para Eventos de Domínio**

```typescript
// application/event-handlers/registration-event-handlers.ts
class UserRegistrationStartedEventHandler
  implements DomainEventHandler<UserRegistrationStartedEvent>
{
  constructor(private analyticsService: AnalyticsService) {}

  async handle(event: UserRegistrationStartedEvent): Promise<void> {
    // Registrar métrica de analytics
    await this.analyticsService.trackUserRegistration(
      event.userId,
      event.email,
    );
  }
}

class EmailVerificationSentEventHandler
  implements DomainEventHandler<EmailVerificationSentEvent>
{
  constructor(private notificationService: NotificationService) {}

  async handle(event: EmailVerificationSentEvent): Promise<void> {
    // Registrar notificação (opcional)
    await this.notificationService.recordEmailVerificationSent(event.userId);
  }
}

class EmailVerifiedEventHandler
  implements DomainEventHandler<EmailVerifiedEvent>
{
  constructor(
    private analyticsService: AnalyticsService,
    private roleService: RoleService,
  ) {}

  async handle(event: EmailVerifiedEvent): Promise<void> {
    // 1. Atualizar analytics
    await this.analyticsService.trackEmailVerified(event.userId);

    // 2. Atribuir permissões completas (agora que o email está verificado)
    // await this.roleService.assignVerifiedUserRole(event.userId);
  }
}
```

### **8. Serviços de Infraestrutura**

```typescript
// infrastructure/services/email.service.ts
class NodemailerEmailService implements EmailService {
  async sendVerificationEmail(
    email: string,
    verificationUrl: string,
    expiresAt: Date,
  ): Promise<void> {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Verify Your Email Address',
      html: this.buildVerificationEmailTemplate(verificationUrl, expiresAt),
    };

    await this.transporter.sendMail(mailOptions);
  }

  private buildVerificationEmailTemplate(
    verificationUrl: string,
    expiresAt: Date,
  ): string {
    return `
            <h1>Verify Your Email Address</h1>
            <p>Please click the link below to verify your email address:</p>
            <a href="${verificationUrl}">Verify Email</a>
            <p>This link will expire on ${expiresAt.toLocaleString()}</p>
        `;
  }
}
```

## **Fluxo Completo do Registro**

1. **Validação**: Email único, senha forte, termos aceitos
2. **Criação de Usuário**: Hash da senha, criação da entidade User
3. **Geração de Token**: Token de verificação com expiração
4. **Eventos**: Publicação de eventos de domínio
5. **Email**: Envio assíncrono do email de verificação
6. **Resposta**: Retorno imediato ao usuário
7. **Verificação**: Confirmação via token (fluxo separado)

## **Vantagens desta Implementação**

- **Separação de Concerns**: Cada componente tem responsabilidade clara
- **Testabilidade**: Fluxo fácil de testar em partes isoladas
- **Extensibilidade**: Novos comportamentos via event handlers
- **Resiliência**: Tratamento adequado de erros em cada etapa
- **Manutenibilidade**: Código organizado por domínio e responsabilidade

Esta implementação segue rigorosamente os princípios de DDD e resulta em um fluxo de registro robusto e maintainable.
