const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    
    class Contact extends Model {
        static associate(models) {
            
        }
    }

    Contact.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        subject: DataTypes.STRING,
        message: DataTypes.TEXT,
    }, {
        sequelize,
        modelName: 'Contact',
        tableName: 'contacts',
        timestamps: true
    });

    return Contact;
}