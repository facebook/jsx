/**
 * @jsx React.DOM
 */

var React = require('React');
var Site = require('Site');
var Prism = require('Prism');
var Marked = require('Marked');
var unindent = require('unindent');

var readmeContent = require('../../README.js');

var index = React.createClass({
  render: function() {
    return (
      <Site>
        <div className="hero">
          <div className="wrap">
            <div className="text">
              Draft: <strong>JSX Specification</strong>
            </div>
            <div className="minitext">
              XML-like syntax extension to ECMAScript
            </div>
          </div>
        </div>

        <section className="content wrap">
          <section className="home-section">
            <Marked>{readmeContent}</Marked>
          </section>
        </section>
      </Site>
    );
  }
});

module.exports = index;
