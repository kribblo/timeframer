module.exports = function(frameSrc, window) {

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
};
