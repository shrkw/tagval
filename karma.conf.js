module.exports = function(config) {
    config.set({
        files: [
            "tagval.coffee",
            "test/*.coffee"
        ],
        frameworks: ["jasmine"],
        browsers: ["PhantomJS"],
        port: 9877,
        preprocessors: {
            '**/*.coffee': 'coffee'
        }
    });
};
