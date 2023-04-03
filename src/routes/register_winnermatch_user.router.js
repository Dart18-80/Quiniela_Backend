const express = require('express');

const register_winnermatch_userController = require('../controller/register_winnermatch_user.controller');


const register_winnermatch_userRouter = express.Router();

//Obtener los registros de una fase
register_winnermatch_userRouter.get("/", register_winnermatch_userController.getRegisterMatch);

//Crear nuevos registros de partidos
register_winnermatch_userRouter.post("/", register_winnermatch_userController.postRegisterMatch);

//Obtener Registros con el id del Usuario
register_winnermatch_userRouter.get("/lambda_resgister", register_winnermatch_userController.getRegisterMatch_byUser)


module.exports = register_winnermatch_userRouter;