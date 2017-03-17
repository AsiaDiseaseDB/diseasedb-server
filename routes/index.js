var express = require('express')
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })
var router = express.Router()

var sqlConnect = require('../models/sqlConnect.js')
var userOperation = require('../models/userOperation.js')(sqlConnect)
var dbOperation = require('../models/dbOperation.js')(sqlConnect)
var formGenerator = require('../models/formGenerator.js')
// var util = require('../models/util.js')
var excelOperation = require('../controller/excelOperation.js')(sqlConnect)
var getValueString = require('../controller/getValueString')

//  配置主页
router.get('/', function (req, res, next) {
  res.render('home')
})

router.get('/exportexcel', excelOperation.exportExcel)

router.post('/importexcel', upload.single('report'), excelOperation.importExcel)

//  ---------loginReq--------
router.post('/loginReq', function (req, res, next) {
  var user = req.body.username
  var pass = req.body.password
  var returnValue = {
    success: false,
    err: null,
    authority: {
      write: false,
      query: false,
      modity: false,
      extract: false
    }
  }
  userOperation.queryUser(user)
    .then(function (rows) {
      if (rows.length > 0) {
        if (rows[0].password === pass) {
          returnValue.success = true
          var q = rows[0].authority
          switch (q) {
            case 4:
              returnValue.authority.extract = true
              returnValue.authority.modity = true
              returnValue.authority.query = true
              returnValue.authority.write = true
              break
            case 3:
              returnValue.authority.modity = true
              returnValue.authority.query = true
              returnValue.authority.write = true
              break
            case 2:
              returnValue.authority.query = true
              returnValue.authority.write = true
              break
            case 1:
              returnValue.authority.write = true
              break
          }
        } else {
          returnValue.err = '用户登录密码错误！！！'
          returnValue.authority = null
        }
      } else {
        returnValue.err = '用户名错误或用户不存在！！！'
        returnValue.authority = null
      }
      res.json(returnValue)
    })
    .catch(function (err) {
      res.json({
        success: false,
        err: err,
        authority: null
      })
    })
})

// ----------query----------
router.post('/query', function (req, res, next) {
  var id = req.body.id
  var returnValue = []
  if (id === null || id === '') {
    var disease = req.body.condition.disease
    var country = req.body.condition.country
    var year = req.body.condition.year
    var doubleClick = req.body.condition.doubleClick
    dbOperation.queryByDescription(disease, country, year, doubleClick)
      .then((rows) => {
        for (var i = 0; i < rows.length; i++) {
          returnValue.push(formGenerator.getBasicSources(rows[i]))
        }
        // console.log(returnValue)
        if (rows.length > 0) {
          res.json({ result: returnValue, err: null })
        } else {
          res.json({ result: null, err: 'Not Found' })
        }
      })
      .catch((err) => {
        res.json({ result: null, err: err })
      })
  }
  if (id != null) {
    dbOperation.queryByReportId(id)
      .then((rows) => {
        if (rows.length > 0) {
          for (var i = 0; i < rows.length; i++) {
            returnValue.push(formGenerator.getBasicSources(rows[i]))
          }
          res.json({ result: returnValue, err: null })
        } else {
          res.json({ result: null, err: 'Not Found' })
        }
      })
      .catch((err) => {
        res.json({ result: null, err: err })
      })
  }
})
// ----------------------queryTree--------------------------------
router.post('/querynext', function (req, res, next) {
  var types = req.body.type
  var ID = req.body.id
  dbOperation.queryTree(types, ID)
    .then(function (rows) {
      var result = []
      if (rows.length > 0) {
        if (types === 'Survey Description') {
          for (let i = 0; i < rows.length; i++) {
            result.push(formGenerator.getSurvey(rows[i]))
          }
          res.json(result)
        } else if (types === 'Location Information') {
          for (let i = 0; i < rows.length; i++) {
            result.push(formGenerator.getLocation(rows[i]))
          }
          res.json(result)
        } else if (types === 'Disease Data') {
          for (let i = 0; i < rows.length; i++) {
            result.push(formGenerator.getDisease(rows[i]))
          }
          res.json(result)
        } else {
          for (let i = 0; i < rows.length; i++) {
            result.push(formGenerator.getIntervention(rows[i]))
          }
          res.json(result)
        }
      } else {
        res.json({ result: result })
      }
    })
    .catch((err) => {
      console.log(err)
      res.json({ result: null })
    })
})

router.post('/getidcontent', function (req, res, next) {
  var type = req.body.type
  var id = req.body.id
  dbOperation.getIdContent(id, type)
    .then((rows) => {
      if (rows.length === 0) {
        res.json({ data: null, err: null })
        return
      }
      switch (type) {
        case 'Basic Sources':
          res.json({
            data: formGenerator.getBasicSources(rows[0]),
            err: null
          })
          break
        case 'Survey Description':
          res.json({
            data: formGenerator.getSurvey(rows[0]),
            err: null
          })
          break
        case 'Location Information':
          res.json({
            data: formGenerator.getLocation(rows[0]),
            err: null
          })
          break
        case 'Disease Data':
          res.json({
            data: formGenerator.getDisease(rows[0]),
            err: null
          })
          break
        case 'Intervention Data':
          res.json({
            data: formGenerator.getIntervention(rows[0]),
            err: null
          })
          break
        default:
          res.json({
            data: null,
            err: 'type error'
          })
      }
    })
    .catch((err) => {
      res.json({
        data: null,
        err: err
      })
    })
})

// -------增添操作----add---------------
router.post('/add', function (req, res, next) {
  // var types = req.body.type
  // console.log(types)
  var valuesStr = getValueString(req.body.type, req.body.data)
  dbOperation.add(valuesStr, req.body.type)
    .then(function (rows) {
      if (rows) {
        res.json({ success: true, err: null })
      } else {
        res.json({ success: false, err: '插入失败' })
      }
    })
    .catch(function (err) {
      res.json({ success: false, err: err })
    })
})

// ----------------删除操作--------------------------
router.post('/delete', function (req, res, next) {
  var type = req.body.type
  var id = req.body.id
  dbOperation.delete(type, id)
    .then(function (rows) {
      var returnValue = null
      if (rows) {
        returnValue = { success: true, err: null }
      } else {
        returnValue = { success: false, err: '删除失败！！！' }
      }
      res.json(returnValue)
    })
    .catch((err) => {
      var returnValue = { success: false, err: err }
      res.json(returnValue)
    })
})

// ----------------编辑操作--------------------------
router.post('/edit', function (req, res, next) {
  var type = req.body.type
  console.log(type)
  console.log(req.body.data)
  dbOperation.edit(type, req.body.data)
    .then((rows) => {
      res.json({ success: true, err: null })
    })
    .catch((err) => {
      res.json({ success: false, err: err })
    })
})

router.post('/getid', function (req, res, next) {
  var type = req.body.type
  dbOperation.getMaxID(type)
    .then(function (rows) {
      var num = 1
      if (rows) {
        num = rows[0].ID + 1
      }
      var returnValue = { id: num }
      console.log(returnValue)
      res.json(returnValue)
    })
    .catch((err) => {
      console.log(err)
      res.json({
        id: -1,
        err: err
      })
    })
})

router.post('/getidtree', function (req, res, next) {
  dbOperation.getIDTree(req.body.id)
    .then(([rowS, rowL, rowD, rowI]) => {
      //  build an id tree
      var rootID = req.body.id
      var idTree = {}
      idTree[rootID] = {}
      for (let i in rowS) {
        idTree[rootID][rowS[i].SurveyID] = {}
      }
      for (let i in rowL) {
        let sid = rowL[i]['Survey description_SurveyID']
        let lid = rowL[i]['LocationID']
        idTree[rootID][sid][lid] = {}
      }
      for (let i in rowD) {
        let sid = rowD[i]['Location information_Survey description_SurveyID']
        let lid = rowD[i]['Location information_LocationID1']
        let did = rowD[i]['DiseaseID']
        idTree[rootID][sid][lid][did] = {}
      }
      for (let i in rowI) {
        let sid = rowI[i]['Disease data_Location information_Survey description_SurveyID']
        let lid = rowI[i]['Disease data_Location information_LocationID1']
        let did = rowI[i]['Disease data_DiseaseID']
        let iid = rowI[i]['InterventionID']
        idTree[rootID][sid][lid][did][iid] = {}
      }
      res.json({
        data: idTree,
        err: null
      })
    })
    .catch((reasons) => {
      console.log(reasons)
      res.json({
        data: null,
        err: reasons
      })
    })
})

module.exports = router
