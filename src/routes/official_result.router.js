const express = require('express');

const official_resultController = require('../controller/official_result.controller');


const official_resultRouter = express.Router();

//Obtener el resultado official
official_resultRouter.get("/:ID", official_resultController.getOfficial_Result);

//Crear o modificar un nuevo resultado official
official_resultRouter.post("/", official_resultController.postOfficial_Result);


module.exports = official_resultRouter;
