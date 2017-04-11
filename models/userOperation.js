var util = require('./util.js')

module.exports = function (sqlConnect) {
  var userOperation = {}

    //  TODO: 用户不能同名
    //  增
  userOperation.addUser = function (name, password, authority) {
        //  TODO:需要做name和password的无害化处理
    var insertSQL = 'INSERT INTO users(name, password, authority) values(\'' +
                    name + '\', \'' + password + '\', ' + authority + ')'
    return util.exeRawSql(insertSQL, sqlConnect)
  }

    //  查
  userOperation.queryAll = function () {
    return new Promise(function (resolve, reject) {
      sqlConnect.query('SELECT * FROM users', function (err, rows, fields) {
        if (err) reject(err)
        resolve(rows)
      })
    })
  }

  userOperation.queryUser = function (username) {
    return new Promise(function (resolve, reject) {
      var sqlExp = 'SELECT * FROM users WHERE name = ' +
                   sqlConnect.escape(username)
      sqlConnect.query(sqlExp, function (err, rows, fields) {
        if (err) reject(err)
        resolve(rows)
      })
    })
  }

  return userOperation
}
