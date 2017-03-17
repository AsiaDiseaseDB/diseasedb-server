var nodeExcel = require('excel-export')
var XLSX = require('xlsx')

var dbState = require('../models/dbState.js')

module.exports = function (sqlConnect) {
  var totalCols = [
    [
      'ReportID', 'Reporter', 'Disease',
      'Country', 'DocumentCategory', 'Journal',
      'Title', 'Authors', 'YearOfPub',
      'Volume', 'Issue', 'PageFrom',
      'PageTo', 'AuthorContactNeeded', 'OpenAccess',
      'Checked', 'Note1'
    ], [
      'SurveyID', 'BasicSourcesReportID', 'DataType',
      'SurveyType', 'MonthStart', 'MonthFinish',
      'YearStart', 'YearFinish', 'Note2'
    ], [
      'LocationID',
      'SurveyDescriptionBasicSourcesReportID',
      'SurveyDescriptionSurveyID',
      'ADM1', 'ADM2', 'ADM3',
      'PointName', 'PointType',
      'Latitude', 'Longitude',
      'GeoReferenceSources', 'Note3'
    ], [
      'DiseaseID', 'LocationInformationLocationID', 'Species',
      'DiagnosticSymptoms', 'DiagnosticBlood', 'DiagnosticSkin',
      'DiagnosticStool', 'NumSamples', 'NumSpecimen',
      'AgeLower', 'AgeUpper',
      'NumExamine', 'NumPositive', 'PercentPositive',
      'NumExamineMale', 'NumPositiveMale', 'PercentPositiveMale',
      'NumExamineFemale', 'NumPositiveFemale', 'PercentPositiveFemale',
      'Note4', 'LocationInformationLocationID1', 'LReportID',
      'LocationInformationSurveyDescriptionSurveyID'
    ], [
      'InterventionID', 'Group', 'MonthsAfterBaseline',
      'Drug', 'FrequencyPerYear', 'PeriodMonths',
      'Coverage', 'OtherMethod', 'INumExamine',
      'INumPositive', 'IPercentPositive', 'INumExamineMale',
      'INumPositiveMale', 'IPercentPositiveMale', 'INumExamineFemale',
      'INumPositiveFemale', 'IPercentPositiveFemale', 'Note5',
      'DiseaseDataDiseaseID',
      'DiseaseDataLocationInformationLocationID1',
      'DiseaseDataLReportID',
      'DiseaseDataLocationInformationSurveyDescriptionSurveyID'
    ]
  ]
  var cols = [
    ...totalCols[0],  //  basicCols
    ...totalCols[1],  //  surveyCols
    ...totalCols[2],  //  locationCols
    ...totalCols[3],  //  diseaseCols
    ...totalCols[4]   //  interventionCols
  ]
  var numberCols = {
    'ReportID': true,
    'YearOfPub': true,
    'Volume': true,
    'Issue': true,
    'PageFrom': true,
    'PageTo': true,
    'SurveyID': true,
    'BasicSourcesReportID': true,
    'LocationID': true,
    'SurveyDescriptionBasicSourcesReportID': true,
    'SurveyDescriptionSurveyID': true,
    'Latitude': true,
    'Longitude': true,
    'LocationInformationSurveyDescriptionSurveyID': true,
    'LocationInformationLocationID1': true,
    'LReportID': true,
    'DiseaseID': true,
    'NumPositiveMale': true,
    'NumPositiveFemale': true,
    'NumPositive': true,
    'NumExamineMale': true,
    'NumExamineFemale': true,
    'NumExamine': true,
    'AgeUpper': true,
    'AgeLower': true,
    'PercentPositiveMale': true,
    'PercentPositiveFemale': true,
    'PercentPositive': true,
    'InterventionID': true,
    'DiseaseDataDiseaseID': true,
    'DiseaseDataLocationInformationLocationID1': true,
    'DiseaseDataLReportID': true,
    'DiseaseDataLocationInformationSurveyDescriptionSurveyID': true,
    'MonthsAfterBaseline': true,
    'FrequencyPerYear': true,
    'PeriodMonths': true,
    'INumExamine': true,
    'INumPositive': true,
    'INumExamineMale': true,
    'INumPositiveMale': true,
    'INumExamineFemale': true,
    'INumPositiveFemale': true,
    'Coverage': true,
    'IPercentPositive': true,
    'IPercentPositiveMale': true,
    'IPercentPositiveFemale': true
  }

  // var idMap = { b: {}, s: {}, l: {}, d: {}, i: {} }
  // var filePathBuff = {}

  var dbOperation = require('../models/dbOperation.js')(sqlConnect)

  // var batchImport = function () {
  //   var data = []
  //   for (let i in filePathBuff) {
  //     let workbook = XLSX.readFile(filePathBuff[i])
  //     let worksheet = workbook.Sheets[workbook.SheetNames[0]]
  //     data.push(XLSX.utils.sheet_to_json(worksheet))
  //   }
  // }

  return {
    exportExcel (req, res) {
      var promises = []
      for (let i in req.query) {
        let id = parseInt(req.query[i])
        promises.push(dbOperation.leftJoinTables(id))
      }
      Promise.all(promises)
        .then((resArr) => {
          var conf = {}
          conf.cols = []
          conf.rows = []
          for (let i in cols) {
            if (numberCols[cols[i]]) {
              conf.cols.push({ caption: cols[i], type: 'number' })
            } else {
              conf.cols.push({ caption: cols[i], type: 'string' })
            }
          }
          for (let i in resArr) {
            for (let j in resArr[i]) {
              let rows = []
              for (let k in resArr[i][j]) {
                rows.push(resArr[i][j][k])
              }
              // console.log(rows[rows.length - 1])
              // console.log(rows.length, conf.cols.length)
              conf.rows.push(rows)
            }
          }
          var result = nodeExcel.execute(conf)
          res.setHeader('Content-Type', 'application/vnd.openxmlformats')
          res.setHeader('Content-Disposition', 'attachment; filename=' + 'Report.xlsx')
          res.end(result, 'binary')
        })
        .catch((err) => {
          console.log(err)
          res.json({ err: err })
        })
    },
    importExcel (req, res) {
      // TODO 完善文件批量导入version1
      dbState.getNewId()
      res.json({ success: true, err: null })
      // if (parseInt(req.body.id) < 4) {
      //   filePathBuff[req.body.id] = req.file.path
      // } else if (parseInt(req.body.id) === 4) {
      //   for (let i in filePathBuff) {
      //     console.log(filePathBuff[i])
      //   }
      //   res.json({ success: true, err: null })
      // } else {
      //   res.json({ success: false, err: 'no type matched' })
      // }
    }
  }
}
