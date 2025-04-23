const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class ArticleCategory extends Model {
        static associate() {

        }
    }

    ArticleCategory.init({}, {
        sequelize,
        modelName: 'ArticleCategory',
        tableName: 'article_category'
    });

    return ArticleCategory;
}