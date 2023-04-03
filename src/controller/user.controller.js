/*Modelo de la base de datos */
const User = require('../database/models/User');

/*Tokens para el login*/
const jwt = require('../services/jwt');
const EmailServices = require('../services/email');
const bcrypt = require("bcrypt-nodejs");

let register = async(req, res) => {
    const Data = req.body;
    let usuario = false;
    const PWD = Data.password.replace(" ", "");
    const email_User = Data.email.replace(" ", "");

    await User.findAll({
            where: {
                Email: email_User,
            }
        })
        .then((user) => {
            if (user.length != 0) {
                res.status(400).json({ errors: [{ message: "El Email ya existe" }] });
                usuario = true;
                return;
            }
        })
        .catch(err => {
            res.status(400).json(err);
            return;
        });

    if (usuario) {
        return;
    }

    let pass_hash = await Password_bcrypt(PWD);

    if(pass_hash === true){
        res.status(500).json({
            message: "No se puede cifrar la contraseña."
        });
        return;
    }

    const name_User = Data.name.replace(" ", "");
    const lastname_User = Data.lastname.replace(" ", "");
    const phone_User = Data.phone.replace(" ", "");

    await User.create({
        Name: name_User,
        Lastname: lastname_User,
        Phone: phone_User,
        Email: email_User,
        Password: pass_hash
    })
    .then((newUser) => {
        const emailResponse = EmailServices.sendRegister(Data);
        if (emailResponse === 500) {
            res.status(200).json({
                message: "Registrado con éxito sin enviar correo electrónico",
                userId: newUser
            });
        } else {
            res.status(200).json({
                message: "Registro Exitoso",
                userId: newUser
            });
        }
        return;
    })
    .catch(err => {
        res.status(400).json(err);
        return;
    });
}

function Password_bcrypt(pass){
    return new Promise ( resolve => {
        bcrypt.hash(pass, null, null, function (error, hash) {
            if (error) {
                resolve(true);
            }
            else {
                resolve(hash);
            }
        })
    })
}



let login = async(req, res) => {
    const Data = req.body;
    const email_User = Data.email.replace(" ", "");
    await User.findOne({
            where: {
                Email: email_User,
            },
            attributes: {
                exclude: ['createdAt','updatedAt']
            }
        })
        .then((user) => {
            if(user == null){
                res.status(404).json({ errors: [{ message: "Usuario no registrado" }] });
                return;
            }
            else{
                const User_Login = user.dataValues;
                bcrypt.compare(Data.password, User_Login.Password, function (err, check) {
                    if (err) {
                      res.status(500).json({ errors: [{ message: "No se puede comparar la contraseña." }, err] });
                    } else {
                      if (!check) {
                        res.status(401).json({ errors: [{ message: "Contraseña invalida." }] });
                      } else {
                        res.status(200).json({
                          token_type: "Bearer",
                          expires_in: 31536000,
                          access_token: jwt.createAccessToken(User_Login),
                          refresh_token: jwt.createRefreshToken(User_Login),
                          "User": {
                            "Name": User_Login.Name,
                            "Lastname": User_Login.Lastname,
                            "Email": User_Login.Email
                          }
                        });
                      }
                    }
                });
            }
        })
        .catch(err => {
            res.status(400).json(err);
            return;
        });
}

module.exports = {
    register,
    login
}