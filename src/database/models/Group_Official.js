const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Group_Official extends Model {}
Group_Official.init({
    ID:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
    }
},{
    sequelize,
    modelName: "Group_Official"
})

module.exports = Group_Official;