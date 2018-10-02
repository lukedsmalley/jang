
const {join, resolve} = require('path')
const {lstatSync, accessSync, readFileSync} = require('fs')

const jang = require('../index')

function pad(input, length, padding) {
  while (input.length < length) input += padding
  return input
}

function stat(...path) {
  try {
    accessSync(join(...path))
    return lstatSync(join(...path))
  } catch (err) {
    return {
      isFile: () => false,
      isDirectory: () => false
    }
  }
}

function loadConfiguration() {
  if (stat(resolve('jang.config.js')).isFile())
    return require(resolve('jang.config.js'))
  else if (stat(resolve('jang.json')).isFile())
    return readFileSync(resolve('jang.json'))
  else
    throw 'Usable configuration not found in working directory'
}

let configuration
try {
  configuration = loadConfiguration()
} catch (err) {
  console.log(`Could not load configuration (${err})`)
  process.exit(1)
}

let pipeline = configuration.map(
  spec => (spec.hasOwnProperty('use') && 'string' === typeof spec.use) ? jang[spec.use].create(spec.options) : spec.use)

let labelPadLength = 0

for (let component of pipeline) {
  if (component.constructor.name.length > labelPadLength)
    labelPadLength = component.constructor.name.length
}

function logProgress() {
  let statusPadLength = 0
  let barPadLength = Number.MAX_SAFE_INTEGER

  for (let component of pipeline) {
    
  }
}


let endpoint = pipeline[pipeline.length - 1]
while (endpoint.remaining() > 0) {
  for (let component of pipeline) {

  }
}