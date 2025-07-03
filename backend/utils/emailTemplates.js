const path = require("path");
const ejs = require("ejs");
const sendEmail = require("./emailSender");
const { image_url } = require("./constants");
const front = process.env.FRONT_URL
const logo = image_url.LOGO

const forgotPasswordMail = async (options) => {
    const { email, name, resetPasswordUrl } = options
    
    console.log(name)
    const templatePath = path.join(__dirname, "../public/emailTemplates/forgotPassword.ejs")
    const data = await ejs.renderFile(templatePath, { name, email, resetPasswordUrl, logo, front });

    await sendEmail({
        email,
        subject: 'Reset Password Token',
        message: data
    })
}

const invitationMail = async (options) => {
    const { email, name, password } = options
    let platformUrl = `${process.env.FRONT_URL}/sign-in`
    const templatePath = path.join(__dirname, "../public/emailTemplates/invitationMail.ejs")
    const data = await ejs.renderFile(templatePath, { name, email, platformUrl, logo, front, password });

    await sendEmail({
        email,
        subject: 'Invitation Mail',
        message: data
    })
}

module.exports = {
    forgotPasswordMail,
    invitationMail
}