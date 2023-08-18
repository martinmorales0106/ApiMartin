const axios = require("axios");
const pgp = require('pg-promise')();

const db = pgp('postgres://postgres:more0106@localhost:5432/books');


const fetchBooksFromGoogleBooks = async () => {
  const ISBN = [
    9780385534260, 9780274810567, 9780385528207, 9781250326751, 9780593652961,
    9780063226081, 9780807014271, 9780375726262, 9781878424365, 9786070780363,
    9780988221895, 9780988221895, 9781950922321, 9781476710402, 9780142403877,
    9781644737705, 9789974878068, 9780062511409, 9798388798442, 9780140449266,
    9781529111798, 9780156013987, 9783836587020, 9781452174464, 9780142437964,
    9781419729669, 9780934868075, 9780143106494, 9780140446043, 9780140446456,
    9782070360024, 9780805212679, 9783836587020, 9780863159473, 9780140441185,
    9780805243550, 9780142437186, 9780142437186, 9780143105244, 9780198321668,
    9780198328704, 9780486284699, 9780140150629, 9780140445145, 9780140445145,
    9781442498327, 9781635575576, 9781394196500, 9780545162074, 9781685130732,
    9780142407332, 9781476764665, 9781416995593, 9781728205489, 9780399501487,
    9780789910820, 9798651196104, 9780124077263, 9781118170519, 9798391200475,
    9780739048122, 9783836503990, 9783836535601, 9780739048153, 9780739054628,
    9783836559799, 9783836560146, 9783836529044, 9783836565677, 9781451695199,
    9798388798442, 9788491291916, 9786070788147, 9786070796746, 9781878424532,
    9786070799396, 9786070774249, 9781644737781, 9788419421890, 9786073821001,
    9781416995562, 9781728210292,
  ];
  const API_KEY = "AIzaSyA5Nt-jUQ5tNQBCLxFT4WjW8C8MWA0Dd2o";
  const baseUrl = "https://www.googleapis.com/books/v1/volumes?q=isbn:";

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const REQUEST_DELAY_MS = 1000; // Tiempo de espera entre solicitudes en milisegundos (1 segundo)

  let books = [];
  for (const isbn of ISBN) {
    try {

      const { data } = await axios.get(`${baseUrl}${isbn}&key=${API_KEY}`);

      if (data.items && data.items.length > 0) {
        const { volumeInfo } = data.items[0];
        const book = {
          id: isbn.toString(),
          title: volumeInfo.title,
          authors: volumeInfo.authors || ["none"],
          published_date: volumeInfo.publishedDate ? (
            volumeInfo.publishedDate.length === 4
              ? Number(volumeInfo.publishedDate)
              : Number(volumeInfo.publishedDate.slice(0, 4))
          ) : null,
          description: volumeInfo.description || "",
          publisher: volumeInfo.publisher || "Morgan Kaufmann",
          image: volumeInfo.imageLinks?.thumbnail || "",
          language: volumeInfo.language || "es",
          tags: volumeInfo.categories || ["Fiction"],
          price: (Math.random() * 50).toFixed(2),
          rating_ave: volumeInfo.averageRating || 3,
          page_count: volumeInfo.pageCount || (Math.random() * 200).toFixed(0),
          url: volumeInfo.canonicalVolumeLink || "",
        };
        books.push(book);
      }

      // Esperar antes de la siguiente solicitud
      await delay(REQUEST_DELAY_MS);
    
    } catch (error) {
      console.error(`Error fetching book with ISBN ${isbn}:`, error.message);
      return null; // Ignorar el libro con error y continuar con otros
    }
  };

  return books.filter((book) => book !== null); // Filtrar libros nulos causados por errores
};

// para mostrar los datos por consola
// (async () => {
//   const books = await fetchBooksFromGoogleBooks();
//   console.log(books);
// })();

const { Book, Tag, Language, Author } = require("../db");
const { NUMERIC } = require("sequelize");
// Llamamos a la función para definir los modelos


const fillBd = async () => {
  try {
    const books = await fetchBooksFromGoogleBooks();

    for (const book of books) {
      const language = await Language.findOrCreate({ where: { language: book.language } });
      
      const newBook = await Book.create({
        title: book.title,
        published_date: book.published_date,
        price: book.price,
        description: book.description,
        rating_ave: book.rating_ave,
        image: book.image,
        page_count: book.page_count,
        url: book.url,
        active: true,
        languageId: parseInt(language[0].dataValues.id)// Use the ID of the language
      });

      for (const authorName of book.authors) {
        const [author] = await Author.findOrCreate({ where: { name: authorName } });
        await newBook.addAuthor(author); // Use addAuthors instead of addAuthor
      }

      for (const tagName of book.tags) {
        const [tag] = await Tag.findOrCreate({ where: { name: tagName } });
        await newBook.addTag(tag);
      }
    }

    console.log('Inserciones completadas correctamente.');
  } catch (error) {
    console.error('Error al insertar datos:', error);
  }
};

module.exports = fillBd;
