const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    class Article extends Model {

        static associate(models) {
            this.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'author'
            })

            this.belongsToMany(models.Category, {
                through: models.ArticleCategory,
                foreignKey: 'article_id',
                otherKey: 'category_id',
                as: 'categories',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            });

            this.hasOne(models.SeoMetadata, {
                foreignKey: 'article_id',
                as: 'seo'
            });

            this.hasMany(models.View, {
                foreignKey: 'article_id',
                as: 'views'
            });

            this.hasMany(models.Like, {
                foreignKey: 'article_id',
                as: 'likes'
            });

            this.belongsToMany(models.User, {
                through: models.Like,
                foreignKey: 'article_id',
                otherKey: 'user_id',
                as: 'likedBy',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            });
        }
    }

    Article.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        slug: DataTypes.STRING,
        content: DataTypes.TEXT,
        thumbnail: DataTypes.STRING,
        is_published: {
            type: DataTypes.BOOLEAN,
            default: false
        },
        published_at:  DataTypes.DATE
    }, {
        sequelize,
        modelName: 'Article',
        timestamps: true
    });

    return Article;
}
