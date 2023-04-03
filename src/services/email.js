const sgMail = require("@sendgrid/mail");
const ejs = require("ejs");
require("dotenv").config();
sgMail.setApiKey(process.env.SG_API_KEY);

let sendRegister = async(data) => {
    const page = await ejs.renderFile(
        __dirname + "/register.ejs", {
            name: data.name,
            email: data.email,
            password: data.password
        }
    );

    const msg = {
        to: data.email,
        from: {
            name: "Quiniela Adslive",
            email: "no-reply@adslivemedia.com"
        },
        subject: "Bienvenido a la Quiniela Adslive",
        text: "Estos son tus datos de acceso.",
        html: page
    };
    sgMail.send(msg).then(response => {
        return response[0].statusCode;
    }).catch(_ => {
        return 500;
    });

};

module.exports = {
    sendRegister
};