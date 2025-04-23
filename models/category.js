const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    
    class Category extends Model {

        static associate(models) {
            this.belongsToMany(models.Article, {
                through: models.ArticleCategory,
                foreignKey: 'category_id',
                otherKey: 'article_id',
                as: 'articles',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            });
        }

    }

    Category.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            unique: true
        },
        slug: {
            type: DataTypes.STRING,
            unique: true
        },
    }, {
        sequelize,
        modelName: 'Category',
        tableName: 'categories',
        timestamps: true
    });

    return Category;
}