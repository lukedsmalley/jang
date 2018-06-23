
const {Walker} = require('./util')

module.exports = {
    Parser: Parser
}


function Parser(productions, root) {
    var productions = productions
    var root = root

    function tryProduce(node, pattern, tokens) {
        let properties = {}
        pattern.branch()
        tokens.branch()
        try {
            produce(properties, pattern, tokens)
        } catch (err) {
            pattern.reject()
            tokens.reject()
            return false
        }
        Object.assign(node, properties)
        pattern.merge()
        tokens.merge()
        return true
    }

    function produce(node, pattern, tokens) {
        while (pattern.hasNext()) {
            let atom = pattern.next()
            let subnode = null
            if (atom.hasOwnProperty('rule')) {
                subnode = { type: atom.rule }
                produce(subnode, new Walker(productions[atom.rule]), tokens)
            } else if (atom.hasOwnProperty('optional')) {
                tryProduce(node, pattern, tokens)
            } else if (atom.hasOwnProperty('repeated')) {
                if (!tryProduce(node, pattern, tokens)) {
                    if (atom.hasOwnProperty('expectation')) {
                        throw `Expected ${atom.expectation} but received ${next.type} '${atom.value}' (${location})`;
                    } else {
                        throw `Invalid syntax (${location})`;
                    }
                }
                for (;;) if (!tryProduce(node, pattern, tokens)) break; //TODO: Must match once
            } else if (atom.hasOwnProperty('alternated')) {
                let matched = false;
                for (let alternative of atom.alternated) if (matched = tryProduce(node, pattern, tokens)) break;
                if (!matched) {
                    let location = tokens.next();
                    if (atom.hasOwnProperty('expectation')) {
                        throw `Expected ${atom.expectation} but received ${next.type} '${atom.value}' (${location})`;
                    } else {
                        throw `Invalid syntax (${location})`;
                    }
                }
            } else if (atom.hasOwnProperty('type')) {
                if (!tokens.hasNext()) {
                    throw `Expected ${atom.type} but input ended`;
                }
                let next = tokens.next()
                if (next.type == atom.type) {
                    subnode = next;
                } else {
                    throw `Expected ${atom.type} but received ${next.type} (${next.location.toString()})`;
                }
            } else if (atom.hasOwnProperty('value')) {
                if (!tokens.hasNext()) {
                    throw `Expected '${atom.value}' but input ended`;
                }
                let next = tokens.next();
                if (next.value == atom.value) {
                    subnode = next;
                } else {
                    throw `Expected '${atom.value}' but received '${next.value}' (${next.location.toString()})`;
                }
            }
            if (subnode !== null) {
                if (atom.hasOwnProperty('valueAsProperty')) {
                    if (tokens.hasNext()) {
                        node[atom.valueAsProperty] = tokens.next();
                    } else {
                        throw 'Unexpected end of input';
                    }
                } else if (atom.hasOwnProperty('property')) {
                    node[atom.property] = subnode;
                }
            }
        }
    }

    this.process = function(tokens) {
        let wtokens = new Walker(tokens)
        let ast = { type: root }
        produce(ast, new Walker(productions[root]), wtokens)
        if (wtokens.hasNext()) {
            let next = wtokens.next()
            throw `Expected end of input but received ${next.type} '${next.value}' (${next.location.toString()})`
        }
        return ast
    }
}

Parser.fromJson = function(data) {
    let o = JSON.parse(data)
    return new Parser(o.rules, o.root)
}