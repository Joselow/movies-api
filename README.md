# API Movies

Bienvenido a la API de Movies. Este proyecto te permite gestionar información sobre películas y géneros. A continuación, encontrarás los pasos para instalar, configurar y ejecutar la API.

## Instalación

1. **Clonar el Repositorio:**
   ```bash
   git clone https://github.com/Joselow/movies-api.git
   cd tu-proyecto
   npm install

##  Configuración de la Base de Datos:

1. **Crea una base de datos en MySQL.**
Abre el archivo .env y configura las credenciales de tu base de datos:
env
   ```bash
   DB_HOST=tu-host
   DB_USER=tu-usuario
   DB_PASSWORD=tu-contraseña
   DB_DATABASE=tu-base-de-datos

 2.  **Ejecución del Servidor:**
Ejecuta el servidor con el siguiente comando:
1. **Clonar el Repositorio:**
   ```bash
    npm run dev:mysql
   
##   Pruebas con Interfaz
Abre el archivo web/index.html en tu navegador para realizar pruebas interactivas.

##   Pruebas con el Archivo api.http:
Instala la extensión REST Client en Visual Studio Code.
Haz clic en "Send Request" que se encuentra sobre cada ruta en el archivo api.http.


¡Gracias por utilizar la API Movies! Si tienes alguna pregunta o encuentras algún problema, no dudes en contactarnos. ¡Disfruta gestionando tu colección de películas! 😊
