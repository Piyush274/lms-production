const { response400 } = require("../../lib/response-messages");

const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return response400(res, error.details[0].message);
        }
        next();
    };
};

module.exports = { validateRequest };
module.exports.authValidation = require("./auth.validation");
module.exports.adminValidation = require("./admin.validation");
module.exports.teacherValidation = require("./teacher.validation");

