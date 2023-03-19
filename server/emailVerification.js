import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

export const emailVerif = function Verification(code,mail){
    var mailerOptions = {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    };
    var transporter = nodemailer.createTransport(mailerOptions);

    var mailOption = {
        from: '"Verifikacija" <bibliotekabora@gmail.com>', // sender address
        to: mail, // list of receivers
        subject: `${code} `, // Subject line
        text: `Vaš kod je: ${code}`, // plaintext body
        html: `<b>Vaš kod je: ${code}</b><br>Unesite ga u polje kako biste se verifikovali.` // html body
    };

    transporter.sendMail(mailOption, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}