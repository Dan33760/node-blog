module.exports = (sequelize, DataTypes) => {
    const Article = sequelize.define(
        'Article',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true
            },
            title: {
                type: DataTypes.STRING,
                allowNulle: false
            },
            slug: DataTypes.STRING,
            content: DataTypes.TEXT,
            thumnail: DataTypes.STRING,
            is_published: {
                type: DataTypes.BOOLEAN,
                default: false
            },
            published_at:  DataTypes.DATE
        },
        {
            timestamps: true
        }
    );

    Article.associate = (models) => {
        Article.belongsTo(models.User);
    };

    return Article;
}
