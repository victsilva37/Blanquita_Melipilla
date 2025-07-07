# Blanquita Melipilla

Aplicación web desarrollada para visualizar productos de un pequeño emprendimiento de envases y troquelados. 

Este proyecto nace como parte de un aprendizaje autónomo, combinando tecnologías modernas como React, Node.js, PostgreSQL, WebSockets y Amazon S3. Está diseñado para ser escalable, fácil de mantener y visualmente claro.

## Tecnologías usadas 

| Tecnología       | Propósito                           |
|------------------|-------------------------------------|
| React            | Frontend SPA                        |
| TypeScript       | Tipado estático                     |
| Express.js       | Servidor backend REST API           |
| PostgreSQL       | Base de datos relacional            |
| AWS S3           | Almacenamiento de imágenes          |
| Socket.IO        | Comunicación en tiempo real         |
| Render.com       | Hosting backend/frontend            |
| JWT              | Autenticación por token             |

## Estructura del proyecto (Archivos y carpetas clave)

### Frontend (react-project/)
Contiene todo el código fuente de la interfaz web desarrollada con React y TypeScript. Se organiza por componentes reutilizables y estilos personalizados.

* **assets/:** Contiene imágenes, fuentes y archivos estáticos utilizados en la UI.

* **components/:** Componentes reutilizables que construyen la interfaz. Ejemplo: cards de productos, modales.

* **interfaces/:** Tipos e interfaces TypeScript. Define estructuras como Producto.

* **layouts/:** Estructura general de la página (cabecera, navegación, etc.).

* **pages/:** Páginas específicas o secciones completas del sitio.

* **main.tsx:** Punto de entrada de React. Renderiza la app y configura el enrutador.

* **index.css:** Estilos globales de la aplicación.

* **index.html:** Plantilla HTML base en la que se monta la app React.


### Backend (node-project/)

Contiene la lógica del servidor backend usando Express, incluyendo conexión a base de datos, subida de imágenes a AWS S3, y autenticación por JWT.

* **database.js:** Conexión y configuración con la base de datos PostgreSQL mediante pg.

* **s3Uploader:** Encapsula la lógica para subir imágenes a AWS S3 desde base64. Retorna la URL pública.

* **token.js:** 	Middleware para autenticar rutas protegidas usando JWT.

* **server.js:** Punto de entrada principal del servidor Express. Define rutas, middlewares, sockets y configuración.

Para mantener un código modular y ordenado, se utiliza una nomenclatura específica en los nombres de los archivos dentro de components, que ayuda a identificar rápidamente el propósito de cada archivo y facilita la mantenibilidad:

* **index_:** Contiene el componente principal que retorna el TSX. Es el archivo donde está el return que define la estructura visual y la composición de ese componente.

* **styles_:** Define los estilos del componente. Centraliza toda la definición visual, permitiendo separar la lógica y el render del estilo.

* **func_:** Contiene la lógica relacionada con ese componente. Aquí se colocan funciones auxiliares, manejo de estados, cálculos o cualquier lógica que no sea directamente la UI o el estilo.

Cada carpeta principal dentro del proyecto está organizada para que los elementos correspondientes a cada layout o pestaña de la aplicación estén claramente diferenciados. Esto sigue un enfoque modular, donde cada funcionalidad de la app (Inicio, Menú, Información) tiene sus propios submódulos o componentes distribuidos en las carpetas principales.


## Entorno de desarrollo

### Requisitos previos

Para una correcta ejecución de proyecto, asegúrate de tener instalado lo siguiente en tu equipo:

* Node.js v18 o superior (incluye npm)

El backend ya está desplegado y configurado en la nube de Render, por lo que no es necesario ejecutarlo localmente.

### Pasos para ejecución

1. Clonar el repositorio.

```bash
git clone https://github.com/victsilva37/blanquita-melipilla.git
```

2. Entrar al proyecto del frontend.

```bash
cd react-project
```

3. Instalar las dependencias

```bash
npm install
```

4. Iniciar la aplicación en modo desarrollo

```bash
npm run dev
```

### Seguridad y autenticación

La aplicación implementa un sistema de autenticación mediante JWT (JSON Web Tokens) para proteger el acceso a los recursos del backend. La mayoría de las rutas están protegidas con middleware que verifica la validez del token JWT enviado en el header Authorization.

Los tokens tienen una duración de 7 días (168h) por motivos de seguridad.

El flujo de autenticación consiste en lo siguiente: 

* Se realiza a través de una petición POST al endpoint /api/login.

* Se validan las credenciales contra variables de entorno (USERNAME y PASSWORD).

* Si las credenciales son válidas, se genera y retorna un JWT firmado.

Por seguridad, el token no se almacena en el frontend permanentemente y se renueva manualmente cuando expira utilizando Postman.
Además es almacenado como variable de entorno dentro del proyecto React.

Esta estructura permite mantener el backend protegido, mientras que el frontend puede consumir los datos de forma controlada y segura.

