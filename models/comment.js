const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    class Comment extends Model {

        static associate(models) {
            
            // Un commentaire appartient a un utilisatur
            this.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'author'
            });

            // Un commentaire appartient a un article
            this.belongsTo(models.Article, {
                foreignKey: 'article_id',
                as: 'article'
            });

            // Un commentaire peut avoir un parent (thread)
            this.belongsTo(models.Comment, {
                foreignKey: 'parent_id',
                as: 'parent'
            });

            // Un commentaire peut avoir plusieurs reponses
            this.hasMany(models.Comment, {
                foreignKey: 'parent_id',
                as: 'replies'
            });
        }
    }

    Comment.init({
        content: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'Comment',
        tableName: 'comments',
        timestamps: true
    })

    return Comment;
}