const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    class SeoMetadata extends Model {
        
        static associate(models) {
            this.belongsTo(models.Article, {
                foreignKey: 'article_id',
                as: 'article'
            });
        }

    }

    SeoMetadata.init({
        meta_title: DataTypes.STRING,
        meta_description: DataTypes.TEXT,
        keywords: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'SeoMetadata',
        tableName: 'seo_metadata'
    });

    return SeoMetadata;
}