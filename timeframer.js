(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.timeframer = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var timeframer=require("./timeframer"),scripts=document.getElementsByTagName("script"),index=scripts.length-1,tag=scripts[index],src=tag.src,root=src.substring(0,src.lastIndexOf("/")),frameSrc=root+"/timeframer.html";timeframer(frameSrc,window);
},{"./timeframer":2}],2:[function(require,module,exports){
module.exports=function(e,t){var a=new MessageChannel,n=a.port1,r=0,o={},s={},i=document.createElement("iframe");i.setAttribute("frameBorder","0"),i.style.width=0,i.style.height=0,i.onload=function(){i.contentWindow.postMessage("TIMEFRAMER","*",[a.port2])},n.onmessage=function(e){var t,a=e.data,n=a.id;if(s[n])t=s[n];else{if(!o[n])return;t=o[n],delete o[n]}var r=t.fn,i=t.args;r.apply(null,i)},t.setTimeout=function(e,t){var a=Array.prototype.slice.call(arguments,2);r+=1,t=t||0;var s=r;return o[s]={fn:e,args:a},n.postMessage({command:"setTimeout",id:s,timeout:t}),s},t.clearTimeout=function(e){n.postMessage({command:"clearTimeout",id:e}),delete o[e]},t.setInterval=function(e,t){var a=Array.prototype.slice.call(arguments,2);r+=1,t=t||0;var o=r;return s[o]={fn:e,args:a},n.postMessage({command:"setInterval",id:o,timeout:t}),o},t.clearInterval=function(e){n.postMessage({command:"clearInterval",id:e}),delete s[e]},i.src=e,t.document.body.appendChild(i)};
},{}]},{},[1])(1)
});