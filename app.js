const express = require("express");
const path = require('path');

const bodyParser = require("body-parser");
const cors = require("cors");
const passport2 = require("passport");

const admins= require("./routes/admins");



const app = express();
const port = process.env.PORT || 8080;

app.use(cors());


app.use(bodyParser.json());
app.use('/admins', admins);

app.use(express.static(path.join(__dirname,'Public')));

app.use(passport2.initialize());
app.use(passport2.session());

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
})

app.listen(port, () => {
    console.log("Server started on port: "+port);

});






