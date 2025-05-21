# Restaurante Colombiano - App Móvil

Aplicación móvil desarrollada con React Native y Firebase que incluye sistema de autenticación y menú de platos típicos colombianos.

## Historial de Cambios y Ajustes para Entrega

- **Notificaciones Push:**
  - Se implementó el sistema de notificaciones push usando Expo Notifications y Firebase.
  - Se creó y configuró `utils/notifications.js` para el manejo de notificaciones.
  - Se actualizó el contexto de autenticación y pedidos para registrar y enviar tokens de notificación.
  - Se agregó lógica para enviar notificaciones locales en emulador/desarrollo y push en dispositivos físicos.
  - Se mejoró el manejo de errores y logs para facilitar el diagnóstico.
  - Se eliminaron las notificaciones de prueba automáticas al iniciar sesión.

- **Ajustes de Build y Compatibilidad:**
  - Se forzó la versión de Kotlin a `1.7.20` en los archivos `android/build.gradle` y `android/gradle.properties` para evitar errores de incompatibilidad con el compilador de Jetpack Compose.
  - Se corrigieron advertencias y errores de configuración en archivos nativos de Android.
  - Se eliminaron todos los comentarios del código fuente para entrega limpia.

- **Preparación para Entrega:**
  - Se documentó el proceso de generación del APK usando EAS Build de Expo.
  - Se recomienda entregar el enlace directo del APK generado por Expo y el repositorio de GitHub con el código fuente.

---

## Características

- Autenticación completa con Firebase
  - Registro de usuarios con nombre y apellidos
  - Inicio de sesión con email y contraseña
  - Persistencia de sesión
  - Cierre de sesión

- Menú de Platos Típicos
  - Visualización de platos colombianos
  - Imágenes, descripciones y precios
  - Interfaz con scroll y diseño de tarjetas
  - 5 platos típicos colombianos

- UI/UX
  - Diseño responsive
  - Manejo de estados de carga
  - Validaciones de formularios
  - Navegación fluida
  - Soporte para iOS y Android

## Requisitos Previos

- Node.js (versión 14 o superior)
- npm o yarn
- Expo CLI
- Un editor de código (VS Code recomendado)
- Cuenta en Firebase

## Estructura del Proyecto

proyecto/
├── assets/
│ ├── icon.jpg # Icono de la aplicación
│ ├── icon-splash.jpg # Imagen de splash screen
│ └── platos/ # Imágenes de los platos
│ ├── bandejapaisa.jpg
│ ├── ajiaco-santafereño.jpg
│ ├── sancochogallina.jpg
│ ├── lechona.jpg
│ └── cazuela-mariscos.jpg
├── screens/
│ ├── LoginScreen.js # Pantalla de inicio de sesión
│ ├── RegisterScreen.js # Pantalla de registro
│ └── MenuScreen.js # Pantalla del menú de platos
├── context/
│ └── AuthContext.js # Contexto de autenticación
├── navigation/
│ └── AuthStack.js # Navegación de la app
├── firebaseConfig.js # Configuración de Firebase
├── App.js # Componente principal
└── app.json # Configuración de Expo

## Configuración del Proyecto

### 1. Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>

# Instalar dependencias
npm install
# o
yarn install
```

### 2. Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
API_KEY=tu_api_key_de_firebase
AUTH_DOMAIN=tu_auth_domain
PROJECT_ID=tu_project_id
STORAGE_BUCKET=tu_storage_bucket
MESSAGING_SENDER_ID=tu_messaging_sender_id
APP_ID=tu_app_id
```

### 3. Configuración de Firebase

1. Crear proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilitar Authentication con Email/Password
3. Copiar credenciales al archivo `.env`

## Ejecutar el Proyecto

```bash
# Iniciar en modo desarrollo
npm start
# o
yarn start
```

## Características de Autenticación

- Registro de Usuario
  - Nombre y apellidos separados
  - Validación de email
  - Contraseña segura (mínimo 8 caracteres)
  - Confirmación de contraseña

- Inicio de Sesión
  - Email y contraseña
  - Persistencia de sesión
  - Manejo de errores

## Menú de Platos

- Platos disponibles:
  - Bandeja Paisa
  - Ajiaco Santafereño
  - Sancocho de Gallina
  - Lechona Tolimense
  - Cazuela de Mariscos

- Cada plato incluye:
  - Imagen del plato
  - Nombre
  - Descripción detallada
  - Precio

## Tecnologías Utilizadas

- React Native
- Expo
- Firebase Authentication
- React Navigation
- Context API

## Mejoras Futuras

- Agregar más platos al menú
- Implementar sistema de pedidos
- Agregar carrito de compras
- Integrar pagos en línea
- Perfil de usuario personalizable

## Solución de Problemas

Si encuentras problemas al ejecutar la aplicación:

1. Verifica la configuración de Firebase
2. Asegúrate de tener todas las variables de entorno
3. Limpia la caché:
   ```bash
   npm cache clean --force
   # o
   yarn cache clean
   ```
4. Reinstala las dependencias:
   ```bash
   rm -rf node_modules
   npm install
   # o
   yarn install
   ```

