var fs = require('fs')
var glob = require('glob');
var mkdirp = require('mkdirp');
var optimist = require('optimist');
var path = require('path');
var argv = optimist.argv;

function backtickify(str) {
  var escaped = '`' + 
    str
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/\$\{/g, '$\\{') +
    '`';
  // Replace require( with require\( so node-haste doesn't replace example
  // require calls in the docs
  return escaped.replace(/require\(/g, 'require\\(');
}

function execute() {
  var readme = fs.readFileSync('../README.md', {encoding: 'utf8'}).toString();

  // Remove JSX header
  readme = readme.split('\n').slice(2).join('\n');

  var content = (
    '/**\n' +
    ' * @generated\n' +
    ' */\n' +
    'module.exports = ' + backtickify(readme) + ';\n'
  );

  fs.writeFileSync('./src/jsx/README.js', content);
}

if (argv.convert) {
  console.log('convert!')
  execute();
}

module.exports = execute;
