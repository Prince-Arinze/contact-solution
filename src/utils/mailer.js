import dotenv from 'dotenv';

dotenv.config()

import nodemailer from 'nodemailer';




export const mailer = async (mailOption, res) => {

     let transporter = nodemailer.createTransport({
         service: "gmail",
         auth: {
             user: process.env.MAILER_EMAIL,
             pass: process.env.MAILER_PASSWORD
         }
     });

     let data = {
         from: mailOption.from,
         to: mailOption.to,
         subject: mailOption.subject,
         text: mailOption.text,
         html: mailOption.html
     }

     let info = await transporter.sendMail(data);

     if(!info) return res.status(400).json({err: "Failed to send mail"});

     return res.json({msg: 'Email sent'});
}