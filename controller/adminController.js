const { StatusCodes } = require(`http-status-codes`)
const models = require("../models")
const nodemailer = require('nodemailer');
const { hashSync, genSaltSync, compareSync } = require("bcrypt")


module.exports = {
    changePrice: (req, res) => {
        if (req.accountType != `admin`) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                error: "doar adminul poate executa aceasta comanda!"
            })
        }
        if (!req.body)
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                error: `missing body`
            })
        const { error, value } = models.adminModel.bestPrice.validate(req.body)
        if (error) {
            console.log(error.message)
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                error: error.message
            })
        }
        req.db.updateBestPrice(req.body.price, (err, results) => {
            if (err) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    err: err.message
                })
            } else res.status(StatusCodes.OK).json({
                success: true,
                data: "Pretul de bază a fost modificat cu succes!"
            })
        })
    },
    modifyCar: (req, res) => {
        if (req.accountType != `admin`) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                error: "Doar adminul poate executa aceasta comanda!"
            })
        }
        if (!req.body) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                error: `missing body`
            })
        }
        const { error, value } = models.carModel.modifyCarSchema.validate(req.body)
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                error: error.message
            })
        }
        req.db.searchCar(req.body.registration_number, (err, results) => {
            if (err) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    err: err.message
                })
            } else if (!results) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    data: `Mașina nu există în baza de date.`
                })
            } else {
                req.db.modifyCar(req.body, (err, results) => {
                    if (err) {
                        res.status(StatusCodes.BAD_REQUEST).json({
                            success: false,
                            err: err.message
                        })
                    } else {
                        res.status(StatusCodes.OK).json({
                            success: true,
                            data: `Mașina a fost modificată cu succes.`
                        })
                    }
                })
            }
        })


    },
    addCar: (req, res) => {
        if (req.accountType != `admin`) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                error: "Doar adminul poate executa aceasta comanda!"
            })
        }
        if (!req.body) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                error: `missing body`
            })
        }
        const { error, value } = models.carModel.modifyCarSchema.validate(req.body)
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                error: error.message
            })
        }
        req.db.searchCar(req.body.registration_number, (err, results) => {
            if (err) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    err: err.message
                })
            }
            if (results) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    data: "Mașina există deja în baza de date."
                })
            } else {
                req.db.searchDriverById(req.body.id_driver, (err, results) => {
                    if (err) {
                        res.status(StatusCodes.BAD_REQUEST).json({
                            success: false,
                            err: err.message
                        })
                    } else {
                        if (!results) {
                            res.status(StatusCodes.BAD_REQUEST).json({
                                success: false,
                                data: "Nu există niciun șofer înregistrat cu acest id."
                            })
                        } else {
                            req.db.addCar(req.body, (err, results) => {
                                if (err) {
                                    res.status(StatusCodes.BAD_REQUEST).json({
                                        success: false,
                                        err: err.message
                                    })
                                } else res.status(StatusCodes.OK).json({
                                    success: true,
                                    data: "Mașina a fost adaugată cu succes!"
                                })
                            })
                        }
                    }
                })
            }
        })

    },
    removeCar: (req, res) => {
        if (req.accountType != `admin`) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                error: "Doar adminul poate executa aceasta comanda!"
            })
        }
        if (!req.body) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                error: `missing body`
            })
        }
        const { error, value } = models.carModel.modifyCarSchema.validate(req.body)
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                error: error.message
            })
        }
        req.db.searchCar(req.body.registration_number, (err, results) => {
            if (err) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    err: err.message
                })
            } else if (!results) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    data: `Mașina nu există în baza de date.`
                })
            } else {
                req.db.removeCar(req.body.registration_number, (err, results) => {
                    if (err) {
                        res.status(StatusCodes.BAD_REQUEST).json({
                            success: false,
                            err: err.message
                        })
                    } else {
                        res.status(StatusCodes.OK).json({
                            success: true,
                            data: `Mașina a fost eliminată cu succes.`
                        })
                    }
                })
            }
        })

    },
    changeDriver: (req, res) => {
        if (req.accountType != `admin`) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                error: "Doar adminul poate executa aceasta comanda!"
            })
        }
        if (!req.body) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                error: `missing body`
            })
        }
        const { error, value } = models.carModel.modifyCarSchema.validate(req.body)
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                error: error.message
            })
        }
        req.db.searchCar(req.body.registration_number, (err, results) => {
            if (err) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    err: err.message
                })
            } else if (!results) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    data: `Mașina nu există în baza de date.`
                })
            } else {
                req.db.searchDriverById(req.body.id_driver, (err, results) => {
                    if (err) {
                        res.status(StatusCodes.BAD_REQUEST).json({
                            success: false,
                            err: err.message
                        })
                    } else if (!results) {
                        res.status(StatusCodes.BAD_REQUEST).json({
                            success: false,
                            data: "Nu există niciun șofer înregistrat cu acest id."
                        })
                    } else {
                        req.db.changeDriver(req.body, (err, results) => {
                            if (err) {
                                res.status(StatusCodes.BAD_REQUEST).json({
                                    success: false,
                                    err: err.message
                                })
                            } else {
                                res.status(StatusCodes.OK).json({
                                    success: true,
                                    data: "Șoferul mașinii a fost schimbat cu succes!"
                                })
                            }
                        })
                    }
                })
            }
        })

    },

    addNotification: (req, res) => {
        if (req.accountType != `admin`)
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                error: "doar adminul poate executa aceasta comanda!"

            })
        if (!req.body)
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                error: `missing body`
            })

        const { error, value } = models.notificationModel.newNotificationSchema.validate(req.body)
        if (error)
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                error: error
            })
        req.db.addNotification(req.body, (err, results) => {
            if (err) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    err: err.message
                })
            } else res.status(StatusCodes.OK).json({
                success: true,
                data: "notificarea a fost adaugata cu succes!"
            })
        })
    },
    deleteNotification: (req, res) => {

        if (req.accountType == `admin`) {
            if (!req.body)
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    error: `missing body`
                })
            console.log(req.body)
            const { error, value } = models.notificationModel.deleteNotificationSchema.validate(req.body)
            if (error)
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    error: error
                })
            req.db.deleteNotification(req.body.id, (err, results) => {
                if (err) {
                    res.status(StatusCodes.BAD_REQUEST).json({
                        success: false,
                        err: err.message
                    })
                } else res.status(StatusCodes.OK).json({
                    success: true,
                    message: "notificarea a fost stearsa cu succes!"
                })
            })
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({
                success: 0,
                error: "doar adminul poate executa aceasta comanda!"
            })
        }
    },
    createAccount: (req, res) => {
        if (req.accountType == `admin`) {
            if (!req.body)
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    error: `missing body`
                })
            const body = req.body
            const salt = genSaltSync(10)
            body.password = hashSync(body.password, salt)
            const { error, value } = models.adminModel.newEmployeeSchema.validate(body);
            if (error) {
                return res.status(300).json({
                    success: false,
                    error: error.message
                })

            }
            req.db.createAccount(body, (error, results) => {
                if (error) {
                    res.status(200).json({
                        success: false,
                        error: error.message
                    })
                } else {
                    res.status(200).json({
                            success: true
                        })
                        /* mailOptions.to = body.email
                        mailOptions.subject = 'Confirmare creare cont'
                        mailOptions.text = 'Ți-ai creat cont cu succes!'
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error.message);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        }); */
                }
            })
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({
                success: 0,
                error: "doar adminul poate executa aceasta comanda!"
            })
        }
    },
    getInfoUser: (req, res) => {
        if (req.accountType == `admin`) {
            if (!req.body)
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    error: `missing body`
                })
            body = req.parameters
            const { error, value } = models.adminModel.validationEmail.validate(body)
            if (error) {
                return res.status(200).json({
                    success: false,
                    error: error.message
                })
            }
            req.db.getUserByEmail(body.email, (error, results) => {
                if (error) {
                    res.status(200).json({
                        success: false,
                        error: error.message
                    })
                } else if (results != undefined) {
                    res.status(200).json({
                        success: true,
                        id: results.id,
                        surname: results.surname,
                        name: results.name,
                        phone: results.phone
                    })
                } else {
                    res.status(StatusCodes.NOT_FOUND).json({
                        success: false
                    })
                }
            })
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({
                success: 0,
                error: "doar adminul poate executa aceasta comanda!"
            })
        }
    },
    deleteAccount: (req, res) => {
        if (req.accountType == `admin`) {
            if (!req.body)
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    error: `missing body`
                })
            body = req.body
            const { error, value } = models.adminModel.validationEmail.validate(body)
            if (error) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    error: error.message
                })
            }
            req.db.getUserByEmail(body.email, (error, results) => {
                if (error) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        error: error.message
                    })
                } else if (results != undefined) {
                    req.db.deleteAccount(body.email, (error, results) => {
                        if (error) {
                            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                                success: false,
                                error: error.message
                            })
                        } else {
                            res.status(200).json({
                                success: true
                            })
                        }
                    })
                } else {
                    res.status(StatusCodes.NOT_FOUND).json({
                        success: false,
                        error: "not exist"
                    })
                }
            })
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({
                success: 0,
                error: "doar adminul poate executa aceasta comanda!"
            })
        }
    }
}