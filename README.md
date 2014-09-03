DRAFT: JSX Specification
========================

JSX is a XML-like syntax extension to ECMAScript without any defined semantics. It's NOT intended to be implemented by engines or browsers. It's intended to be used by various preprocessors (transpilers) to transform these tokens into standard ECMAScript.

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
  </DropDown>;

render(dropdown);
```

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
- JSXOpeningElement JSXChildren<sub>opt</sub> JSXClosingElement

JSXSelfClosingElement :

- `<` JSXElementName JSXAttributes<sub>opt</sub> `/` `>`

JSXOpeningElement :

- `<` JSXElementName JSXAttributes<sub>opt</sub> `>`

JSXClosingElement :

- `<` `/` JSXElementName `>`

JSXElementName :

- JSXIdentifier
- JSXNamedspacedName
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

- JSXAttributeName `=` JSXAttributeValue

JSXAttributeName :

- JSXIdentifier
- JSXNamespacedName

JSXAttributeValue : 

- `"` JSXDoubleStringCharacters<sub>opt</sub> `"`
- `'` JSXSingleStringCharacters<sub>opt</sub> `'`
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

- JSXText
- JSXElement
- `{` `}`
- `{` AssignmentExpression `}`

JSXText :

- JSXTextCharacter JSXText<sub>opt</sub>

JSXTextCharacter :

- SourceCharacter __but not one of `{` or `<`__

__Whitespace and Comments__

_JSX uses the same punctuators and braces as ECMAScript. WhiteSpace, LineTerminators and Comments are generally allowed between any punctuator or brace._

Parser Implementations
----------------------

- [acorn-jsx][acorn-jsx]: A fork of acorn.
- [esprima-fb][esprima-fb]: A fork of esprima.
- [sweet-jsx][sweet-jsx]: A sweet.js macro.

Transpilers
-----------

These are a set of transpilers that all conform to the JSX syntax but use different semantics on the output:

- [JSXDOM](https://github.com/vjeux/jsxdom): Create DOM elements using JSX.
- [Mercury JSX](https://github.com/Raynos/mercury-jsx): Create virtual-dom VNodes or VText using JSX.
- [React JSX](http://facebook.github.io/react/docs/jsx-in-depth.html): Create ReactElements using JSX.

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

The JSX syntax is similar to the [E4X Specification (ECMA-357)](http://www.ecma-international.org/publications/standards/Ecma-357.htm). E4X is a deprecated specification with deep reaching semantic meaning. JSX partially overlaps with a tiny subset of the E4X syntax. However, JSX has no relation to the E4X specification.

AST Format
----------

JSX extends ECMAScript [Mozilla AST format](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey/Parser_API) with following node types:

__JSX Names__

```
interface XJSIdentifier <: Identifier {
    type: "XJSIdentifier";
}

interface XJSNamespacedName <: Expression, Pattern {
    type: "XJSNamespacedName";
    namespace: XJSIdentifier,
    name: XJSIdentifier
}

interface XJSMemberExpression <: Expression, Pattern {
    type: "XJSMemberExpression";
    object: XJSMemberExpression | XJSIdentifier,
    property: XJSIdentifier
}
```

__JSX Expression Container__

```
interface XJSEmptyExpression <: Node {
    type: "XJSEmptyExpression"
}

interface XJSExpressionContainer <: Node {
    type: "XJSExpressionContainer",
    expression: Expression | XJSEmptyExpression;
}
```

__JSX Boundary Tags__

```
interface XJSBoundaryElement <: Node {
    name: XJSIdentifier | XJSMemberExpression | XJSNamespacedName;
}

interface XJSOpeningElement <: XJSBoundaryElement {
    type: "XJSOpeningElement",
    attributes: [ XJSAttribute | XJSSpreadAttribute ],
    selfClosing: boolean;
}

interface XJSClosingElement <: XJSBoundaryElement {
    type: "XJSClosingElement"
}
```

__JSX Attributes__

```
interface XJSAttribute <: Node {
    type: "XJSAttribute",
    name: XJSIdentifier | XJSNamespacedName,
    value: Literal | XJSExpressionContainer | XJSElement | null
}

// This is already used by ES6 parsers, but not included
// in Mozilla's spec yet.
interface SpreadElement <: Pattern {
    type: "SpreadElement";
    argument: Expression;
}

interface XJSSpreadAttribute <: SpreadElement {
    type: "XJSSpreadAttribute";
}
```

__JSX Element__

```
interface XJSElement <: Expression {
    type: "XJSElement",
    openingElement: XJSOpeningElement,
    children: [ Literal | XJSExpressionContainer | XJSElement ],
    closingElement: XJSClosingElement | null
}
```

__Tools that work with JSX AST__

* Parsing: [acorn-jsx][acorn-jsx], [esprima-fb][esprima-fb].
* Traversal: [estraverse-fb](https://github.com/RReverser/estraverse-fb).
* Node creation and declarative traversal: [ast-types](https://github.com/benjamn/ast-types)
* Transpiling to ECMAScript AST: [jsx-transpiler](https://github.com/RReverser/jsx-transpiler)

[acorn-jsx]: https://github.com/RReverser/acorn-jsx
[esprima-fb]: https://github.com/facebook/esprima
[sweet-jsx]: https://github.com/andreypopp/sweet-jsx
