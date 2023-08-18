const server = require("./src/app.js"); // Importa la configuración de tu aplicación Express desde app.js
const { conn } = require("./src/db.js"); // Importa la conexión a la base de datos desde db.js
require("dotenv").config(); // Carga las variables de entorno desde el archivo .env

const { PORT } = process.env; // Obtiene el número de puerto del archivo .env
const fillBd = require('./src/controllers/booksBd.js'); // Importa el archivo booksBd.js

async function startServer() {
  try {
    // Sincronizar todos los modelos de la base de datos.
    await conn.sync({ force: false }); // Esto crea o actualiza las tablas de la base de datos según los modelos definidos. 'force: true' borra y recrea las tablas en cada inicio del servidor (uso en desarrollo, ¡cuidado en producción!).
    //await fillBd();

    // Iniciar el servidor para que escuche en el puerto especificado.
    const app = server.listen(PORT, () => {
      console.log(`Server corriendo en el puerto ${PORT}`);
    });

    return app; // Retorna la instancia del servidor Express
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
  }
}

startServer(); // Llama a la función para iniciar el servidor
