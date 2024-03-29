module.exports = function(frameSrc, global) {

    global = global || {};
    global.document = global.document || document;

    var channel = new MessageChannel();
    var worker = channel.port1;

    var timeoutId = 0;
    var timeouts = {};
    var intervals = {};

    var timeframe = document.createElement('iframe');
    timeframe.setAttribute('frameBorder', '0');
    timeframe.style.width = 0;
    timeframe.style.height = 0;

    timeframe.onload = function() {
        timeframe.contentWindow.postMessage('TIMEFRAMER', '*', [channel.port2]);
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

    global.setTimeout = function(fn, delay) {
        var args = Array.prototype.slice.call(arguments, 2);
        timeoutId += 1;
        delay = delay || 0;
        var id = timeoutId;
        timeouts[id] = {fn: fn, args: args};
        worker.postMessage({command: 'setTimeout', id: id, timeout: delay});
        return id;
    };

    global.clearTimeout = function(id) {
        worker.postMessage({command: 'clearTimeout', id: id});
        delete timeouts[id];
    };

    global.setInterval = function(fn, delay) {
        var args = Array.prototype.slice.call(arguments, 2);
        timeoutId += 1;
        delay = delay || 0;
        var id = timeoutId;
        intervals[id] = {fn: fn, args: args};
        worker.postMessage({command: 'setInterval', id: id, timeout: delay});
        return id;
    };

    global.clearInterval = function(id) {
        worker.postMessage({command: 'clearInterval', id: id});
        delete intervals[id];
    };

    timeframe.src = frameSrc;

    global.document.body.appendChild(timeframe);

    return global;
};
