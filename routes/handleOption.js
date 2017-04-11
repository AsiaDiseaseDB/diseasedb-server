var express = require('express')
var router = express.Router()

let optionManager = require('../models/optionManager.js')
let reporterManager = require('../models/reporterManager.js')

//  these 3 apis will be deprecated
router.post('/getReporter', (req, res, next) => {
  res.json({
    err: null,
    data: reporterManager.getReporterOptions()
  })
})

router.post('/addReporter', (req, res, next) => {
  let newReporter = req.body.newReporter
  reporterManager.addReporterOptions(newReporter)
  res.json({
    err: null,
    success: true
  })
})

router.post('/deleteReporter', (req, res, next) => {
  let reporter = req.body.reporter
  reporterManager.deleteReporterOptions(reporter)
  res.json({
    err: null,
    success: true
  })
})
//  ----------

router.post('/getWholeOptions', (req, res, next) => {
  let data = null
  let err = null
  try {
    data = optionManager.getWholeOptions()
  } catch (e) {
    err = e
  } finally {
    res.json({
      err: err,
      data: data
    })
  }
})

//  req: { catagory, optName }
router.post('/getOptions', (req, res, next) => {
  let { catagory, optName } = req.body
  let data = null
  let err = null
  try {
    data = optionManager.getOptions(catagory, optName)
  } catch (e) {
    err = e
  } finally {
    res.json({
      err: err,
      data: data
    })
  }
})

//  req: { catagory, optName, payload }
router.post('/addOptions', (req, res, next) => {
  let { catagory, optName, payload } = req.body
  let err = null
  try {
    optionManager.addOptions(catagory, optName, payload)
  } catch (e) {
    err = e
  } finally {
    res.json({
      err: err,
      success: true
    })
  }
})

//  req: { catagory, optName, payload }
router.post('/deleteOptions', (req, res, next) => {
  let { catagory, optName, payload } = req.body
  let err = null
  try {
    optionManager.deleteOptions(catagory, optName, payload)
  } catch (e) {
    err = e
  } finally {
    res.json({
      err: err,
      success: true
    })
  }
})

module.exports = router
