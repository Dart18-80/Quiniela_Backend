const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class User extends Model {}
User.init({
    ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "El nombre no puede estar vacio"
            },
            is: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
            len: {
                args: [3, 20],
                msg: "El nombre debe tener un mínimo de 3 letras y un máximo de 20 letras"
            },
        },
    },
    Lastname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "El apellido no puede estar vacio"
            },
            is: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
            len: {
                args: [3, 20],
                msg: "El Apellido debe tener un mínimo de 3 letras y un máximo de 20 letras"
            },
        },
    },
    Phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "El telefono no puede estar vacio"
            },
            len: {
                args: [7, 20],
                msg: "El telefono debe tener un mínimo de 7 letras y un máximo de 20 letras"
            },
        },
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: "El correo no puede estar vacio"
            },
            isEmail: {
                args: true,
                msg: "El correo electrónico no está en el formato correcto"
            },
        },
    },
    Password: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: "La contraseña no puede estar vacio"
            }
        },
    }
}, {
    sequelize,
    modelName: "User"
})

module.exports = User;