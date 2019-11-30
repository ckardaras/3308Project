const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require("body-parser");
const mysql = require('mysql');
const path = require('path');
const pug = require('pug');


var createError = require('http-errors');
var logger = require('morgan');
var session = require('express-session');

const app = express();



const port = 3000;


const db = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "",
    multipleStatements:true
});




var sql ="DROP DATABASE IF EXISTS League; CREATE DATABASE League;" //Make New Database, drop existing League DB if exists

sql+="SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';" //make it so you can enter stuff

sql+="CREATE SCHEMA IF NOT EXISTS `League` DEFAULT CHARACTER SET utf8; USE League;" //make schema step into leage db

sql += "CREATE TABLE IF NOT EXISTS `League`.`Team` (`Team_Id` INT NOT NULL AUTO_INCREMENT,`TeamName` VARCHAR(45) NULL,`Active` TINYINT NULL DEFAULT 1,`TeamDesc` VARCHAR(200) NULL,PRIMARY KEY (`Team_Id`))ENGINE = InnoDB;" //make team table

sql+="CREATE TABLE IF NOT EXISTS `League`.`UserGroup` (`UserGroup_Id` INT NOT NULL AUTO_INCREMENT,`UserGroupName` VARCHAR(50) NULL,PRIMARY KEY (`UserGroup_Id`))ENGINE = InnoDB;" //make usergroup table

sql+="CREATE TABLE IF NOT EXISTS `League`.`User` (`User_Id` INT NOT NULL AUTO_INCREMENT,`username` VARCHAR(50) NOT NULL,`password` VARCHAR(50) NOT NULL,`Team_Id` INT NOT NULL,`UserGroup_Id` INT NULL,INDEX `TeamId_idx` (`Team_Id` ASC),UNIQUE INDEX `username_UNIQUE` (`username` ASC),PRIMARY KEY (`User_Id`),INDEX `User_Group_Id_idx` (`UserGroup_Id` ASC),CONSTRAINT `TeamId`FOREIGN KEY (`Team_Id`)REFERENCES `League`.`Team` (`Team_Id`)ON DELETE NO ACTION ON UPDATE NO ACTION,CONSTRAINT `User_Group_Id`FOREIGN KEY (`UserGroup_Id`)REFERENCES `League`.`UserGroup` (`UserGroup_Id`)ON DELETE NO ACTION ON UPDATE NO ACTION)ENGINE = InnoDB;" //make user table

sql+="CREATE TABLE IF NOT EXISTS `League`.`Profile` (`User_Id` INT NOT NULL,`email` VARCHAR(100) NULL, `phone` VARCHAR(10) NULL,`ProfilePicLink` VARCHAR(100) NULL,PRIMARY KEY (`User_Id`),CONSTRAINT `User_Id`FOREIGN KEY (`User_Id`)REFERENCES `League`.`User` (`User_Id`)ON DELETE NO ACTION ON UPDATE NO ACTION)ENGINE = InnoDB;" //make profile table

sql+="CREATE TABLE IF NOT EXISTS `League`.`Match` (`Match_Id` INT NOT NULL AUTO_INCREMENT,`GameDate` DATE NULL,`Arena` VARCHAR(100) NULL,`Valid` VARCHAR(45) NOT NULL DEFAULT 'False',PRIMARY KEY (`Match_Id`))ENGINE = InnoDB;" //make match table

sql+="CREATE TABLE IF NOT EXISTS `League`.`TeamMatch_Bridge` (`Match_Id` INT NOT NULL,`Team_Id` INT NOT NULL,`Score` INT NULL,`is_Winner` TINYINT NULL DEFAULT 0,PRIMARY KEY (`Match_Id`, `Team_Id`),INDEX `Team_Id_idx` (`Team_Id` ASC),CONSTRAINT `Match_Id`FOREIGN KEY (`Match_Id`)REFERENCES `League`.`Match` (`Match_Id`)ON DELETE NO ACTION ON UPDATE NO ACTION,CONSTRAINT `Team_Id`FOREIGN KEY (`Team_Id`)REFERENCES `League`.`Team` (`Team_Id`)ON DELETE NO ACTION ON UPDATE NO ACTION)ENGINE = InnoDB;" //Make Table TeamMatch_Bridge

sql+="CREATE TABLE IF NOT EXISTS `League`.`Setup` (`Limiter` ENUM('only') NOT NULL DEFAULT 'only',`NumOfTeams` INT NOT NULL,`TeamSize` INT NOT NULL,`LeagueName` VARCHAR(100) NOT NULL,PRIMARY KEY (`Limiter`),UNIQUE INDEX `Limiter_UNIQUE` (`Limiter` ASC))ENGINE = InnoDB;" //make Setup Table

sql+="CREATE TABLE IF NOT EXISTS `League`.`Rules` (`Rule_Id` INT NOT NULL AUTO_INCREMENT,`Rule_Description` VARCHAR(200) NULL,PRIMARY KEY (`Rule_Id`))ENGINE = InnoDB;" //make rules table

sql+="CREATE TABLE IF NOT EXISTS `League`.`GroupRules_Bridge` (`UserGroup_Id` INT NOT NULL,`Rule_Id` INT NOT NULL,PRIMARY KEY (`UserGroup_Id`, `Rule_Id`),INDEX `Rule_Id_idx` (`Rule_Id` ASC),CONSTRAINT `UserGroup_Id`FOREIGN KEY (`UserGroup_Id`)REFERENCES `League`.`UserGroup` (`UserGroup_Id`)ON DELETE NO ACTION ON UPDATE NO ACTION,CONSTRAINT `Rule_Id`FOREIGN KEY (`Rule_Id`)REFERENCES `League`.`Rules` (`Rule_Id`)ON DELETE NO ACTION ON UPDATE NO ACTION)ENGINE = InnoDB;" //make GroupRules_bridge table

sql+="INSERT INTO User Values (1, 'admin','admin',0,1);"

//sql+="SET SQL_MODE=@OLD_SQL_MODE;SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;" //set various variables back to default


// Sql test code

sql+="insert into User Values(2, 'Mario','pass',1, 2);"
sql+="insert into User Values(3, 'Peach','pass',1, 2);"
sql+="insert into User Values(4, 'Luigi','pass',1, 2);"
sql+="insert into User Values(5, 'Yoshi','pass',1, 2);"
sql+="insert into User Values(6, 'Bowser','pass',1, 3);"
sql+="INSERT INTO Team Values(1,'Mario Party',1, 'I am Coach Bowser. These Are my Minions');"
sql+="INSERT INTO Team Values(2,'Another Test Team',1, 'This is another Test Team');"




db.connect(function(err){      //con is the reference to our database
    if(err) throw err;
    console.log("Connected!");
    db.query(sql, function(err,result){
        if (err) throw err;
        console.log("Database League Created");
    });
});

global.db=db;


//configure middleware
app.set('port',process.env.port || port); //set express to use this port
app.set('views', __dirname + '/views'); //set express to look in this folder to render views
app.set('view engine', 'pug'); //configure template engine
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //parse form data client
app.use(express.static(__dirname + '/'));
app.use(fileUpload()); //configure file upload
app.use(session({
    secret: 'eioptuwlkgmhi',
    resave: true,
    saveUninitialized: false

}));






app.get('/',function(req,res){
    db.query('Select * from User;', function(err, rows, fields) {
    if(!err)
    {
        console.log(rows);
        res.render('pages/login.pug',{
            data:rows
        });
    }
    else
        console.log('encountered error');
    });

});

app.get('/submit_success',function(req,res){
    res.render('pages/submit_success.pug', {
        css:"../css/submit_success.css"
    });
});

// login page
app.get('/login', function(req, res) {
	res.render('pages/login',{
		css:"../css/login.css",
		my_title:"Login Page"
	});
});

app.post('/auth', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	if (username && password) {
		connection.query('SELECT * FROM USER WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				req.session.loggedin = true; //if username and password are correct the you get redirected to Player page
				req.session.username = username;
				res.redirect('/PlayerPage');
			} else {
				res.send('Incorrect Username and/or Password!');
			}
			res.end();
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
});

// registration page
app.get('/register', function(req, res) {
    var query1="Select TeamName,Team_Id from Team where Team_Id>0;";
    db.query(query1, function(err,rows,fields){
        if(!err)
        {
            console.log(rows);
            res.render('pages/register',
            {
                local_css:"my_style.css",
                my_title:"Registration Page",
                css:"../css/register.css",
                Data:rows
            })     
        }
        else 
            console.log('Encountered Error')
	});
});

app.post('/sign_up', function(req,res){
    var name = req.player_form.player_fullName;
    var username = req.player_form.player_userName;
    var email =req.player_form.player_emailAddress;
    var pass = req.player_form.player_passwordFirst;
    var pass2 = req.player_form.player_passwordConfirm;
    var phone =req.player_form.player_phoneNumber;

    var data = {
        "name": name,
        "username": username,
        "email":email,
        "password":pass,
        "passwordconfirm":pass2,
        "phone":phone
    }
connection.query('INSERT INTO User SET ?', data, function(error, results, fields){
        if (err) throw err;
        console.log("Record inserted Successfully");

    });

    return res.redirect('/PlayerPage');
});



app.get('/team',function(req,res){
    var query1='Select * from User where Team_Id=1;';
    var query2='Select * from Team where Team_Id=1;';
    db.query(query1+query2, function(err, rows, fields) {
    if(!err)
    {
        console.log(rows);
        console.log(rows.length)
        res.render('pages/team.pug',{
            data1:rows[0],
            data2:rows[1]
        });
    }
    else
        console.log('encountered error');
    });
});

app.listen(port, ()=> {
    console.log('Server running on port:',port);
});
