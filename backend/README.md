# AMPLIFY Backend API

Backend RESTful para AMPLIFY - Plataforma de conexion de musicos en Ecuador.

## Descripcion

API Node.js + Express que gestiona autenticacion, perfiles musicales y conexiones entre musicos. Disenado para integrarse con frontend React Native/React.

---

## Caracteristicas

- Sistema de autenticacion completo (JWT)
- Registro y login de usuarios
- Proteccion de rutas con middleware
- Base de datos PostgreSQL
- Hash de contrasenas con bcrypt
- Validaciones y manejo de errores

---

## Stack Tecnologico

- **Runtime:** Node.js v18+
- **Framework:** Express.js
- **Base de datos:** PostgreSQL 15
- **Autenticacion:** JWT (jsonwebtoken)
- **Seguridad:** bcrypt para hash de passwords
- **ORM:** SQL nativo con pg
- **Docker:** PostgreSQL en contenedor

---

## Instalacion

### Requisitos previos

- Node.js v18 o superior
- Docker Desktop
- Git

### Pasos de instalacion
```bash
# 1. Clonar repositorio
git clone https://github.com/dennis840/amplify-backend.git
cd amplify-backend

# 2. Instalar dependencias
cd backend
npm install

# 3. Configurar variables de entorno
cp .env.example .env

# 4. Levantar base de datos PostgreSQL
cd ..
docker-compose up -d

# 5. Iniciar servidor de desarrollo
cd backend
npm run dev
```

El servidor estara disponible en: `http://localhost:3000`

---

## Variables de Entorno

Crear archivo `.env` en la carpeta `backend/`:
```env
# Servidor
PORT=3000
NODE_ENV=development

# Base de datos PostgreSQL
DB_HOST=localhost
DB_PORT=5433
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=amplify_dev

# JWT
JWT_SECRET=tu_secreto_muy_seguro_aqui
JWT_EXPIRES_IN=7d
```

**Importante:** Cambiar `JWT_SECRET` en produccion por un valor aleatorio seguro.

---

## API Endpoints

### Base URL
```
http://localhost:3000
```

---

### Endpoints Publicos (Sin autenticacion)

#### 1. Health Check

**Request:**
```http
GET /health
```

**Respuesta exitosa (200):**
```json
{
  "status": "ok",
  "message": "AMPLIFY API running",
  "timestamp": "2026-01-24T10:30:00.000Z"
}
```

---

#### 2. Registro de Usuario

**Request:**
```http
POST /api/auth/register
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Juan Perez",
  "email": "juan@ejemplo.com",
  "password": "Password123!",
  "terms": true
}
```

**Validaciones:**
- `name`: requerido, string
- `email`: requerido, formato email valido
- `password`: requerido, minimo 8 caracteres
- `terms`: requerido, debe ser `true`

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 1,
    "name": "Juan Perez",
    "email": "juan@ejemplo.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores posibles:**
```json
{
  "success": false,
  "error": "El email ya esta registrado"
}
```

---

#### 3. Inicio de Sesion (SignIn)

**Request:**
```http
POST /api/auth/signin
Content-Type: application/json
```

**Body:**
```json
{
  "email": "juan@ejemplo.com",
  "password": "Password123!"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Inicio de sesion exitoso",
  "user": {
    "id": 1,
    "name": "Juan Perez",
    "email": "juan@ejemplo.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores posibles:**
```json
{
  "success": false,
  "error": "Email no registrado"
}
```
```json
{
  "success": false,
  "error": "Contrasena incorrecta"
}
```

---

### Endpoints Protegidos (Requieren autenticacion)

**Header requerido:**
```http
Authorization: Bearer {TOKEN}
```

#### 4. Obtener Usuario Actual

**Request:**
```http
GET /api/auth/me
Authorization: Bearer {TOKEN}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "Juan Perez",
    "email": "juan@ejemplo.com"
  }
}
```

**Errores posibles:**
```json
{
  "success": false,
  "error": "Token no proporcionado"
}
```

---

## Pruebas con PowerShell

### Registro de usuario
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method POST -ContentType "application/json" -Body '{"name":"Maria Gonzalez","email":"maria@test.com","password":"SecurePass456!","terms":true}'
```

### Login
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/signin" -Method POST -ContentType "application/json" -Body '{"email":"maria@test.com","password":"SecurePass456!"}'
$token = $response.token
```

### Obtener usuario actual
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/me" -Method GET -Headers @{ Authorization = "Bearer $token" }
```

---

## Base de Datos

### Esquema de tabla users
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Conectar a PostgreSQL
```bash
docker exec -it amplify_db psql -U postgres -d amplify_dev
```

---

## Estructura del Proyecto
```
backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── authController.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   ├── models/
│   │   └── userModel.js
│   ├── routes/
│   │   └── authRoutes.js
│   ├── utils/
│   │   └── jwtUtils.js
│   └── index.js
├── tests/
├── .env.example
├── package.json
└── README.md
```

---

## Seguridad

### Implementado:
- Passwords hasheados con bcrypt
- Tokens JWT con expiracion
- Validacion de datos
- CORS habilitado
- Variables en .env

### Para produccion:
- HTTPS obligatorio
- Rate limiting
- Helmet.js
- Refresh tokens

---

## Scripts
```bash
npm run dev      # Desarrollo con nodemon
npm start        # Produccion
npm test         # Tests
```

---

## Equipo

- **Backend Lead:** Hefesto (Dennis Santiago Villacis Vasquez)
- **Frontend Lead:** Gepeto
- **Proyecto:** BandasMatch - AMPLIFY

---

## Changelog

### v0.4.0-docs (2026-01-24)
- Documentacion completa de API

### v0.3.0-auth-complete (2026-01-24)
- Sistema Auth completo con middleware

### v0.2.0-auth-signin (2026-01-24)
- Endpoint signin implementado

### v0.1.0-auth-register (2026-01-24)
- Endpoint register implementado
- Tabla users en PostgreSQL