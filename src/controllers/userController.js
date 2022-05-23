const knex = require('../models/knex');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.register = async(req, res) => {
    try {
        const {firstName, lastName, email, password} = req.body
        console.log(req.body)
    } catch (error) {
        req.status(500).send({
            code: 500,
            status: false,
            message: error.message,
            data: null
        })
    }
}