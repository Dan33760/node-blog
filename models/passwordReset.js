const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    class PasswordReset extends Model {

        static associate(models) {

        }

    }

    PasswordReset.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        email: DataTypes.STRING,
        token: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'PasswordReset',
        tableName: 'password_resets'
    });

    return PasswordReset;
}