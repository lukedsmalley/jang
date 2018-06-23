
const path = require('path')
const jang = require('./index')

let config
try {
  config = require(path.resolve('jang.config.js'))
  config = Array.isArray(config) ? config : [config]
} catch (err) {
  console.error(`Could not load configuration (${err})`)
  process.exit(1)
}

//let components = config.map(component => )

//new jang.Pipeline(components.)