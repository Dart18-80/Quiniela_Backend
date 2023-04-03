const Groups_letter = require("../database/models/Groups_Letter");
const authToken = require('../services/auth')

let getGroup_Letter = async (req, res) => {
    if(!req.headers.authorization){
        res.status(401).json({errors:[{message: "No autorizado."}]})
        return
    }

    const userData = authToken(req.headers.authorization);

    if(userData.message == 'Invalid token.'){
        res.status(401).json({errors:[{message: "No autorizado."}]});
        return;
    }

    await Groups_letter.findAll({
        attributes:{
            exclude: ['createdAt','updatedAt']
        }
    })
    .then((newGropsLetter) => {
        if(newGropsLetter.length == 0){
            res.status(404).json({errors:[{message: "No hay Grupos"}]});
            return;
        }
        else if (newGropsLetter.length >= 1){
            res.status(200).json(newGropsLetter);
            return;
        }
        else{
            res.status(400).json({errors:[{message: "Ocurrió un error con respecto a los Grupos"}]});
            return;
        }
    })
}

let postGroup_Letter = async (req, res) =>{
    if(!req.headers.authorization){
        res.status(401).json({errors:[{message: "No autorizado."}]})
        return
    }

    const userData = authToken(req.headers.authorization);

    if(userData.message == 'Invalid token.'){
        res.status(401).json({errors:[{message: "No autorizado."}]});
        return;
    }

    const Data = req.body;

    await Groups_letter.create({
        Letter_Group: Data.letter_group,
    })
    .then((newGroup) => {
        res.status(200).json({"ID": newGroup.ID, "Letter_Group": newGroup.Letter_Group});
        return;
    })
    .catch(err => {
        res.status(400).json(err);
        return;
    });
}

let getIDLetter = async (req, res) =>{
    if(!req.headers.authorization){
        res.status(401).json({errors:[{message: "No autorizado."}]})
        return
    }

    const userData = authToken(req.headers.authorization);

    if(userData.message == 'Invalid token.'){
        res.status(401).json({errors:[{message: "No autorizado."}]});
        return;
    }

    const Data = req;

    await Groups_letter.findOne({
        where:{
            ID: Data.params.ID
        },
        attributes: {
            exclude: ['createdAt','updatedAt']
        }
    })
    .then((newGroup) => {
        if(newGroup != null){
            res.status(200).json({"ID": newGroup.dataValues.ID, "Letter_Group": newGroup.dataValues.Letter_Group});
            return;
        }
        else{
            res.status(400).json({errors:[{message: "No existe este Grupo."}]});
            return;
        }
    })
    .catch(err => {
        res.status(400).json(err);
        return;
    });
}

module.exports = {
    getGroup_Letter,
    postGroup_Letter,
    getIDLetter
}