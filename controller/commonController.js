const models = require(`../models`)
const { StatusCodes } = require(`http-status-codes`)
module.exports = {
    getAWB: (req, res) => {
        console.log(req.body)
        if (req.body.AWB) {
            if (dbAWB.find(function (arg) {
                return arg == req.body.AWB;
            }))
                return res.status(200).json({
                    "succes": true
                })
            else return res.status(200).json({
                "succes": false
            })
        }
        return res.status(400).json({
            error: `Missing 'AWB' filed from request`
        })
    },

    handleLogin: (req, res) => {
        console.log(req.body);
        if (!req.body)
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                error: `no body provided for login`
            })
        console.log(req.body)
        const { error, value } = models.userModel.loginUserSchema.validate(req.body)
        if (error)
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                error: error.message
            })

        req.db.getUserByEmail(value.email, (err, data) => {
            if (err) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    error: error.message
                })
            }
            return res.status(StatusCodes.ACCEPTED).json({
                success: true,
                message: value,
                data: data,
            })
        })
    }

}