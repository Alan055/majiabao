/**
 * @file generate skeleton
 * @author panyuqi <panyuqi@baidu.com>
 */

/* eslint-disable no-console, fecs-no-require */

var ssr = require('./ssr');
var ref = require('./util');
var insertAt = ref.insertAt;
var isObject = ref.isObject;
var isFunction = ref.isFunction;
var generateRouterScript = ref.generateRouterScript;

var DEFAULT_PLUGIN_OPTIONS = {
    webpackConfig: {},
    insertAfter: '<div id="app">',
    quiet: false
};

var DEFAULT_ENTRY_NAME = 'main';

var PLUGIN_NAME = 'VueSkeletonWebpackPlugin';

var SkeletonPlugin = function SkeletonPlugin(options) {
    if ( options === void 0 ) options = {};

    this.options = Object.assign({}, DEFAULT_PLUGIN_OPTIONS, options);
};

SkeletonPlugin.prototype.apply = function apply (compiler) {
        var this$1 = this;

    var skeletons;
    // compatible with webpack 4.x
    if (compiler.hooks) {
        compiler.hooks.make.tapAsync(PLUGIN_NAME, function (compilation, cb) {
            if (!compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing) {
                console.error('VueSkeletonWebpackPlugin must be placed after HtmlWebpackPlugin in `plugins`.');
                return;
            }

            this$1.generateSkeletonForEntries(this$1.extractEntries(compiler.options.entry), compiler, compilation)
                .then(function (skeletonResults) {
                    skeletons = skeletonResults.reduce(function (cur, prev) { return Object.assign(prev, cur); }, {});
                    cb();
                })
                .catch(function (e) { return console.log(e); });

            compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync(PLUGIN_NAME, function (htmlPluginData, callback) {
                this$1.injectToHtml(htmlPluginData, skeletons);
                callback(null, htmlPluginData);
            });
        });
    }
    else {
        compiler.plugin('make', function (compilation, cb) {
            this$1.generateSkeletonForEntries(this$1.extractEntries(compiler.options.entry), compiler, compilation)
                .then(function (skeletonResults) {
                    skeletons = skeletonResults.reduce(function (cur, prev) { return Object.assign(prev, cur); }, {});
                    cb();
                })
                .catch(function (e) { return console.log(e); });
                
            compilation.plugin('html-webpack-plugin-before-html-processing', function (htmlPluginData, callback) {
                this$1.injectToHtml(htmlPluginData, skeletons);
                callback(null, htmlPluginData);
            });
        });
    }
};

/**
 * format entries for all skeletons from options
 * 
 * @param {Object} parentEntry entry in webpack.config
 * @return {Object} entries entries for all skeletons
 */
SkeletonPlugin.prototype.extractEntries = function extractEntries (parentEntry) {
    var entry = Object.assign({}, this.options.webpackConfig.entry);
    var skeletonEntries;

    if (isObject(entry)) {
        skeletonEntries = entry;
    }
    else {
        var entryName = DEFAULT_ENTRY_NAME;

        if (isObject(parentEntry)) {
            entryName = Object.keys(parentEntry)[0];
        }
        skeletonEntries = {};
            skeletonEntries[entryName] = entry;
    }

    return skeletonEntries;
};

/**
 * find skeleton for current html-plugin in all skeletons
 * 
 * @param {Object} htmlPluginData data for html-plugin
 * @param {Object} skeletons skeletons
 * @param {Object} target skeleton
 */
SkeletonPlugin.prototype.findSkeleton = function findSkeleton (htmlPluginData, skeletons) {
        if ( skeletons === void 0 ) skeletons = {};

    var usedChunks = Object.keys(htmlPluginData.assets.chunks);
    var entryKey;

    // find current processing entry
    if (Array.isArray(usedChunks)) {
        entryKey = Object.keys(skeletons).find(function (v) { return usedChunks.indexOf(v) > -1; });
    }
    else {
        entryKey = DEFAULT_ENTRY_NAME;
    }

    return {
        name: entryKey,
        skeleton: skeletons[entryKey]
    };
};

/**
 * inject HTML, CSS and JS
 * 
 * @param {Object} htmlPluginData data for html-plugin
 * @param {Object} skeletons skeletons
 */
SkeletonPlugin.prototype.injectToHtml = function injectToHtml (htmlPluginData, skeletons) {
        if ( skeletons === void 0 ) skeletons = {};

    var ref = this.options;
        var insertAfter = ref.insertAfter;
    var ref$1 = this.findSkeleton(htmlPluginData, skeletons);
        var name = ref$1.name;
        var skeleton = ref$1.skeleton;
    if (!skeleton) {
        //console.log('Empty entry for skeleton, please check your webpack.config.');
        return;
    }
    var html = skeleton.html; if ( html === void 0 ) html = '';
        var css = skeleton.css; if ( css === void 0 ) css = '';
        var script = skeleton.script; if ( script === void 0 ) script = '';
        
    // insert inlined styles into html
    var headTagEndPos = htmlPluginData.html.lastIndexOf('</head>');
    htmlPluginData.html = insertAt(htmlPluginData.html, ("<style>" + css + "</style>"), headTagEndPos);

    // replace mounted point with ssr result in html
    if (isFunction(insertAfter)) {
        insertAfter = insertAfter(name);
    }
    var appPos = htmlPluginData.html.lastIndexOf(insertAfter) + insertAfter.length;
    htmlPluginData.html = insertAt(htmlPluginData.html, html + script, appPos);
};

/**
 * generate skeletons for all entries
 * 
 * @param {Object} entries entries for all skeletons
 * @param {Object} compiler compiler
 * @param {Object} compilation compilation
 * @return {Promise} promise
 */
SkeletonPlugin.prototype.generateSkeletonForEntries = function generateSkeletonForEntries (entries, compiler, compilation) {
        var this$1 = this;

    var ref = this.options;
        var router = ref.router;
        var minimize = ref.minimize;
        var quiet = ref.quiet;

    return Promise.all(Object.keys(entries).map(function (entryKey) {
        var skeletonWebpackConfig = Object.assign({}, this$1.options.webpackConfig);

        // set current entry & output in webpack config
        skeletonWebpackConfig.entry = entries[entryKey];
        if (!skeletonWebpackConfig.output) {
            skeletonWebpackConfig.output = {};
        }
        skeletonWebpackConfig.output.filename = "skeleton-" + entryKey + ".js";

        // inject router code in SPA mode
        var routerScript = '';
        if (router) {
            var isMPA = !!(Object.keys(entries).length > 1);
            routerScript = generateRouterScript(router, minimize, isMPA, entryKey);
        }

        // server side render skeleton for current entry
        return ssr(skeletonWebpackConfig, {
            quiet: quiet, compilation: compilation, context: compiler.context
        }).then(function (ref) {
                var skeletonHTML = ref.skeletonHTML;
                var skeletonCSS = ref.skeletonCSS;

            return ( obj = {}, obj[entryKey] = {
                    html: skeletonHTML,
                    css: skeletonCSS,
                    script: routerScript
                }, obj );
                var obj;
        });
    }));
};

SkeletonPlugin.loader = function loader (ruleOptions) {
        if ( ruleOptions === void 0 ) ruleOptions = {};

    console.log('[DEPRECATED] SkeletonPlugin.loader is DEPRECATED now. Hot reload in dev mode is supported already, so you can remove this option.');
    return Object.assign(ruleOptions, {
        loader: require.resolve('./loader'),
        options: Object.assign({}, ruleOptions.options)
    });
};

module.exports = SkeletonPlugin;
