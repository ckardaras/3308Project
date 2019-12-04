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

sql+="CREATE TABLE IF NOT EXISTS `League`.`Profile` (`User_Id` INT NOT NULL AUTO_INCREMENT,`email` VARCHAR(100) NULL,`phone` VARCHAR(10) NULL,`ProfilePicLink` VARCHAR(100) NULL, name VARCHAR(100) NULL,PRIMARY KEY (`User_Id`),CONSTRAINT `User_Id`FOREIGN KEY (`User_Id`)REFERENCES `League`.`User` (`User_Id`)ON DELETE NO ACTION ON UPDATE NO ACTION)ENGINE = InnoDB;" //make profile table

sql+="CREATE TABLE IF NOT EXISTS `League`.`Match` (`Match_Id` INT NOT NULL AUTO_INCREMENT,`GameDate` DATE NULL,`Arena` VARCHAR(100) NULL,`Valid` VARCHAR(45) NOT NULL DEFAULT 'False',PRIMARY KEY (`Match_Id`))ENGINE = InnoDB;" //make match table

sql+="CREATE TABLE IF NOT EXISTS `League`.`TeamMatch_Bridge` (`Match_Id` INT NOT NULL,`Team_Id` INT NOT NULL,`Score` INT NULL,`is_Winner` TINYINT NULL DEFAULT 0,PRIMARY KEY (`Match_Id`, `Team_Id`),INDEX `Team_Id_idx` (`Team_Id` ASC),CONSTRAINT `Match_Id`FOREIGN KEY (`Match_Id`)REFERENCES `League`.`Match` (`Match_Id`)ON DELETE NO ACTION ON UPDATE NO ACTION,CONSTRAINT `Team_Id`FOREIGN KEY (`Team_Id`)REFERENCES `League`.`Team` (`Team_Id`)ON DELETE NO ACTION ON UPDATE NO ACTION)ENGINE = InnoDB;" //Make Table TeamMatch_Bridge

sql+="CREATE TABLE IF NOT EXISTS `League`.`Setup` (`Limiter` ENUM('only') NOT NULL DEFAULT 'only',`NumOfTeams` INT NOT NULL,`TeamSize` INT NOT NULL,`LeagueName` VARCHAR(100) NOT NULL,PRIMARY KEY (`Limiter`),UNIQUE INDEX `Limiter_UNIQUE` (`Limiter` ASC))ENGINE = InnoDB;" //make Setup Table

sql+="CREATE TABLE IF NOT EXISTS `League`.`Rules` (`Rule_Id` INT NOT NULL AUTO_INCREMENT,`Rule_Description` VARCHAR(200) NULL,PRIMARY KEY (`Rule_Id`))ENGINE = InnoDB;" //make rules table

sql+="CREATE TABLE IF NOT EXISTS `League`.`GroupRules_Bridge` (`UserGroup_Id` INT NOT NULL,`Rule_Id` INT NOT NULL,PRIMARY KEY (`UserGroup_Id`, `Rule_Id`),INDEX `Rule_Id_idx` (`Rule_Id` ASC),CONSTRAINT `UserGroup_Id`FOREIGN KEY (`UserGroup_Id`)REFERENCES `League`.`UserGroup` (`UserGroup_Id`)ON DELETE NO ACTION ON UPDATE NO ACTION,CONSTRAINT `Rule_Id`FOREIGN KEY (`Rule_Id`)REFERENCES `League`.`Rules` (`Rule_Id`)ON DELETE NO ACTION ON UPDATE NO ACTION)ENGINE = InnoDB;" //make GroupRules_bridge table


//sql+="SET SQL_MODE=@OLD_SQL_MODE;SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;" //set various variables back to default


// Sql test code

sql+="insert into User(username,password,Team_Id,UserGroup_Id) Values('Mario','pass',1, 2);"
sql+="INSERT INTO Profile(email,phone,ProfilePicLink,name) Values('Mario@gmail.com','1234567891','../img/portrait/Mario.jpg','Mario Mario');"

sql+="insert into User(username,password,Team_Id,UserGroup_Id) Values('Peach','pass',1, 2);"
sql+="INSERT INTO Profile(email,phone,ProfilePicLink,name) Values('Princess@gmail.com','1237577891','../img/portrait/Peach.jpg','Princess Peach');"

sql+="insert into User(username,password,Team_Id,UserGroup_Id) Values('Luigi','pass',1, 2);"
sql+="INSERT INTO Profile(email,phone,ProfilePicLink,name) Values('Luigi@gmail.com','1234555591','../img/portrait/Luigi.jpg','Luigi Mario');"

sql+="insert into User(username,password,Team_Id,UserGroup_Id) Values('Yoshi','pass',1, 2);"
sql+="INSERT INTO Profile(email,phone,ProfilePicLink,name) Values('Yoshi@gmail.com','1234567891','../img/portrait/Yoshi.jpg','T. Yoshisaur');"

sql+="insert into User(username,password,Team_Id,UserGroup_Id) Values('Bowser','pass',1, 1);"
sql+="INSERT INTO Profile(email,phone,ProfilePicLink,name) Values('CoachBowser@gmail.com','5555555555','../img/portrait/Bowser.jpg','King Koopa');"

sql+="insert into User(username,password,Team_Id,UserGroup_Id) Values('Somebody','password',2, 1);"
sql+="INSERT INTO Profile(email,phone,ProfilePicLink,name) Values('Test@gmail.com','5555555555','../img/portrait/Bowser.jpg','Fred');"

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

var pass_req=true;
var user_req=true;
var got_in=true;






app.get('/',function(req,res){
    res.redirect('/login');
});


// login page
app.get('/login', function(req, res) {
    req.session.name=undefined;
	res.render('pages/login',{
		css:"../css/login.css",
        my_title:"Login Page",
        pass_req: pass_req,
        user_req: user_req,
        got_in: got_in
    });
    got_in=true;
    pass_req=true;
    user_req=true;
});




app.get('/submit_success',function(req,res){
    res.render('pages/submit_success.pug', {
        css:"../css/submit_success.css"
    });
});

app.post('/auth', function(req, res) {
	var username = req.body.username;
    var password = req.body.password;
    console.log(req.session.name);
	if (username && password) {
		db.query('select username, password from User where username =?',[username], function(error, rows, fields){
            console.log(rows);
            console.log(rows[0].password);
			if (rows[0].password==password){
                req.session.loggedin = true; //if username and password are correct the you get redirected to Player page
				req.session.name = username;
				res.redirect('/home');
			} else {
                got_in=false;
                res.redirect('/login')
			}
			res.end();
		});
	} else {
        got_in=false;
        if(password=="")
        {
            pass_req=false;
            got_in=true;
        }
        if(username=="")
        {
            user_req=false;
            got_in=true;
        }
		res.redirect('/login');
		res.end();
	}
});

app.get('/login/auth', function(req, res)
{
    res.render('pages/login');
});


// login page
app.get('/home', function(req, res) {
    if(req.session.name===undefined)
    {
        res.redirect('/login')
    }
    var query="Select * from User where username=";
    query+=req.session.name;
    query+=";";
    db.query('select * from User where username =?;',[req.session.name],function(error, rows, fields)
    {
        console.log(rows);
        res.render('pages/PlayerPage',{
            css:'../css/PlayerPage.css',
            title:"Home page",
            data: rows
        });
    });
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
                title:"Registration Page",
                css:"../css/register.css",
                Data:rows
            })
        }
        else
            console.log('Encountered Error')
	});
});

app.post('/sign_up_p', function(req,res){
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
var query1="INSERT INTO User ()"
connection.query('INSERT INTO User Values('+name+');',function(error, results, fields){
        if (err) throw err;
        console.log("Record inserted Successfully");

    });

    return res.redirect('/login');
});



app.get('/team',function(req,res){
    if(req.session.name===undefined)
    {
        res.redirect('/login')
    }
    var user = req.session.name;
    var query1="Select * from User Where Team_Id=(Select Team_Id from User where username IN('";
    query1+=req.session.name;
    query1+="'));";

    
    var query2="Select * from Team where Team_Id=(Select Team_Id from User where username IN('";
    query2+=req.session.name;
    query2+="'));";

    var query3="Select p.name from User u inner join Profile p on u.User_Id=p.User_Id inner join Team t on t.Team_Id=u.Team_Id Where u.Team_Id=(Select Team_Id from User where username IN('";
    query3+=req.session.name;
    query3+="'));";
    db.query(query1+query2+query3, function(err, rows, fields) {
    if(!err)
    {
        res.render('pages/team.pug',{
            css:'../css/teampage.css',
            data1:rows[0],
            data2:rows[1],
            data3:rows[2],
            title:'Team Page'
        });
    }
    else
        console.log('encountered error');
    });
});

app.listen(port, ()=> {
    console.log('Server running on port:',port);
});
