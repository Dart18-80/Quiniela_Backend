const express = require('express');

const games_officialController = require('../controller/games_official.controller');


const games_officialRouter = express.Router();

//Obtener partidos apartir del ID de las phases
games_officialRouter.get("/:NAME", games_officialController.getGames_Official);

//Crear Partidos
games_officialRouter.post("/", games_officialController.postGames_Official);


module.exports = games_officialRouter;