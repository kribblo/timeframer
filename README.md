# timeframer

`setTimeout` and `setInterval` that keeps on ticking when a tab is in the background (they're otherwise throttled). Use with care and only when there's a good use-case.

It works by creating an invisible iframe with a WebWorker that does the actual timers and update ticks via a MessageChannel. This is just a way to make it real simple to avoid cross-domain issues, the iframe and the worker is hosted on the same origin. If you can host your own worker on your own domain, that's much easier. 

All this trickery is due to the Microsoft browsers, all others make do fine with Blob URL's.

This is an initial proof-of-concept.

## Usage

### Include in webpage

From a webpage, make a `<script>` tag with `src` pointing to `timeframer.js` where it and `timeframer.html` is hosted.

For instance, it is hosted on GitHub pages at <https://kribblo.github.io/timeframer/timeframer.js>, example:

```html
<script src="https://kribblo.github.io/timeframer/timeframer.js"></script>
```

**Note:** this will overwrite the regular `window.setTimeout` and `window.setInterval` so all of them will run all the time in the background.

For a more subtle approach, `src/timeframer.js` can be included as a module and return another object containing the methods.

## TODO

* npm + usage
* test case/example

## Development

### Update dist

    npm install
    npm run build

### Publish to gh-pages

    npm run www
    