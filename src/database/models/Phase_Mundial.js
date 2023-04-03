const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Phase_Mundial extends Model {}
Phase_Mundial.init({
    ID:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
    },
    Name_Phase: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull:{
                msg: "El nombre de la fase no puede estar vacía"
            },
            is: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u
        },
    }
},{
    sequelize,
    modelName: "Phase_Mundial"
})

module.exports = Phase_Mundial;