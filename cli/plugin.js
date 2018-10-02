
const EventEmitter = require('events')
const {inherits} = require('util')

module.exports = {
  JangPlugin
}

function JangPlugin() {
  EventEmitter.call(this)
  let _this = this

  this.setCount = function(count) {
    _this.emit('count', count)
  }
}

inherits(JangPlugin, EventEmitter)