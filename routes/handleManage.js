var express = require('express')
var router = express.Router()

var sqlConnect = require('../models/sqlConnect.js')
var manager = require('../models/manager.js')(sqlConnect)

router.post('/searchUser', function (req, res, next) {
  let { username } = req.body
  manager.searchUser(username)
    .then((result) => {
      res.json({ success: true, result, err: null })
    })
    .catch((err) => { res.json({ success: false, result: null, err: err }) })
})

router.post('/searchAllUser', function (req, res, next) {
  manager.searchAllUser()
    .then((result) => {
      res.json({ success: true, result, err: null })
    })
    .catch((err) => { res.json({ success: false, result: null, err: err }) })
})

router.post('/addUser', function (req, res, next) {
  let { username, password, authority, managerInfo } = req.body
  manager.identify(managerInfo)
    .then((result1) => {
      if (result1.length > 0) {
        return manager.addUser(username, password, authority)
      } else {
        return Promise.reject('No Such Manager')
      }
    })
    .then((result2) => { res.json({ success: true, err: null }) })
    .catch((err) => { res.json({ success: false, err: err }) })
})

router.post('/deleteUser', function (req, res, next) {
  let { username, managerInfo } = req.body
  manager.identify(managerInfo)
    .then((result1) => {
      if (result1.length > 0) {
        return manager.deleteUser(username)
      } else {
        return Promise.reject('No Such Manager')
      }
    })
    .then((result2) => { res.json({ success: true, err: null }) })
    .catch((err) => { res.json({ success: false, err: err }) })
})

router.post('/modifyPassword', function (req, res, next) {
  let { username, newPassword, managerInfo } = req.body
  manager.identify(managerInfo)
    .then((result1) => {
      if (result1.length > 0) {
        return manager.modifyPassword(username, newPassword)
      } else {
        return Promise.reject('No Such Manager')
      }
    })
    .then((result2) => { res.json({ success: true, err: null }) })
    .catch((err) => { res.json({ success: false, err: err }) })
})

router.post('/modifyAuthority', function (req, res, next) {
  let { username, newAuthority, managerInfo } = req.body
  manager.identify(managerInfo)
    .then((result1) => {
      if (result1.length > 0) {
        return manager.modifyAuthority(username, newAuthority)
      } else {
        return Promise.reject('No Such Manager')
      }
    })
    .then((result2) => { res.json({ success: true, err: null }) })
    .catch((err) => { res.json({ success: false, err: err }) })
})

module.exports = router
