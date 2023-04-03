const Games_Official = require("./models/Games_Official");
const Group_Official = require("./models/Group_Official");
const Groups_Letter = require("./models/Groups_Letter");

const Official_Result = require("./models/Official_Result");
const Phase_Mundial = require("./models/Phase_Mundial");
const Points = require("./models/Points");

const Register_WinnerMatch_User = require("./models/Register_WinnerMatch_User");
const Register_WinnerGroup_User = require("./models/Register_WinnerGroup_User");
const Team_Official_Pass = require("./models/Team_Official_Pass");

const Team = require("./models/Team");
const User = require("./models/User");
const Menu = require("./models/Menu");


/*Register_WinnerMatch_User*/ 
User.hasMany(Register_WinnerMatch_User, {foreignKey:"ID_User"})
Register_WinnerMatch_User.belongsTo(User, {foreignKey:"ID_User"})

Games_Official.hasMany(Register_WinnerMatch_User, {foreignKey:"ID_Game_Official"})
Register_WinnerMatch_User.belongsTo(Games_Official, {foreignKey:"ID_Game_Official"})

Team.hasMany(Register_WinnerMatch_User, {foreignKey:"Winner"})
Register_WinnerMatch_User.belongsTo(Team, {foreignKey:"Winner"})

/*Register_WinnerGroup_User*/ 
Team.hasMany(Register_WinnerGroup_User, {foreignKey:"Team_1"})
Register_WinnerGroup_User.belongsTo(Team, {foreignKey:"Team_1"})

Team.hasMany(Register_WinnerGroup_User, {foreignKey:"Team_2"})
Register_WinnerGroup_User.belongsTo(Team, {foreignKey:"Team_2"})

User.hasMany(Register_WinnerGroup_User, {foreignKey:"ID_User"})
Register_WinnerGroup_User.belongsTo(User, {foreignKey:"ID_User"})

Groups_Letter.hasMany(Register_WinnerGroup_User, {foreignKey:"ID_Groups_Letter"})
Register_WinnerGroup_User.belongsTo(Groups_Letter, {foreignKey:"ID_Groups_Letter"})

/*Points*/ 
User.hasMany(Points, {foreignKey:"ID_User"})
Points.belongsTo(User, {foreignKey:"ID_User"})

/*Games Official */
Phase_Mundial.hasMany(Games_Official, {foreignKey:"ID_Phase_Mundial"})
Games_Official.belongsTo(Phase_Mundial, {foreignKey:"ID_Phase_Mundial"})

Team.hasMany(Games_Official, {foreignKey:"Team_1"})
Games_Official.belongsTo(Team, {foreignKey:"Team_1"})

Team.hasMany(Games_Official, {foreignKey:"Team_2"})
Games_Official.belongsTo(Team, {foreignKey:"Team_2"})

/*Official Result*/
Games_Official.hasMany(Official_Result, {foreignKey:"ID_Game_Official"})
Official_Result.belongsTo(Games_Official, {foreignKey:"ID_Game_Official"})

Team.hasMany(Official_Result, {foreignKey:"Winner"})
Official_Result.belongsTo(Team, {foreignKey:"Winner"})

/*Groups Official*/
Team.hasMany(Group_Official, {foreignKey:"ID_Team"})
Group_Official.belongsTo(Team, {foreignKey:"ID_Team"})

Groups_Letter.hasMany(Group_Official, {foreignKey:"ID_Groups_Letter"})
Group_Official.belongsTo(Groups_Letter, {foreignKey:"ID_Groups_Letter"})

/*Teams Official Pass */
Groups_Letter.hasMany(Team_Official_Pass, {foreignKey:"ID_Groups_Letter"})
Team_Official_Pass.belongsTo(Groups_Letter, {foreignKey:"ID_Groups_Letter"})

Team.hasMany(Team_Official_Pass, {foreignKey:"Team_1"})
Team_Official_Pass.belongsTo(Team, {foreignKey:"Team_1"})

Team.hasMany(Team_Official_Pass, {foreignKey:"Team_2"})
Team_Official_Pass.belongsTo(Team, {foreignKey:"Team_2"})