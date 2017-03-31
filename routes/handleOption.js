var express = require('express')
var router = express.Router()

let reporterManager = require('../models/reporterManager.js')

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

module.exports = router
