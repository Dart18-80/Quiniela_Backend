const express = require('express');

const team_official_passController = require('../controller/team_official_pass.controller');


const team_official_passRouter = express.Router();

//Obtener todos los resultados
team_official_passRouter.get("/", team_official_passController.getOfficial_Pass);

//Obtener Resultado de un grupo Especifico
team_official_passRouter.get("/:Letter", team_official_passController.getResult_byLetter);

//Post de equipos que pasan
team_official_passRouter.post("/", team_official_passController.postOfficial_Pass);


module.exports = team_official_passRouter;
