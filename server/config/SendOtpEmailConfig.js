import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "aitripplannerpk@gmail.com",
    pass: "crvw href ntjc btmx",
  },
});

export  function sendMail(to,subject,text){
console.log("Sending email to:", to);
console.log("Subject:", subject);
console.log("Text:", text);

    return transporter.sendMail({
        from: '"AI Trip Planner" <aitripplannerpk@gmail.com>',
        to: to,
        subject: subject,
        text: text,
    })
}

