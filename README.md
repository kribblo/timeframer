# timeframer

`setTimeout` and `setInterval` that keeps on ticking when a tab is in the background (they're otherwise throttled). Use with care and only when there's a good use-case.

It works by creating an invisible iframe with a WebWorker that does the actual timers and update ticks via a MessageChannel. This is just a way to make it real simple to avoid cross-domain issues, the iframe and the worker is hosted on the same origin. If you can host your own worker on your own domain, that's much easier. 

All this trickery is due to the Microsoft browsers, all others make do fine with Blob URL's.

This is an initial proof-of-concept.

## Usage

### Include in webpage

From a webpage, make a `<script>` tag with `src` pointing to `timeframer.js` where it and `timeframer.html` is hosted.

`setTimeout`, `clearTimeout`, `setInterval` and `clearInterval` will all be available on the global `window.timeframer`.

You can host it yourself (the `dist` folder), and it's also hosted on GitHub pages at <https://kribblo.github.io/timeframer/timeframer.js>, example:

```html
<script src="https://kribblo.github.io/timeframer/timeframer.js"></script>
<script>
    let i = 1;
    let interval = timeframer.setInterval(function() {
        console.log('Interval', i++)
    }, 500)
    timeframer.setTimeout(function() {
        timeframer.clearInterval(interval)
    }, 1600);
</script>
```

### Override window.setTimeout and friends

```javascript
window.setTimeout = timeframer.setTimeout;
window.setInterval = timeframer.setInterval;
window.clearTimeout = timeframer.clearTimeout;
window.clearInterval = timeframer.clearInterval;
```

Use caution. If you do this, all timers and intervals in the page will run at full speed in the background, this should only be used where it is needed.

## TODO

* test case/example page

## Development

### Update dist

    npm install
    npm run build

### Publish to gh-pages

    npm run www
    