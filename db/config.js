require('dotenv').config()

module.exports = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASS,
    "database": process.env.DB_NAME,
    "host": process.env.HOST_URL,
    "dialect": "postgres"
  },
  "test":{
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASS,
    "database": process.env.DB_NAME,
    "host": process.env.HOST_URL,
    "dialect": "postgres"
  },
  "production": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASS,
    "database": process.env.DB_NAME,
    "host": process.env.HOST_URL,
    "dialect": "postgres"
  },
}
