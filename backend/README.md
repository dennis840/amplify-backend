# AMPLIFY Backend API

Backend RESTful para AMPLIFY - Plataforma de conexión de músicos en Ecuador.

## 📋 Descripción

API Node.js + Express que gestiona autenticación, perfiles musicales y conexiones entre músicos. Diseñado para integrarse con frontend React Native/React.

---

## 🚀 Características

- Sistema de autenticación completo (JWT)
- Registro y login de usuarios
- Protección de rutas con middleware
- Base de datos PostgreSQL
- Hash de contraseñas con bcrypt
- Validaciones y manejo de errores

---

## 🛠️ Stack Tecnológico

- **Runtime:** Node.js v18+
- **Framework:** Express.js
- **Base de datos:** PostgreSQL 15
- **Autenticación:** JWT (jsonwebtoken)
- **Seguridad:** bcrypt para hash de passwords
- **ORM:** SQL nativo con pg
- **Docker:** PostgreSQL en contenedor

---

## 📦 Instalación

### Requisitos previos

- Node.js v18 o superior
- Docker Desktop
- Git

### Pasos de instalación
```bash
# 1. Clonar repositorio
git clone https://github.com/dennis840/amplify-backend.git
cd amplify-backend

# 2. Instalar dependencias
cd backend
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 4. Levantar base de datos PostgreSQL
cd ..
docker-compose up -d

# 5. Iniciar servidor de desarrollo
cd backend
npm run dev
```

El servidor estará disponible en: `http://localhost:3000`

---

## ⚙️ Variables de Entorno

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

⚠️ **Importante:** Cambiar `JWT_SECRET` en producción por un valor aleatorio seguro.

---

## 📚 API Endpoints

### Base URL
```
http://localhost:3000
```

---

### 🔓 Endpoints Públicos (Sin autenticación)

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
  "name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "password": "Password123!",
  "terms": true
}
```

**Validaciones:**
- `name`: requerido, string
- `email`: requerido, formato email válido
- `password`: requerido, mínimo 8 caracteres
- `terms`: requerido, debe ser `true`

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@ejemplo.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores posibles:**
```json
// Email ya registrado (400)
{
  "success": false,
  "error": "El email ya está registrado"
}

// Campos faltantes (400)
{
  "success": false,
  "error": "Todos los campos son obligatorios"
}
```

---

#### 3. Inicio de Sesión (SignIn)

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
  "message": "Inicio de sesión exitoso",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@ejemplo.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores posibles:**
```json
// Email no registrado (401)
{
  "success": false,
  "error": "Email no registrado"
}

// Contraseña incorrecta (401)
{
  "success": false,
  "error": "Contraseña incorrecta"
}
```

---

### 🔐 Endpoints Protegidos (Requieren autenticación)

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
    "name": "Juan Pérez",
    "email": "juan@ejemplo.com"
  }
}
```

**Errores posibles:**
```json
// Token no proporcionado (401)
{
  "success": false,
  "error": "Token no proporcionado"
}

// Token inválido o expirado (401)
{
  "success": false,
  "error": "Token inválido o expirado"
}
```

---

## 🧪 Pruebas con PowerShell

### Registro de usuario
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"name":"María González","email":"maria@test.com","password":"SecurePass456!","terms":true}'
```

### Login
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/signin" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"maria@test.com","password":"SecurePass456!"}'

$token = $response.token
```

### Obtener usuario actual
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/me" `
  -Method GET `
  -Headers @{ Authorization = "Bearer $token" }
```

---

## 🗄️ Base de Datos

### Esquema de tabla `users`
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

## 📁 Estructura del Proyecto
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

## 🔒 Seguridad

### Implementado:
- Passwords hasheados con bcrypt
- Tokens JWT con expiración
- Validación de datos
- CORS habilitado
- Variables en .env

### Para producción:
- HTTPS obligatorio
- Rate limiting
- Helmet.js
- Refresh tokens

---

## 🚢 Scripts
```bash
npm run dev      # Desarrollo con nodemon
npm start        # Producción
npm test         # Tests
```

---

## 👥 Equipo

- **Backend Lead:** Hefesto (Dennis Santiago Villacís Vásquez)
- **Frontend Lead:** Gepeto

---

## 📝 Changelog

### v0.4.0-docs (2026-01-24)
- Documentación completa

### v0.3.0-auth-complete (2026-01-24)
- Sistema Auth completo con middleware

### v0.2.0-auth-signin (2026-01-24)
- Endpoint signin

### v0.1.0-auth-register (2026-01-24)
- Endpoint register