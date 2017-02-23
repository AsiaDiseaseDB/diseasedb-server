module.exports = function(sqlConnect) {
    var dbOperation = new Object();

    dbOperation.queryByReportId = function(reportid) {
        return new Promise(function(resolve, reject) {
            sqlConnect.query('SELECT * FROM `Basic sources` WHERE ReportID = '
                             + sqlConnect.escape(reportid), function(err, rows, fields) {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }

    dbOperation.queryByDescription = function(disease, country, year, checked) {
        return new Promise(function(resolve, reject) {
            var rowSQL = 'SELECT * FROM `Basic sources` WHERE';
            //  TODO: 无害化处理，放置SQL注入攻击
            if (disease !== "") {
                rowSQL += ' `Disease` = ' + disease;
            }
            if (country !== "") {
                rowSQL += ' `Country` = ' + country;
            }
            if (year !== "") {
                rowSQL += ' `Year of Pub` = ' + year;
            }
            if (checked !== "") {
                rowSQL += ' `checked` = ' + checked;
            }
            sqlConnect.query(rowSQL, function(err, rows, fields) {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }

    //  插入参数作为数组传入
    //  args.length should be 16
    dbOperation.addReport = function(args) {
        //  TODO:需要做无害化处理
        console.log(args.length);
        var columnsStr = '`Reporter`, `Disease`, `Country`, `Document Category`, `Journal`, ' +
                      '`Title`, `Authors`, `Year of Pub`, `Volume`, `Issue`, `Page from`, ' +
                      '`Page to`, `Author contact needed`, `Open access`, `checked`, `note1`';
        var valuesStr = '';
        for (var i = 0; i < args.length; ++i) {
            valuesStr += args[i];
            if (i < args.length - 1)
                valuesStr += ', '
        }
        var insertSQL = 'insert into `Basic sources`(' + columnsStr + ') values('
            + valuesStr + ')';
        sqlConnect.query(insertSQL, function (err, res) {
            if (err) console.log(err);
        });
    }

    return dbOperation;
}
