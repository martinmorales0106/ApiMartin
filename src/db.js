require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DB_USER, DB_PASSWORD, DB_HOST } = process.env;

// crear una instancia de conexión a una base de datos PostgreSQL
const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/books`,
  {
    logging: false,
    native: false,
  }
);

// Función para cargar y definir los modelos
function defineModels() {
  const modelDefiners = [];

  fs.readdirSync(path.join(__dirname, "/models"))
    .filter(
      (file) =>
        file.indexOf(".") !== 0 && file.slice(-3) === ".js"
    )
    .forEach((file) => {
      modelDefiners.push(require(path.join(__dirname, "/models", file)));
    });

  // Sequelize se utiliza para interactuar con la base de datos utilizando los modelos definidos
  modelDefiners.forEach((modelDefiner) => modelDefiner(sequelize));

}

// Llamamos a la función para definir los modelos
defineModels();

// Relaciones entre modelos
const { Book, Language, Tag, Author} = sequelize.models;

Language.hasMany(Book, { foreignKey: 'languageId' });
Book.belongsTo(Language, { foreignKey: 'languageId' });


Book.belongsToMany(Author, { through: "author_book", timestamps: false }); //Crea tabla intermedia
Author.belongsToMany(Book, { through: "author_book", timestamps: false}); //Crea tabla intermedia

Book.belongsToMany(Tag, { through: "tag_book", timestamps: false }); //Crea tabla intermedia
Tag.belongsToMany(Book, { through: "tag_book", timestamps: false}); //Crea tabla intermedia

module.exports = {
  Book,
  Language,
  Tag,
  Author,
  conn: sequelize,
};
