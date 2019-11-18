var mysql = require('mysql');
var express = require('express');
var bodyParser = require("body-parser");
var pug = require('pug');

const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var con = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "",
    multipleStatements:true
});


var sql ="DROP DATABASE IF EXISTS League; CREATE DATABASE League;" //Make New Database, drop existing League DB if exists

sql+="SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';" //make it so you can enter stuff

sql+="CREATE SCHEMA IF NOT EXISTS `League` DEFAULT CHARACTER SET utf8; USE League;" //make schema step into leage db

sql += "CREATE TABLE IF NOT EXISTS `League`.`Team` (`Team_Id` INT NOT NULL AUTO_INCREMENT,`TeamName` VARCHAR(45) NULL,`Active` TINYINT NULL DEFAULT 1,PRIMARY KEY (`Team_Id`))ENGINE = InnoDB;" //make team table

sql+="CREATE TABLE IF NOT EXISTS `League`.`UserGroup` (`UserGroup_Id` INT NOT NULL AUTO_INCREMENT,`UserGroupName` VARCHAR(50) NULL,PRIMARY KEY (`UserGroup_Id`))ENGINE = InnoDB;" //make usergroup table

sql+="CREATE TABLE IF NOT EXISTS `League`.`User` (`User_Id` INT NOT NULL AUTO_INCREMENT,`username` VARCHAR(50) NOT NULL,`password` VARCHAR(50) NOT NULL,`Team_Id` INT NOT NULL,`UserGroup_Id` INT NULL,INDEX `TeamId_idx` (`Team_Id` ASC),UNIQUE INDEX `username_UNIQUE` (`username` ASC),UNIQUE INDEX `password_UNIQUE` (`password` ASC),PRIMARY KEY (`User_Id`),INDEX `User_Group_Id_idx` (`UserGroup_Id` ASC),CONSTRAINT `TeamId`FOREIGN KEY (`Team_Id`)REFERENCES `League`.`Team` (`Team_Id`)ON DELETE NO ACTION ON UPDATE NO ACTION,CONSTRAINT `User_Group_Id`FOREIGN KEY (`UserGroup_Id`)REFERENCES `League`.`UserGroup` (`UserGroup_Id`)ON DELETE NO ACTION ON UPDATE NO ACTION)ENGINE = InnoDB;" //make user table

sql+="CREATE TABLE IF NOT EXISTS `League`.`Profile` (`User_Id` INT NOT NULL,`email` VARCHAR(100) NULL, `phone` VARCHAR(10) NULL,`ProfilePicLink` VARCHAR(100) NULL,PRIMARY KEY (`User_Id`),CONSTRAINT `User_Id`FOREIGN KEY (`User_Id`)REFERENCES `League`.`User` (`User_Id`)ON DELETE NO ACTION ON UPDATE NO ACTION)ENGINE = InnoDB;" //make profile table

sql+="CREATE TABLE IF NOT EXISTS `League`.`Match` (`Match_Id` INT NOT NULL AUTO_INCREMENT,`GameDate` DATE NULL,`Arena` VARCHAR(100) NULL,`Valid` VARCHAR(45) NOT NULL DEFAULT 'False',PRIMARY KEY (`Match_Id`))ENGINE = InnoDB;" //make match table

sql+="CREATE TABLE IF NOT EXISTS `League`.`TeamMatch_Bridge` (`Match_Id` INT NOT NULL,`Team_Id` INT NOT NULL,`Score` INT NULL,`is_Winner` TINYINT NULL DEFAULT 0,PRIMARY KEY (`Match_Id`, `Team_Id`),INDEX `Team_Id_idx` (`Team_Id` ASC),CONSTRAINT `Match_Id`FOREIGN KEY (`Match_Id`)REFERENCES `League`.`Match` (`Match_Id`)ON DELETE NO ACTION ON UPDATE NO ACTION,CONSTRAINT `Team_Id`FOREIGN KEY (`Team_Id`)REFERENCES `League`.`Team` (`Team_Id`)ON DELETE NO ACTION ON UPDATE NO ACTION)ENGINE = InnoDB;" //Make Table TeamMatch_Bridge

sql+="CREATE TABLE IF NOT EXISTS `League`.`Setup` (`Limiter` ENUM('only') NOT NULL DEFAULT 'only',`NumOfTeams` INT NOT NULL,`TeamSize` INT NOT NULL,`LeagueName` VARCHAR(100) NOT NULL,PRIMARY KEY (`Limiter`),UNIQUE INDEX `Limiter_UNIQUE` (`Limiter` ASC))ENGINE = InnoDB;" //make Setup Table

sql+="CREATE TABLE IF NOT EXISTS `League`.`Rules` (`Rule_Id` INT NOT NULL AUTO_INCREMENT,`Rule_Description` VARCHAR(200) NULL,PRIMARY KEY (`Rule_Id`))ENGINE = InnoDB;" //make rules table

sql+="CREATE TABLE IF NOT EXISTS `League`.`GroupRules_Bridge` (`UserGroup_Id` INT NOT NULL,`Rule_Id` INT NOT NULL,PRIMARY KEY (`UserGroup_Id`, `Rule_Id`),INDEX `Rule_Id_idx` (`Rule_Id` ASC),CONSTRAINT `UserGroup_Id`FOREIGN KEY (`UserGroup_Id`)REFERENCES `League`.`UserGroup` (`UserGroup_Id`)ON DELETE NO ACTION ON UPDATE NO ACTION,CONSTRAINT `Rule_Id`FOREIGN KEY (`Rule_Id`)REFERENCES `League`.`Rules` (`Rule_Id`)ON DELETE NO ACTION ON UPDATE NO ACTION)ENGINE = InnoDB;" //make GroupRules_bridge table

sql+="SET SQL_MODE=@OLD_SQL_MODE;SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;" //set various variables back to default

con.connect(function(err){      //con is the reference to our database
    if(err) throw err;
    console.log("Connected!");
    con.query(sql, function(err,result){
        if (err) throw err;
        console.log("Database League Created");
    });
});



app.listen(3000)
