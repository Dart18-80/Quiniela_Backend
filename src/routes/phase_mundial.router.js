const express = require('express');

const phase_mundialController = require('../controller/phase_mundial.controller');


const phase_mundialRouter = express.Router();

//Obtener phases del mundial
phase_mundialRouter.get("/", phase_mundialController.getPhases_Mundial);

//Crear nuevas fases del mundial
phase_mundialRouter.post("/", phase_mundialController.postPhases_Mundial);


module.exports = phase_mundialRouter;