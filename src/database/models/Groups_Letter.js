const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Groups_Letter extends Model {}
Groups_Letter.init({
    ID:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
    },
    Letter_Group: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull:{
                msg: "El grupo debe de tener una letra"
            },
            isAlpha:{
                msg: "La letra está escrita incorrectamente"
            },
        },
    }
},{
    sequelize,
    modelName: "Groups_Letter"
})

module.exports = Groups_Letter;