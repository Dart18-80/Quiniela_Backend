const express = require("express");
const cors = require('cors');

const app = express();

require('./database/asociations');

app.use(cors({
    origin: '*',
}));

app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ extended: true, limit: '50mb' }));

//Routes
app.use('/user', require('./routes/user.router'));
app.use('/team', require('./routes/team.router'));
app.use('/groupletter', require('./routes/groups_letter.routes'));
app.use('/groupsofficial', require('./routes/groups_official.router'));
app.use('/registergroups', require('./routes/register_winnergroup_user.router'));
app.use('/menu', require('./routes/menu.router'));
app.use('/phaseMundial', require('./routes/phase_mundial.router'));
app.use('/gamesOfficial', require('./routes/games_official.router'));
app.use('/registerMatch', require('./routes/register_winnermatch_user.router'));
app.use('/points', require('./routes/points.router'));
app.use('/officialResult', require('./routes/official_result.router'));
app.use('/teamOfficialPass', require('./routes/team_official_pass.router'));


app.get('/', function(req, res) {
    res.send('Quinielas App running.');
});



module.exports = app;