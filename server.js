var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.dev');
var proxy = require('http-proxy-middleware');

var app = express();
var compiler = webpack(config);

var port = 3000;

var options = {
    target: 'http://manager.alexeys.leads', // target host
    changeOrigin: true,               // needed for virtual hosted sites
};

var exampleProxy = proxy(options);

// Step 2: Attach the dev middleware to the compiler & the server
app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true, publicPath: config.output.publicPath
}));

// Step 3: Attach the hot middleware to the compiler & the server
app.use(require("webpack-hot-middleware")(compiler, {
    log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
}));

// Do anything you like with the rest of your express application.

app.get("/", function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

/**
 * Anything in public can be accessed statically without
 * this express router getting involved
 */

app.use(express.static(path.join(__dirname, 'public'), {
    dotfiles: 'ignore',
    index: false
}));

app.get("/multientry", function(req, res) {
    res.sendFile(__dirname + '/index-multientry.html');
});

app.use('/reports', exampleProxy);
app.use('/assets', exampleProxy);

app.listen(port, function onAppListening(err) {
    if (err) {
        console.error(err);
    } else {
        console.info('==> 🚧  Webpack development server listening on port %s', port);
    }
});