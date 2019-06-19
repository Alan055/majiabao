const fs = require('fs')
const path = require('path')

function readAsJson(dataPath) {
  let content = fs.readFileSync(path.resolve(__dirname, dataPath), { encoding: 'utf8' })
  content = content.replace(/^.*{/, '{').replace(/\s\/\/.*/g, '').replace(/,[.\s]*}/g, '}').replace(/，/g, ',').replace(/“|”/g, '"')
  return JSON.parse(content)
}

module.exports = function(app) {
  app.use('/loan/getHomePage', function(req, res) {
    res.json(readAsJson('./mock-data/homepage.js'));
  });

  app.use('/repay/applyRepaymentConfig', function(req, res) {
    res.json(readAsJson('./mock-data/repaymentConfig.js'));
  });

}
