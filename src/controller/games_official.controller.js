const Phase_Mundial = require("../database/models/Phase_Mundial");
const Games_Official = require("../database/models/Games_Official");
const Team = require("../database/models/Team");
const Register_WinnerMatch_User = require('../database/models/Register_WinnerMatch_User');

const authToken = require('../services/auth');

let getGames_Official = async (req, res) => {
    if(!req.headers.authorization){
        res.status(401).json({errors:[{message: "No autorizado."}]})
        return
    }

    const userData = authToken(req.headers.authorization);

    if(userData.message == 'Invalid token.'){
        res.status(401).json({errors:[{message: "No autorizado."}]});
        return;
    }

    const DataURL = req.params.NAME;
    let phase_mundial;
    let error_Phase = false;

    await Phase_Mundial.findOne({
        where:{
            Name_Phase: DataURL
        },
        attributes: {
            exclude: ['createdAt','updatedAt']
        }
    })
    .then((selectPhase) => {
        if(selectPhase != null){
            phase_mundial = {"ID": selectPhase.dataValues.ID, "Name_Phase": selectPhase.dataValues.Name_Phase};
        }
        else{
            res.status(400).json({errors:[{message: "No existe esta Fase."}]});
            error_Phase = true;
        }
    })
    .catch(err => {
        res.status(400).json(err);
        error_Phase = true;
    });

    if(error_Phase){
        return;
    }

    await Games_Official.findAll({
        include: [
            {
                model: Team,
                attributes: {
                    exclude: ['createdAt','updatedAt']
                }
            }
        ],
        where:{
            ID_Phase_Mundial: phase_mundial.ID
        },
        attributes: {
            exclude: ['createdAt','updatedAt']
        }
    })
    .then(async (GameOfficialORM) => {
        let response = {"Games_Official": [], "Phase_Mundial": phase_mundial}
        response.Games_Official = await Return_Response(GameOfficialORM, userData.id);

        res.status(200).json(response);
        return;
    })
    .catch(err => {
        res.status(400).json(err);
        return;
    });

    
}

function Return_Response (GameOfficialORM, ID_User){
    return new Promise (async (resolve) =>{
        let response = {"Games_Official": []}
        for await (const GameOfficialArray of GameOfficialORM){
            let Game = await Array_Orm(GameOfficialArray, ID_User)
            response.Games_Official.push(Game);
        }
        resolve(response.Games_Official);
    })
}

function Array_Orm(GameOfficialArray, ID_User){
    return new Promise ( async (resolve) => {
        let dataGame = GameOfficialArray.dataValues;
        let today = new Date();
        let Active;
        if(dataGame.Date_Begin > today){
            Active = true
        }else{
            Active = false
        }

        let Team_1 = {}

        await Team.findOne({
            where:{
                ID: dataGame.Team_1
            },
            attributes: {
                exclude: ['createdAt','updatedAt']
            }
        })
        .then((Team_Include)=>{
            Team_1 = Team_Include.dataValues;
        })

        let Registro_Partido;

        await Register_WinnerMatch_User.findOne({
            where:{
                ID_User: ID_User,
                ID_Game_Official: dataGame.ID 
            },
            attributes: {
                exclude: ['createdAt','updatedAt']
            }
        })
        .then((Registro)=>{
            if(Registro != null){
                Registro_Partido = Registro;
            }else{
                Registro_Partido = false;
            }
        })


        let Game_Official = {
            "ID_Game": dataGame.ID,
            "Date_Begin": dataGame.Date_Begin,
            "Date_Finish": dataGame.Date_Finish,
            "Team_1_ID": dataGame.Team_1,
            "Team_2_ID": dataGame.Team_2,
            "Team_1": Team_1,
            "Team_2": dataGame.Team,
            "Active": Active,
            "Register_Match": Registro_Partido
        }

        resolve(Game_Official)
    })
}


let postGames_Official = async (req, res) =>{
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
    let phase_mundial;
    let error_Phase = false;

    await Phase_Mundial.findOne({
        where:{
            Name_Phase: Data.name_phase
        },
        attributes: {
            exclude: ['createdAt','updatedAt']
        }
    })
    .then((selectPhase) => {
        if(selectPhase != null){
            phase_mundial = {"ID": selectPhase.dataValues.ID, "Name_Phase": selectPhase.dataValues.Name_Phase};
        }
        else{
            res.status(400).json({errors:[{message: "No existe esta Fase."}]});
            error_Phase = true;
        }
    })
    .catch(err => {
        res.status(400).json(err);
        error_Phase = true;
    });

    if(error_Phase){
        return;
    }

    await Games_Official.create({
        Team_1: Data.team_1,
        Team_2: Data.team_2,
        ID_Phase_Mundial: phase_mundial.ID,
        Date_Begin: Data.date_begin,
        Date_Finish: Data.date_finish,

    })
    .then((games_official) => {
        res.status(200).json({"ID": games_official.ID, "Team_1": games_official.Team_1, "Team_2": games_official.Team_2, "ID_Phase_Mundial": games_official.ID_Phase_Mundial});
        return;
    })
    .catch(err => {
        res.status(400).json(err);
        return;
    });
}

module.exports = {
    getGames_Official,
    postGames_Official
}