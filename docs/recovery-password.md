Excelente pergunta! Vamos detalhar como o fluxo de troca de senha se encaixa dentro do domínio de autenticação, aplicando os conceitos de DDD.

## **Análise do Domínio: Troca de Senha**

A troca de senha é um **Caso de Uso Complexo** que envolve múltiplos subdomínios dentro do contexto de autenticação:

1. **Verificação de Identidade** (Subdomínio de Autenticação Core)
2. **Validação de Segurança** (Subdomínio de Segurança)
3. **Atualização de Credenciais** (Subdomínio de Autenticação Core)
4. **Gestão de Sessões** (Subdomínio de Tokens/Sessões)

---

## **Fluxo Detalhado com Implementação**

### **1. Caso de Uso Principal: ChangePasswordUseCase**

```typescript
// application/use-cases/change-password.use-case.ts
interface ChangePasswordUseCase {
  execute(request: ChangePasswordRequest): Promise<ChangePasswordResult>;
}

class ChangePasswordUseCaseImpl implements ChangePasswordUseCase {
  constructor(
    private authenticationService: AuthenticationService,
    private passwordPolicyService: PasswordPolicyService,
    private sessionService: SessionService,
    private securityService: SecurityService,
    private eventPublisher: DomainEventPublisher,
  ) {}

  async execute(request: ChangePasswordRequest): Promise<ChangePasswordResult> {
    // 1. Validar identidade do usuário
    const user = await this.authenticationService.verifyUserIdentity(
      request.userId,
      request.currentPassword,
    );

    // 2. Validar nova senha contra políticas
    await this.passwordPolicyService.validatePasswordStrength(
      request.newPassword,
    );

    // 3. Verificar se não é uma senha recente
    await this.securityService.checkPasswordHistory(
      user.id,
      request.newPassword,
    );

    // 4. Executar a troca de senha
    await this.authenticationService.changePassword(
      user.id,
      request.newPassword,
    );

    // 5. Invalidar sessões existentes (exceto a atual)
    await this.sessionService.invalidateOtherSessions(
      user.id,
      request.currentSessionId,
    );

    // 6. Publicar evento de domínio
    await this.eventPublisher.publish(
      new PasswordChangedEvent(user.id, new Date()),
    );

    return ChangePasswordResult.success();
  }
}
```

### **2. Serviços de Domínio Envolvidos**

#### **AuthenticationService (Subdomínio Central)**

```typescript
// domain/authentication/services/authentication.service.ts
interface AuthenticationService {
  verifyUserIdentity(userId: UserId, password: string): Promise<User>;
  changePassword(userId: UserId, newPassword: string): Promise<void>;
}

class AuthenticationServiceImpl implements AuthenticationService {
  async verifyUserIdentity(userId: UserId, password: string): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new IdentityVerificationFailedError('User not found');
    }

    const isValid = await this.passwordHasher.verify(
      password,
      user.passwordHash,
    );

    if (!isValid) {
      // Registrar tentativa fracassada para segurança
      await this.securityService.recordFailedAttempt(userId);
      throw new IdentityVerificationFailedError('Invalid credentials');
    }

    return user;
  }

  async changePassword(userId: UserId, newPassword: string): Promise<void> {
    const user = await this.userRepository.findById(userId);

    const newPasswordHash = await this.passwordHasher.hash(newPassword);

    user.changePassword(newPasswordHash);

    await this.userRepository.save(user);
  }
}
```

#### **PasswordPolicyService (Subdomínio de Segurança)**

```typescript
// domain/security/services/password-policy.service.ts
class PasswordPolicyServiceImpl implements PasswordPolicyService {
  async validatePasswordStrength(password: string): Promise<ValidationResult> {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain both uppercase and lowercase letters');
    }

    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return errors.length === 0
      ? ValidationResult.valid()
      : ValidationResult.invalid(errors);
  }
}
```

#### **SecurityService (Subdomínio de Segurança)**

```typescript
// domain/security/services/security.service.ts
class SecurityServiceImpl implements SecurityService {
  async checkPasswordHistory(
    userId: UserId,
    newPassword: string,
  ): Promise<void> {
    const recentPasswords =
      await this.passwordHistoryRepository.findLastPasswords(userId, 5); // Últimas 5 senhas

    for (const oldPassword of recentPasswords) {
      const isReused = await this.passwordHasher.verify(
        newPassword,
        oldPassword.hash,
      );

      if (isReused) {
        throw new PasswordReuseError('Cannot reuse recent passwords');
      }
    }
  }

  async recordFailedAttempt(userId: UserId): Promise<void> {
    // Implementar lógica de proteção contra brute-force
    const attempts = await this.failedAttemptRepository.getRecentAttempts(
      userId,
      15,
    ); // Últimos 15 minutos

    if (attempts.length >= 5) {
      await this.lockAccountTemporarily(userId);
    }
  }
}
```

### **3. Entidade User com Comportamento de Domínio**

```typescript
// domain/authentication/entities/user.entity.ts
class User extends AggregateRoot {
  constructor(
    public id: UserId,
    private email: Email,
    private passwordHash: string,
    private isActive: boolean,
    private passwordChangedAt?: Date,
  ) {
    super();
  }

  changePassword(newPasswordHash: string): void {
    if (!this.isActive) {
      throw new UserInactiveError('Cannot change password for inactive user');
    }

    this.passwordHash = newPasswordHash;
    this.passwordChangedAt = new Date();

    // Registrar evento de domínio
    this.addDomainEvent(
      new PasswordChangedEvent(this.id, this.passwordChangedAt),
    );
  }

  // Outros comportamentos relacionados à identidade...
  verifyPassword(password: string, hasher: PasswordHasher): Promise<boolean> {
    return hasher.verify(password, this.passwordHash);
  }
}
```

### **4. Eventos de Domínio para Rastreabilidade**

```typescript
// domain/events/password-changed.event.ts
class PasswordChangedEvent implements DomainEvent {
  constructor(
    public readonly userId: UserId,
    public readonly changedAt: Date,
    public readonly eventId: string = generateId(),
    public readonly occurredOn: Date = new Date(),
  ) {}
}

// domain/events/failed-password-attempt.event.ts
class FailedPasswordAttemptEvent implements DomainEvent {
  constructor(
    public readonly userId: UserId,
    public readonly attemptAt: Date,
    public readonly ipAddress: string,
  ) {}
}
```

### **5. Controller/API Layer**

```typescript
// infrastructure/controllers/password.controller.ts
@Controller('auth/password')
class PasswordController {
  constructor(private changePasswordUseCase: ChangePasswordUseCase) {}

  @Post('change')
  async changePassword(@Body() request: ChangePasswordRequestDto) {
    try {
      // 1. Extrair usuário do token JWT (identidade atual)
      const currentUserId = this.extractUserIdFromToken();

      // 2. Validar DTO de entrada
      const validatedRequest = new ChangePasswordRequest(
        currentUserId,
        request.currentPassword,
        request.newPassword,
        request.currentSessionId,
      );

      // 3. Executar caso de uso
      const result = await this.changePasswordUseCase.execute(validatedRequest);

      return { success: true, message: 'Password changed successfully' };
    } catch (error) {
      // Tratamento específico de erros de domínio
      if (error instanceof IdentityVerificationFailedError) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      if (error instanceof PasswordReuseError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }
}
```

### **6. DTOs e Objetos de Valor**

```typescript
// application/dtos/change-password.dto.ts
class ChangePasswordRequest {
  constructor(
    public readonly userId: UserId,
    public readonly currentPassword: string,
    public readonly newPassword: string,
    public readonly currentSessionId?: SessionId,
  ) {}
}

class ChangePasswordResponse {
  constructor(
    public readonly success: boolean,
    public readonly message: string,
    public readonly sessionsInvalidated: number,
  ) {}
}
```

---

## **Fluxo Completo da Troca de Senha**

1. **Validação de Identidade**:

   - Verificar se a senha atual está correta
   - Proteção contra brute-force

2. **Validação de Segurança**:

   - Força da nova senha
   - Histórico de senhas anteriores
   - Políticas de complexidade

3. **Execução da Troca**:

   - Hash da nova senha
   - Atualização do aggregate User
   - Registro do timestamp de alteração

4. **Gestão de Sessões**:

   - Invalidar outras sessões por segurança
   - Manter sessão atual ativa

5. **Eventos e Rastreabilidade**:
   - Publicar evento para outros contextos
   - Logs de auditoria
   - Notificações (se necessário)

---

## **Vantagens desta Abordagem com DDD**

- **Seperação de Concerns**: Cada serviço tem responsabilidade bem definida
- **Testabilidade**: Cada componente pode ser testado isoladamente
- **Rastreabilidade**: Eventos de domínio permitem acompanhar o fluxo
- **Segurança**: Lógica centralizada em serviços especializados
- **Manutenibilidade**: Mudanças em políticas afetam apenas um serviço

Esta estrutura garante que a troca de senha seja segura, rastreável e alinhada com as regras de negócio do domínio de autenticação.
