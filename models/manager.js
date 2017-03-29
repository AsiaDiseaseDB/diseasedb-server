var util = require('./util.js')

module.exports = function (sqlConnect) {
  return {
    searchUser (name) {
      var rawSql = 'SELECT `name`, `authority` FROM `users` WHERE `name` = ?'
      return util.exeSqlWithArgs(rawSql, [name], sqlConnect)
    },
    searchAllUser () {
      var rawSql = 'SELECT `name`, `authority` FROM `users`'
      return util.exeRawSql(rawSql, sqlConnect)
    },
    //  认证root身份
    identify (managerInfo) {
      var { name, password } = managerInfo
      var rawSql = 'SELECT `id` FROM `users` WHERE `name` = ? AND `password` = ?'
      return util.exeSqlWithArgs(rawSql, [name, password], sqlConnect)
    },
    addUser (username, password, authority) {
      var post = {
        name: username,
        password: password,
        authority: authority
      }
      var rawSql = 'INSERT INTO `users` SET ?'
      return util.exeSqlWithArgs(rawSql, post, sqlConnect)
    },
    deleteUser (username) {
      var rawSql = 'DELETE FROM `users` WHERE name = ?'
      return util.exeSqlWithArgs(rawSql, [username], sqlConnect)
    },
    modifyPassword (username, newPassword) {
      var rawSql = 'UPDATE `users` SET `password` = ? WHERE `name` = ?'
      return util.exeSqlWithArgs(rawSql, [newPassword, username], sqlConnect)
    },
    modifyAuthority (username, newAuthority) {
      var rawSql = 'UPDATE `users` SET `authority` = ? WHERE `name` = ?'
      return util.exeSqlWithArgs(rawSql, [newAuthority, username], sqlConnect)
    }
  }
}
