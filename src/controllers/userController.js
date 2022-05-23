const knex = require('../models/knex');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.register = async(req, res) => {
    try {
        //* Request body dimasukkan dalam object
        const {firstName, lastName, username, email, password} = req.body

        //* Check field apakah ada yang kosong ? kala ada kasih pesan
        if(firstName && lastName && username && email && password === ""){
            return res.status(400).send({
                message: 'field should not be empty'
            })
        }
        
        //* Field password dari user di encrypt
        const hashedPassword = bcrypt.hashSync(password, 8)
       
        //* Masukkan data dari field yang telah diisi oleh user ke database menggunakan knex
        let insertData = await knex('users').insert({
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            password: hashedPassword
        }).then(insertedId => {
            return insertedId
        })

        const token = jwt.sign({
            id: insertData[0]
        }, process.env.JWT_KEY, {expiresIn: 3600})

        //* Beri status success ketika tidak ada eror
        return res.status(200).send({
            message: 'register success',
            data: insertData, 
            token: token
        })

        //* Kalau ada eror ketika insert ke database, beri pesan eror
    } catch (error) {
        res.status(500).send({
            code: 500,
            status: false,
            message: error.message,
            data: null
        })
    }
}

//* buat endpoint login
exports.login = async(req, res) =>{
    //* Jika tidak ada eror, select * from table user where username = req.body.username
    try {
        let getData = await knex('users').where({
            username: req.body.username
        }).select('*')

    //* Cek apakah password valid ? caranya compare req.body.password && getData[0].password
        const isPasswordValid = bcrypt.compareSync(req.body.password, getData[0].password)

    //* Jika password tidak valid, maka kembalikan pesan 'password invalid
        if(!isPasswordValid){
            return res.status(400).send({
                message: 'password invalid'
            })
        }

        const token = jwt.sign({
            id:getData[0].id
        }, process.env.JWT_KEY, {expiresIn: 3600})

        return res.status(200).send({
            message: 'login succesfull',
            data : getData,
            token: token
        })

    } catch (error) {
        res.status(500).send({
            code: 500,
            status: false,
            message: error.message,
            data: null
        })
    }
}