const Points = require("../database/models/Points");
const authToken = require('../services/auth');
const User = require("../database/models/User");
const Official_Result = require("../database/models/Official_Result");
const Team_Official_Pass = require("../database/models/Team_Official_Pass");
const Register_WinnerMatch_User = require('../database/models/Register_WinnerMatch_User');
const Register_WinnerGroup_User = require('../database/models/Register_WinnerGroup_User');
const Games_Official = require("../database/models/Games_Official");

let getPoints = async (req, res) => {
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

    await Points.findOne({
        where:{
            ID_User: UserID
        },
        attributes:{
            exclude: ['createdAt','updatedAt']
        }
    })
    .then((Points) => {
        if(Points != null){
            res.status(200).json({"Points": Points.dataValues.Points});
            return;
        }
        else{
            res.status(400).json({errors:[{message: "El usuario no tiene puntos."}]});
            return;
        }
    }).catch(err => {
        res.status(400).json(err);
        return;
    });
}

let getTop_Points = async (req, res) => {
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
    let Actual_User = {};
    let Error_PointsUser = false;

    await Points.findOne({
        where:{
            ID_User: UserID
        },
        attributes:{
            exclude: ['ID','ID_User','createdAt','updatedAt']
        },
        include:[
            {
                model: User,
                attributes:{
                    exclude: ['createdAt','updatedAt','Phone', 'DPI', 'Password', 'Email'] 
                }
            }
        ],
    })
    .then((Points) => {
        if(Points != null){
            Actual_User = Points.dataValues;
        }
        else{
            Actual_User = {
                "Points": 0,
                "User": {
                    "ID": UserID,
                }

            }
        }
    }).catch(err => {
        res.status(400).json(err);
        Error_PointsUser = true;
    });

    if(Error_PointsUser){
        return;
    }

    await Points.findAll({
        limit: 10,
        attributes:{
            exclude: ['ID','ID_User','createdAt','updatedAt']
        },
        include:[
            {
                model: User,
                attributes:{
                    exclude: ['createdAt','updatedAt','Phone', 'DPI', 'Password', 'Email'] 
                }
            }
        ],
        order:[
            ['Points', 'DESC']
        ]
    })
    .then((Top) => {
        if(Top.length != 0){
            res.status(200).json({"Actual_User": Actual_User, "Top_10": Top});
            return;
        }
        else{
            res.status(400).json({errors:[{message: "No existen usuarios con puntos registrados"}]});
            return;
        }
    })
    .catch(err => {
        res.status(400).json(err);
        return;
    });
}

let postPoints = async (req, res) =>{
    const Data = req.body;
    let PointsError = false;
    let Get_Points = "";

    await Points.findOne({
        where:{
            ID_User: Data.id_user
        },
        attributes:{
            exclude: ['createdAt','updatedAt']
        }
    })
    .then((Points) => {
        if(Points != null){
            Get_Points = Points;
        }
    }).catch(err => {
        PointsError = true;
        res.status(400).json(err);
        return;
    });

    if(PointsError){
        return;
    }

    if(Get_Points == ""){
        await Points.create({
            ID_User: Data.id_user,
            Points: Data.points
        })
        .then((newPoints) => {
            res.status(200).json({"message":"Registro Exitoso"});
            return;
        })
        .catch(err => {
            res.status(400).json(err);
            return;
        });
    }
    else{
        await Points.update(
            {
                Points: Data.points,
            },
            {
                where: {
                    ID: Get_Points.dataValues.ID
                }
            }
        )
        .then((updatePoints) => {
            res.status(200).json({"message":"Registro Exitoso"});
            return;
        })
        .catch(err => {
            res.status(400).json(err);
            return;
        });
    }
}

let Post_Points_By_User = async (req, res) =>{
    let UserError = false;
    let User_Array = [];
    let today = Date.now();
    const Ultimate_Day_Group = new Date("2022-12-03T00:00:00");

    await User.findAll({
        attributes:{
            exclude: ['createdAt','updatedAt']
        }
    })
    .then((Users) => {
        if(Users.length != 0){
            User_Array = Users;
        }else{
            UserError = true;
            res.status(400).json({"message":"No existen usuarios para realizar el conteo"});
        }
    }).catch(err => {
        UserError = true;
        res.status(400).json(err);
    });

    if(UserError){
        return;
    }

    for await (const User_Regist of User_Array){
        let User_Points = {
            "ID": User_Regist.dataValues.ID,
            "Point": 0,
        }

        let errorRegister_WinnerMatch = false;
        let registersMatch_forUser;

        await Register_WinnerMatch_User.findAll({
            where:{
                ID_User: User_Points.ID,
            },
            attributes:{
                exclude: ['createdAt','updatedAt']
            }
        })
        .then((Register_WinnerMatchs) => {
            if(Register_WinnerMatchs.length != 0){
                registersMatch_forUser = Register_WinnerMatchs;
            }else{
                errorRegister_WinnerMatch = true;
            }
        }).catch(err => {
            errorRegister_WinnerMatch = true;
        });

        if(!errorRegister_WinnerMatch){
            for await (const Registro_Partido of registersMatch_forUser){
                await Official_Result.findOne({
                    include: [
                        {
                            model: Games_Official,
                            attributes: {
                                exclude: ['createdAt','updatedAt']
                            }
                        }
                    ],
                    where:{
                        ID_Game_Official: Registro_Partido.dataValues.ID_Game_Official,
                    },
                    attributes:{
                        exclude: ['createdAt','updatedAt']
                    }
                })
                .then((Official_Results) => {
                    if(Official_Results != null){
                        if(today > Official_Result.dataValues.Games_Official.dataValues.Date_Finish){
                            User_Points.Point ++; 
                            if(Registro_Partido.dataValues.Winner == Official_Results.dataValues.Winner){
                                User_Points.Point ++;
                            }
                            if(Registro_Partido.dataValues.Goals_Team_Winner == Official_Results.dataValues.Goals_Team_Winner){
                                User_Points.Point ++;
                            }
                            if(Registro_Partido.dataValues.Goals_Team_Losser == Official_Results.dataValues.Goals_Team_Losser){
                                User_Points.Point ++;
                            }
                        }
                    }
                }).catch(err => {
                    console.log(err)
                });
            }
        }

        let errorRegister_WinnerGroup = false;
        let registersGroup_forUser;

        await Register_WinnerGroup_User.findAll({
            where:{
                ID_User: User_Points.ID,
            },
            attributes:{
                exclude: ['createdAt','updatedAt']
            }
        })
        .then((Register_WinnerGroups) => {
            if(Register_WinnerGroups.length != 0){
                registersGroup_forUser = Register_WinnerGroups;
                if(today > Ultimate_Day_Group){
                    User_Points.Point = User_Points.Point + Register_WinnerGroups.length;
                }
            }else{
                errorRegister_WinnerGroup = true;
            }
        }).catch(err => {
            errorRegister_WinnerGroup = true;
        });

        if(!errorRegister_WinnerGroup){
            for await (const registroGrupo of registersGroup_forUser){
                await Team_Official_Pass.findOne({
                    where:{
                        ID_Groups_Letter: registroGrupo.dataValues.ID_Groups_Letter,
                    },
                    attributes:{
                        exclude: ['createdAt','updatedAt']
                    }
                })
                .then((Team_Official) => {
                    if(Team_Official != null){
                        if(Team_Official.dataValues.Team_1 == registroGrupo.dataValues.Team_1){
                            User_Points.Point = User_Points.Point + 2;
                        }
                        if(Team_Official.dataValues.Team_2 == registroGrupo.dataValues.Team_2){
                            User_Points.Point = User_Points.Point + 2;
                        }

                        if(Team_Official.dataValues.Team_1 == registroGrupo.dataValues.Team_2){
                            User_Points.Point ++;
                        }
                        if(Team_Official.dataValues.Team_2 == registroGrupo.dataValues.Team_1){
                            User_Points.Point ++;
                        }
                    }
                }).catch(err => {
                    console.log(err)
                });
            }
        }

        let PointsError = false;
        let Get_Points = "";

        await Points.findOne({
            where:{
                ID_User: User_Points.ID
            },
            attributes:{
                exclude: ['createdAt','updatedAt']
            }
        })
        .then((Points) => {
            if(Points != null){
                Get_Points = Points;
            }
        }).catch(err => {
            PointsError = true;
        });

        if(PointsError){
            return;
        }

        if(Get_Points == ""){
            await Points.create({
                ID_User: User_Points.ID,
                Points: User_Points.Point
            })
            .then((newPoints) => {
            })
            .catch(err => {
            });
        }
        else{
            await Points.update(
                {
                    Points: User_Points.Point,
                },
                {
                    where: {
                        ID: Get_Points.dataValues.ID
                    }
                }
            )
            .then((updatePoints) => {
            })
            .catch(err => {
            });
        }
    }

    res.status(200).json({"message":"Registro Exitoso"});
    return;
}

module.exports = {
    getPoints,
    postPoints,
    Post_Points_By_User,
    getTop_Points
}