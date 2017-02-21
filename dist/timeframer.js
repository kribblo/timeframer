(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.timeframer = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var timeframer = require('./timeframer');

var scripts = document.getElementsByTagName('script');
var index = scripts.length - 1;
var tag = scripts[index];
var src = tag.src;
var root = src.substring(0, src.lastIndexOf('/'));

var frameSrc = root + '/timeframer.html';

console.log(document.body);

timeframer(frameSrc, window);

},{"./timeframer":2}],2:[function(require,module,exports){
module.exports = function(frameSrc, window) {

    window = window || {};
    window.document = window.document || document;

    var channel = new MessageChannel();
    var worker = channel.port1;

    var timeoutId = 0;
    var timeouts = {};
    var intervals = {};

    var timeframer = document.createElement('iframe');
    timeframer.setAttribute('frameBorder', '0');
    timeframer.style.width = 0;
    timeframer.style.height = 0;

    timeframer.onload = function() {
        timeframer.contentWindow.postMessage('TIMEFRAMER', '*', [channel.port2]);
    };

    worker.onmessage = function(e) {
        var data = e.data;
        var id = data.id;

        var stored;
        if(intervals[id]) {
            stored = intervals[id];
        } else if(timeouts[id]) {
            stored = timeouts[id];
            delete timeouts[id];
        } else {
            return;
        }

        var fn = stored.fn;
        var args = stored.args;

        fn.apply(null, args);
    };

    window.setTimeout = function(fn, delay) {
        var args = Array.prototype.slice.call(arguments, 2);
        timeoutId += 1;
        delay = delay || 0;
        var id = timeoutId;
        timeouts[id] = {fn: fn, args: args};
        worker.postMessage({command: 'setTimeout', id: id, timeout: delay});
        return id;
    };

    window.clearTimeout = function(id) {
        worker.postMessage({command: 'clearTimeout', id: id});
        delete timeouts[id];
    };

    window.setInterval = function(fn, delay) {
        var args = Array.prototype.slice.call(arguments, 2);
        timeoutId += 1;
        delay = delay || 0;
        var id = timeoutId;
        intervals[id] = {fn: fn, args: args};
        worker.postMessage({command: 'setInterval', id: id, timeout: delay});
        return id;
    };

    window.clearInterval = function(id) {
        worker.postMessage({command: 'clearInterval', id: id});
        delete intervals[id];
    };

    timeframer.src = frameSrc;

    window.document.body.appendChild(timeframer);

    return window;
};

},{}]},{},[1])(1)
});