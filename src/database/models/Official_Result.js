const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Official_Result extends Model {}
Official_Result.init({
    ID:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
    },
    Goals_Team_Winner:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull:{
                msg: "Los goles del equipo ganador no pueden estar vacios"
            },
            isInt:{
                msg: "Los goles del equipo ganador no cuentan con el formato correcto"
            },
        },
    },
    Goals_Team_Losser:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull:{
                msg: "Los goles del equipo perdedor no pueden estar vacios"
            },
            isInt:{
                msg: "Los goles del equipo perdedor no cuentan con el formato correcto"
            },
        },
    }
},{
    sequelize,
    modelName: "Official_Result"
})

module.exports = Official_Result;