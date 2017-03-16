var util = require('./util.js')

module.exports = function (sqlConnect) {
  var dbOperation = {}

  dbOperation.leftJoinTables = function (reportid) {
    var dbCols = '`ReportID`, `Reporter`, `Disease`, `Country`, `Document Category`, `Journal`, ' +
              '`Title`, `Authors`, `Year of Pub`, `Volume`, `Issue`, `Page from`, `Page to`, ' +
              '`Author contact needed`, `Open access`, `checked`, `note1`, ' +
              '`SurveyID`, `Basic sources_ReportID`, `Data type`, ' +
              '`Survey type`, `Month start`, `Month finish`, ' +
              '`Year start`, `Year finish`, `note2`, ' +
              '`LocationID`, `Survey description_Basic sources_ReportID`, ' +
              '`Survey description_SurveyID`, `ADM1`, `ADM2`, `ADM3`, ' +
              '`Point name`, `Point type`, `Latitude`, `Longitude`, ' +
              '`Geo-reference sources`, `note3`, ' +
              '`DiseaseID`, `Location information_LocationID`, `Species`, ' +
              '`Diagnostic_symptoms`, `Diagnostic_blood`, `Diagnostic_skin`, ' +
              '`Diagnostic_stool`, `Num_samples`, `Num_specimen`, ' +
              '`AgeLower`, `AgeUpper`, ' +
              '`Num_examine`, `Num_positive`, `Percent_positive`, ' +
              '`Num_examine_male`, `Num_positive_male`, `Percent_positive_male`, ' +
              '`Num_examine_female`, `Num_positive_female`, `Percent_positive_female`, ' +
              '`note4`, `Location information_LocationID1`, `L_ReportID`, ' +
              '`Location information_Survey description_SurveyID`, ' +
              '`InterventionID`, `Group`, `Months after baseline`, ' +
              '`Drug`, `Frequency per year`, `Period (months)`, ' +
              '`Coverage`, `Other method`, `I_Num_examine`, ' +
              '`I_Num_positive`, `I_Percent_positive`, `I_Num_examine_male`, ' +
              '`I_Num_positive_male`, `I_Percent_positive_male`, `I_Num_examine_female`, ' +
              '`I_Num_positive_female`, `I_Percent_positive_female`, `note5`, ' +
              '`Disease data_DiseaseID`, ' +
              '`Disease data_Location information_LocationID1`, ' +
              '`Disease data_L_ReportID`, ' +
              '`Disease data_Location information_Survey description_SurveyID`'
    // var testCols = '`ReportID`, `SurveyID`, `LocationID`, `DiseaseID`, `InterventionID`'
    var rawSql = 'SELECT ' + dbCols + ' ' +
                 'FROM `Basic Sources` b ' +
                 'LEFT JOIN `Survey Description` s ON b.ReportID = s.`Basic sources_ReportID` ' +
                 'LEFT JOIN `Location Information` l ON s.SurveyID = l.`Survey description_SurveyID` ' +
                 'LEFT JOIN `Disease Data` d ON l.LocationID = d.`Location information_LocationID1` ' +
                 'LEFT JOIN `Intervention Data` i ON d.DiseaseID = i.`Disease data_DiseaseID` ' +
                 'WHERE b.ReportID = ?'
    return util.exeSqlWithArgs(rawSql, [reportid], sqlConnect)
  }

  dbOperation.queryByReportId = function (reportid) {
    var rawSql = 'SELECT * FROM `Basic sources` WHERE ReportID = ' +
                 sqlConnect.escape(reportid)
    return util.exeRawSql(rawSql, sqlConnect)
  }

  dbOperation.queryByDescription = function (disease, country, year, checked) {
    var rawSql = 'SELECT * FROM `Basic sources` WHERE'
    //  TODO: 无害化处理，防止SQL注入攻击
    if (disease != null) {
      rawSql += ' `Disease` = \'' + disease + '\''
    }
    if (country != null && disease != null) {
      rawSql += ' AND `Country` = \'' + country + '\''
    } else if (country != null && disease == null) {
      rawSql += ' `Country` = \'' + country + '\''
    }
    if (year != null && country == null && disease == null) {
      rawSql += ' `Year of Pub` = ' + year
    } else if (year != null && !(country == null && disease == null)) {
      rawSql += ' AND `Year of Pub` = ' + year
    }
    if (checked != null && year == null && country == null && disease == null) {
      rawSql += ' `checked` = \'' + checked + '\''
    } else if (checked != null && !(year == null && country == null && disease == null)) {
      rawSql += ' AND `checked` = \'' + checked + '\''
    }
    return util.exeRawSql(rawSql, sqlConnect)
  }

  dbOperation.queryTree = function (type, id) {
    var rawSql = ''
    if (type === 'Basic Sources') {
      rawSql = 'SELECT * FROM `Basic Sources` WHERE `ReportID`=' + id
    } else if (type === 'Survey Description') {
      rawSql = 'SELECT * FROM `Survey Description` WHERE `Basic sources_ReportID`=' + id
    } else if (type === 'Location Information') {
      rawSql = 'SELECT * FROM `Location Information` WHERE `Survey description_SurveyID`=' + id
    } else if (type === 'Disease Data') {
      rawSql = 'SELECT * FROM `Disease data` WHERE `Location information_LocationID1`=' + id
    } else if (type === 'Intervention Data') {
      rawSql = 'SELECT * FROM `Intervention Data` WHERE `Disease data_DiseaseID`=' + id
    } else {
      console.log('type error')
    }
    return util.exeRawSql(rawSql, sqlConnect)
  }

  dbOperation.check = function (type, id) {
    var rawSql = ''
    if (type === 'Survey Description') {
      rawSql = 'SELECT * FROM `Basic sources` WHERE `ReportID`=' + id
    } else if (type === 'Location Information') {
      rawSql = 'SELECT * FROM `Survey description` WHERE `SurveyID`=' + id
    } else if (type === 'Disease Data') {
      rawSql = 'SELECT * FROM `Location information` WHERE `LocationID1`=' + id
    } else if (type === 'Intervention Data') {
      rawSql = 'SELECT * FROM `Disease Data` WHERE `DiseaseID`=' + id
    }
    return util.exeRawSql(rawSql, sqlConnect)
  }

  dbOperation.add = function (args, type) {
    var rowSQl = null
    var columns = null
    if (type === 'Basic Sources') {
      columns = '`ReportID`,`Reporter`,`Disease`,`Country`,`Document Category`,`Journal`,' +
        '`Title`,`Authors`,`Year of Pub`,`Volume`,`Issue`,`Page from`,`Page to`,' +
        '`Author contact needed`,`Open access`,`checked`,`note1`'
      rowSQl = 'insert into `Basic Sources` (' + columns + ') values(' + args + ')'
    } else if (type === 'Survey Description') {
      columns = '`SurveyID`,`Basic sources_ReportID`,`Data type`,`Survey type`,' +
        '`Month start`,`Month finish`,`Year start`,`Year finish`,`note2`'
      rowSQl = 'insert into `Survey description` (' + columns + ') values(' + args + ')'
    } else if (type === 'Location Information') {
      columns = '`LocationID`,`Survey description_Basic sources_ReportID`,`Survey description_SurveyID`,' +
        '`ADM1`,`ADM2`,`ADM3`,`Point name`,`Point type`,`Latitude`,`Longitude`,`Geo-reference sources`,`note3`'
      rowSQl = 'insert into `Location information` (' + columns + ') values(' + args + ')'
    } else if (type === 'Disease Data') {
      columns = '`DiseaseID`,`Location information_LocationID`,`Species`,`Diagnostic_symptoms`,' +
        '`Diagnostic_blood`,`Diagnostic_skin`,`Diagnostic_stool`,`Num_samples`,`Num_specimen`,' +
        '`AgeLower`,`AgeUpper`,`Num_examine`,`Num_positive`,`Percent_positive`,`Num_examine_male`,' +
        '`Num_positive_male`,`Percent_positive_male`,`Num_examine_female`,`Num_positive_female`,' +
        '`Percent_positive_female`,`note4`,`Location information_LocationID1`,`L_ReportID`,' +
        '`Location information_Survey description_SurveyID`'
      rowSQl = 'insert into `Disease data` (' + columns + ') values(' + args + ')'
    } else if (type === 'Intervention Data') {
      columns = '`InterventionID`,`Group`,`Months after baseline`,`Drug`,`Frequency per year`,`Period (months)`,' +
        '`Coverage`,`Other method`,`I_Num_examine`,`I_Num_positive`,`I_Percent_positive`,' +
        '`I_Num_examine_male`,`I_Num_positive_male`,`I_Percent_positive_male`,`I_Num_examine_female`,' +
        '`I_Num_positive_female`,`I_Percent_positive_female`,`note5`,`Disease data_DiseaseID`,' +
        '`Disease data_Location information_LocationID1`,`Disease data_L_ReportID`,' +
        '`Disease data_Location information_Survey description_SurveyID`'
      rowSQl = 'insert into `Intervention data` (' + columns + ') values(' + args + ')'
    }
    console.log(rowSQl)
    return util.exeRawSql(rowSQl, sqlConnect)
  }

  dbOperation.delete = function (type, id) {
    if (type === 'Basic Sources') {
      let deletesql1 = 'DELETE from `Intervention data` WHERE `Disease data_Location information_LocationID1` = ' + id + ';'
      let deletesql2 = 'DELETE from `Disease data` WHERE `L_ReportID` = ' + id + ';'
      let deletesql3 = 'DELETE from `Location information` WHERE `Survey description_Basic sources_ReportID` = ' + id + ';'
      let deletesql4 = 'DELETE from `Survey description` WHERE `Basic sources_ReportID` = ' + id + ';'
      let deletesql5 = 'DELETE from `Basic sources` WHERE `ReportID` = ' + id + ';'
      return Promise.all([
        util.exeRawSql(deletesql1, sqlConnect),
        util.exeRawSql(deletesql2, sqlConnect),
        util.exeRawSql(deletesql3, sqlConnect),
        util.exeRawSql(deletesql4, sqlConnect),
        util.exeRawSql(deletesql5, sqlConnect)
      ])
    } else if (type === 'Survey Description') {
      let deletesql1 = 'DELETE from `Intervention data` WHERE `Disease data_Location information_Survey description_SurveyID` = ' + id
      let deletesql2 = 'DELETE from `disease data` WHERE `Location information_Survey description_SurveyID` = ' + id + ';'
      let deletesql3 = 'DELETE from `Location information` WHERE `Survey description_SurveyID` = ' + id + ';'
      let deletesql4 = 'DELETE from `Survey description` WHERE `SurveyID` = ' + id + ';'
      return Promise.all([
        util.exeRawSql(deletesql1, sqlConnect),
        util.exeRawSql(deletesql2, sqlConnect),
        util.exeRawSql(deletesql3, sqlConnect),
        util.exeRawSql(deletesql4, sqlConnect)
      ])
    } else if (type === 'Location Information') {
      let deletesql1 = 'DELETE from `Intervention data` WHERE `Disease data_Location information_LocationID1` = ' + id + ';'
      let deletesql2 = 'DELETE from `disease data` WHERE `Location information_LocationID` = ' + id + ';'
      let deletesql3 = 'DELETE from `Location information` WHERE `LocationID` = ' + id + ';'
      return Promise.all([
        util.exeRawSql(deletesql1, sqlConnect),
        util.exeRawSql(deletesql2, sqlConnect),
        util.exeRawSql(deletesql3, sqlConnect)
      ])
    } else if (type === 'Disease Data') {
      let deletesql1 = 'DELETE from `Intervention data` WHERE `Disease data_DiseaseID`=' + id + ';'
      let deletesql2 = 'DELETE from `Disease data` WHERE `DiseaseID` = ' + id + ';'
      return Promise.all([
        util.exeRawSql(deletesql1, sqlConnect),
        util.exeRawSql(deletesql2, sqlConnect)
      ])
    } else if (type === 'Intervention Data') {
      let deletesql1 = 'delete from `Intervention data` where `InterventionID`=' + id + ';'
      return util.exeRawSql(deletesql1, sqlConnect)
    } else {
      console.log('Type Error')
      return util.exeRawSql('', sqlConnect)
    }
  }

  dbOperation.edit = function (type, newData) {
    var sql = ''
    var id = -1
    if (type === 'Basic Sources') {
      id = newData.ReportID
      sql = 'update `basic sources` set ' +
        '`Reporter` = \'' + newData.Reporter +
        '\',`Disease`= \'' + newData.Disease +
        '\',`Country`= \'' + newData.Country +
        '\',`Document Category`= \'' + newData.DocumentCategory +
        '\',`Journal` = \'' + newData.Journal +
        '\',`Title` = \'' + newData.Title +
        '\',`Authors`= \'' + newData.Authors +
        '\',`Year of Pub`=' + newData.YearOfPub +
        ',`Volume`=' + newData.Volume +
        ',`Issue`=' + newData.Issue +
        ',`Page from`=' + newData.PageFrom +
        ',`Page to`=' + newData.PageTo +
        ',`Author contact needed`= \'' + newData.AuthorContactNeeded +
        '\',`Open access`= \'' + newData.OpenAccess +
        '\',`checked`= \'' + newData.Checked +
        '\',`note1`= \'' + newData.Note1 + '\' where ReportID =' + id
    } else if (type === 'Survey Description') {
      id = newData.SurveyID
      sql = 'update `' + type + '` set ' + '`Basic sources_ReportID`= ' +
        newData.BasicSourcesReportID +
        ',`Data type`= \'' + newData.DataType +
        '\',`Survey type`= \'' + newData.SurveyType +
        '\',`Month start`= \'' + newData.MonthStart +
        '\',`Month finish`= \'' + newData.MonthFinish +
        '\',`Year start`= ' + newData.YearStart +
        ',`Year finish`= ' + newData.YearFinish +
        ',`note2`= \'' + newData.Note2 + '\' where SurveyID = ' + id
    } else if (type === 'Location Information') {
      id = newData.LocationID
      sql = 'update `' + type + '` set ' +
        '`Survey description_Basic sources_ReportID`= ' + newData.SurveyDescriptionBasicSourcesReportID +
        ',`Survey description_SurveyID`= ' + newData.SurveyDescriptionSurveyID +
        ',`ADM1`= \'' + newData.ADM1 +
        '\',`ADM2`= \'' + newData.ADM2 +
        '\',`ADM3`= \'' + newData.ADM3 +
        '\',`Point name`= \'' + newData.PointName +
        '\',`Point type`= \'' + newData.PointType +
        '\',`Latitude`= ' + newData.Latitude +
        ',`Longitude`= ' + newData.Longitude +
        ',`Geo-reference sources`= \'' + newData.GeoReferenceSources +
        '\',`note3`= \'' + newData.Note3 + '\' where LocationID = ' + id
    } else if (type === 'Disease Data') {
      id = newData.DiseaseID
      sql = 'update `' + type + '` set ' +
        '`Location information_LocationID`= \'' + newData.LocationInformationLocationID +
        '\',`Species`= \'' + newData.Species +
        '\',`Diagnostic_symptoms`= \'' + newData.DiagnosticSymptoms +
        '\',`Diagnostic_blood`= \'' + newData.DiagnosticBlood +
        '\',`Diagnostic_skin`= \'' + newData.DiagnosticSkin +
        '\',`Diagnostic_stool`= \'' + newData.DiagnosticStool +
        '\',`Num_samples`= \'' + newData.NumSamples +
        '\',`Num_specimen`= \'' + newData.NumSpecimen +
        '\',`AgeLower`= ' + newData.AgeLower +
        ',`AgeUpper`= ' + newData.AgeUpper +
        ',`Num_examine`= ' + newData.NumExamine +
        ',`Num_positive`= ' + newData.NumPositive +
        ',`Percent_positive`= ' + newData.PercentPositive +
        ',`Num_examine_male`= ' + newData.NumExamineMale +
        ',`Num_positive_male`= ' + newData.NumPositiveMale +
        ',`Percent_positive_male`= ' + newData.PercentPositiveMale +
        ',`Num_examine_female`= ' + newData.NumExamineFemale +
        ',`Num_positive_female`= ' + newData.NumPositiveFemale +
        ',`Percent_positive_female`= ' + newData.PercentPositiveFemale +
        ',`note4`= \'' + newData.Note4 +
        '\',`Location information_LocationID1`= ' + newData.LocationInformationLocationID1 +
        ',`L_ReportID`= ' + newData.LReportID +
        ',`Location information_Survey description_SurveyID`= ' + newData.LocationInformationSurveyDescriptionSurveyID +
        ' where DiseaseID = ' + id
    } else if (type === 'Intervention Data') {
      id = newData.InterventionID
      sql = 'update `Intervention data` set ' +
        '`Group`= \'' + newData.Group +
        '\',`Months after baseline`= ' + newData.MonthsAfterBaseline +
        ',`Drug`= \'' + newData.Drug +
        '\',`Frequency per year`= ' + newData.FrequencyPerYear +
        ',`Period (months)`= ' + newData.PeriodMonths +
        ',`Coverage`= ' + newData.Coverage +
        ',`Other method`= \'' + newData.OtherMethod +
        '\',`I_Num_examine`= ' + newData.INumExamine +
        ',`I_Num_positive`= ' + newData.INumPositive +
        ',`I_Percent_positive`= ' + newData.IPercentPositive +
        ',`I_Num_examine_male`= ' + newData.INumExamineMale +
        ',`I_Num_positive_male`= ' + newData.INumPositiveMale +
        ',`I_Percent_positive_male`= ' + newData.IPercentPositiveMale +
        ',`I_Num_examine_female`= ' + newData.INumExamineFemale +
        ',`I_Num_positive_female`= ' + newData.INumPositiveFemale +
        ',`I_Percent_positive_female`= ' + newData.IPercentPositiveFemale +
        ',`note5`= \'' + newData.Note5 +
        '\',`Disease data_DiseaseID`= ' + newData.DiseaseDataDiseaseID +
        ',`Disease data_Location information_LocationID1`= ' + newData.DiseaseDataLocationInformationLocationID1 +
        ',`Disease data_L_ReportID`= ' + newData.DiseaseDataLReportID +
        ',`Disease data_Location information_Survey description_SurveyID`= ' + newData.DiseaseDataLocationInformationSurveyDescriptionSurveyID +
        ' where InterventionID = ' + id
    } else {
      console.log('err >> not match')
    }
    console.log(sql)
    return util.exeRawSql(sql, sqlConnect)
  }

  // -----------------getid---------------------------------
  dbOperation.getMaxID = function (type) {
    var selectStr = ''
    if (type === 'Basic Sources') {
      selectStr = 'select MAX(ReportID) as ID from `basic sources`'
    } else if (type === 'Survey Description') {
      selectStr = 'select MAX(SurveyID) as ID from `survey description`'
    } else if (type === 'Location Information') {
      selectStr = 'select MAX(LocationID) as ID from `location information`'
    } else if (type === 'Disease Data') {
      selectStr = 'select MAX(DiseaseID) as ID from `disease data`'
    } else if (type === 'Intervention Data') {
      selectStr = 'select MAX(InterventionID) as ID from `intervention data`'
    } else {
      console.log('type error')
      selectStr = ''
    }
    return util.exeRawSql(selectStr, sqlConnect)
  }

  dbOperation.exportTable = function (id) {
    var rawSqlB = 'SELECT * FROM `Basic Sources` WHERE `ReportID` = ?'
    var rawSqlS = 'SELECT * FROM `Survey Description` WHERE `Basic sources_ReportID` = ?'
    var rawSqlL = 'SELECT * FROM `Location Information` WHERE `Survey description_Basic sources_ReportID` = ?'
    var rawSqlD = 'SELECT * FROM `Disease Data` WHERE `L_ReportID` = ?'
    var rawSqlI = 'SELECT * FROM `Intervention data` WHERE `Disease data_L_ReportID` = ?'
    return Promise.all([
      util.exeSqlWithArgs(rawSqlB, [id], sqlConnect),
      util.exeSqlWithArgs(rawSqlS, [id], sqlConnect),
      util.exeSqlWithArgs(rawSqlL, [id], sqlConnect),
      util.exeSqlWithArgs(rawSqlD, [id], sqlConnect),
      util.exeSqlWithArgs(rawSqlI, [id], sqlConnect)
    ])
  }
  //  获取整棵id树，传入根ID
  dbOperation.getIDTree = function (id) {
    // console.log('getidtree')
    var rawSqlS = 'SELECT `SurveyID` ' +
                  'FROM `Survey Description` WHERE `Basic sources_ReportID` = ?'
    var rawSqlL = 'SELECT `Survey description_SurveyID`' +
                  ',`LocationID` FROM `Location Information`' +
                  ' WHERE `Survey description_Basic sources_ReportID` = ?'
    var rawSqlD = 'SELECT `Location information_Survey description_SurveyID` ' +
                  ',`Location information_LocationID1`' +
                  ',`DiseaseID` ' +
                  'FROM `Disease Data` WHERE `L_ReportID` = ?'
    var rawSqlI = 'SELECT `Disease data_Location information_Survey description_SurveyID`' +
                  ',`Disease data_Location information_LocationID1`' +
                  ',`Disease data_DiseaseID`' +
                  ',`InterventionID` ' +
                  'FROM `Intervention data` WHERE `Disease data_L_ReportID` = ?'
    return Promise.all([
      util.exeSqlWithArgs(rawSqlS, [id], sqlConnect),
      util.exeSqlWithArgs(rawSqlL, [id], sqlConnect),
      util.exeSqlWithArgs(rawSqlD, [id], sqlConnect),
      util.exeSqlWithArgs(rawSqlI, [id], sqlConnect)
    ])
  }

  dbOperation.getIdContent = function (id, type) {
    var rawSql = ''
    if (type === 'Basic Sources') {
      rawSql = 'SELECT * FROM `Basic Sources` WHERE `ReportID`=' + id
    } else if (type === 'Survey Description') {
      rawSql = 'SELECT * FROM `Survey Description` WHERE `SurveyID`=' + id
    } else if (type === 'Location Information') {
      rawSql = 'SELECT * FROM `Location Information` WHERE `LocationID`=' + id
    } else if (type === 'Disease Data') {
      rawSql = 'SELECT * FROM `Disease data` WHERE `DiseaseID`=' + id
    } else if (type === 'Intervention Data') {
      rawSql = 'SELECT * FROM `Intervention Data` WHERE `InterventionID`=' + id
    } else {
      console.log('type error')
    }
    return util.exeRawSql(rawSql, sqlConnect)
  }

  return dbOperation
}
