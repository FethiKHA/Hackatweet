const mongoose = require('mongoose');

const connectionString = 'mongodb+srv://khalifethi:Tesveuch@cluster0.emx75.mongodb.net/Hackatweet';

mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
 .then(() => console.log('Database connected'))

  .catch(error => console.error(error));
