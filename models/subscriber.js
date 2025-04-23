const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    
    class Subscriber extends Model {
        static associate(models) {
            
        }
    }

    Subscriber.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        subscribed_at: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'Subscriber',
        tableName: 'subscribers',
        timestamps: true
    });

    return Subscriber;
}