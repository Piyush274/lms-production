const JWT = require("jsonwebtoken");

const generateToken = async (payload) => {
    try {
        return JWT.sign({ _id: payload.userId }, process.env.JWT_SEC)
    } catch (error) {
        console.log(error);
        throw error;
    }
};




module.exports = {
    generateToken
}