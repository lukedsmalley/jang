
exports = {
    StringLocation: StringLocation,
    Token: Token,
    Walker: Walker,
    Pipeline: Pipeline
}


function StringLocation(filename, line, column) {
    this.filename = filename === undefined ? '<source>' : filename
    this.line = line === undefined ? 1 : line
    this.column = column === undefined ? 1 : column
}

StringLocation.prototype.toString = function() {
    return `${this.filename}:${this.line}:${this.column}`
}

StringLocation.prototype.clone = function() {
    return new StringLocation(this.filename, this.line, this.column)
}

StringLocation.prototype.walk = function(value) {
    for (var i = 0; i < value.length; i++) {
        if (value.charAt(i) == '\n') {
            this.line += 1
            this.column = 1
        } else {
            this.column += 1
        }
    }
    return this
}


function Token(value, type, location) {
    this.value = value
    this.type = type
    this.location = location
}


function Walker(iterable) {
    var iterable = iterable;
    var index = 0;
    var snapshots = [];

    this.hasNext = () => index < iterable.length
    this.next = () => iterable[index++]
    this.branch = () => { snapshots.push(index) }
    this.merge = () => { snapshots.pop() }
    this.reject = () => { index = snapshots.pop() }
}


function Pipeline(...components) {
    var components = components

    this.process = function(input, ...args) {
        let wcomponents = new Walker(components)
        let wargs = new Walker(args)
        while (wcomponents.hasNext()) input = wargs.hasNext() ? wcomponents.next().process(input, ...wargs.next()) : wcomponents.next().process(input)
        return input
    } 
}