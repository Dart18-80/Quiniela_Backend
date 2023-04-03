const Team_Official_Pass = require("../database/models/Team_Official_Pass");
const Groups_Letter = require("../database/models/Groups_Letter");

let getOfficial_Pass = async (req, res) => {
    
    await Team_Official_Pass.findAll({
        attributes:{
            exclude: ['createdAt','updatedAt']
        },
        include:[{
            model: Groups_Letter,
            attributes:{
                exclude: ['createdAt','updatedAt']
            }
        }],
    })
    .then((Official_Pass) => {
        if(Official_Pass.length == 0){
            res.status(404).json({errors:[{message: "No hay Registros de equipos clasificados"}]});
            return;
        }
        else if (Official_Pass.length >= 1){
            res.status(200).json(Official_Pass);
            return;
        }
        else{
            res.status(400).json({errors:[{message: "Ocurrió un error con respecto a los Equipos Clasificados"}]});
            return;
        }
    })
}

let getResult_byLetter = async (req, res) =>{

    const DataLetter = req.params.Letter;
    let error_Letter = false;
    let Get_Letter;

    await Groups_Letter.findOne({
        attributes:{
            exclude: ['createdAt','updatedAt']
        },
        where:{
            Letter_Group: DataLetter
        }
    })
    .then((LetterNew) => {
        if(LetterNew == null){
            res.status(404).json({errors:[{message: "No existe un grupo con esa letra"}]});
            error_Letter = true;
        }
        else{
            Get_Letter = LetterNew.dataValues;
        }
    })
    .catch(err => {
        res.status(400).json(err);
        error_Letter = true;
    });

    if(error_Letter){
        return;
    }

    await Team_Official_Pass.findOne({
        attributes:{
            exclude: ['createdAt','updatedAt']
        },
        where:{
            ID_Groups_Letter: Get_Letter.ID
        },
        include:[{
            model: Groups_Letter,
            attributes:{
                exclude: ['createdAt','updatedAt']
            }
        }],
    })
    .then((Team_Official) => {
        if(Team_Official == null){
            res.status(404).json({errors:[{message: "No existe un registro para ese grupo"}]});
            return;
        }
        else{
            res.status(200).json(Team_Official);
            return;
        }
    })
    .catch(err => {
        res.status(400).json(err);
        return;
    });
}

let postOfficial_Pass = async (req, res) =>{

    const Data = req.body;

    let error_Letter = false;
    let error_team_pass = false;
    let Get_Letter;
    let Get_team_pass = "";

    await Groups_Letter.findOne({
        attributes:{
            exclude: ['createdAt','updatedAt']
        },
        where:{
            Letter_Group: Data.Group_Letter
        }
    })
    .then((LetterNew) => {
        if(LetterNew == null){
            res.status(404).json({errors:[{message: "No existe un grupo con esa letra"}]});
            error_Letter = true;
        }
        else{
            Get_Letter = LetterNew.dataValues;
        }
    })
    .catch(err => {
        res.status(400).json(err);
        error_Letter = true;
    });

    if(error_Letter){
        return;
    }
    
    await Team_Official_Pass.findOne({
        attributes:{
            exclude: ['createdAt','updatedAt']
        },
        where:{
            ID_Groups_Letter: Get_Letter.ID
        },
        include:[{
            model: Groups_Letter,
            attributes:{
                exclude: ['createdAt','updatedAt']
            }
        }],
    })
    .then((Team_Official) => {
        if(Team_Official != null){
            Get_team_pass = Team_Official.dataValues;
        }
    })
    .catch(err => {
        res.status(400).json(err);
        error_team_pass = false;
    });

    if(error_team_pass){
        return;
    }

    if(Get_team_pass == ""){
        await Team_Official_Pass.create({
            ID_Groups_Letter: Get_Letter.ID,
            Team_1: Data.Team_1,
            Team_2: Data.Team_2,
        })
        .then((newGroup) => {
            res.status(200).json({"message":"Registro Exitoso"});
            return;
        })
        .catch(err => {
            res.status(400).json(err);
            return;
        });
    }
    else{
        await Team_Official_Pass.update(
            {
                Team_1: Data.Team_1,
                Team_2: Data.Team_2,
            },
            {
                where:{
                    ID: Get_team_pass.ID
                }
            }
        )
        .then((newOfficialResult) => {
            res.status(200).json({"message":"Registro Exitoso"});
            return;
        })
        .catch(err => {
            res.status(400).json(err);
            return;
        });
    }
}

module.exports = {
    getOfficial_Pass,
    getResult_byLetter,
    postOfficial_Pass
}