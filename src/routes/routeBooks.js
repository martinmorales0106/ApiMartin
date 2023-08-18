const { Router } = require("express");
const  {handlerGetBooks, handlerIdBook}  = require("../handlers/handlerBooks");



const routeBooks = Router();

routeBooks.get("/", handlerGetBooks);
routeBooks.get("/:id", handlerIdBook);

module.exports = routeBooks;
