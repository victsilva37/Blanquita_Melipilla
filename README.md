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
| Supabase         | Almacenamiento de información (datos y archivos)|
| Socket.IO        | Comunicación en tiempo real         |
| Vercel           | Hosting backend/frontend            |
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


## Producto final

Con todo esto, el proyecto se encuentra desplegado desde Render y lo puedes ver accediendo a esta [url](https://blanquita-melipilla-front.vercel.app)



