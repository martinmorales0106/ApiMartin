const { Router } = require("express");
const routeBooks= require("./routeBooks");

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();
router.use("/books", routeBooks);


// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

module.exports = router;
