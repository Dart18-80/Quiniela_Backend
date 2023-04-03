const Menu = require("../database/models/Menu");
const authToken = require('../services/auth')

let getMenus = async (req, res) => {
    if(!req.headers.authorization){
        res.status(401).json({errors:[{message: "No autorizado."}]})
        return
    }

    const userData = authToken(req.headers.authorization);

    if(userData.message == 'Invalid token.'){
        res.status(401).json({errors:[{message: "No autorizado."}]});
        return;
    }

    await Menu.findAll({
        attributes:{
            exclude: ['createdAt','updatedAt']
        }
    })
    .then((Menus) => {
        if(Menus.length == 0){
            res.status(404).json({errors:[{message: "No hay Menu"}]});
            return;
        }
        else if (Menus.length >= 1){
            let Object_send = {
                "Menus": []
            }
            Menus.forEach((valueMenu) => {
                let Object_menu = {
                    "Date_Begin": "",
                    "Date_Finish": "",
                    "Name_Fase": "",
                    "Active": true
                }
                if(valueMenu.dataValues.Name_Fase == "Grupos"){
                    Object_menu["Date_Begin"] = valueMenu.dataValues.Date_Begin.toISOString().split('T')[0]
                    Object_menu["Date_Finish"] = valueMenu.dataValues.Date_Finish.toISOString().split('T')[0]
                    Object_menu["Name_Fase"] = valueMenu.dataValues.Name_Fase
                    Object_menu["Active"] = true
                    Object_send["Menus"].push(Object_menu)
                }
                else{
                    let Actually = Date.now();
                    Object_menu["Date_Begin"] = valueMenu.dataValues.Date_Begin.toISOString().split('T')[0]
                    Object_menu["Date_Finish"] = valueMenu.dataValues.Date_Finish.toISOString().split('T')[0]
                    Object_menu["Name_Fase"] = valueMenu.dataValues.Name_Fase
                    if(valueMenu.dataValues.Date_Begin < Actually){
                        Object_menu["Active"] = true
                    }else{
                        Object_menu["Active"] = false
                    }
                    Object_send["Menus"].push(Object_menu)
                }
            })
            res.status(200).json(Object_send);
            return;
        }
        else{
            res.status(400).json({errors:[{message: "Ocurrió un error con respecto al Menu"}]});
            return;
        }
    }).catch(err => {
        res.status(400).json(err);
        return;
    });
}

let postMenus = async (req, res) =>{
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

    await Menu.create({
        Date_Begin: Data.date_begin,
        Date_Finish: Data.date_finish,
        Name_Fase: Data.name_fase
    })
    .then((newMenu) => {
        res.status(200).json({"ID": newMenu.ID, "Name_Fase": newMenu.Name_Fase, "Date_Begin": newMenu.Date_Begin, "Date_Finish": newMenu.Date_Finish });
        return;
    })
    .catch(err => {
        res.status(400).json(err);
        return;
    });
}

module.exports = {
    getMenus,
    postMenus
}