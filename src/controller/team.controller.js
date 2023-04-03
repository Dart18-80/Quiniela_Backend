const Team = require("../database/models/Team");
const authToken = require('../services/auth')

let getTeam = async (req, res) => {
    if(!req.headers.authorization){
        res.status(401).json({errors:[{message: "No autorizado."}]})
        return
    }

    const userData = authToken(req.headers.authorization);

    if(userData.message == 'Invalid token.'){
        res.status(401).json({errors:[{message: "No autorizado."}]});
        return;
    }

    await Team.findAll({
        attributes:{
            exclude: ['createdAt','updatedAt']
        }
    })
    .then((Teams) => {
        if(Teams.length == 0){
            res.status(404).json({errors:[{message: "No hay equipos"}]});
            return;
        }
        else if (Teams.length >= 1){
            res.status(200).json(Teams);
            return;
        }
        else{
            res.status(400).json({errors:[{message: "Ocurrió un error con respecto a los Equipos"}]});
            return;
        }
    })
}

let getTeam_byName = async (req, res) =>{

    const Data = req.query;

    await Team.findOne({
        attributes:{
            exclude: ['createdAt','updatedAt']
        },
        where:{
            Name_Team: Data.name_team
        }
    })
    .then((Teams) => {
        if(Teams == null){
            res.status(404).json({errors:[{message: "No existe un equipo con ese nombre"}]});
            return;
        }
        else{
            res.status(200).json(Teams);
            return;
        }
    })
}

let postTeam = async (req, res) =>{
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

    await Team.create({
        Name_Team: Data.name_team,
    })
    .then((newTeam) => {
        res.status(200).json({"ID": newTeam.ID, "Name_Team": newTeam.Name_Team});
        return;
    })
    .catch(err => {
        res.status(400).json(err);
        return;
    });
}

module.exports = {
    getTeam,
    postTeam,
    getTeam_byName
}