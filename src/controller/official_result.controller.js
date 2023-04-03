const Official_Result = require("../database/models/Official_Result");
const Games_Official = require("../database/models/Games_Official");

let getOfficial_Result = async (req, res) => {
    const Data = req;

    await Official_Result.findOne({
        where:{
            ID_Game_Official: Data.params.ID
        },
        attributes: {
            exclude: ['createdAt','updatedAt']
        }
    })
    .then((newOfficialResult) => {
        if(newOfficialResult != null){
            res.status(200).json(newOfficialResult);
            return;
        }
        else{
            res.status(400).json({errors:[{message: "No existe un resultado Oficial asociado a dicho juego oficial."}]});
            return;
        }
    })
    .catch(err => {
        res.status(400).json(err);
        return;
    });

    
}

let postOfficial_Result = async (req, res) =>{

    const Data = req.body;
    let errorGame_Official = false;
    let Get_Game_Official = "";

    await Games_Official.findOne({
        where:{
            Team_1: Data.team_1,
            Team_2: Data.team_2
        },
        attributes:{
            exclude: ['createdAt','updatedAt']
        }
    }).then((newGame_Official) => {
        if(newGame_Official == null){
            res.status(400).json({errors:[{message: "No existe un partido official con esos equipos."}]});
            errorGame_Official = true;
        }else{
            Get_Game_Official = newGame_Official;
        }
    })
    .catch(err => {
        errorGame_Official = true;
        res.status(400).json(err);
    });

    if(errorGame_Official){
        return;
    }

    let errorOfficialResult = false;
    let get_officialResult;

    await Official_Result.findOne({
        where:{
            ID_Game_Official: Get_Game_Official.dataValues.ID
        },
        attributes:{
            exclude: ['createdAt','updatedAt']
        }
    }).then((newOfficial_Result) => {
        getOfficial_Result = newOfficial_Result
    })
    .catch(err => {
        errorOfficialResult = true;
        res.status(400).json(err);
    });

    if(getOfficial_Result == null){
        await Official_Result.create({
            Goals_Team_Winner: Data.goals_team_winner,
            Goals_Team_Losser: Data.goals_team_losser,
            ID_Game_Official: Get_Game_Official.dataValues.ID,
            Winner: Data.winner
        })
        .then((newOfficialResult) => {
            res.status(200).json({"message":"Registro Exitoso"});
            return;
        })
        .catch(err => {
            res.status(400).json(err);
            return;
        });
    }else{
        await Official_Result.update(
            {
                Goals_Team_Winner: Data.goals_team_winner,
                Goals_Team_Losser: Data.goals_team_losser,
                Winner: Data.winner
            },
            {
                where:{
                    ID: getOfficial_Result.dataValues.ID
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
    getOfficial_Result,
    postOfficial_Result
}