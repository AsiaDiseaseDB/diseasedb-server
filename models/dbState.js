var fs = require('fs')
const path = require('path')

const basePath = path.join(__dirname, '../', 'store')

module.exports = {
  // 由于文件很小，采用同步读写
  getNewId (type) {
    var data = fs.readFileSync(path.join(basePath, 'state.json'))
    var jsonObj = JSON.parse(data)
    var returnId = -1
    switch (type) {
      case 'Basic Sources':
        returnId = jsonObj.bid
        jsonObj.bid += 1
        break
      case 'Survey Description':
        returnId = jsonObj.sid
        jsonObj.sid += 1
        break
      case 'Location Information':
        returnId = jsonObj.lid
        jsonObj.lid += 1
        break
      case 'Disease Data':
        returnId = jsonObj.did
        jsonObj.did += 1
        break
      case 'Intervention Data':
        returnId = jsonObj.iid
        jsonObj.iid += 1
        break
    }
    fs.writeFileSync(path.join(basePath, 'state.json'), JSON.stringify(jsonObj))
    return parseInt(returnId)
  }
}
