const { Book, Author, Tag } = require('../db');

const getBookById = async (id) => {
  try {
    const book = await Book.findByPk(id, {
      include: [
        { model: Author, attributes: ['name'], through: { attributes: [] } }, // Include authors with specified attributes
        { model: Tag, attributes: ['name'], through: { attributes: [] } }      // Include tags with specified attributes
      ],
      attributes: ['id_book', 'title', 'published_date', 'price', 'description', 'rating_ave', 'image', 'page_count', 'url', 'active']
    });

    if (!book) {
      return null; // Book with given ID not found
    }

    const formattedBook = {
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
      tags: book.Tags.map(tag => tag.name)
    };

    return formattedBook;
  } catch (error) {
    console.error(`Error al obtener el libro con ID ${id}:`, error);
    return null;
  }
};

module.exports = getBookById;
