/*
  cli参数
  --define=a:1,b:2
*/

const argv = require('yargs').argv
const cliConfig = require('../cliConfig')

function parse(params) {
  if(!params) {
    return {}
  }
  params = params.split(',')
  let result = {}
  params.forEach(item => {
    let param = item.split(':')
    result[param[0]] = JSON.stringify(param[1])
  })
  return result
}

let params = parse(argv.define)
params = Object.assign(cliConfig, params)

module.exports = params
