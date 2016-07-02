DRAFT: JSX Specification
========================

JSX is a XML-like syntax extension to ECMAScript without any defined semantics. It's NOT intended to be implemented by engines or browsers. __It's NOT a proposal to incorporate JSX into the ECMAScript spec itself.__ It's intended to be used by various preprocessors (transpilers) to transform these tokens into standard ECMAScript.

```
// Using JSX to express UI components.
var dropdown =
  <Dropdown>
    A dropdown list
    <Menu>
      <MenuItem>Do Something</MenuItem>
      <MenuItem>Do Something Fun!</MenuItem>
      <MenuItem>Do Something Else</MenuItem>
    </Menu>
  </Dropdown>;

render(dropdown);
```
Indented Mode
```
// Using JSX to express UI components.
var dropdown =
  <Dropdown>
    A dropdown list
    <Menu>
      <MenuItem>Do Something
      <MenuItem>Do Something Fun!
      <MenuItem>Do Something Else
      
render(dropdown);
```
------

Rationale
---------

The purpose of this specification is to define a concise and familiar syntax for defining tree structures with attributes. A generic but well defined syntax enables a community of independent parsers and syntax highlighters to conform to a single specification.

Embedding a new syntax in an existing language is a risky venture. Other syntax implementors or the existing language may introduce another incompatible syntax extension.

Through a stand-alone specification, we make it easier for implementors of other syntax extensions to consider JSX when designing their own syntax. This will hopefully allow various new syntax extensions to co-exist.

It is our intention to claim minimal syntactic real estate while keeping the syntax concise and familiar. That way we leave the door open for other extensions.

This specification does not attempt to comply with any XML or HTML specification. JSX is designed as an ECMAScript feature and the similarity to XML is only for familiarity.

Syntax
------

_JSX extends the PrimaryExpression in the [ECMAScript 6th Edition (ECMA-262)](http://people.mozilla.org/~jorendorff/es6-draft.html) grammar:_

PrimaryExpression :

- JSXElement

__Elements__

JSXElement : 

- JSXSelfClosingElement 
- JSXOpeningElement JSXChildren<sub>opt</sub> JSXClosingElement<br />
  (names of JSXOpeningElement and JSXClosingElement should match)

JSXSelfClosingElement :

- `<` JSXElementName JSXAttributes<sub>opt</sub> `/` `>`

JSXOpeningElement :

- `<` JSXElementName JSXAttributes<sub>opt</sub> `>`

JSXClosingElement :

- `<` `/` JSXElementName `>`

JSXElementName :

- JSXIdentifier
- JSXNamespacedName
- JSXMemberExpression

JSXIdentifier :

- IdentifierStart
- JSXIdentifier IdentifierPart
- JSXIdentifier __NO WHITESPACE OR COMMENT__ `-`

JSXNamespacedName :

- JSXIdentifier `:` JSXIdentifier

JSXMemberExpression :

- JSXIdentifier `.` JSXIdentifier
- JSXMemberExpression `.` JSXIdentifier

__Attributes__

JSXAttributes : 

- JSXSpreadAttribute JSXAttributes<sub>opt</sub>
- JSXAttribute JSXAttributes<sub>opt</sub>

JSXSpreadAttribute :

- `{` `...` AssignmentExpression `}`

JSXAttribute : 

- JSXAttributeName JSXAttributeInitializer<sub>opt</sub>

JSXAttributeName :

- JSXIdentifier
- JSXNamespacedName

JSXAttributeInitializer : 

- `=` JSXAttributeValue

JSXAttributeValue : 

- `"` JSXDoubleStringCharacters<sub>opt</sub> `"`
- `'` JSXSingleStringCharacters<sub>opt</sub> `'`
- `{` AssignmentExpression `}`
- JSXElement

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

- JSXText
- JSXElement
- `{` AssignmentExpression<sub>opt</sub> `}`

JSXText :

- JSXTextCharacter JSXText<sub>opt</sub>

JSXTextCharacter :

- SourceCharacter __but not one of `{`, `<`, `>` or `}`__

__Whitespace and Comments__

_JSX uses the same punctuators and braces as ECMAScript. WhiteSpace, LineTerminators and Comments are generally allowed between any punctuators._

Parser Implementations
----------------------

- [acorn-jsx](https://github.com/RReverser/acorn-jsx): A fork of acorn.
- [esprima-fb](https://github.com/facebook/esprima): A fork of esprima.
- [jsx-reader](https://github.com/jlongster/jsx-reader): A sweet.js macro.

Transpilers
-----------

These are a set of transpilers that all conform to the JSX syntax but use different semantics on the output:

- [React JSX](http://facebook.github.io/react/docs/jsx-in-depth.html): Create ReactElements using JSX.
- [jsx-transform](https://github.com/alexmingoia/jsx-transform): Configurable implementation of JSX decoupled from React.
- [Babel](http://babeljs.io): An ES2015 and beyond to ES of now transpiler with JSX support.

NOTE: A conforming transpiler may choose to use a subset of the JSX syntax.

Why not Template Literals?
--------------------------

[ECMAScript 6th Edition (ECMA-262)](http://people.mozilla.org/~jorendorff/es6-draft.html) introduces template literals which are intended to be used for embedding DSL in ECMAScript. Why not just use that instead of inventing a syntax that's not part of ECMAScript?

Template literals work well for long embedded DSLs. Unfortunately the syntax noise is substantial when you exit in and out of embedded arbitrary ECMAScript expressions with identifiers in scope.

```
// Template Literals
var box = jsx`
  <${Box}>
    ${
      shouldShowAnswer(user) ?
      jsx`<${Answer} value=${false}>no</${Answer}>` :
      jsx`
        <${Box.Comment}>
         Text Content
        </${Box.Comment}>
      `
    }
  </${Box}>
`;
```

It would be possible to use template literals as a syntactic entry point and change the semantics inside the template literal to allow embedded scripts that can be evaluated in scope:

```
// Template Literals with embedded JSX
var box = jsx`
  <Box>
    {
      shouldShowAnswer(user) ?
      <Answer value={false}>no</Answer> :
      <Box.Comment>
         Text Content
      </Box.Comment>
    }
  </Box>
`;
```

However, this would lead to further divergence. Tooling that is built around the assumptions imposed by template literals wouldn't work. It would undermine the meaning of template literals. It would be necessary to define how JSX behaves within the rest of the ECMAScript grammar within the template literal anyway.

Therefore it's better to introduce JSX as an entirely new type of PrimaryExpression:

```
// JSX
var box =
  <Box>
    {
      shouldShowAnswer(user) ?
      <Answer value={false}>no</Answer> :
      <Box.Comment>
         Text Content
      </Box.Comment>
    }
  </Box>;
```

Why not JXON?
-------------

Another alternative would be to use object initializers (similar to [JXON](https://developer.mozilla.org/en-US/docs/JXON)). Unfortunately, the balanced braces do not give great syntactic hints for where an element starts and ends in large trees. Balanced named tags is a critical syntactic feature of the XML-style notation.

Prior Art
---------

The JSX syntax is similar to the [E4X Specification (ECMA-357)](http://www.ecma-international.org/publications/files/ECMA-ST-WITHDRAWN/Ecma-357.pdf). E4X is a deprecated specification with deep reaching semantic meaning. JSX partially overlaps with a tiny subset of the E4X syntax. However, JSX has no relation to the E4X specification.

License
-------

Copyright (c) 2014, Facebook, Inc.
All rights reserved.

This work is licensed under a [Creative Commons Attribution 4.0
International License](http://creativecommons.org/licenses/by/4.0/).
