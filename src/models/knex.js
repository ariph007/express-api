const knexConfig = require('./knexfile')
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development'])

module.exports = knex;