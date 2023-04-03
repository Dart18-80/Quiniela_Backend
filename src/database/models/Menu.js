const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Menu extends Model {}
Menu.init({
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
    },
    Name_Fase: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Nombre de la fase no puede estar vacio"
            },
            is: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
            len: {
                args: [3, 20],
                msg: "El nombre debe tener un mínimo de 3 letras y un máximo de 20 letras"
            },
        },
    }
},{
    sequelize,
    modelName: "Menu"
})

module.exports = Menu;