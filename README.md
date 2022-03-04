DRAFT: JSX Specification
========================
[![Support Ukraine](https://img.shields.io/badge/Support-Ukraine-FFD500?style=flat&labelColor=005BBB)](https://opensource.fb.com/support-ukraine)

[**See spec text with grammar here**](https://facebook.github.io/jsx).

JSX is an XML-like syntax extension to ECMAScript without any defined semantics. It's NOT intended to be implemented by engines or browsers. __It's NOT a proposal to incorporate JSX into the ECMAScript spec itself.__ It's intended to be used by various preprocessors (transpilers) to transform these tokens into standard ECMAScript. 

```jsx
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

Rationale
---------

The purpose of this specification is to define a concise and familiar syntax for defining tree structures with attributes. A generic but well defined syntax enables a community of independent parsers and syntax highlighters to conform to a single specification.

Embedding a new syntax in an existing language is a risky venture. Other syntax implementors or the existing language may introduce another incompatible syntax extension.

Through a stand-alone specification, we make it easier for implementors of other syntax extensions to consider JSX when designing their own syntax. This will hopefully allow various new syntax extensions to co-exist.

It is our intention to claim minimal syntactic real estate while keeping the syntax concise and familiar. That way we leave the door open for other extensions.

This specification does not attempt to comply with any XML or HTML specification. JSX is designed as an ECMAScript feature and the similarity to XML is only for familiarity.


Why not Template Literals?
--------------------------

[ECMAScript 6th Edition (ECMA-262)](https://www.ecma-international.org/ecma-262/8.0/index.html) introduces template literals which are intended to be used for embedding DSL in ECMAScript. Why not just use that instead of inventing a syntax that's not part of ECMAScript?

Template literals work well for long embedded DSLs. Unfortunately the syntax noise is substantial when you exit in and out of embedded arbitrary ECMAScript expressions with identifiers in scope.

```jsx
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

```jsx
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

```jsx
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

Another alternative would be to use object initializers (similar to [JXON](https://htmlpreview.github.io/?https://github.com/mdn/archived-content/blob/main/files/en-us/archive/jxon/raw.html)). Unfortunately, the balanced braces do not give great syntactic hints for where an element starts and ends in large trees. Balanced named tags is a critical syntactic feature of the XML-style notation.

Prior Art
---------

The JSX syntax is similar to the [E4X Specification (ECMA-357)](http://www.ecma-international.org/publications/files/ECMA-ST-WITHDRAWN/Ecma-357.pdf). E4X is a deprecated specification with deep reaching semantic meaning. JSX partially overlaps with a tiny subset of the E4X syntax. However, JSX has no relation to the E4X specification.

License
-------

Copyright (c) 2014 - present, Meta Platform, Inc.
All rights reserved.

This work is licensed under a [Creative Commons Attribution 4.0
International License](http://creativecommons.org/licenses/by/4.0/).
