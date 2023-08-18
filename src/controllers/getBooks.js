const { Book, Author, Tag, Language } = require('../db');

const getBooks = async () => {
  try {
    const books = await Book.findAll({
      include: [
        { model: Author, attributes: ['name'], through: { attributes: [] } }, // Include authors with specified attributes
        { model: Tag, attributes: ['name'], through: { attributes: [] } },      // Include tags with specified attributes
        { model: Language, attributes: ['language'], foreignKey: 'languageId' }
      ],
      attributes: ['id_book', 'title', 'published_date', 'price', 'description', 'rating_ave', 'image', 'page_count', 'url', 'active']
    });

    const formattedBooks = books.map(book => {
      return {
        id: book.id_book,
        title: book.title,
        published_date: book.published_date,
        price: book.price,
        description: book.description,
        rating_ave: book.rating_ave,
        image: book.image,
        page_count: book.page_count,
        url: book.url,
        active: book.active,
        authors: book.Authors.map(author => author.name),
        tags: book.Tags.map(tag => tag.name),
        language: book.Language.language
      };
    });

    return formattedBooks;
  } catch (error) {
    console.error('Error al obtener los libros:', error);
    return [];
  }
};

module.exports = getBooks;

