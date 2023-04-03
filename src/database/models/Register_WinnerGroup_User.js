const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Register_WinnerGroup_User extends Model {}
Register_WinnerGroup_User.init({
    ID:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
    }
},{
    sequelize,
    modelName: "Register_WinnerGroup_User"
})

module.exports = Register_WinnerGroup_User;