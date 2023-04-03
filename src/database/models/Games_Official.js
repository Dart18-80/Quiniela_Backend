const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Games_Official extends Model {}
Games_Official.init({
    ID:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
    },
    Date_Begin: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate:{
                args: true,
                msg: "Fecha de inicio no está en el formato correcto"
            },
        },
    },
    Date_Finish: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate:{
                args: true,
                msg: "Fecha de fin no está en el formato correcto"
            },
        },
    }
},{
    sequelize,
    modelName: "Games_Official"
})

module.exports = Games_Official;