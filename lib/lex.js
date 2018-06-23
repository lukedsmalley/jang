
const {StringLocation, Token} = require('./util')

exports = {
  Lexer: Lexer
}


function LexerBuilder() { //Builders are an unnecessary feature for the JS implementation, but will be necessary for cross-language compatibility
  var stack = [{}]

  this.build = function() {
    this.and()
    return new Lexer(stack[0])
  }

  this.withPattern = function(alias, ...patterns) {
    stack.unshift({
      alias: alias === undefined ? stack[0].alias : alias,
      patterns: patterns
    })
    return this
  }

  this.withDefault = function(alias) {
    stack.unshift({
      alias: alias === undefined ? stack[0].alias : alias,
      default: true
    })
    return this
  }

  this.withExpression = function(alias, expression) {
    stack.unshift({
      alias: alias === undefined ? stack[0].alias : alias,
      expression: expression instanceof RegExp ? expression.source : expression
    })
    return this
  }

  this.and = function() {
    let top = stack.unshift()
    if (!stack[0].children) stack[0].children = []
    stack[0].children.push(top)
    return this
  }

  this.delimiter = function() {
    stack[0].delimiter = true
    return this
  }

  this.clear = function() {
    stack[0].clear = true
    return this
  }

  this.push = function() {
    stack[0].push = true
    return this
  }

  this.break = function() {
    stack[0].break = true
    return this
  }
}


function Lexer(rules) {
  var rules = rules

  function LexerState(input, filename) {
    this.input = input
    this.location = new StringLocation(filename)
    this.index = 0
    this.tokens = []
    this.currentToken = null

    this.matches = function(value) {
      if (this.index + value.length > this.input.length) return false
      return this.input.substr(this.index, value.length) === value
    }

    this.push = function() {
      if (this.currentToken !== null) {
        this.tokens.push(this.currentToken)
        this.currentToken = null
      }
    }

    this.append = function(value, type) {
      if (this.currentToken === null) {
        this.currentToken = new Token(value, type, this.location.clone())
      } else {
        this.currentToken.value += value
        this.currentToken.type = type
      }
    }

    this.increment = function(value) {
      this.location.increment(value)
      this.index += value.length
    }
  }

  function canMatchRule(state, rule) {
    if (rule.default) return ''
    
    if (rule.expression) {
      let pattern = rule.expression instanceof RegExp ? rule.expression : new RegExp(rule.expression, 'g')
      pattern.lastIndex = state.index
      let match = pattern.exec(state.input)
      if (match != null && match.index == state.index) return match[0]
    }

    if (rule.matcher) {
      let match = rule.matcher(state.input, state.index)
      if (match != null) return match
    }
    
    if (rule.pattern || rule.patterns) {
      let patterns = []
      if (rule.patterns) for (let pattern of rule.patterns) patterns.push(pattern)
      if (rule.pattern) patterns.push(rule.pattern)
      for (let pattern of rule.patterns) if (state.matches(pattern)) return pattern
    }

    return null
  }

  function continueSpan(state, span) {
    for (let rule of span.children) {
      let match = canMatchRule(state, rule)
      if (match !== null) {
        if (rule.clear) state.push()
        if (!rule.delimiter) state.append(match, rule.alias)
        if (rule.push) state.push()
        state.increment(match)
        if (rule.children) processSpan(state, rule)
        if (rule.break) return false
        else return true
      }
    }
    throw new Error(`Illegal pattern in ${span.alias}. (${state.location.toString()})`)
  }

  function processSpan(state, span) {
    while (state.index < state.input.length && continueSpan(state, span));
    state.push()
  }

  this.process = function(input, filename) {
    let state = new LexerState(input, filename)
    processSpan(state, {
      alias: 'input',
      children: rules
    })
    return state.tokens
  }
}

Lexer.create = () => new LexerBuilder()

Lexer.fromJson = data => new Lexer(JSON.parse(data).rules)