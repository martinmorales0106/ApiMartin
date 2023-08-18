const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "Book",
    {
      id_book: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      published_date: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      rating_ave: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      page_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      url: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      timestamps: false,
    }
  );
};
