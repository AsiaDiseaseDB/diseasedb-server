module.exports = {
  //  return a Promise
  exeRawSql (rawSql, sqlConnect) {
    return new Promise((resolve, reject) => {
      sqlConnect.query(rawSql, (err, rows, fields) => {
        if (err) {
          console.log(err)
          reject(err)
        }
        resolve(rows)
      })
    })
  },
  exeSqlWithArgs (rawSql, args, sqlConnect) {
    return new Promise((resolve, reject) => {
      var query = sqlConnect.query(rawSql, args, (err, rows, fields) => {
        if (err) reject(err)
        resolve(rows)
      })
      console.log(query.sql) 
    })
  },
  isEmpty (ele) {
    return ele === '' || ele === null || ele === undefined
  }
}
