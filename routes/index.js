var express = require('express');
var router = express.Router();

var sqlConnect = require('../models/sqlConnect.js');
var userOperation = require('../models/userOperation.js')(sqlConnect);
var dbOperation = require('../models/dbOperation.js')(sqlConnect);

//  配置主页
router.get('/', function(req, res, next) {
    if (req.session.isonline) {
        res.status = 303;
        res.redirect('/home');
        return;
    }

    //  登录失败或者尝试离线直接访问时，显示相关错误信息
    if (req.session.err != null) {
        res.render('login', { err: req.session.err });
        req.session.err = null;
    } else {
        res.render('login', { err: "" });
    }
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

router.get('/home', function(req, res, next) {
    var sess = req.session;
    //  禁止离线访问并配置错误信息
    if (!sess.isonline) {
        res.status(303);
        req.session.err = 'You are offline';
        res.redirect('/');
        return;
    }
    res.render('home');
});

// router.get('/testdb', function(req, res, next) {
//     var args = ['"Du Zhiheng"', '"STH"', '"China"', '"working report"', '"journal"',
//                 '"title"', '"author"', 1996, 0, 0, 0, 0, '"No"', '"No"', '"No"', '""'];
//     dbOperation.addReport(args);
//     res.send('db item added');
// });

// learn vue
router.get('/testvue', function(req, res, next) {
    res.render('testvue');
});

router.get('/treeview', function(req, res, next) {
    res.render('treeview');
});

module.exports = router;
