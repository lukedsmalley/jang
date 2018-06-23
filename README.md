# Jang
Jang is a language processing library that provides a complete parsing toolchain distributed into several component modules. Components can be combined into pipelines to implement a complete parser/compiler or other processor. Jang can be used as a library or through `jang/cli` and the `jang.config.js` file in a command-line environment.

Current components:
- Lexer
- Parser

Future components:
- Verifier
- Generator

TODO:
- Should builders be deprecated?
- Create component model spec
- Implement optional streaming interface in components