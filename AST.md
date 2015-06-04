JSX extensions to Mozilla AST Format
====================================

JSX extends ECMAScript [ESTree AST format](https://github.com/estree/estree) with the following node types:

JSX Names
---------

__JSX Identifier subtype__

```
interface JSXIdentifier <: Identifier {
    type: "JSXIdentifier";
}
```

__Namespaced names__

Property-like namespace syntax (tag names only):

```
interface JSXMemberExpression <: Expression {
    type: "JSXMemberExpression";
    object: JSXMemberExpression | JSXIdentifier,
    property: JSXIdentifier
}
```

XML-based namespace syntax:

```
interface JSXNamespacedName <: Expression {
    type: "JSXNamespacedName";
    namespace: JSXIdentifier,
    name: JSXIdentifier
}
```

JSX Expression Container
------------------------

JSX adds empty "expression" type in order to allow comments in JSX text:

```
interface JSXEmptyExpression <: Node {
    type: "JSXEmptyExpression"
}
```

Any expression used as attribute value or inside JSX text should is wrapped into expression container:

```
interface JSXExpressionContainer <: Node {
    type: "JSXExpressionContainer",
    expression: Expression | JSXEmptyExpression;
}
```

JSX Element
-----------

A JSX element consists of a start tag, a list of children, and an optional end tag:

```
interface JSXElement <: Expression {
    type: "JSXElement",
    startTag: JSXStartTag,
    children: [ Literal | JSXExpressionContainer | JSXElement ],
    endTag: JSXEndTag | null
}
```

JSX Tags
-----------------

Any JSX element is delimited by tags &mdash; either self-closing or both start and end tags:

```
interface JSXTag <: Node {
    name: JSXIdentifier | JSXMemberExpression | JSXNamespacedName;
}

interface JSXStartTag <: JSXTag {
    type: "JSXStartTag",
    attributes: [ JSXAttribute | JSXSpreadAttribute ],
    selfClosing: boolean;
}

interface JSXEndTag <: JSXTag {
    type: "JSXEndTag"
}
```

JSX Attributes
--------------

Start tags may contain attributes:

```
interface JSXAttribute <: Node {
    type: "JSXAttribute",
    name: JSXIdentifier | JSXNamespacedName,
    value: Literal | JSXExpressionContainer | JSXElement | null
}

// This is already used by ES6 parsers, but not included
// in Mozilla's spec yet.
interface SpreadElement <: Node {
    type: "SpreadElement";
    argument: Expression;
}

interface JSXSpreadAttribute <: SpreadElement {
    type: "JSXSpreadAttribute";
}
```

Tools that work with JSX AST
----------------------------

* Parsers:
  - [acorn-jsx](https://github.com/RReverser/acorn-jsx): A plugin for acorn.
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
