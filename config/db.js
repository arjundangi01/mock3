require('dotenv').config();
const mongoose = require('mongoose')
const mongoDBConnection = mongoose.connect(`${process.env.MONGO_URL}/mockevaluation`);
module.exports = mongoDBConnection
