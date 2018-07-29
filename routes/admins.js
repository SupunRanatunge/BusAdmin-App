const express = require("express");
const router = express.Router();
var mysql = require('mysql');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



var connection = mysql.createConnection({
    host: 'sql12.freesqldatabase.com',
    port: '3306',
    user: 'sql12249655',
    password: 'Tj1MJJvpuE',
    database: 'sql12249655'
});

connection.connect(function(error) {
    if(error) {
        console.log(error)
    }else {
        console.log('connected')
    }
});
router.get('/',(error, res)=>{
    if(error) {
        console.log(error)
    }else {
        console.log('connected')
    }
    
})
router.get('/profile', (req, res, next) =>{
    res.send('Profile')

});

router.post('/register', function(req, res) {
    id = req.body.id
    name = req.body.name
    password = req.body.password
    bcrypt.genSalt(10, (err, salt) =>{
        bcrypt.hash(password, salt, (err, hash)=> {
            password = hash;
            connection.query("INSERT INTO Admin VALUES "+"('"+ id+"','"+name+"','"+password+"')", (error, result)=>{
            if (error) {
                res.json({success: false, msg: "failed to register"})
            }else {
                console.log('successfully inserted'),
                res.json({success:true, msg:"Admin is registered"})
            }
        })
    })
    })
});

router.post('/addUser', function(req, res) {
    userId = req.body.id
    userName = req.body.name
    balance = req.body.balance
    status = req.body.status
    connection.query("INSERT INTO User VALUES "+"('"+ userId+"','"+userName+"',"+balance+",'"+status+"')", (error, result)=>{
    if (error) {
        res.json({success: false, msg: "failed to register"})
    }else {
        console.log('successfully inserted'),
        res.json({success:true, msg:"User is added"})
            }
    })
    
});

router.post('/addRoute', function(req, res) {
    routeId = req.body.routeId
    haltId = req.body.haltId
    weight = req.body.weight
    latitude = req.body.latitude
    longitude = req.body.longitude
    connection.query("INSERT INTO Route VALUES "+"('"+ routeId+"','"+haltId+"',"+weight+","+latitude+","+longitude+")", (error, result)=>{
    if (error) {
        res.json({success: false, msg: "failed to add route"})
    }else {
        console.log('successfully inserted'),
        res.json({success:true, msg:"Route is added"})
            }
    })
});
    
router.post('/authenticateAdmin', (req, res, next) =>{
    id = req.body.id
    password = req.body.password
    connection.query("SELECT password,name FROM Admin where id=?",id , (error,results)=>{
        if(error){
            console.log(error)
        }else {
            userPassword = results[0].password
            name = results[0].name
            console.log(name)
            bcrypt.compare(password, userPassword, (err, isMatch)=>{
                if(err) throw err;
                if(isMatch){
                    console.log('matching')
                    const token = jwt.sign({
                        id: id
                      }, ' ', { expiresIn: '1h' });
                    console.log(token);
                    return res.json ({
                        success: true,
                        token:  token,
                        admin: {
                            id: id,
                            name: name
                        }
                    });
                }
                else {
                    return res.json({success: false, msg: "Wrong Password"});
                }

            })
        }
    })
});

router.get('/routeDetails', (req, res, next) => {
    
    connection.query("SELECT * FROM Route" , (error,results)=>{
        if(error){
            console.log(error)
        }else {
            res.send(results)
           }
    });
});



module.exports = router;