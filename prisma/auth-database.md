# Auth Service - Database

## Objetivo

O banco de dados do Auth-Service foi projetado para gerenciar autenticação, autorização e controle de acesso de usuários em múltiplos sistemas, utilizando um modelo baseado em papéis (roles) e módulos.

---

## Tabelas e Relações

### 1. User

- **Descrição:** Usuários autenticáveis do sistema.
- **Campos:** id, email, name, password, createdAt, updatedAt, system_id
- **Relações:**
  - Pertence a um System (`system_id`)
  - Relaciona-se com Role via UserRole

### 2. System

- **Descrição:** Sistemas/aplicações que utilizam o Auth-Service.
- **Campos:** id, name, description, createdAt, updatedAt
- **Relações:**
  - Possui múltiplos User, Role e Module

### 3. Role

- **Descrição:** Papéis de acesso atribuíveis a usuários.
- **Campos:** id, name, description, createdAt, system_id
- **Relações:**
  - Pertence a um System
  - Relaciona-se com User via UserRole
  - Relaciona-se com Module via RoleModule

### 4. Module

- **Descrição:** Funcionalidades ou áreas do sistema controladas por permissão.
- **Campos:** id, name, description, createdAt, updatedAt, system_id
- **Relações:**
  - Pertence a um System
  - Relaciona-se com Role via RoleModule

### 5. UserRole

- **Descrição:** Associação entre User e Role (muitos-para-muitos).
- **Campos:** id, user_id, role_id, createdAt, updatedAt
- **Relações:**
  - user_id → User
  - role_id → Role

### 6. RoleModule

- **Descrição:** Associação entre Role e Module (muitos-para-muitos).
- **Campos:** id, role_id, module_id, createdAt, updatedAt
- **Relações:**
  - role_id → Role
  - module_id → Module

---

## Diagrama Resumido das Relações

```
System
 ├── User
 ├── Role
 │    └── UserRole ── User
 │    └── RoleModule ── Module
 └── Module
```

---

## Observações

- O modelo suporta múltiplos sistemas, cada um com seus próprios usuários, papéis e módulos.
- O controle de acesso é feito via associação de papéis a usuários e de papéis a
