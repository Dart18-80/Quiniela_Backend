const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Team_Official_Pass extends Model {}
Team_Official_Pass.init({
    ID:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
    }
},{
    sequelize,
    modelName: "Team_Official_Pass"
})

module.exports = Team_Official_Pass;