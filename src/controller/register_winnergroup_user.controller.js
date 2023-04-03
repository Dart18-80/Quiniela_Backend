const Register_WinnerGroup_User = require('../database/models/Register_WinnerGroup_User');

const authToken = require('../services/auth');


let getRegisterGroups = async (req, res) => {
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

    await Register_WinnerGroup_User.findOne({
        where:{
            ID_Groups_Letter: Data.id_groups_letter,
            ID_User: UserID
        },
        attributes:{
            exclude: ['createdAt','updatedAt']
        }
    })
    .then((RegisterGroups) => {
        if(RegisterGroups == null){
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

let postRegisterGroups = async (req, res) => {
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

    const Ultimate_Day = new Date("2022-11-25T00:00:00");
    const To_Day = Date.now();

    if(To_Day > Ultimate_Day){
        res.status(400).json({errors:[{message: "La fecha de ingreso de registros a expirado."}]});
        return;
    }

    await Register_WinnerGroup_User.findOne({
        where:{
            ID_Groups_Letter: Data.id_groups_letter,
            ID_User: UserID
        },
        attributes:{
            exclude: ['createdAt','updatedAt']
        }
    })
    .then((RegisterGroups) => {
        if(RegisterGroups != null){
            Register_Winner = RegisterGroups;
        }
    })
    .catch(err => {
        res.status(400).json(err);
        return;
    });

    if(Register_Winner == ""){
        await Register_WinnerGroup_User.create({
            Team_1: Data.team_1,
            Team_2: Data.team_2,
            ID_User: UserID,
            ID_Groups_Letter: Data.id_groups_letter
        })
        .then((RegisterGroup) => {
            res.status(200).json({"message":"Registro Exitoso", "Official_Group": {"Team_1": RegisterGroup.Team_1, "Team_2": RegisterGroup.Team_2, "ID_Groups_Letter": RegisterGroup.ID_Groups_Letter}});
            return;
        })
        .catch(err => {
            res.status(400).json(err);
            return;
        });
    }
    else{
        await Register_WinnerGroup_User.update(
            {
                Team_1: Data.team_1,
                Team_2: Data.team_2
            },
            {
                where: {
                    ID: Register_Winner.ID,
                    ID_Groups_Letter: Register_Winner.ID_Groups_Letter,
                    ID_User: Register_Winner.ID_User
                }
            }
        )
        .then((RegisterGroup) => {
            res.status(200).json({"message":"Registro Exitoso", "Official_Group": {"Team_1": Data.team_1, "Team_2": Data.team_2, "ID_Groups_Letter": Register_Winner.ID_Groups_Letter}});
            return;
        })
        .catch(err => {
            res.status(400).json(err);
            return;
        });
    }
    
}

let getRegisterGroups_byUser = async (req, res) => {
    const Data = req.query;

    await Register_WinnerGroup_User.findAll({
        where:{
            ID_User: Data.ID_user
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


module.exports = {
    getRegisterGroups,
    postRegisterGroups,
    getRegisterGroups_byUser
}