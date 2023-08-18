const getBooks = require("../controllers/getBooks");
const getBookById = require("../controllers/getBookById");

const handlerGetBooks = async (req, res) => {
  const { name } = req.query;

  try {
    let books;
    if (name) {
      books = await getBooksByName(name);
    } else {
      books = await getBooks();
    }
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ error: "Error al obtener los libros." });
  }
};

const handlerIdBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await getBookById(id);
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ error: "Error al obtener los libros por ID." });
  }
};

module.exports = { handlerGetBooks, handlerIdBook };
