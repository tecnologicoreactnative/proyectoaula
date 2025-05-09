# Aplicación de Restaurante

Esta es una aplicación móvil desarrollada con React Native para la gestión de un restaurante, que permite a los usuarios ver el menú, realizar pedidos y a los administradores gestionar los platos y pedidos.

## Características

- **Autenticación de Usuarios**
  - Registro y login de usuarios
  - Roles diferenciados (admin y cliente)
  - Cuenta Admin: adminrestaurante@gmail.com contraseña: admin123

- **Menú**
  - Visualización de platos disponibles
  - Detalles de cada plato (nombre, descripción, precio, imagen)
  - Selección de cantidad de platos

- **Pedidos**
  - Creación de pedidos
  - Visualización del historial de pedidos
  - Seguimiento del estado de los pedidos

- **Panel de Administración**
  - Gestión de platos (agregar, editar, eliminar)
  - Gestión de pedidos (actualizar estado)
  - Visualización de todos los pedidos

## Tecnologías Utilizadas

- React Native
- Firebase (Authentication, Firestore)
- Expo
- React Navigation
- Context API para gestión de estado

## Configuración del Proyecto

1. Clonar el repositorio
```bash
git clone [url-del-repositorio]
```

2. Instalar dependencias
```bash
npm install
```

3. Configurar Firebase
   - Crear un proyecto en Firebase
   - Configurar Authentication y Firestore
   - Agregar las credenciales en `firebaseConfig.js`

4. Iniciar la aplicación
```bash
npm start
```

## Estructura del Proyecto

```
restaurante/
├── assets/              # Imágenes y recursos
├── context/            # Contextos de React
│   ├── AuthContext.js
│   ├── PlatosContext.js
│   └── PedidosContext.js
├── screens/            # Pantallas de la aplicación
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   ├── MenuScreen.js
│   ├── AdminScreen.js
│   ├── EditPlatoScreen.js
│   ├── PedidosScreen.js
│   └── AdminPedidosScreen.js
├── firebaseConfig.js   # Configuración de Firebase
└── App.js             # Punto de entrada de la aplicación
```

## Reglas de Firestore

- **Platos**: Lectura pública, escritura solo para administradores
- **Pedidos**: 
  - Lectura para el usuario que creó el pedido y administradores
  - Creación para usuarios autenticados
  - Actualización solo para administradores
- **Usuarios**: 
  - Lectura y escritura para el propio usuario y administradores

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

