module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNulle: false
            },
            email: {
                type: DataTypes.STRING,
                allowNulle: false,
                unique: true
            },
            password: {
                type: DataTypes.STRING,
                allowNulle: false,
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
        },
        {
            timestamps: true
        }
    );

    User.associate = (models) => {
        User.hasMany(models.Article);
    };

    return User;
}