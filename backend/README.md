\# AMPLIFY Backend API



Backend RESTful para AMPLIFY - Plataforma de conexión de músicos en Ecuador.



\## 📋 Descripción



API Node.js + Express que gestiona autenticación, perfiles musicales y conexiones entre músicos. Diseñado para integrarse con frontend React Native/React.



---



\## 🚀 Características



\- ✅ Sistema de autenticación completo (JWT)

\- ✅ Registro y login de usuarios

\- ✅ Protección de rutas con middleware

\- ✅ Base de datos PostgreSQL

\- ✅ Hash de contraseñas con bcrypt

\- ✅ Validaciones y manejo de errores



---



\## 🛠️ Stack Tecnológico



\- \*\*Runtime:\*\* Node.js v18+

\- \*\*Framework:\*\* Express.js

\- \*\*Base de datos:\*\* PostgreSQL 15

\- \*\*Autenticación:\*\* JWT (jsonwebtoken)

\- \*\*Seguridad:\*\* bcrypt para hash de passwords

\- \*\*ORM:\*\* SQL nativo con pg

\- \*\*Docker:\*\* PostgreSQL en contenedor



---



\## 📦 Instalación



\### Requisitos previos



\- Node.js v18 o superior

\- Docker Desktop

\- Git



\### Pasos de instalación

```bash

\# 1. Clonar repositorio

git clone https://github.com/dennis840/amplify-backend.git

cd amplify-backend



\# 2. Instalar dependencias

cd backend

npm install



\# 3. Configurar variables de entorno

cp .env.example .env

\# Editar .env con tus credenciales



\# 4. Levantar base de datos PostgreSQL

cd ..

docker-compose up -d



\# 5. Iniciar servidor de desarrollo

cd backend

npm run dev

```



El servidor estará disponible en: `http://localhost:3000`



---



\## ⚙️ Variables de Entorno



Crear archivo `.env` en la carpeta `backend/`:

```env

\# Servidor

PORT=3000

NODE\_ENV=development



\# Base de datos PostgreSQL

DB\_HOST=localhost

DB\_PORT=5433

DB\_USER=postgres

DB\_PASSWORD=postgres

DB\_NAME=amplify\_dev



\# JWT

JWT\_SECRET=tu\_secreto\_muy\_seguro\_aqui

JWT\_EXPIRES\_IN=7d

```



⚠️ \*\*Importante:\*\* Cambiar `JWT\_SECRET` en producción por un valor aleatorio seguro.



---



\## 📚 API Endpoints



\### Base URL

```

http://localhost:3000

```



---



\### 🔓 Endpoints Públicos (Sin autenticación)



\#### 1. Health Check

```http

GET /health

```



\*\*Respuesta exitosa (200):\*\*

```json

{

&nbsp; "status": "ok",

&nbsp; "message": "AMPLIFY API running",

&nbsp; "timestamp": "2026-01-24T10:30:00.000Z"

}

```



---



\#### 2. Registro de Usuario

```http

POST /api/auth/register

Content-Type: application/json

```



\*\*Body:\*\*

```json

{

&nbsp; "name": "Juan Pérez",

&nbsp; "email": "juan@ejemplo.com",

&nbsp; "password": "Password123!",

&nbsp; "terms": true

}

```



\*\*Validaciones:\*\*

\- `name`: requerido, string

\- `email`: requerido, formato email válido

\- `password`: requerido, mínimo 8 caracteres (validación en frontend)

\- `terms`: requerido, debe ser `true`



\*\*Respuesta exitosa (201):\*\*

```json

{

&nbsp; "success": true,

&nbsp; "message": "Usuario registrado exitosamente",

&nbsp; "user": {

&nbsp;   "id": 1,

&nbsp;   "name": "Juan Pérez",

&nbsp;   "email": "juan@ejemplo.com"

&nbsp; },

&nbsp; "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

}

```



\*\*Errores posibles:\*\*

```json

// Email ya registrado (400)

{

&nbsp; "success": false,

&nbsp; "error": "El email ya está registrado"

}



// Campos faltantes (400)

{

&nbsp; "success": false,

&nbsp; "error": "Todos los campos son obligatorios"

}



// Términos no aceptados (400)

{

&nbsp; "success": false,

&nbsp; "error": "Debes aceptar los términos y condiciones"

}

```



---



\#### 3. Inicio de Sesión (SignIn)

```http

POST /api/auth/signin

Content-Type: application/json

```



\*\*Body:\*\*

```json

{

&nbsp; "email": "juan@ejemplo.com",

&nbsp; "password": "Password123!"

}

```



\*\*Respuesta exitosa (200):\*\*

```json

{

&nbsp; "success": true,

&nbsp; "message": "Inicio de sesión exitoso",

&nbsp; "user": {

&nbsp;   "id": 1,

&nbsp;   "name": "Juan Pérez",

&nbsp;   "email": "juan@ejemplo.com"

&nbsp; },

&nbsp; "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

}

```



\*\*Errores posibles:\*\*

```json

// Email no registrado (401)

{

&nbsp; "success": false,

&nbsp; "error": "Email no registrado"

}



// Contraseña incorrecta (401)

{

&nbsp; "success": false,

&nbsp; "error": "Contraseña incorrecta"

}



// Campos faltantes (400)

{

&nbsp; "success": false,

&nbsp; "error": "Email y contraseña son obligatorios"

}

```



---



\### 🔐 Endpoints Protegidos (Requieren autenticación)



\*\*Header requerido en todas las peticiones:\*\*

```http

Authorization: Bearer {TOKEN}

```



---



\#### 4. Obtener Usuario Actual

```http

GET /api/auth/me

Authorization: Bearer {TOKEN}

```



\*\*Respuesta exitosa (200):\*\*

```json

{

&nbsp; "success": true,

&nbsp; "user": {

&nbsp;   "id": 1,

&nbsp;   "name": "Juan Pérez",

&nbsp;   "email": "juan@ejemplo.com"

&nbsp; }

}

```



\*\*Errores posibles:\*\*

```json

// Token no proporcionado (401)

{

&nbsp; "success": false,

&nbsp; "error": "Token no proporcionado"

}



// Token inválido o expirado (401)

{

&nbsp; "success": false,

&nbsp; "error": "Token inválido o expirado"

}



// Usuario no encontrado (401)

{

&nbsp; "success": false,

&nbsp; "error": "Usuario no encontrado"

}

```



---



\## 🧪 Pruebas con PowerShell



\### Registro de usuario

```powershell

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" `

&nbsp; -Method POST `

&nbsp; -ContentType "application/json" `

&nbsp; -Body '{"name":"María González","email":"maria@test.com","password":"SecurePass456!","terms":true}'

```



\### Login

```powershell

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/signin" `

&nbsp; -Method POST `

&nbsp; -ContentType "application/json" `

&nbsp; -Body '{"email":"maria@test.com","password":"SecurePass456!"}'



$token = $response.token

```



\### Obtener usuario actual

```powershell

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/me" `

&nbsp; -Method GET `

&nbsp; -Headers @{ Authorization = "Bearer $token" }

```



---



\## 🗄️ Base de Datos



\### Esquema de tabla `users`

```sql

CREATE TABLE users (

&nbsp; id SERIAL PRIMARY KEY,

&nbsp; email VARCHAR(255) UNIQUE NOT NULL,

&nbsp; password\_hash VARCHAR(255) NOT NULL,

&nbsp; name VARCHAR(255) NOT NULL,

&nbsp; created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP

);

```



\### Conectar a PostgreSQL (desde Docker)

```bash

docker exec -it amplify\_db psql -U postgres -d amplify\_dev

```



Comandos útiles:

```sql

\\dt              -- Listar tablas

\\d users         -- Ver estructura de tabla users

SELECT \* FROM users;  -- Ver todos los usuarios

\\q               -- Salir

```



---



\## 📁 Estructura del Proyecto

```

backend/

├── src/

│   ├── config/

│   │   └── database.js          # Configuración PostgreSQL

│   ├── controllers/

│   │   └── authController.js    # Lógica de autenticación

│   ├── middlewares/

│   │   └── authMiddleware.js    # Verificación de JWT

│   ├── models/

│   │   └── userModel.js         # Queries SQL para users

│   ├── routes/

│   │   └── authRoutes.js        # Definición de rutas

│   ├── utils/

│   │   └── jwtUtils.js          # Generación/verificación JWT

│   └── index.js                 # Punto de entrada

├── tests/

│   └── server.test.js           # Tests básicos

├── .env.example                 # Plantilla de variables

├── .env                         # Variables (no versionado)

├── .gitignore

├── package.json

└── README.md

```



---



\## 🔒 Seguridad



\### Buenas prácticas implementadas:



✅ Passwords hasheados con bcrypt (salt rounds: 10)

✅ Tokens JWT con expiración (7 días por defecto)

✅ Validación de datos de entrada

✅ CORS habilitado para frontend

✅ Variables sensibles en .env (no versionadas)

✅ Middleware de autenticación para rutas protegidas



\### Recomendaciones adicionales para producción:



\- \[ ] Usar HTTPS obligatorio

\- \[ ] Implementar rate limiting

\- \[ ] Agregar helmet.js para headers de seguridad

\- \[ ] Logs de seguridad

\- \[ ] Sanitización de inputs

\- \[ ] Implementar refresh tokens



---



\## 🚢 Scripts Disponibles

```bash

npm run dev      # Inicia servidor en modo desarrollo (nodemon)

npm start        # Inicia servidor en modo producción

npm test         # Ejecuta tests con Jest

```



---



\## 🐛 Troubleshooting



\### Error: "Cannot find module"

```bash

cd backend

npm install

```



\### Error: "Database connection failed"

```bash

\# Verificar que Docker esté corriendo

docker ps



\# Levantar PostgreSQL

docker-compose up -d



\# Verificar credenciales en .env

```



\### Error: "Port 3000 already in use"

```bash

\# Cambiar PORT en .env

PORT=3001

```



---



\## 👥 Equipo de Desarrollo



\- \*\*Backend Lead:\*\* Hefesto (Dennis Santiago Villacís Vásquez)

\- \*\*Frontend Lead:\*\* Gepeto

\- \*\*Proyecto:\*\* BandasMatch - AMPLIFY



---



\## 📄 Licencia



ISC



---



\## 🔗 Enlaces



\- \*\*Repositorio Backend:\*\* https://github.com/dennis840/amplify-backend

\- \*\*Repositorio Frontend:\*\* https://github.com/dennis840/amplify-frontend



---



\## 📝 Changelog



\### v0.3.0-auth-complete (2026-01-24)

\- ✅ Sistema de autenticación completo

\- ✅ Middleware de verificación JWT

\- ✅ Endpoint GET /api/auth/me



\### v0.2.0-auth-signin (2026-01-24)

\- ✅ Endpoint POST /api/auth/signin

\- ✅ Validaciones de credenciales



\### v0.1.0-auth-register (2026-01-24)

\- ✅ Endpoint POST /api/auth/register

\- ✅ Tabla users en PostgreSQL

\- ✅ Hash de passwords con bcrypt



---



\*\*¿Preguntas? Contacta al equipo de desarrollo.\*\*



