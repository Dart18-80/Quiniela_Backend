const express = require('express');

const groups_officialController = require('../controller/groups_official.controller');


const groups_officialRouter = express.Router();

//Obtener Grupos Officiales Correspondientes
groups_officialRouter.get("/", groups_officialController.getGroupsOfficial);

//Crear nuevos Grupos Oficiales
groups_officialRouter.post("/", groups_officialController.postGroupsOfficial);

//Obtener Equipos Dependiendo El Grupo
groups_officialRouter.get("/:ID", groups_officialController.getLetterGroupsOfficial);


module.exports = groups_officialRouter;