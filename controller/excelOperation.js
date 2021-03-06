var nodeExcel = require('excel-export')
var XLSX = require('xlsx')
var fs = require('fs')

var dbState = require('../models/dbState.js')

var getValueString = require('../lib/getValueString')

function addQuote (form, ex) {
  var newObj = {}
  for (let i in form) {
    if (ex !== undefined && !ex.includes(i)) {
      newObj[i] = '\'' + form[i] + '\''
    } else {
      newObj[i] = form[i]
    }
  }
  return newObj
}

function empty2Null (form) {
  var newObj = {}
  for (let i in form) {
    if (form[i] === '' || form[i] === null || form[i] === '\'\'' || form[i] === undefined) {
      newObj[i] = 'null'
    } else {
      newObj[i] = form[i]
    }
  }
  return newObj
}

//  依照type对data中的属性值前后加上单引号
function getHandledData (type, data) {
  var ex = {
    basicSources: ['ReportID', 'YearOfPub', 'Volume', 'Issue', 'PageFrom', 'PageTo'],
    survey: ['SurveyID', 'BasicSourcesReportID'],
    location: [
      'LocationID', 'SurveyDescriptionBasicSourcesReportID',
      'SurveyDescriptionSurveyID', 'Latitude', 'Longitude'
    ],
    disease: [
      'DiseaseID', 'AgeLower', 'AgeUpper',
      'NumExamine', 'NumPositive', 'PercentPositive',
      'NumExamineMale', 'NumPositiveMale', 'PercentPositiveMale',
      'NumExamineFemale', 'NumPositiveFemale', 'PercentPositiveFemale',
      'LocationInformationLocationID1', 'LReportID',
      'LocationInformationSurveyDescriptionSurveyID'
    ],
    intervention: [
      'InterventionID', 'MonthsAfterBaseline', 'FrequencyAfterYear',
      'PeriodMonths', 'Coverage', 'INumExamine',
      'INumPositive', 'IPercentPositive', 'INumExamineMale',
      'INumPositiveMale', 'IPercentPositiveMale', 'INumExamineFemale',
      'INumPositiveFemale', 'IPercentPositiveFemale', 'DiseaseDataDiseaseID',
      'DiseaseDataLocationInformationLocationID1', 'DiseaseDataLReportID',
      'DiseaseDataLocationInformationSurveyDescriptionSurveyID'
    ]
  }
  switch (type) {
    case 'Basic Sources':
      return empty2Null(addQuote(data, ex.basicSources))
    case 'Survey Description':
      return empty2Null(addQuote(data, ex.survey))
    case 'Location Information':
      return empty2Null(addQuote(data, ex.location))
    case 'Disease Data':
      return empty2Null(addQuote(data, ex.disease))
    case 'Intervention Data':
      return empty2Null(addQuote(data, ex.intervention))
    default:
      console.log('type error')
  }
}

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

  let idMap = {}
  let filePathBuff = {}
  let idBuff = {}

  let dbOperation = require('../models/dbOperation.js')(sqlConnect)

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
      //  add multi-user support
      let curUser = req.body.username
      idBuff[curUser] = req.body.id

      if (parseInt(idBuff[curUser]) === 0) {
        idMap[curUser] = { b: {}, s: {}, l: {}, d: {}, i: {} }
        filePathBuff[curUser] = []
      }
      filePathBuff[curUser].push(req.file.path)
      if (parseInt(idBuff[curUser]) < 4) {
        res.json({ success: true, err: null })
      } else if (parseInt(idBuff[curUser]) === 4) {
        //  五个文件都上传完成
        let addPromises = []
        for (let i in filePathBuff[curUser]) {
          let workbook = XLSX.readFile(filePathBuff[curUser][i])
          let worksheet = workbook.Sheets[workbook.SheetNames[0]]
          let jsonArr = XLSX.utils.sheet_to_json(worksheet)
          if (parseInt(i) === 0) {
            for (let j in jsonArr) {
              let ReportID = dbState.getNewId('Basic Sources')
              let bid = parseInt(jsonArr[j].bid)
              idMap[curUser].b[bid] = ReportID
              jsonArr[j].ReportID = ReportID
              let valuesStr = getValueString('Basic Sources', getHandledData('Basic Sources', jsonArr[j]))
              addPromises.push(dbOperation.add(valuesStr, 'Basic Sources'))
            }
          } else if (parseInt(i) === 1) {
            for (let j in jsonArr) {
              let SurveyID = dbState.getNewId('Survey Description')
              let sid = parseInt(jsonArr[j].sid)
              let bid = parseInt(jsonArr[j].bid)
              idMap[curUser].s[sid] = SurveyID
              jsonArr[j].SurveyID = SurveyID
              if (idMap[curUser].b[bid] !== undefined) {
                jsonArr[j].BasicSourcesReportID = idMap[curUser].b[bid]
              }
              let valuesStr = getValueString('Survey Description',
                                             getHandledData('Survey Description', jsonArr[j]))
              addPromises.push(dbOperation.add(valuesStr, 'Survey Description'))
            }
          } else if (parseInt(i) === 2) {
            for (let j in jsonArr) {
              let LocationID = dbState.getNewId('Location Information')
              let bid = parseInt(jsonArr[j].bid)
              let sid = parseInt(jsonArr[j].sid)
              let lid = parseInt(jsonArr[j].lid)
              idMap[curUser].l[lid] = LocationID
              jsonArr[j].LocationID = LocationID
              if (idMap[curUser].b[bid] !== undefined && idMap[curUser].s[sid] !== undefined) {
                jsonArr[j].SurveyDescriptionBasicSourcesReportID = idMap[curUser].b[bid]
                jsonArr[j].SurveyDescriptionSurveyID = idMap[curUser].s[sid]
              }
              let valuesStr = getValueString('Location Information',
                                             getHandledData('Location Information', jsonArr[j]))
              addPromises.push(dbOperation.add(valuesStr, 'Location Information'))
            }
          } else if (parseInt(i) === 3) {
            for (let j in jsonArr) {
              let DiseaseID = dbState.getNewId('Disease Data')
              let bid = parseInt(jsonArr[j].bid)
              let sid = parseInt(jsonArr[j].sid)
              let lid = parseInt(jsonArr[j].lid)
              let did = parseInt(jsonArr[j].did)
              idMap[curUser].d[did] = DiseaseID
              jsonArr[j].DiseaseID = DiseaseID
              if (idMap[curUser].b[bid] !== undefined && idMap[curUser].s[sid] !== undefined &&
                  idMap[curUser].l[lid] !== undefined) {
                jsonArr[j].LReportID = idMap[curUser].b[bid]
                jsonArr[j].LocationInformationSurveyDescriptionSurveyID = idMap[curUser].s[sid]
                jsonArr[j].LocationInformationLocationID1 = idMap[curUser].l[lid]
              }
              let valuesStr = getValueString('Disease Data',
                                             getHandledData('Disease Data', jsonArr[j]))
              addPromises.push(dbOperation.add(valuesStr, 'Disease Data'))
            }
          } else if (parseInt(i) === 4) {
            for (let j in jsonArr) {
              let InterventionID = dbState.getNewId('Intervention Data')
              let bid = parseInt(jsonArr[j].bid)
              let sid = parseInt(jsonArr[j].sid)
              let lid = parseInt(jsonArr[j].lid)
              let did = parseInt(jsonArr[j].did)
              let iid = parseInt(jsonArr[j].iid)
              idMap[curUser].i[iid] = InterventionID
              jsonArr[j].InterventionID = InterventionID
              if (idMap[curUser].b[bid] !== undefined && idMap[curUser].s[sid] !== undefined &&
                  idMap[curUser].l[lid] !== undefined && idMap[curUser].d[did] !== undefined) {
                jsonArr[j].DiseaseDataLReportID = idMap[curUser].b[bid]
                jsonArr[j].DiseaseDataLocationInformationSurveyDescriptionSurveyID = idMap[curUser].s[sid]
                jsonArr[j].DiseaseDataLocationInformationLocationID1 = idMap[curUser].l[lid]
                jsonArr[j].DiseaseDataDiseaseID = idMap[curUser].d[did]
              }
              let valuesStr = getValueString('Intervention Data',
                                             getHandledData('Intervention Data', jsonArr[j]))
              addPromises.push(dbOperation.add(valuesStr, 'Intervention Data'))
            }
          }
        }
        Promise.all(addPromises)
          .then((rows) => {
            for (let j in filePathBuff[curUser]) {
              fs.unlinkSync(filePathBuff[curUser][j])
            }
            res.json({ success: true, err: null })
          })
          .catch((err) => {
            console.log('batch input catch error')
            console.log(err)
            res.json({ success: false, err: err })
          })
      } else {
        res.json({ success: false, err: 'no type matched' })
      }
    },
    importTable (req, res) {
      let workbook = XLSX.readFile(req.file.path)
      let worksheet = workbook.Sheets[workbook.SheetNames[0]]
      let jsonArr = XLSX.utils.sheet_to_json(worksheet)
      let addPromises = []
      let valuesStr = ''
      let [bid, sid, lid, did] = [-1, -1, -1, -1]
      for (let i in jsonArr) {
        let id = dbState.getNewId(req.body.type)
        // console.log(req.body.bid)
        switch (req.body.type) {
          case 'Basic Sources':
            bid = parseInt(req.body.bid)
            jsonArr[i].SurveyID = id
            jsonArr[i].BasicSourcesReportID = bid
            valuesStr = getValueString('Survey Description',
                                           getHandledData('Survey Description', jsonArr[i]))
            addPromises.push(dbOperation.add(valuesStr, 'Survey Description'))
            break
          case 'Survey Description':
            bid = parseInt(req.body.bid)
            sid = parseInt(req.body.sid)
            jsonArr[i].LocationID = id
            jsonArr[i].SurveyDescriptionBasicSourcesReportID = bid
            jsonArr[i].SurveyDescriptionSurveyID = sid
            valuesStr = getValueString('Location Information',
                                           getHandledData('Location Information', jsonArr[i]))
            addPromises.push(dbOperation.add(valuesStr, 'Location Information'))
            break
          case 'Location Information':
            bid = parseInt(req.body.bid)
            sid = parseInt(req.body.sid)
            lid = parseInt(req.body.lid)
            jsonArr[i].DiseaseID = id
            jsonArr[i].LReportID = bid
            jsonArr[i].LocationInformationSurveyDescriptionSurveyID = sid
            jsonArr[i].LocationInformationLocationID1 = lid
            valuesStr = getValueString('Disease Data',
                                           getHandledData('Disease Data', jsonArr[i]))
            addPromises.push(dbOperation.add(valuesStr, 'Disease Data'))
            break
          case 'Disease Data':
            bid = parseInt(req.body.bid)
            sid = parseInt(req.body.sid)
            lid = parseInt(req.body.lid)
            did = parseInt(req.body.did)
            jsonArr[i].InterventionID = id
            jsonArr[i].DiseaseDataLReportID = bid
            jsonArr[i].DiseaseDataLocationInformationSurveyDescriptionSurveyID = sid
            jsonArr[i].DiseaseDataLocationInformationLocationID1 = lid
            jsonArr[i].DiseaseDataDiseaseID = did
            valuesStr = getValueString('Intervention Data',
                                           getHandledData('Intervention Data', jsonArr[i]))
            addPromises.push(dbOperation.add(valuesStr, 'Intervention Data'))
            break
        }
      }
      Promise.all(addPromises)
        .then((rows) => {
          res.json({ success: true, err: null })
        })
        .catch((err) => {
          console.log('batch input catch error')
          console.log(err)
          res.json({ success: false, err: err })
        })
    }
  }
}
