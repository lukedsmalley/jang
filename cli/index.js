
/*const path = require('path')
const readline = require('readline')

const jang = require('../index')

function

let config
try {
  config = require(path.resolve('jang.config.js'))
  config = Array.isArray(config) ? config : [config]
} catch (err) {
  console.error(`Could not load configuration (${err})`)
  process.exit(1)
}

let components = config.map(step => {
  let component = 'string' === typeof step.use ? jang[step.use] : step.use
  return new component(step.options)
})

//new jang.Pipeline(components.)*/

const {Monitor} = require('./monitor')

let m = new Monitor('benis', 0)
m.setWork(100)

let i = 0
setInterval(function() {
  if (i++ < 100) m.progress()
}, 50)

