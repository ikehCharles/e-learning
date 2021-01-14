const mongoose = require("mongoose")

mongoose.connect(process.env.dbString, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected', () => console.log('connected'))
mongoose.connection.on('error', () => console.log('error'))

module.exports = mongoose.connection;