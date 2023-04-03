const express = require('express');

const userController = require('../controller/user.controller');


const UserRouter = express.Router();

//Crear un usuario
UserRouter.post("/register", userController.register);

//Login del Usuario
UserRouter.post("/login", userController.login);


module.exports = UserRouter;
