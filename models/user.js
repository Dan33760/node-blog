const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    class User extends Model {

        static associate(models) {
            User.hasMany(models.Article, {
                foreignKey: 'user_id',
                as: 'articles'
            });

            this.hasMany(models.Like, {
                foreignKey: 'user_id',
                as: 'likes'
            });

            this.belongsToMany(models.Article, {
                through: models.Like,
                foreignKey: 'user_id',
                otherKey: 'article_id',
                as: 'likedArticles',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            });
        }


    }

    User.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM,
            values: ['reader', 'editor', 'admin']
        },
        avatar: {
            type: DataTypes.STRING
        },
        bio: {
            type: DataTypes.TEXT
        }
    }, {
        sequelize,
        modelName: 'User',
        timestamps: true
    });

    return User;
}