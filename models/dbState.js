var fs = require('fs')
const path = require('path')

const basePath = path.join(__dirname, '../', 'store')

module.exports = {
  // 由于文件很小，采用同步读写
  // TODO: 完善ID获取
  getNewId (type) {
    console.log(__dirname)
    var data = fs.readFileSync(path.join(basePath, 'state.json'))
    var jsonObj = JSON.parse(data)
    jsonObj.bid += 1
    fs.writeFileSync(path.join(basePath, 'state.json'), JSON.stringify(jsonObj))
  }
}
