const express = require('express');

const register_winnergroup_userController = require('../controller/register_winnergroup_user.controller');


const register_winnergroup_userRouter = express.Router();

//Obtener Grupos Officiales Correspondientes
register_winnergroup_userRouter.get("/", register_winnergroup_userController.getRegisterGroups);

//Crear nuevos Grupos Oficiales
register_winnergroup_userRouter.post("/", register_winnergroup_userController.postRegisterGroups);

//Obtener Registros con el id del Usuario 
register_winnergroup_userRouter.get("/lambda_resgister", register_winnergroup_userController.getRegisterGroups_byUser)


module.exports = register_winnergroup_userRouter;