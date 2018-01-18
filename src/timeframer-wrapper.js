var timeframer = require('./timeframer');

var scripts = document.getElementsByTagName('script');
var index = scripts.length - 1;
var tag = scripts[index];
var src = tag.src;
var root = src.substring(0, src.lastIndexOf('/'));

var frameSrc = root + '/timeframer.html';

module.exports = timeframer(frameSrc);
