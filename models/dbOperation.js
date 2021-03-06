var util = require('./util.js')

const bColumns = '`ReportID`,`Reporter`,`Disease`,`Country`,`Document Category`,`Journal`,' +
               '`Title`,`Authors`,`Year of Pub`,`Volume`,`Issue`,`Page from`,`Page to`,' +
               '`Author contact needed`,`Open access`,`checked`,`note1`'

const sColumns = '`SurveyID`,`Basic sources_ReportID`,`Data type`,`Survey type`,' +
               '`Month start`,`Month finish`,`Year start`,`Year finish`,`note2`'

const lColumns = '`LocationID`,`Survey description_Basic sources_ReportID`,`Survey description_SurveyID`,' +
               '`ADM1`,`ADM2`,`ADM3`,`Point name`,`Point type`,`Latitude`,`Longitude`,`Geo-reference sources`,`note3`'

const dColumns = '`DiseaseID`,`Location information_LocationID`,`Species`,`Diagnostic_symptoms`,' +
               '`Diagnostic_blood`,`Diagnostic_skin`,`Diagnostic_stool`,`Num_samples`,`Num_specimen`,' +
               '`AgeLower`,`AgeUpper`,`Num_examine`,`Num_positive`,`Percent_positive`,`Num_examine_male`,' +
               '`Num_positive_male`,`Percent_positive_male`,`Num_examine_female`,`Num_positive_female`,' +
               '`Percent_positive_female`,`note4`,`Location information_LocationID1`,`L_ReportID`,' +
               '`Location information_Survey description_SurveyID`'

const iColumns = '`InterventionID`,`Group`,`Months after baseline`,`Drug`,`Frequency per year`,`Period (months)`,' +
               '`Coverage`,`Other method`,`I_Num_examine`,`I_Num_positive`,`I_Percent_positive`,' +
               '`I_Num_examine_male`,`I_Num_positive_male`,`I_Percent_positive_male`,`I_Num_examine_female`,' +
               '`I_Num_positive_female`,`I_Percent_positive_female`,`note5`,`Disease data_DiseaseID`,' +
               '`Disease data_Location information_LocationID1`,`Disease data_L_ReportID`,' +
               '`Disease data_Location information_Survey description_SurveyID`'

function handleNullCol (col) {
  if (col === undefined) {
    return 'null'
  } else {
    return col
  }
}

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

  dbOperation.queryByReportId = function (reportid, authority) {
    var rawSql = 'SELECT * FROM `Basic Sources` WHERE ReportID = ' +
    sqlConnect.escape(reportid)
    if (authority >= 3) {
      rawSql += ' AND `Open access` = \'Yes\''
    }
    // console.log(rawSql)
    return util.exeRawSql(rawSql, sqlConnect)
  }

  dbOperation.queryByDescription = function (disease, country, year, checked, authority) {
    var rawSql = 'SELECT * FROM `Basic Sources` WHERE'
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
    if (authority >= 3) {
      rawSql += ' AND `Open access` = \'Yes\''
    }
    // console.log(rawSql)
    return util.exeRawSql(rawSql, sqlConnect)
  }

  dbOperation.queryAll = function (authority, limit) {
    var rawSql = 'SELECT * FROM `Basic Sources`'
    if (authority >= 3) {
      rawSql += ' WHERE `Open access` = \'Yes\''
    }
    if (limit !== undefined) {
      rawSql += ' LIMIT ' + parseInt(limit)
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
      rawSql = 'SELECT * FROM `Disease Data` WHERE `Location information_LocationID1`=' + id
    } else if (type === 'Intervention Data') {
      rawSql = 'SELECT * FROM `Intervention Data` WHERE `Disease data_DiseaseID`=' + id
    } else {
      console.log('type error')
    }
    return util.exeRawSql(rawSql, sqlConnect)
  }

  dbOperation.add = function (args, type) {
    var rawSQl = ''
    if (type === 'Basic Sources') {
      rawSQl = 'INSERT INTO `Basic Sources` (' + bColumns + ') values(' + args + ')'
    } else if (type === 'Survey Description') {
      rawSQl = 'INSERT INTO `Survey Description` (' + sColumns + ') values(' + args + ')'
    } else if (type === 'Location Information') {
      rawSQl = 'INSERT INTO `Location Information` (' + lColumns + ') values(' + args + ')'
    } else if (type === 'Disease Data') {
      rawSQl = 'INSERT INTO `Disease Data` (' + dColumns + ') values(' + args + ')'
    } else if (type === 'Intervention Data') {
      rawSQl = 'INSERT INTO `Intervention Data` (' + iColumns + ') values(' + args + ')'
    }
    console.log(rawSQl)
    return util.exeRawSql(rawSQl, sqlConnect)
  }

  dbOperation.delete = function (type, id) {
    if (type === 'Basic Sources') {
      let deletesql1 = 'DELETE from `Intervention Data` WHERE `Disease data_L_ReportID` = ' + id + ';'
      let deletesql2 = 'DELETE from `Disease Data` WHERE `L_ReportID` = ' + id + ';'
      let deletesql3 = 'DELETE from `Location Information` WHERE `Survey description_Basic sources_ReportID` = ' + id + ';'
      let deletesql4 = 'DELETE from `Survey Description` WHERE `Basic sources_ReportID` = ' + id + ';'
      let deletesql5 = 'DELETE from `Basic Sources` WHERE `ReportID` = ' + id + ';'
      return Promise.all([
        util.exeRawSql(deletesql1, sqlConnect),
        util.exeRawSql(deletesql2, sqlConnect),
        util.exeRawSql(deletesql3, sqlConnect),
        util.exeRawSql(deletesql4, sqlConnect),
        util.exeRawSql(deletesql5, sqlConnect)
      ])
    } else if (type === 'Survey Description') {
      let deletesql1 = 'DELETE from `Intervention Data` WHERE `Disease data_Location information_Survey description_SurveyID` = ' + id
      let deletesql2 = 'DELETE from `Disease Data` WHERE `Location information_Survey description_SurveyID` = ' + id + ';'
      let deletesql3 = 'DELETE from `Location Information` WHERE `Survey description_SurveyID` = ' + id + ';'
      let deletesql4 = 'DELETE from `Survey Description` WHERE `SurveyID` = ' + id + ';'
      return Promise.all([
        util.exeRawSql(deletesql1, sqlConnect),
        util.exeRawSql(deletesql2, sqlConnect),
        util.exeRawSql(deletesql3, sqlConnect),
        util.exeRawSql(deletesql4, sqlConnect)
      ])
    } else if (type === 'Location Information') {
      let deletesql1 = 'DELETE from `Intervention Data` WHERE `Disease data_Location information_LocationID1` = ' + id + ';'
      let deletesql2 = 'DELETE from `Disease Data` WHERE `Location information_LocationID` = ' + id + ';'
      let deletesql3 = 'DELETE from `Location Information` WHERE `LocationID` = ' + id + ';'
      return Promise.all([
        util.exeRawSql(deletesql1, sqlConnect),
        util.exeRawSql(deletesql2, sqlConnect),
        util.exeRawSql(deletesql3, sqlConnect)
      ])
    } else if (type === 'Disease Data') {
      let deletesql1 = 'DELETE from `Intervention Data` WHERE `Disease data_DiseaseID`=' + id + ';'
      let deletesql2 = 'DELETE from `Disease Data` WHERE `DiseaseID` = ' + id + ';'
      return Promise.all([
        util.exeRawSql(deletesql1, sqlConnect),
        util.exeRawSql(deletesql2, sqlConnect)
      ])
    } else if (type === 'Intervention Data') {
      let deletesql1 = 'delete from `Intervention Data` where `InterventionID`=' + id + ';'
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
      sql = 'update `Basic Sources` set ' +
        '`Reporter` = ' + handleNullCol(newData.Reporter) +
        ',`Disease`= ' + handleNullCol(newData.Disease) +
        ',`Country`= ' + handleNullCol(newData.Country) +
        ',`Document Category`= ' + handleNullCol(newData.DocumentCategory) +
        ',`Journal` = ' + newData.Journal +
        ',`Title` = ' + newData.Title +
        ',`Authors`= ' + newData.Authors +
        ',`Year of Pub`=' + newData.YearOfPub +
        ',`Volume`=' + handleNullCol(newData.Volume) +
        ',`Issue`=' + handleNullCol(newData.Issue) +
        ',`Page from`=' + handleNullCol(newData.PageFrom) +
        ',`Page to`=' + handleNullCol(newData.PageTo) +
        ',`Author contact needed`= ' + newData.AuthorContactNeeded +
        ',`Open access`= ' + newData.OpenAccess +
        ',`checked`= ' + handleNullCol(newData.Checked) +
        ',`note1`= ' + handleNullCol(newData.Note1) + ' where ReportID =' + id
    } else if (type === 'Survey Description') {
      id = newData.SurveyID
      sql = 'update `' + type + '` set ' + '`Basic sources_ReportID`= ' +
        newData.BasicSourcesReportID +
        ',`Data type`= ' + handleNullCol(newData.DataType) +
        ',`Survey type`= ' + handleNullCol(newData.SurveyType) +
        ',`Month start`= ' + handleNullCol(newData.MonthStart) +
        ',`Month finish`= ' + handleNullCol(newData.MonthFinish) +
        ',`Year start`= ' + handleNullCol(newData.YearStart) +
        ',`Year finish`= ' + handleNullCol(newData.YearFinish) +
        ',`note2`= ' + handleNullCol(newData.Note2) + ' where SurveyID = ' + id
    } else if (type === 'Location Information') {
      id = newData.LocationID
      sql = 'update `' + type + '` set ' +
        '`Survey description_Basic sources_ReportID`= ' + newData.SurveyDescriptionBasicSourcesReportID +
        ',`Survey description_SurveyID`= ' + newData.SurveyDescriptionSurveyID +
        ',`ADM1`= ' + handleNullCol(newData.ADM1) +
        ',`ADM2`= ' + handleNullCol(newData.ADM2) +
        ',`ADM3`= ' + handleNullCol(newData.ADM3) +
        ',`Point name`= ' + handleNullCol(newData.PointName) +
        ',`Point type`= ' + handleNullCol(newData.PointType) +
        ',`Latitude`= ' + handleNullCol(newData.Latitude) +
        ',`Longitude`= ' + handleNullCol(newData.Longitude) +
        ',`Geo-reference sources`= ' + handleNullCol(newData.GeoReferenceSources) +
        ',`note3`= ' + handleNullCol(newData.Note3) + ' where LocationID = ' + id
    } else if (type === 'Disease Data') {
      id = newData.DiseaseID
      sql = 'update `' + type + '` set ' +
        '`Location information_LocationID`= ' + handleNullCol(newData.LocationInformationLocationID) +
        ',`Species`= ' + newData.Species +
        ',`Diagnostic_symptoms`= ' + handleNullCol(newData.DiagnosticSymptoms) +
        ',`Diagnostic_blood`= ' + handleNullCol(newData.DiagnosticBlood) +
        ',`Diagnostic_skin`= ' + handleNullCol(newData.DiagnosticSkin) +
        ',`Diagnostic_stool`= ' + handleNullCol(newData.DiagnosticStool) +
        ',`Num_samples`= ' + handleNullCol(newData.NumSamples) +
        ',`Num_specimen`= ' + handleNullCol(newData.NumSpecimen) +
        ',`AgeLower`= ' + handleNullCol(newData.AgeLower) +
        ',`AgeUpper`= ' + handleNullCol(newData.AgeUpper) +
        ',`Num_examine`= ' + handleNullCol(newData.NumExamine) +
        ',`Num_positive`= ' + handleNullCol(newData.NumPositive) +
        ',`Percent_positive`= ' + handleNullCol(newData.PercentPositive) +
        ',`Num_examine_male`= ' + handleNullCol(newData.NumExamineMale) +
        ',`Num_positive_male`= ' + handleNullCol(newData.NumPositiveMale) +
        ',`Percent_positive_male`= ' + handleNullCol(newData.PercentPositiveMale) +
        ',`Num_examine_female`= ' + handleNullCol(newData.NumExamineFemale) +
        ',`Num_positive_female`= ' + handleNullCol(newData.NumPositiveFemale) +
        ',`Percent_positive_female`= ' + handleNullCol(newData.PercentPositiveFemale) +
        ',`note4`= ' + handleNullCol(newData.Note4) +
        ',`Location information_LocationID1`= ' + newData.LocationInformationLocationID1 +
        ',`L_ReportID`= ' + newData.LReportID +
        ',`Location information_Survey description_SurveyID`= ' + newData.LocationInformationSurveyDescriptionSurveyID +
        ' where DiseaseID = ' + id
    } else if (type === 'Intervention Data') {
      id = newData.InterventionID
      sql = 'update `Intervention Data` set ' +
        '`Group`= ' + handleNullCol(newData.Group) +
        ',`Months after baseline`= ' + handleNullCol(newData.MonthsAfterBaseline) +
        ',`Drug`= ' + handleNullCol(newData.Drug) +
        ',`Frequency per year`= ' + handleNullCol(newData.FrequencyPerYear) +
        ',`Period (months)`= ' + handleNullCol(newData.PeriodMonths) +
        ',`Coverage`= ' + handleNullCol(newData.Coverage) +
        ',`Other method`= ' + handleNullCol(newData.OtherMethod) +
        ',`I_Num_examine`= ' + handleNullCol(newData.INumExamine) +
        ',`I_Num_positive`= ' + handleNullCol(newData.INumPositive) +
        ',`I_Percent_positive`= ' + handleNullCol(newData.IPercentPositive) +
        ',`I_Num_examine_male`= ' + handleNullCol(newData.INumExamineMale) +
        ',`I_Num_positive_male`= ' + handleNullCol(newData.INumPositiveMale) +
        ',`I_Percent_positive_male`= ' + handleNullCol(newData.IPercentPositiveMale) +
        ',`I_Num_examine_female`= ' + handleNullCol(newData.INumExamineFemale) +
        ',`I_Num_positive_female`= ' + handleNullCol(newData.INumPositiveFemale) +
        ',`I_Percent_positive_female`= ' + handleNullCol(newData.IPercentPositiveFemale) +
        ',`note5`= ' + handleNullCol(newData.Note5) +
        ',`Disease data_DiseaseID`= ' + newData.DiseaseDataDiseaseID +
        ',`Disease data_Location information_LocationID1`= ' + newData.DiseaseDataLocationInformationLocationID1 +
        ',`Disease data_L_ReportID`= ' + newData.DiseaseDataLReportID +
        ',`Disease data_Location information_Survey description_SurveyID`= ' + newData.DiseaseDataLocationInformationSurveyDescriptionSurveyID +
        ' WHERE InterventionID = ' + id
    } else {
      console.log('err >> not match')
    }
    return util.exeRawSql(sql, sqlConnect)
  }

  // -----------------getid---------------------------------
  dbOperation.getMaxID = function (type) {
    var selectStr = ''
    if (type === 'Basic Sources') {
      selectStr = 'select MAX(ReportID) as ID from `Basic Sources`'
    } else if (type === 'Survey Description') {
      selectStr = 'select MAX(SurveyID) as ID from `Survey Description`'
    } else if (type === 'Location Information') {
      selectStr = 'select MAX(LocationID) as ID from `Location Information`'
    } else if (type === 'Disease Data') {
      selectStr = 'select MAX(DiseaseID) as ID from `Disease Data`'
    } else if (type === 'Intervention Data') {
      selectStr = 'select MAX(InterventionID) as ID from `Intervention Data`'
    } else {
      console.log('type error')
      selectStr = ''
    }
    return util.exeRawSql(selectStr, sqlConnect)
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
                  'FROM `Intervention Data` WHERE `Disease data_L_ReportID` = ?'
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
      rawSql = 'SELECT * FROM `Disease Data` WHERE `DiseaseID`=' + id
    } else if (type === 'Intervention Data') {
      rawSql = 'SELECT * FROM `Intervention Data` WHERE `InterventionID`=' + id
    } else {
      console.log('type error')
    }
    return util.exeRawSql(rawSql, sqlConnect)
  }

  return dbOperation
}
