const Phase_Mundial = require("../database/models/Phase_Mundial");
const authToken = require('../services/auth')

let getPhases_Mundial = async (req, res) => {
    if(!req.headers.authorization){
        res.status(401).json({errors:[{message: "No autorizado."}]})
        return
    }

    const userData = authToken(req.headers.authorization);

    if(userData.message == 'Invalid token.'){
        res.status(401).json({errors:[{message: "No autorizado."}]});
        return;
    }

    await Phase_Mundial.findAll({
        attributes:{
            exclude: ['createdAt','updatedAt']
        }
    })
    .then((Phases_mundial) => {
        if(Phases_mundial.length == 0){
            res.status(404).json({errors:[{message: "No hay Fases del mundial"}]});
            return;
        }
        else if (Phases_mundial.length >= 1){
            res.status(200).json(Phases_mundial);
            return;
        }
        else{
            res.status(400).json({errors:[{message: "Ocurrió un error con respecto a la Fases del mundial"}]});
            return;
        }
    })
}

let postPhases_Mundial = async (req, res) =>{
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

    await Phase_Mundial.create({
        Name_Phase: Data.name_phase,
    })
    .then((Phases_mundial) => {
        res.status(200).json({"ID": Phases_mundial.ID, "Name_Team": Phases_mundial.Name_Phase});
        return;
    })
    .catch(err => {
        res.status(400).json(err);
        return;
    });
}

module.exports = {
    getPhases_Mundial,
    postPhases_Mundial
}