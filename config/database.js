const { compile } = require("joi");
const { createPool } = require("mysql");
require("dotenv").config();
const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.MYSQL_DB
});

// pool.query(`select * from users`, [], (error, results, fields) => {
//     console.log(results)
// })


module.exports = {
    getAwbEvents: (awb, callBack) => {
        if (!callBack)
            return new Promise((resolve, reject) => {
                pool.query(
                    `select * from awb_events where awb = ?`, [awb],
                    (error, results, fields) => {
                        if (error)
                            return reject(error);
                        if (!results[0])
                            return reject(`No such awb in db`)
                        return resolve(results);
                    }
                );
            })
        pool.query(
            `select * from awb_events where awb = ?`, [awb],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    setUserToken: (id, callBack) => {
        pool.query(
            `INSERT INTO tokens where id = ?`, [id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    checkToken: (id, callBack) => {
        pool.query(
            `SELECT *FROM tokens where id = ?`, [id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getUserType: (id, callBack) => {
        pool.query(
            `SELECT type FROM users where id = ?`, [id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getUserByEmail: (email, callBack) => {
        pool.query(
            `select * from users where email = ?`, [email],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    },
    getTokens: (id, callBack) => {
        pool.query(
            `select * from tokens where id = ?`, [id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    createAccount: (data, callBack) => {
        pool.query(
            `INSERT INTO USERS (name,surname,email,password,phone,type,county,city,address) VALUES (?,?,?,?,?,?,?,?,?)`, [
                data.name,
                data.surname,
                data.email,
                data.password,
                data.phone,
                data.type,
                data.county,
                data.city,
                data.address
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error)
                }
                return callBack(null, results)
            }
        );
    },
    placeNewOrder: (data, callBack) => {
        pool.query(
            `INSERT INTO orders (fullName_sender,contactPerson_sender,phone_sender,email_sender,county_sender,city_sender,address_sender,fullName_receiver,contactPerson_receiver,phone_receiver,county_receiver,city_receiver,address_receiver,nrEnvelope,nrParcel, weight,length,width,height,date, hour, preference1, preference2, preference3, payment, mentions) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [
                data.fullName_sender,
                data.contactPerson_sender,
                data.phone_sender,
                data.email_sender,
                data.county_sender,
                data.city_sender,
                data.address_sender,

                data.fullName_receiver,
                data.contactPerson_receiver,
                data.phone_receiver,
                data.county_receiver,
                data.city_receiver,
                data.address_receiver,

                data.nrEnvelope,
                data.nrParcel,
                data.weight,

                data.length,
                data.width,
                data.height,

                data.date,
                data.hour,

                data.preference1,
                data.preference2,
                data.preference3,

                data.payment,

                data.mentions

            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error)
                }
                return callBack(null, results)
            }
        );
    },
    addEventsDriver: (data, callBack) => {
        pool.query(
            `INSERT INTO driver_events values (?,?,?,?,?,?,?)`, [
                data.id,
                data.accident,
                data.meteo,
                data.failure,
                data.client,
                data.content,
                data.delivered
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error)
                }
                return callBack(null, results)
            }
        )
    },
    addNotification: (data, callBack) => {
        pool.query(
            `INSERT INTO notifications(expiry_date,text) values (?,?)`, [
                data.expiry_date,
                data.text,
            ],
            (error, results, fields) => callBack(error)
        )
    },

    deleteNotification: (id, callBack) => {
        pool.query(
            `DELETE FROM notifications WHERE id=(?)`, [
                id
            ],
            (error) => callBack(error)
        )
    },

    getNotifications: (callBack) => {
        pool.query(
            `SELECT * FROM notifications`,
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        )
    },
    getDetailsOrder: (awb, callBack) => {
        //promise wrapping
        if (!callBack)
            return new Promise((resolve, reject) => {
                pool.query(
                    `SELECT * FROM orders where awb = ?`, [
                    awb
                ],
                    (error, results, fields) => {
                        if (error)
                            return reject(error);
                        if (!results[0])
                            return reject(`No such awb in db`)
                        return resolve(results[0]);
                    }
                )
            })
        pool.query(
            `SELECT * FROM orders where awb = ?`, [
                awb
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        )
    },
    newCode: (data, callBack) => {
        console.log(data)
        pool.query(
            `INSERT INTO codes (id , expiry_date , type) values(?,LOCALTIME() + INTERVAL 15 MINUTE,?)`, [
                data.id,
                data.type
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        )
    },
    existCode: (id, callBack) => {
        pool.query(
            `SELECT * from codes where id=?`, [
                id
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        )
    },
    selectIdChange: (body, callBack) => {
        pool.query(
            `SELECT * from (select id from codes where code = ? and expiry_date > localtime() and type = ? order by expiry_date desc) AS T LIMIT 1`, [
                body.code,
                body.type
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        )
    },
    changePassword: (data, callBack) => {
        pool.query(
            `UPDATE users SET password = ? where id = ?`, [
                data.password,
                data.id
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        )
    },
    changeEmail: (data, callBack) => {
        pool.query(
            `UPDATE USERS SET email = ? where id = ?`, [
                data.email,
                data.id
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        )
    },
    deleteCode: (data, callBack) => {
        pool.query(
            `DELETE from codes where id = ? and code != ? and type =?`, [
                data.id,
                data.code,
                data.type
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        )
    },
    deleteAccount: (email, callBack) => {
        pool.query(
            `DELETE from users where email=?`, [
                email
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        )
    },
    searchCar: (registration_number, callBack) => {
        pool.query(
            `SELECT * from cars where registration_number=?`, [
                registration_number
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        )
    },
    addCar: (data, callBack) => {
        pool.query(
            `INSERT INTO cars (registration_number,id_driver,status) VALUES(?,?,?)`, [
                data.registration_number,
                data.id_driver,
                data.status
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    modifyCar: (data, callBack) => {
        pool.query(
            `UPDATE cars SET status = ? where registration_number = ?`, [
                data.status,
                data.registration_number
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    removeCar: (registration_number, callBack) => {
        pool.query(
            `DELETE FROM cars WHERE registration_number=?`, [
                registration_number
            ],
            (error) => callBack(error)
        )
    },
    updateBestPrice: (price, callBack) => {
        pool.query(
            `UPDATE price SET price = ?`, [
                price
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    searchDriverById: (id, callBack) => {
        pool.query(
            `SELECT * from users where id=? AND type=?`, [
                id,
                `driver`
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        )
    },
    checkDriverCar: (data, callBack) => {
        pool.query(
            `SELECT * from cars where id_driver=? AND type=? AND registration_number=?`, [
                data.id,
                `driver`,
                data.registration_number
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        )
    },
    changeDriver: (data, callBack) => {
        pool.query(
            `UPDATE cars SET id_driver = ? where registration_number = ?`, [
                data.id_driver,
                data.registration_number
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
            }
        )
    },

    getAccountsByTypeAndByCounty: (type, county, callBack) => {
        //promise wrapping
        if (!callBack)
            return new Promise((resolve, reject) => {
                pool.query(
                    `SELECT * from users where type=? AND county=?`, [
                        type,
                        county
                    ],
                    (error, results, fields) => {
                        if (error)
                            return reject(error)
                        return resolve(results)
                    }
                )
            })
        pool.query(
            `SELECT * from users where type=? AND county=?`, [
                type,
                county
            ],
            (error, results, fields) => {
                if (error)
                    return callBack(error)
                return callBack(null, results, fields)
            }
        )
    },
}