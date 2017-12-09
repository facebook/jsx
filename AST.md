JSX extensions to Mozilla AST Format
====================================

JSX extends ECMAScript [ESTree AST format](https://github.com/estree/estree) with the following node types:

JSX Names
---------

__JSX Identifier subtype__

```js
interface JSXIdentifier <: Identifier {
    type: "JSXIdentifier";
}
```

__Namespaced names__

Property-like namespace syntax (tag names only):

```js
interface JSXMemberExpression <: Expression {
    type: "JSXMemberExpression";
    object: JSXMemberExpression | JSXIdentifier;
    property: JSXIdentifier;
}
```

XML-based namespace syntax:

```js
interface JSXNamespacedName <: Expression {
    type: "JSXNamespacedName";
    namespace: JSXIdentifier;
    name: JSXIdentifier;
}
```

JSX Expression Container
------------------------

JSX adds empty "expression" type in order to allow comments in JSX text:

```js
interface JSXEmptyExpression <: Node {
    type: "JSXEmptyExpression";
}
```

Any expression used as attribute value or inside JSX text should is wrapped into expression container:

```js
interface JSXExpressionContainer <: Node {
    type: "JSXExpressionContainer";
    expression: Expression | JSXEmptyExpression;
}
```

A JSX element uses a special form of an expression container for an iterator child who should be “spread out” inside an element’s children list:

```js
interface JSXSpreadChild <: Node {
    type: "JSXSpreadChild";
    expression: Expression;
}
```

JSX Boundary Tags
-----------------

Any JSX element is bounded by tags &mdash; either self-closing or both opening and closing elements:

```js
interface JSXBoundaryElement <: Node {
    name: JSXIdentifier | JSXMemberExpression | JSXNamespacedName;
}

interface JSXOpeningElement <: JSXBoundaryElement {
    type: "JSXOpeningElement";
    attributes: [ JSXAttribute | JSXSpreadAttribute ];
    selfClosing: boolean;
}

interface JSXClosingElement <: JSXBoundaryElement {
    type: "JSXClosingElement";
}
```

JSX Attributes
--------------

Opening element ("tag") may contain attributes:

```js
interface JSXAttribute <: Node {
    type: "JSXAttribute";
    name: JSXIdentifier | JSXNamespacedName;
    value: Literal | JSXExpressionContainer | JSXElement | JSXFragment | null;
}

interface JSXSpreadAttribute <: SpreadElement {
    type: "JSXSpreadAttribute";
}
```

JSX Text
--------

JSX Text node stores a string literal found in JSX element children.

```js
interface JSXText <: Node {
  type: "JSXText";
  value: string;
  raw: string;
}
```

JSX Element
-----------

JSX element consists of opening element, list of children and optional closing element:

```js
interface JSXElement <: Expression {
    type: "JSXElement";
    openingElement: JSXOpeningElement;
    children: [ JSXText | JSXExpressionContainer | JSXSpreadChild | JSXElement | JSXFragment ];
    closingElement: JSXClosingElement | null;
}
```

JSX Fragment
------------

JSX fragment consists of an opening fragment, list of children, and closing fragment:

```js
interface JSXFragment <: Expression {
    type: "JSXFragment";
    openingFragment: JSXOpeningFragment;
    children: [ JSXText | JSXExpressionContainer | JSXSpreadChild | JSXElement | JSXFragment ];
    closingFragment: JSXClosingFragment;
}
```

```js
interface JSXOpeningFragment <: Node {
    type: "JSXOpeningFragment";
}
```

```js
interface JSXClosingFragment <: Node {
    type: "JSXClosingFragment";
}
```

Tools that work with JSX AST
----------------------------

* Parsers:
  - [babylon](https://github.com/babel/babylon)
  - [flow-parser](https://www.npmjs.com/package/flow-parser)
  - [typescript](https://www.typescriptlang.org/docs/handbook/jsx.html)
  - [esprima](https://esprima.readthedocs.io/en/latest/syntactic-analysis.html#jsx-syntax-support)
  - [acorn-jsx](https://github.com/RReverser/acorn-jsx): A plugin for acorn.
* Node creation and declarative traversal: [ast-types](https://github.com/benjamn/ast-types)

License
-------

Copyright (c) 2014 - present, Facebook, Inc.
All rights reserved.

This work is licensed under a [Creative Commons Attribution 4.0
International License](http://creativecommons.org/licenses/by/4.0/).
