const express = require('express');

const menuController = require('../controller/menu.controller');


const menuRouter = express.Router();

//Obtener menu
menuRouter.get("/", menuController.getMenus);

//Crear nuevas opciones para el menu
menuRouter.post("/", menuController.postMenus);


module.exports = menuRouter;
