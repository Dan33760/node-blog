const Sequelize = require('sequelize');

const sequelize = new Sequelize('newblog', 'root', '', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;