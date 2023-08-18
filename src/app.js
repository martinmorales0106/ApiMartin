const express = require('express'); // Importa el módulo Express
const cookieParser = require('cookie-parser'); // Importa el módulo para manejar cookies
const bodyParser = require('body-parser'); // Importa el módulo para analizar cuerpos de solicitud
const morgan = require('morgan'); // Importa el módulo para el registro de solicitudes
const routes = require('./routes/index.js'); // Importa el módulo que contiene las rutas de tu aplicación

const server = express(); // Crea una instancia de la aplicación Express

server.name = 'API'; // Define el nombre de la aplicación

// Middlewares
server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' })); // Configura el analizador de URL para decodificar datos codificados en la URL
server.use(bodyParser.json({ limit: '50mb' })); // Configura el analizador JSON para manejar cuerpos de solicitud JSON
server.use(cookieParser()); // Agrega el middleware para manejar cookies
server.use(morgan('dev')); // Configura el registro de solicitudes en formato "dev"
server.use((req, res, next) => {
  // Configura las cabeceras CORS para permitir las solicitudes desde un dominio específico
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // Actualiza el dominio para permitir las solicitudes desde tu cliente
  res.header('Access-Control-Allow-Credentials', 'true'); // Permite enviar y recibir cookies en las solicitudes CORS
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Configura las cabeceras permitidas
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE'); // Configura los métodos HTTP permitidos
  next(); // Pasa al siguiente middleware
});

// Rutas
server.use('/', routes); // Agrega las rutas definidas en el módulo routes

// Manejo de errores
server.use((err, req, res, next) => {
  const status = err.status || 500; // Obtiene el código de estado del error o usa 500 (Error interno del servidor) por defecto
  const message = err.message || 'Internal Server Error'; // Obtiene el mensaje del error o usa un mensaje genérico
  console.error(err); // Registra el error en la consola
  res.status(status).send(message); // Envía la respuesta de error con el código de estado y el mensaje
});

module.exports = server; // Exporta la instancia de la aplicación Express
