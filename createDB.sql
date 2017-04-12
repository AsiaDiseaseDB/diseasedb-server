-- MySQL Script generated by MySQL Workbench
-- Sun Mar 19 20:43:17 2017
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema nodejs
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema nodejs
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `nodejs` DEFAULT CHARACTER SET utf8 ;
USE `nodejs` ;

-- -----------------------------------------------------
-- Table `nodejs`.`Basic Sources`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nodejs`.`Basic Sources` (
  `ReportID` INT NOT NULL AUTO_INCREMENT,
  `Reporter` VARCHAR(45) NOT NULL COMMENT 'authority',
  `Disease` VARCHAR(45) NOT NULL,
  `Country` VARCHAR(45) NOT NULL,
  `Document Category` VARCHAR(45) NOT NULL,
  `Journal` VARCHAR(45) NOT NULL,
  `Title` VARCHAR(45) NOT NULL,
  `Authors` VARCHAR(45) NOT NULL,
  `Year of Pub` INT NOT NULL,
  `Volume` INT NULL,
  `Issue` INT NULL,
  `Page from` INT NULL,
  `Page to` INT NULL,
  `Author contact needed` ENUM('No', 'Yes', 'Already') NOT NULL,
  `Open access` ENUM('No', 'Yes') NOT NULL COMMENT 'Authority',
  `checked` VARCHAR(45) NULL,
  `note1` LONGTEXT NULL,
  PRIMARY KEY (`ReportID`),
  UNIQUE INDEX `ReportID_UNIQUE` (`ReportID` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nodejs`.`Survey Description`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nodejs`.`Survey Description` (
  `SurveyID` INT NOT NULL AUTO_INCREMENT,
  `Basic sources_ReportID` INT NOT NULL,
  `Data type` VARCHAR(45) NOT NULL,
  `Survey type` VARCHAR(45) NOT NULL,
  `Month start` VARCHAR(45) NULL,
  `Month finish` VARCHAR(45) NULL,
  `Year start` VARCHAR(45) NULL,
  `Year finish` VARCHAR(45) NULL,
  `note2` LONGTEXT NULL,
  PRIMARY KEY (`SurveyID`, `Basic sources_ReportID`),
  UNIQUE INDEX `SurveyID_UNIQUE` (`SurveyID` ASC),
  INDEX `fk_Survey description_Basic sources_idx` (`Basic sources_ReportID` ASC),
  CONSTRAINT `fk_Survey description_Basic sources`
    FOREIGN KEY (`Basic sources_ReportID`)
    REFERENCES `nodejs`.`Basic Sources` (`ReportID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nodejs`.`Location Information`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nodejs`.`Location Information` (
  `LocationID` INT NOT NULL AUTO_INCREMENT,
  `Survey description_Basic sources_ReportID` INT NOT NULL,
  `Survey description_SurveyID` INT NOT NULL,
  `ADM1` VARCHAR(45) NULL,
  `ADM2` VARCHAR(45) NULL,
  `ADM3` VARCHAR(45) NULL,
  `Point name` VARCHAR(45) NULL,
  `Point type` VARCHAR(45) NULL,
  `Latitude` FLOAT NULL,
  `Longitude` FLOAT NULL,
  `Geo-reference sources` VARCHAR(45) NULL,
  `note3` LONGTEXT NULL,
  PRIMARY KEY (`LocationID`, `Survey description_Basic sources_ReportID`, `Survey description_SurveyID`),
  UNIQUE INDEX `LocationID_UNIQUE` (`LocationID` ASC),
  INDEX `fk_Location information_Survey description1_idx` (`Survey description_SurveyID` ASC, `Survey description_Basic sources_ReportID` ASC),
  CONSTRAINT `fk_Location information_Survey description1`
    FOREIGN KEY (`Survey description_SurveyID` , `Survey description_Basic sources_ReportID`)
    REFERENCES `nodejs`.`Survey Description` (`SurveyID` , `Basic sources_ReportID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nodejs`.`Disease Data`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nodejs`.`Disease Data` (
  `DiseaseID` INT NOT NULL AUTO_INCREMENT,
  `Location information_LocationID` VARCHAR(45) NOT NULL,
  `Species` VARCHAR(45) NOT NULL,
  `Diagnostic_symptoms` VARCHAR(45) NULL,
  `Diagnostic_blood` VARCHAR(45) NULL,
  `Diagnostic_skin` VARCHAR(45) NULL,
  `Diagnostic_stool` VARCHAR(45) NULL,
  `Num_samples` VARCHAR(45) NULL,
  `Num_specimen` VARCHAR(45) NULL,
  `AgeLower` INT NULL,
  `AgeUpper` INT NULL,
  `Num_examine` INT NULL,
  `Num_positive` INT NULL,
  `Percent_positive` FLOAT NULL,
  `Num_examine_male` INT NULL,
  `Num_positive_male` INT NULL,
  `Percent_positive_male` FLOAT NULL,
  `Num_examine_female` INT NULL,
  `Num_positive_female` INT NULL,
  `Percent_positive_female` FLOAT NULL,
  `note4` LONGTEXT NULL,
  `Location information_LocationID1` INT NOT NULL,
  `L_ReportID` INT NOT NULL,
  `Location information_Survey description_SurveyID` INT NOT NULL,
  PRIMARY KEY (`DiseaseID`, `Location information_LocationID1`, `L_ReportID`, `Location information_Survey description_SurveyID`),
  UNIQUE INDEX `DiseaseID_UNIQUE` (`DiseaseID` ASC),
  INDEX `fk_Disease data_Location information1_idx` (`Location information_LocationID1` ASC, `L_ReportID` ASC, `Location information_Survey description_SurveyID` ASC),
  CONSTRAINT `fk_Disease data_Location information1`
    FOREIGN KEY (`Location information_LocationID1` , `L_ReportID` , `Location information_Survey description_SurveyID`)
    REFERENCES `nodejs`.`Location Information` (`LocationID` , `Survey description_Basic sources_ReportID` , `Survey description_SurveyID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nodejs`.`Intervention Data`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nodejs`.`Intervention Data` (
  `InterventionID` INT NOT NULL AUTO_INCREMENT,
  `Group` VARCHAR(45) NULL,
  `Months after baseline` INT NULL,
  `Drug` VARCHAR(45) NULL,
  `Frequency per year` INT NULL,
  `Period (months)` INT NULL,
  `Coverage` FLOAT NULL,
  `Other method` VARCHAR(45) NULL,
  `I_Num_examine` INT NULL,
  `I_Num_positive` INT NULL,
  `I_Percent_positive` FLOAT NULL,
  `I_Num_examine_male` INT NULL,
  `I_Num_positive_male` INT NULL,
  `I_Percent_positive_male` FLOAT NULL,
  `I_Num_examine_female` INT NULL,
  `I_Num_positive_female` INT NULL,
  `I_Percent_positive_female` FLOAT NULL,
  `note5` LONGTEXT NULL,
  `Disease data_DiseaseID` INT NOT NULL,
  `Disease data_Location information_LocationID1` INT NOT NULL,
  `Disease data_L_ReportID` INT NOT NULL,
  `Disease data_Location information_Survey description_SurveyID` INT NOT NULL,
  PRIMARY KEY (`InterventionID`, `Disease data_DiseaseID`, `Disease data_Location information_LocationID1`, `Disease data_L_ReportID`, `Disease data_Location information_Survey description_SurveyID`),
  UNIQUE INDEX `InterventionID_UNIQUE` (`InterventionID` ASC),
  INDEX `fk_Intervention data_Disease data1_idx` (`Disease data_DiseaseID` ASC, `Disease data_Location information_LocationID1` ASC, `Disease data_L_ReportID` ASC, `Disease data_Location information_Survey description_SurveyID` ASC),
  CONSTRAINT `fk_Intervention data_Disease data1`
    FOREIGN KEY (`Disease data_DiseaseID` , `Disease data_Location information_LocationID1` , `Disease data_L_ReportID` , `Disease data_Location information_Survey description_SurveyID`)
    REFERENCES `nodejs`.`Disease Data` (`DiseaseID` , `Location information_LocationID1` , `L_ReportID` , `Location information_Survey description_SurveyID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nodejs`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `password` VARCHAR(45) NULL,
  `authority` INT NULL
);

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
