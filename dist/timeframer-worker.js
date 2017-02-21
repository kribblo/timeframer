var timerIds = {};
var timeoutWorker = {};

timeoutWorker.setInterval = function(args) {
    timerIds[args.id] = setInterval(function() {
        postMessage({id: args.id});
    }, args.timeout);
};

timeoutWorker.clearInterval = function(args) {
    clearInterval(timerIds[args.id]);
};

timeoutWorker.setTimeout = function(args) {
    timerIds[args.id] = setTimeout(function() {
        postMessage({id: args.id});
    }, args.timeout);
};

timeoutWorker.clearTimeout = function(args) {
    clearTimeout(timerIds[args.id]);
};

onmessage = function(e) {
    var command = e.data.command;
    timeoutWorker[command](e.data)
};
