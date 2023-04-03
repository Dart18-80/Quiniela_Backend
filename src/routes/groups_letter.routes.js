const express = require('express');

const groups_letterController = require('../controller/groups_letter.controller');


const Group_LetterRouter = express.Router();

//Obtener Grupos Existentes
Group_LetterRouter.get("/", groups_letterController.getGroup_Letter);

//Crear nuevos Grupos
Group_LetterRouter.post("/", groups_letterController.postGroup_Letter);

//Obtener Grupo Especifico
Group_LetterRouter.get("/:ID", groups_letterController.getIDLetter);

module.exports = Group_LetterRouter;