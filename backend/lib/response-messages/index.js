const HttpStatus = require("../../utils/HttpStatus")

const response201 = (res, message = "Created successfully", response) => {
    return res.status(HttpStatus.CREATED).json({
        status: HttpStatus.CREATED,
        message,
        response: response || []
    })
}

const response200 = (res, message = "fetch successfully", response) => {
    return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message,
        response: response || []
    })
}

const response400 = (res, message = "Bad Request") => {
    return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        message
    })
}

const response401 = (res, message = "Unauthorized Request") => {
    return res.status(HttpStatus.UNAUTHORIZED).json({
        status: HttpStatus.UNAUTHORIZED,
        message
    })
}

const response500 = (res, message = "Internal Server Error") => {
    return res.status(HttpStatus.ERROR).json({
        status: HttpStatus.ERROR,
        message
    })
}

module.exports = { response201, response200, response400, response401, response500 }