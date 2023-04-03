const Register_WinnerMatch_User = require('../database/models/Register_WinnerMatch_User');
const Games_Official = require('../database/models/Games_Official');
const Phase_Mundial = require('../database/models/Phase_Mundial');

const authToken = require('../services/auth');


let getRegisterMatch = async (req, res) => {
    if(!req.headers.authorization){
        res.status(401).json({errors:[{message: "No autorizado."}]})
        return
    }

    const userData = authToken(req.headers.authorization);

    if(userData.message == 'Invalid token.'){
        res.status(401).json({errors:[{message: "No autorizado."}]});
        return;
    }

    const UserID = userData.id;
    const Data = req.query;
    let errorPhase = false;
    let Get_Phase_Mundial;

    await Phase_Mundial.findOne({
        where: {
            Name_Phase: Data.name_phase
        },
        attributes:{
            exclude: ['createdAt','updatedAt']
        }
    })
    .then((Phases_mundial) => {
        if(Phases_mundial == null){
            errorPhase = true;
            res.status(404).json({errors:[{message: "No existe fase del mundial"}]});
            return;
        }
        else {
            Get_Phase_Mundial = Phases_mundial;
        }
    }).catch(err => {
        errorPhase = true;
        res.status(400).json(err);
        return;
    });

    if(errorPhase){
        return;
    }

    await Register_WinnerMatch_User.findAll({
        include:{
            model: Games_Official,
            where: {
                ID_Phase_Mundial: Get_Phase_Mundial.dataValues.ID
            },
            attributes:{
                exclude: ['createdAt','updatedAt']
            }
        },
        where:{
            ID_User: UserID
        },
        attributes:{
            exclude: ['createdAt','updatedAt']
        }
    })
    .then((RegisterGroups) => {
        if(RegisterGroups.length == 0){
            res.status(200).json({"Exist": false});
        }else{
            res.status(200).json({"Exist": true, "Result_Register": RegisterGroups});
        }
    })
    .catch(err => {
        res.status(400).json(err);
        return;
    });
}

let postRegisterMatch = async (req, res) => {
    if(!req.headers.authorization){
        res.status(401).json({errors:[{message: "No autorizado."}]})
        return
    }

    const userData = authToken(req.headers.authorization);

    if(userData.message == 'Invalid token.'){
        res.status(401).json({errors:[{message: "No autorizado."}]});
        return;
    }

    const UserID = userData.id;
    const Data = req.body;
    let Register_Winner = "";

    await Register_WinnerMatch_User.findOne({
        where:{
            ID_Game_Official: Data.id_game_official,
            ID_User: UserID
        },
        attributes:{
            exclude: ['createdAt','updatedAt']
        }
    })
    .then((RegisterMatch) => {
        if(RegisterMatch != null){
            Register_Winner = RegisterMatch;
        }
    })
    .catch(err => {
        res.status(400).json(err);
        return;
    });

    if(Register_Winner == ""){
        await Register_WinnerMatch_User.create({
            Goals_Team_Winner: Data.goals_team_winner,
            Goals_Team_Losser: Data.goals_team_losser,
            ID_User: UserID,
            ID_Game_Official: Data.id_game_official,
            Winner: Data.winner
        })
        .then((RegisterMatch) => {
            res.status(200).json({"message":"Registro Exitoso"});
            return;
        })
        .catch(err => {
            res.status(400).json(err);
            return;
        });
    }
    else{
        await Register_WinnerMatch_User.update(
            {
                Goals_Team_Winner: Data.goals_team_winner,
                Goals_Team_Losser: Data.goals_team_losser,
                Winner: Data.winner
            },
            {
                where: {
                    ID: Register_Winner.ID,
                }
            }
        )
        .then((RegisterMatch) => {
            res.status(200).json({"message":"Registro Exitoso"});
            return;
        })
        .catch(err => {
            res.status(400).json(err);
            return;
        });
    }
    
}

let getRegisterMatch_byUser = async (req, res) => {
    const Data = req.query;

    await Register_WinnerMatch_User.findAll({
        where:{
            ID_User: Data.ID_user
        },
        attributes:{
            exclude: ['createdAt','updatedAt']
        }
    })
    .then((RegisterMatch) => {
        if(RegisterMatch.length == 0){
            res.status(200).json({"Exist": false});
        }else{
            res.status(200).json({"Exist": true, "Result_Register": RegisterMatch});
        }
    })
    .catch(err => {
        res.status(400).json(err);
        return;
    });
}


module.exports = {
    getRegisterMatch,
    postRegisterMatch,
    getRegisterMatch_byUser
}