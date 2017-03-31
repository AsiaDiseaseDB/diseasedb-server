let fs = require('fs')
const path = require('path')

const basePath = path.join(__dirname, '../', 'store')

module.exports = {
  getReporterOptions () {
    let data = fs.readFileSync(path.join(basePath, 'options.json'))
    let jsonObj = JSON.parse(data)
    return jsonObj.basicDetail.reporterOptions
  },
  addReporterOptions (newReporter) {
    let data = fs.readFileSync(path.join(basePath, 'options.json'))
    let jsonObj = JSON.parse(data)
    jsonObj.basicDetail.reporterOptions.push(newReporter)
    fs.writeFileSync(path.join(basePath, 'options.json'), JSON.stringify(jsonObj))
    return true
  },
  deleteReporterOptions (reporter) {
    let data = fs.readFileSync(path.join(basePath, 'options.json'))
    let jsonObj = JSON.parse(data)
    let newOptions = []
    for (let i in jsonObj.basicDetail.reporterOptions) {
      if (jsonObj.basicDetail.reporterOptions[i] !== reporter) {
        newOptions.push(jsonObj.basicDetail.reporterOptions[i])
      }
    }
    jsonObj.basicDetail.reporterOptions = newOptions
    fs.writeFileSync(path.join(basePath, 'options.json'), JSON.stringify(jsonObj))
    return true
  }
}
