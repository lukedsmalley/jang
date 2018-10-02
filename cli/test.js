
const {Monitor} = require('./monitor')

const m = new Monitor('benis', 0)
m.setWork(10)

let i = 0
setInterval(function() {
  m.info(i)
  if (i < 10) m.progress()
  i++
}, 1000)