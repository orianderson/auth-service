Excelente! Vamos definir cada entidade com seus atributos, comportamentos e relações, aplicando os princípios de DDD.

## **1. User (Aggregate Root)**

```typescript
// domain/authentication/entities/user.entity.ts
class User extends AggregateRoot<UserId> {
  private _email: Email;
  private _passwordHash: string;
  private _isActive: boolean;
  private _isVerified: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _lastLoginAt: Date | null;
  private _failedLoginAttempts: number;
  private _lockedUntil: Date | null;
  private _roles: UserRole[]; // Lista de roles atribuídas ao usuário

  constructor(
    id: UserId,
    email: Email,
    passwordHash: string,
    isActive: boolean = true,
    isVerified: boolean = false,
  ) {
    super(id);
    this._email = email;
    this._passwordHash = passwordHash;
    this._isActive = isActive;
    this._isVerified = isVerified;
    this._createdAt = new Date();
    this._updatedAt = new Date();
    this._lastLoginAt = null;
    this._failedLoginAttempts = 0;
    this._lockedUntil = null;
    this._roles = [];
  }

  // Comportamentos de Negócio
  changePassword(newPasswordHash: string): void {
    this.validateUserActive();
    this._passwordHash = newPasswordHash;
    this._updatedAt = new Date();
    this.addDomainEvent(new PasswordChangedEvent(this.id, this._updatedAt));
  }

  updateEmail(newEmail: Email): void {
    this.validateUserActive();
    this._email = newEmail;
    this._isVerified = false; // Requer re-verificação
    this._updatedAt = new Date();
    this.addDomainEvent(new EmailChangedEvent(this.id, newEmail));
  }

  markAsVerified(): void {
    this._isVerified = true;
    this._updatedAt = new Date();
  }

  recordSuccessfulLogin(): void {
    this._lastLoginAt = new Date();
    this._failedLoginAttempts = 0;
    this._lockedUntil = null;
    this._updatedAt = new Date();
  }

  recordFailedLogin(): void {
    this._failedLoginAttempts++;
    this._updatedAt = new Date();

    if (this._failedLoginAttempts >= 5) {
      this._lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos
      this.addDomainEvent(new AccountLockedEvent(this.id, this._lockedUntil));
    }
  }

  unlockAccount(): void {
    this._failedLoginAttempts = 0;
    this._lockedUntil = null;
    this._updatedAt = new Date();
  }

  isAccountLocked(): boolean {
    return this._lockedUntil ? this._lockedUntil > new Date() : false;
  }

  assignRole(role: Role): void {
    if (!this._roles.some((r) => r.roleId.equals(role.id))) {
      this._roles.push(new UserRole(this.id, role.id));
      this._updatedAt = new Date();
      this.addDomainEvent(new RoleAssignedEvent(this.id, role.id));
    }
  }

  removeRole(roleId: RoleId): void {
    this._roles = this._roles.filter((r) => !r.roleId.equals(roleId));
    this._updatedAt = new Date();
    this.addDomainEvent(new RoleRemovedEvent(this.id, roleId));
  }

  private validateUserActive(): void {
    if (!this._isActive) {
      throw new UserInactiveError('User account is inactive');
    }
    if (this.isAccountLocked()) {
      throw new AccountLockedError('User account is temporarily locked');
    }
  }

  // Getters
  get email(): Email {
    return this._email;
  }
  get isActive(): boolean {
    return this._isActive;
  }
  get isVerified(): boolean {
    return this._isVerified;
  }
  get roles(): UserRole[] {
    return [...this._roles];
  }
  // ... outros getters
}
```

## **2. Session (Entity dentro do Aggregate User)**

```typescript
// domain/authentication/entities/session.entity.ts
class Session extends Entity<SessionId> {
  private _userId: UserId;
  private _deviceInfo: DeviceInfo;
  private _ipAddress: string;
  private _userAgent: string;
  private _createdAt: Date;
  private _lastActivityAt: Date;
  private _expiresAt: Date;
  private _isRevoked: boolean;

  constructor(
    id: SessionId,
    userId: UserId,
    deviceInfo: DeviceInfo,
    ipAddress: string,
    userAgent: string,
    expiresInHours: number = 24,
  ) {
    super(id);
    this._userId = userId;
    this._deviceInfo = deviceInfo;
    this._ipAddress = ipAddress;
    this._userAgent = userAgent;
    this._createdAt = new Date();
    this._lastActivityAt = new Date();
    this._expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);
    this._isRevoked = false;
  }

  // Comportamentos
  updateActivity(): void {
    if (this.isExpired() || this._isRevoked) {
      throw new SessionExpiredError('Cannot update expired or revoked session');
    }
    this._lastActivityAt = new Date();
  }

  revoke(): void {
    this._isRevoked = true;
  }

  isExpired(): boolean {
    return new Date() > this._expiresAt;
  }

  isValid(): boolean {
    return !this._isRevoked && !this.isExpired();
  }

  // Getters
  get userId(): UserId {
    return this._userId;
  }
  get deviceInfo(): DeviceInfo {
    return this._deviceInfo;
  }
  get expiresAt(): Date {
    return this._expiresAt;
  }
  get isRevoked(): boolean {
    return this._isRevoked;
  }
}

// Objeto de Valor para Device Info
class DeviceInfo extends ValueObject {
  constructor(
    public readonly deviceType: string,
    public readonly os: string,
    public readonly browser: string,
  ) {
    super();
  }
}
```

## **3. Token (Entity)**

```typescript
// domain/tokens/entities/token.entity.ts
class Token extends Entity<TokenId> {
  private _userId: UserId;
  private _tokenType: TokenType;
  private _tokenValue: string;
  private _scopes: string[];
  private _createdAt: Date;
  private _expiresAt: Date;
  private _isRevoked: boolean;
  private _usedAt: Date | null;

  constructor(
    id: TokenId,
    userId: UserId,
    tokenType: TokenType,
    tokenValue: string,
    scopes: string[] = [],
    expiresInMinutes: number,
  ) {
    super(id);
    this._userId = userId;
    this._tokenType = tokenType;
    this._tokenValue = tokenValue;
    this._scopes = [...scopes];
    this._createdAt = new Date();
    this._expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);
    this._isRevoked = false;
    this._usedAt = null;
  }

  // Comportamentos
  markAsUsed(): void {
    if (this.isExpired() || this._isRevoked) {
      throw new TokenInvalidError('Cannot use expired or revoked token');
    }
    this._usedAt = new Date();
  }

  revoke(): void {
    this._isRevoked = true;
  }

  isExpired(): boolean {
    return new Date() > this._expiresAt;
  }

  isValid(): boolean {
    return !this._isRevoked && !this.isExpired() && !this._usedAt;
  }

  hasScope(scope: string): boolean {
    return this._scopes.includes(scope) || this._scopes.includes('*');
  }

  // Getters
  get userId(): UserId {
    return this._userId;
  }
  get tokenType(): TokenType {
    return this._tokenType;
  }
  get scopes(): string[] {
    return [...this._scopes];
  }
}

// Enum para Tipo de Token
enum TokenType {
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token',
  VERIFICATION_TOKEN = 'verification_token',
  PASSWORD_RESET_TOKEN = 'password_reset_token',
}
```

## **4. RefreshToken (Entity Especializada)**

```typescript
// domain/tokens/entities/refresh-token.entity.ts
class RefreshToken extends Token {
  private _accessTokenId: TokenId;
  private _isRotated: boolean;
  private _nextRefreshTokenId: RefreshTokenId | null;

  constructor(
    id: RefreshTokenId,
    userId: UserId,
    tokenValue: string,
    accessTokenId: TokenId,
    expiresInDays: number = 7,
  ) {
    super(
      id,
      userId,
      TokenType.REFRESH_TOKEN,
      tokenValue,
      ['refresh'],
      expiresInDays * 24 * 60, // Converter dias para minutos
    );
    this._accessTokenId = accessTokenId;
    this._isRotated = false;
    this._nextRefreshTokenId = null;
  }

  // Comportamentos específicos para Refresh Token
  rotate(newRefreshTokenId: RefreshTokenId): void {
    if (this._isRotated) {
      throw new TokenAlreadyUsedError('Refresh token has already been rotated');
    }
    this._isRotated = true;
    this._nextRefreshTokenId = newRefreshTokenId;
    this.revoke(); // Revogar após rotação por segurança
  }

  canRotate(): boolean {
    return this.isValid() && !this._isRotated;
  }

  // Getters
  get accessTokenId(): TokenId {
    return this._accessTokenId;
  }
  get isRotated(): boolean {
    return this._isRotated;
  }
  get nextRefreshTokenId(): RefreshTokenId | null {
    return this._nextRefreshTokenId;
  }
}
```

## **5. Role (Aggregate Root do Subdomínio de Autorização)**

```typescript
// domain/authorization/entities/role.entity.ts
class Role extends AggregateRoot<RoleId> {
  private _name: string;
  private _description: string;
  private _isDefault: boolean;
  private _permissions: RolePermission[];
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: RoleId,
    name: string,
    description: string = '',
    isDefault: boolean = false,
  ) {
    super(id);
    this._name = name;
    this._description = description;
    this._isDefault = isDefault;
    this._permissions = [];
    this._createdAt = new Date();
    this._updatedAt = new Date();
  }

  // Comportamentos
  assignPermission(permission: Permission): void {
    if (!this._permissions.some((p) => p.permissionId.equals(permission.id))) {
      this._permissions.push(new RolePermission(this.id, permission.id));
      this._updatedAt = new Date();
      this.addDomainEvent(
        new PermissionAssignedToRoleEvent(this.id, permission.id),
      );
    }
  }

  removePermission(permissionId: PermissionId): void {
    this._permissions = this._permissions.filter(
      (p) => !p.permissionId.equals(permissionId),
    );
    this._updatedAt = new Date();
    this.addDomainEvent(
      new PermissionRemovedFromRoleEvent(this.id, permissionId),
    );
  }

  hasPermission(permissionName: string): boolean {
    return this._permissions.some(
      (rolePermission) => rolePermission.permission?.name === permissionName,
    );
  }

  // Getters
  get name(): string {
    return this._name;
  }
  get description(): string {
    return this._description;
  }
  get isDefault(): boolean {
    return this._isDefault;
  }
  get permissions(): RolePermission[] {
    return [...this._permissions];
  }
}
```

## **6. Permission (Entity dentro do Aggregate Role)**

```typescript
// domain/authorization/entities/permission.entity.ts
class Permission extends Entity<PermissionId> {
  private _name: string;
  private _description: string;
  private _category: string;
  private _resource: string;
  private _action: PermissionAction;
  private _createdAt: Date;

  constructor(
    id: PermissionId,
    name: string,
    resource: string,
    action: PermissionAction,
    description: string = '',
    category: string = 'general',
  ) {
    super(id);
    this._name = name;
    this._description = description;
    this._category = category;
    this._resource = resource;
    this._action = action;
    this._createdAt = new Date();
  }

  // Comportamentos
  matches(resource: string, action: PermissionAction): boolean {
    return this._resource === resource && this._action === action;
  }

  // Getters
  get name(): string {
    return this._name;
  }
  get resource(): string {
    return this._resource;
  }
  get action(): PermissionAction {
    return this._action;
  }
  get category(): string {
    return this._category;
  }
}

// Enum para Ações de Permissão
enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage',
}
```

## **7. Entidades de Relacionamento (Join Tables)**

```typescript
// Entidade para relacionamento User-Role
class UserRole extends Entity<UserRoleId> {
  constructor(
    id: UserRoleId,
    public readonly userId: UserId,
    public readonly roleId: RoleId,
    public readonly assignedAt: Date = new Date(),
  ) {
    super(id);
  }
}

// Entidade para relacionamento Role-Permission
class RolePermission extends Entity<RolePermissionId> {
  constructor(
    id: RolePermissionId,
    public readonly roleId: RoleId,
    public readonly permissionId: PermissionId,
    public readonly assignedAt: Date = new Date(),
  ) {
    super(id);
  }
}
```

## **8. Objetos de Valor e IDs**

```typescript
// Value Objects
class Email extends ValueObject {
  constructor(public readonly value: string) {
    super();
    if (!this.isValidEmail(value)) {
      throw new InvalidEmailError('Invalid email format');
    }
  }

  private isValidEmail(email: string): boolean {
    // Implementar validação de email
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

// IDs como Value Objects
class UserId extends Identity<string> {}
class SessionId extends Identity<string> {}
class TokenId extends Identity<string> {}
class RoleId extends Identity<string> {}
class PermissionId extends Identity<string> {}
class UserRoleId extends Identity<string> {}
class RolePermissionId extends Identity<string> {}
```

## **Relações entre as Entidades**

```
User (Aggregate Root)
├── Sessions (1:N)
├── Tokens (1:N)
└── UserRoles (1:N) → Role (Aggregate Root)
                     └── RolePermissions (1:N) → Permission (Entity)
```

Esta estrutura define claramente as responsabilidades de cada entidade, seus comportamentos de negócio e como elas se relacionam dentro do domínio de autenticação e autorização.
