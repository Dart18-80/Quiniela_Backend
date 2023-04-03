const express = require('express');

const pointsController = require('../controller/points.controller');


const pointsRouter = express.Router();

//Obtener puntos de un usuario
pointsRouter.get("/", pointsController.getPoints);

//Registrar los puntos de un usuario
pointsRouter.post("/", pointsController.postPoints);

//Realizar el conteo de los puntos en base a los registros
pointsRouter.post("/point_counter", pointsController.Post_Points_By_User);

//Puntos del top 10
pointsRouter.get("/top", pointsController.getTop_Points);


module.exports = pointsRouter;
