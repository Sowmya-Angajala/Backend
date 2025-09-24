const nodemailer = require('nodemailer');


let transporter;


async function getTransporter(){
if(transporter) return transporter;
if(process.env.SMTP_HOST && process.env.SMTP_USER){
transporter = nodemailer.createTransport({
host: process.env.SMTP_HOST,
port: Number(process.env.SMTP_PORT) || 587,
auth: {
user: process.env.SMTP_USER,
pass: process.env.SMTP_PASS
}
});
} else {
// fallback to ethereal test account
const test = await nodemailer.createTestAccount();
transporter = nodemailer.createTransport({
host: 'smtp.ethereal.email',
port: 587,
auth: { user: test.user, pass: test.pass }
});
}
return transporter;
}


async function sendMail(opts){
const t = await getTransporter();
const info = await t.sendMail(opts);
// if ethereal, return preview URL
return info;
}


module.exports = { sendMail };