const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Points extends Model {}
Points.init({
    ID:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
    },
    Points:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull:{
                msg: "Los puntos no pueden estar vacíos"
            },
            isInt:{
                msg: "Puntos está mal escrito"
            },
        },
    },
},{
    sequelize,
    modelName: "Points"
})

module.exports = Points;