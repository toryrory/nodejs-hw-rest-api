const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const { SENDGRID_API_KEY } = process.env;
sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => { // это функция аналог закоментированых строк. Она для переиспользования отправки емейлов, например при гегистрации, покупке и тд. В data  передается нужные to subject text html, а отправитель вобычно один и тот же
    const email = { ...data, from: "torisecretix@gmail.com" };
    await sgMail.send(email);
    return true;
}

module.exports = sendEmail;

// const email = {
//   to: "vofenon868@soombo.com",
//   from: "orisecretix@gmail.com",
//   subject: "test email send 2",
//   text: "hi sweety",
//   html: "<p><strong>Test Email</strong> from localhost 3000</p>",
// };

// sgMail
//   .send(email)
//   .then(() => console.log("email send successfully"))
//   .catch((error) => console.log(error));
