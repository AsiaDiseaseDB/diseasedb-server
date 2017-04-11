let fs = require('fs')
const path = require('path')

const basePath = path.join(__dirname, '../', 'store')

module.exports = {
  getWholeOptions () {
    let data = fs.readFileSync(path.join(basePath, 'options.json'))
    let jsonObj = JSON.parse(data)
    // console.log(jsonObj)
    return jsonObj
  },
  getOptions (catagory, optName) {
    let data = fs.readFileSync(path.join(basePath, 'options.json'))
    let jsonObj = JSON.parse(data)
    return jsonObj[catagory][optName]
  },
  addOptions (catagory, optName, payload) {
    let data = fs.readFileSync(path.join(basePath, 'options.json'))
    let jsonObj = JSON.parse(data)
    jsonObj[catagory][optName].push(payload)
    fs.writeFileSync(path.join(basePath, 'options.json'), JSON.stringify(jsonObj))
    return true
  },
  deleteOptions (catagory, optName, payload) {
    let data = fs.readFileSync(path.join(basePath, 'options.json'))
    let jsonObj = JSON.parse(data)
    let newOptions = []
    console.log('----------------------')
    console.log(jsonObj[catagory][optName])
    for (let i in jsonObj[catagory][optName]) {
      if (jsonObj[catagory][optName][i] !== payload) {
        newOptions.push(jsonObj[catagory][optName][i])
      }
    }
    jsonObj[catagory][optName] = newOptions
    console.log(jsonObj[catagory][optName])
    console.log('----------------------')
    fs.writeFileSync(path.join(basePath, 'options.json'), JSON.stringify(jsonObj))
    return true
  }
}
