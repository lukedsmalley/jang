
const readline = require('readline')

module.exports = {
  Monitor
}

function pad(input, length, padding) {
  while (input.length < length) input += padding
  return input
}

var labelPadLength = 0
var statusPadLength = 0
let barPadLength = Number.MAX_SAFE_INTEGER

function Monitor(label, index) {
  var work = 0
  var progress = 0

  if (label.length > labelPadLength) labelPadLength = label.length

  this.info = function(text) {
    console.log(text)
    console.log(pad('', process.stdout.columns, ' '))
    log()
  }

  function log() {
    let status = pad(String(progress) + String(work == 0 ? '' : `/${work}`), statusPadLength, ' ')
    let name = pad(label, labelPadLength, ' ')
    //console.log(Math.floor(barPadLength / work * progress))
    let progressLength = Math.min(barPadLength, Math.floor(progress / work * barPadLength))
    readline.moveCursor(process.stdout, 0, index + 1)
    console.log(`${name} ${status} |${pad(pad('', progressLength, '='), barPadLength, ' ')}|`)
    readline.moveCursor(process.stdout, 0, -(index + 2))
  }

  function updatePadLengths() {
    let statusLength = String(progress).length + (work == 0 ? 0 : (String(work).length + 1))
    if (statusLength > statusPadLength) statusPadLength = statusLength
    let barLength = process.stdout.columns - statusPadLength - labelPadLength - 4
    if (barLength < barPadLength) barPadLength = barLength
  }

  this.setWork = function(value) {
    work = value
    updatePadLengths()
    log()
  }

  this.progress = function() {
    progress++
    updatePadLengths()
    log()
  }
}

/*exports.for = function(label) {
  let status = new Status(label)
  statuses.push(status)
  return new Monitor(status)
}

function logProgress() {
  if (process.stdout.isTTY) {
    let length = 0
    for (let monitor of monitors) if (monitor.status.length > length) length = monitor.status.length
    for (let monitor of monitors)
  }
}*/