var express = require('express');
var router = express.Router();

var sqlConnect = require('../models/sqlConnect.js');
var userOperation = require('../models/userOperation.js')(sqlConnect);
var dbOperation = require('../models/dbOperation.js')(sqlConnect);

//  配置主页
router.get('/', function(req, res, next) {
    res.render('home');
});

router.post('/process', function(req, res, next) {
    var user = req.body.username;
    var pass = req.body.password;
    res.status(303);

    //  若已登录，直接跳转
    if (req.session.isonline == true) {
        res.redirect('/home');
        return;
    }
    userOperation.queryUser(user)
        .then(function(rows) {
            for (var i = 0; i < rows.length; ++i) {
                if (rows[i].password === pass) {
                    //  success
                    req.session.err = null;
                    req.session.isonline = true;
                    req.session.username = user;
                    req.session.password = pass;
                    res.redirect('/home');
                    return;
                }
            }
            //  登录失败时设置错误信息
            req.session.err = 'username does not exist or wrong password, go back and try again~';
            res.redirect('/');
            // fail
        })
        .catch(function(err) {
            console.log(err);
            res.redirect('/');
        });
});

// CORS demo
// router.post('/testaxios', function(req, res, next) {
//     console.log(req.body);
//     res.json({
//         returnValue: true
//     })
// });

//  -----------------
router.post('/loginReq', function(req, res, next) {
    var user = req.body.username;
    var pass = req.body.password;

    userOperation.queryUser(user)
        .then(function(rows) {
            var returnValue = { success: false };
            for (var i = 0; i < rows.length; ++i) {
                if (rows[i].password === pass) {
                    returnValue.success = true;
                    break;
                }
            }
            res.json(returnValue);
        })
        .catch(function(err) {
            console.log(err);
        });
});

module.exports = router;
