const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Team extends Model {}
Team.init({
    ID:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
    },
    Name_Team: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull:{
                msg: "El nombre del equipo no puede estar vacio"
            },
            is: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u
        },
    }
},{
    sequelize,
    modelName: "Team"
})

module.exports = Team;