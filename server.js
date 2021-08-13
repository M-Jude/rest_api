const express = require('express')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const cors = require('cors')
require('dotenv').config()

const app = express();

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET_KEY , (err, decode) => {
            if (err) req.user = undefined;
            req.user = decode;
            next();
        });
    } else {
        req.user = undefined;
        next();
    }
});

(async () => {
    try {
        await mongoose.connect(process.env.MONGOPATH, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
    } catch (err) {
      console.log('error: ' + err)
    }
  })()

const PORT = process.env.PORT || 3000;

require('./src/index')(app)

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})

module.exports = app;