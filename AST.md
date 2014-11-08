JSX extensions to Mozilla AST Format
====================================

JSX extends ECMAScript [Mozilla AST format](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey/Parser_API) with following node types:

JSX Names
---------

__JSX Identifier subtype__

```
interface XJSIdentifier <: Identifier {
    type: "XJSIdentifier";
}
```

__Namespaced names__

Property-like namespace syntax (tag names only):

```
interface XJSMemberExpression <: Expression, Pattern {
    type: "XJSMemberExpression";
    object: XJSMemberExpression | XJSIdentifier,
    property: XJSIdentifier
}
```

XML-based namespace syntax:

```
interface XJSNamespacedName <: Expression, Pattern {
    type: "XJSNamespacedName";
    namespace: XJSIdentifier,
    name: XJSIdentifier
}
```

JSX Expression Container
------------------------

JSX adds empty "expression" type in order to allow comments in JSX text:

```
interface XJSEmptyExpression <: Node {
    type: "XJSEmptyExpression"
}
```

Any expression used as attribute name, value or inside JSX text should is wrapped into expression container:

```
interface XJSExpressionContainer <: Node {
    type: "XJSExpressionContainer",
    expression: Expression | XJSEmptyExpression;
}
```

JSX Boundary Tags
-----------------

Any JSX element is bounded by tags &mdash; either self-closing or both opening and closing elements:

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

JSX Attributes
--------------

Opening element ("tag") may contain attributes:

```
interface XJSAttribute <: Node {
    type: "XJSAttribute",
    name: XJSIdentifier | XJSNamespacedName | XJSExpressionContainer,
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

JSX Element
-----------

Finally, JSX element itself consists of opening element, list of children and optional closing element:

```
interface XJSElement <: Expression {
    type: "XJSElement",
    openingElement: XJSOpeningElement,
    children: [ Literal | XJSExpressionContainer | XJSElement ],
    closingElement: XJSClosingElement | null
}
```

Tools that work with JSX AST
----------------------------

* Parsers:
  - [acorn-jsx](https://github.com/RReverser/acorn-jsx): A fork of acorn.
  - [esprima-fb](https://github.com/facebook/esprima): A fork of esprima.
* Traversal: [estraverse-fb](https://github.com/RReverser/estraverse-fb).
* Node creation and declarative traversal: [ast-types](https://github.com/benjamn/ast-types)
* Transpiling to ECMAScript AST: [jsx-transpiler](https://github.com/RReverser/jsx-transpiler)

License
-------

Copyright (c) 2014, Facebook, Inc.
All rights reserved.

This work is licensed under a [Creative Commons Attribution 4.0
International License](http://creativecommons.org/licenses/by/4.0/).
