const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    class Like extends Model {
        static associate(models) {
            this.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user'
            });

            this.belongsTo(models.Article, {
                foreignKey: 'article_id',
                as: 'article'
            });
        }
    }

    Like.init({
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        article_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Like',
        tableName: 'likes',
        timestamps: true,
        updatedAt: false,
        indexes: [
            {
                unique: true,
                fields: ['user_id', 'article_id']
            }
        ]
    });

    return Like;
}