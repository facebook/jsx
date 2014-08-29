JSX
===

JSX is a XML-like syntax extension to ECMAScript without any defined semantics. It's NOT intended to be implemented by engines or browsers. It's intended to be used by various preprocessors (transpilers) to transform these tokens into standard ECMAScript.

Rationale
---------

The purpose of this specification is to define a concise and familiar syntax for defining tree structures with attributes. A generic but well defined syntax enables a community of independent parsers and syntax highlighters to conform to a single specification.

Embedding a new syntax in an existing language is a risky venture. Other syntax implementors or the existing language may introduce another incompatible syntax extension.

Through a stand-alone specification, we make it easier for implementors of other syntax extensions to consider JSX when designing their own syntax. This will hopefully allow various new syntax extensions to co-exist.

It is our intention to claim minimal syntactic real estate while keeping the syntax concise and familiar. That way we leave the door open for other extensions.

Syntax
------

_JSX extends the PrimaryExpression in the [ECMAScript 6th Edition (ECMA-262)](http://people.mozilla.org/~jorendorff/es6-draft.html) grammar._

PrimaryExpression :
- JSXElement

__Elements__

JSXElement : 
- JSXSelfClosingElement 
- JSXOpeningElement JSXChildren<sub>opt</sub> JSXClosingElement

JSXSelfClosingElement :
- `<` JSXElementName JSXAttributes<sub>opt</sub> JSXWhitespace<sub>opt</sub> `/` `>`

JSXOpeningElement :
- `<` JSXElementName JSXAttributes<sub>opt</sub> JSXWhitespace<sub>opt</sub> `>`

JSXClosingElement :
- `<` `/` JSXElementName JSXWhitespace<sub>opt</sub> `>`

JSXElementName :
- JSXIdentifier
- JSXNamedspacedName
- JSXMemberExpression

JSXIdentifier :
- JSXIdentifierStart
- JSXIdentifier JSXIdentifierPart

JSXIdentifierStart :
- IdentifierStart __but not `\` UnicodeEscapeSequence__

JSXIdentifierPart :
- IdentifierPart __but not `\` UnicodeEscapeSequence__
- `-`

JSXNamespacedName :
- JSXIdentifier `:` JSXIdentifier

JSXMemberExpression :
- JSXMemberExpression `.` JSXIdentifier

__Attributes__

JSXAttributes : 
- JSXSpreadAttribute JSXAttributes<sub>opt</sub>
- JSXAttribute JSXAttributes<sub>opt</sub>

JSXSpreadAttribute :
- JSXWhitespace `{` `...` AssignmentExpression `}`

JSXAttribute : 
- JSXWhitespace JSXAttributeName JSXWhitespace<sub>opt</sub> `=` JSXWhitespace<sub>opt</sub> JSXAttributeValue

JSXAttributeName :
- JSXIdentifier
- JSXNamespacedName

JSXAttributeValue : 
- `"` JSXDoubleStringCharacters<sub>opt</sub> `"`
- `'` JSXSingleStringCharacters<sub>opt</sub> `'`
- `{` JSXWhitespace `}`
- `{` AssignmentExpression `}`

JSXDoubleStringCharacters : 
- JSXDoubleStringCharacter JSXDoubleStringCharacters<sub>opt</sub>

JSXDoubleStringCharacter : 
- SourceCharacter __but not `"`__

JSXSingleStringCharacters : 
- JSXSingleStringCharacter JSXSingleStringCharacters<sub>opt</sub>

JSXSingleStringCharacter : 
- SourceCharacter __but not `'`__

__Children__

JSXChildren : 
- JSXChild JSXChildren<sub>opt</sub>

JSXChild :
- JSXText JSXChildren<sub>opt</sub>
- JSXElement JSXChildren<sub>opt</sub>
- `{` JSXWhitespace<sub>opt</sub> `}`
- `{` AssignmentExpression `}`

JSXText :
- JSXTextCharacter JSXText<sub>opt</sub>

JSXTextCharacter :
- SourceCharacter __but not one of `{`, `<`, `>` or `}`__

__Whitespace and Comments__

_JSX treats comments as whitespace where they are allowed._

JSXWhitespace :
- JSXWhitespacePart JSXWhitespace<sub>opt</sub>

JSXWhitespacePart :
- WhiteSpace
- LineTerminator
- Comment

Parser Implementations
----------------------

- [acorn-jsx](https://github.com/RReverser/acorn-jsx): A fork of acorn.
- [esprima-fb](https://github.com/facebook/esprima): A fork of esprima.
- [sweet-jsx](https://github.com/andreypopp/sweet-jsx): A sweet.js macro.

Transpilers
-----------

These are a set of transpilers that all conform to the JSX syntax but use different semantics on the output:

- [jsxdom](https://github.com/vjeux/jsxdom): Create DOM elements using JSX.
- [Mercury JSX](https://github.com/Raynos/mercury-jsx): Create virtual-dom VNodes or VText using JSX.
- [React JSX](http://facebook.github.io/react/docs/jsx-in-depth.html): Create ReactElements using JSX.

Why not Template Literals?
--------------------------

[ECMAScript 6th Edition (ECMA-262)](http://people.mozilla.org/~jorendorff/es6-draft.html) introduces template literals which are intended to be used for embedding DSL in ECMAScript. Why not just use that instead of inventing a syntax that's not part of ECMAScript?

ES6 template literals are a flexible way to embed alternate syntaxes into pure JS code. That said, the syntactical overhead of using template literals in lieu of JSX is significant. Compare:

```js
// JSX
var box =
  <Box>
    {answerQuestion(<Answer value={false}>no</Answer>)}
  </Box>;

// ES6 template literal
var box = jsx`
  <${Box}>
    ${answerQuestion(jsx`<${Answer} value=${false}>no</${Answer}>`)}
  </${Box}>
`;
```

For performance, it also makes sense to use a specialized transform to avoid the runtime cost of parsing the tag strings. The semantics of JSX are defined by the transpiler, which sidesteps the need to perform any parsing at runtime.

Prior Art
---------

The JSX syntax was derived from the [E4X Specification (ECMA-357)](http://www.ecma-international.org/publications/standards/Ecma-357.htm). E4X is a deprecated specification with deep reaching semantic meaning. JSX largely overlaps with a tiny subset of the E4X syntax. However, JSX is a stand-alone specification has no relation to the E4X specification.
