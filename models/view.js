const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    class View extends Model {
        static associate(models) {
            this.belongsTo(models.Article, {
                foreignKey: 'article_id',
                as: 'article'
            });
        }
    }

    View.init({
        user_ip: DataTypes.STRING,
        user_agent: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'View',
        tableName: 'views',
        timestamps: true,
        updatedAt: false
    });

    return View;
}