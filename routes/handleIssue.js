var express = require('express')
var nodemailer = require('nodemailer')
var router = express.Router()

router.post('/bug', (req, res, next) => {
  let bugDescription = req.body.description
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: '163',
    auth: {
      user: 'addproject@163.com',
      pass: 'addproject163163'
    }
  })

  let mailOptions = {
    from: '"ADD Project" <addproject@163.com>', // sender address
    to: ['laiyingsi@163.com', '498973030@qq.com'], // list of receivers
    subject: 'Bug Report', // Subject line
    text: bugDescription // plain text body
  }

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.json({ success: false, err: error })
    } else {
      res.json({ success: true, err: null })
    }
  })
})

router.post('/newuser', (req, res, next) => {
  let username = req.body.username
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: '163',
    auth: {
      user: 'addproject@163.com',
      pass: 'addproject163163'
    }
  })

  let mailOptions = {
    from: '"ADD Project" <addproject@163.com>', // sender address
    to: ['laiyingsi@163.com', '498973030@qq.com'], // list of receivers
    subject: 'New User Registered', // Subject line
    text: username + ' has joined the online database system!' // plain text body
  }

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.json({ success: false, err: error })
    } else {
      res.json({ success: true, err: null })
    }
  })
})

module.exports = router
