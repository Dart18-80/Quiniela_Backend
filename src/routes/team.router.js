const express = require('express');

const teamController = require('../controller/team.controller');


const teamRouter = express.Router();

//Obtener Equipos
teamRouter.get("/", teamController.getTeam);

//Obtener Equipos por el nombre
teamRouter.get("/name", teamController.getTeam_byName);

//Crear nuevos Equipos
teamRouter.post("/", teamController.postTeam);


module.exports = teamRouter;
