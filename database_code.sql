-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema League
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema League
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `League` DEFAULT CHARACTER SET utf8 ;
USE `League` ;

-- -----------------------------------------------------
-- Table `League`.`Team`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `League`.`Team` (
  `Team_Id` INT NOT NULL AUTO_INCREMENT,
  `TeamName` VARCHAR(45) NULL,
  `Active` TINYINT NULL DEFAULT 1,
  PRIMARY KEY (`Team_Id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `League`.`UserGroup`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `League`.`UserGroup` (
  `UserGroup_Id` INT NOT NULL AUTO_INCREMENT,
  `UserGroupName` VARCHAR(50) NULL,
  PRIMARY KEY (`UserGroup_Id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `League`.`User`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `League`.`User` (
  `User_Id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `password` VARCHAR(50) NOT NULL,
  `Team_Id` INT NOT NULL,
  `UserGroup_Id` INT NULL,
  INDEX `TeamId_idx` (`Team_Id` ASC) VISIBLE,
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
  UNIQUE INDEX `password_UNIQUE` (`password` ASC) VISIBLE,
  PRIMARY KEY (`User_Id`),
  INDEX `User_Group_Id_idx` (`UserGroup_Id` ASC) VISIBLE,
  CONSTRAINT `TeamId`
    FOREIGN KEY (`Team_Id`)
    REFERENCES `League`.`Team` (`Team_Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `User_Group_Id`
    FOREIGN KEY (`UserGroup_Id`)
    REFERENCES `League`.`UserGroup` (`UserGroup_Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `League`.`Profile`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `League`.`Profile` (
  `User_Id` INT NOT NULL,
  `email` VARCHAR(100) NULL,
  `phone` VARCHAR(10) NULL,
  `ProfilePicLink` VARCHAR(100) NULL,
  PRIMARY KEY (`User_Id`),
  CONSTRAINT `User_Id`
    FOREIGN KEY (`User_Id`)
    REFERENCES `League`.`User` (`User_Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `League`.`Match`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `League`.`Match` (
  `Match_Id` INT NOT NULL AUTO_INCREMENT,
  `GameDate` DATE NULL,
  `Arena` VARCHAR(100) NULL,
  `AcceptResults` TINYINT NULL,
  `Matchcol` VARCHAR(45) NULL,
  PRIMARY KEY (`Match_Id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `League`.`TeamMatch_Bridge`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `League`.`TeamMatch_Bridge` (
  `Match_Id` INT NOT NULL,
  `Team_Id` INT NOT NULL,
  `Score` INT NULL,
  `is_Winner` TINYINT NULL DEFAULT 0,
  PRIMARY KEY (`Match_Id`, `Team_Id`),
  INDEX `Team_Id_idx` (`Team_Id` ASC) VISIBLE,
  CONSTRAINT `Match_Id`
    FOREIGN KEY (`Match_Id`)
    REFERENCES `League`.`Match` (`Match_Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `Team_Id`
    FOREIGN KEY (`Team_Id`)
    REFERENCES `League`.`Team` (`Team_Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `League`.`Setup`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `League`.`Setup` (
  `Limiter` ENUM('only') NOT NULL DEFAULT 'only',
  `LeagueName` VARCHAR(45) NULL,
  `NumOfTeams` INT NOT NULL,
  `TeamSize` INT NOT NULL,
  PRIMARY KEY (`Limiter`),
  UNIQUE INDEX `Limiter_UNIQUE` (`Limiter` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `League`.`Rules`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `League`.`Rules` (
  `Rule_Id` INT NOT NULL AUTO_INCREMENT,
  `Rule_Description` VARCHAR(200) NULL,
  PRIMARY KEY (`Rule_Id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `League`.`GroupRules_Bridge`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `League`.`GroupRules_Bridge` (
  `UserGroup_Id` INT NOT NULL,
  `Rule_Id` INT NOT NULL,
  PRIMARY KEY (`UserGroup_Id`, `Rule_Id`),
  INDEX `Rule_Id_idx` (`Rule_Id` ASC) VISIBLE,
  CONSTRAINT `UserGroup_Id`
    FOREIGN KEY (`UserGroup_Id`)
    REFERENCES `League`.`UserGroup` (`UserGroup_Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `Rule_Id`
    FOREIGN KEY (`Rule_Id`)
    REFERENCES `League`.`Rules` (`Rule_Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
