const Groups_official = require('../database/models/Group_Official');
const Groups_Letter = require('../database/models/Groups_Letter');
const Team = require('../database/models/Team');

const authToken = require('../services/auth');

let getGroupsOfficial = async (req, res) => {
    if(!req.headers.authorization){
        res.status(401).json({errors:[{message: "No autorizado."}]})
        return
    }

    const userData = authToken(req.headers.authorization);

    if(userData.message == 'Invalid token.'){
        res.status(401).json({errors:[{message: "No autorizado."}]});
        return;
    }


    await Groups_official.findAll({
        attributes:{
            exclude: ['createdAt','updatedAt']
        }
    })
    .then((OfficialGroup) => {
        if(OfficialGroup.length == 0){
            res.status(404).json({errors:[{message: "No hay Grupos Oficiales"}]});
            return;
        }
        else if (OfficialGroup.length >= 1){
            res.status(200).json(OfficialGroup);
            return;
        }
        else{
            res.status(400).json({errors:[{message: "Ocurrió un error con respecto a los Grupos Oficiales"}]});
            return;
        }
    })
}

let postGroupsOfficial = async (req, res) =>{
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

    await Groups_official.create({
        ID_Team: Data.id_team,
        ID_Groups_Letter: Data.id_group
    })
    .then((OfficialGroup) => {
        res.status(200).json({"message":"Registro Exitoso", "Official_Group": {"ID_Team": OfficialGroup.ID_Team, "ID_Groups_Letter": OfficialGroup.ID_Groups_Letter}});
        return;
    })
    .catch(err => {
        res.status(400).json(err);
        return;
    });
}

let getLetterGroupsOfficial = async (req, res ) =>{
    if(!req.headers.authorization){
        res.status(401).json({errors:[{message: "No autorizado."}]})
        return
    }

    const userData = authToken(req.headers.authorization);

    if(userData.message == 'Invalid token.'){
        res.status(401).json({errors:[{message: "No autorizado."}]});
        return;
    }

    let ErrorGroups_Letter = false;
    let ErrorGroups_Official = false;
    let letterPagination = {
        "Current": 0,
        "Before": 0,
        "Next": 0
    }
    const Data = req;
    let Int_ID = parseInt(Data.params.ID)
    if(Int_ID >= 9 ){
        res.status(401).json({errors:[{message: "No existe este Grupo."}]})
    }else if (Int_ID <= 0){
        res.status(401).json({errors:[{message: "No existe este Grupo."}]})
    }


    await Groups_Letter.findAll({
        attributes:{
            exclude: ['createdAt','updatedAt']
        }, 
        order:[
            ['ID', 'DESC']
        ]
    }).then((Letter) => {
        if(Data.params.ID == 1){
            letterPagination.Current = Int_ID;
            letterPagination.Before = Letter.length;
            letterPagination.Next = Int_ID + 1;
        }
        else if (Data.params.ID == Letter.length){
            letterPagination.Current = Int_ID;
            letterPagination.Before = Int_ID - 1;
            letterPagination.Next = 1;
        }
        else {
            letterPagination.Current = Int_ID;
            letterPagination.Before = Int_ID - 1;
            letterPagination.Next = Int_ID + 1;
        }

    }).catch(err => {
        res.status(400).json(err);
        ErrorGroups_Letter = true;
        return;
    });

    if(ErrorGroups_Letter){
        return;
    }

    let Official_Group = [];
    let Group_Request = "";

    await Groups_official.findAll({
        include:[{
            model: Team,
            attributes:{
                exclude: ['createdAt','updatedAt']
            }
        },{
            model: Groups_Letter,
            attributes:{
                exclude: ['createdAt','updatedAt']
            }
        }],
        attributes:{
            exclude: ['createdAt','updatedAt', "ID_Team", "ID_Groups_Letter"]
        }, 
        where: {
            ID_Groups_Letter: Data.params.ID,
        }
    })
    .then((OfficialGroup) => {
        Group_Request = OfficialGroup[0].dataValues.Groups_Letter.dataValues;
        OfficialGroup.forEach((Group) => {
            Official_Group.push({"Team": Group.dataValues.Team.dataValues})
        })
    }).catch(err => {
        res.status(400).json(err);
        ErrorGroups_Official = true;
        return;
    });

    if(ErrorGroups_Official){
        return
    }

    res.status(200).json({
        "Pages": letterPagination,
        "Teams": Official_Group,
        "Group": Group_Request
    })

} 

module.exports = {
    getGroupsOfficial,
    postGroupsOfficial,
    getLetterGroupsOfficial
}