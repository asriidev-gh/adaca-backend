const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const CategoryModel = require('./category.model')(sequelize, Sequelize);
const ItemModel = require('./item.model')(sequelize, Sequelize);

db.categories = CategoryModel;
db.items = ItemModel;

ItemModel.belongsTo(CategoryModel, { foreignKey: 'categoryId' });
CategoryModel.hasMany(ItemModel, { foreignKey: 'categoryId' });

module.exports = db;