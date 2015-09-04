/**
* ui.js是一套javascript工具库，目的是为了编写程序更为高效
* 部分功能基于jQuery扩展，因此依赖于jQuery，但不受jQuery版本影响
* 部分函数功能名称参考Underscore，但不依赖Underscore
* 核心功能ui.require()，不同于requireJS，
*   可直接不重复地加载插件，含js和css文件，加载成功后执行回调函数，插件变量全局通用
*/
var ui = function () { };
ui.version = '1.0';
ui.config = {};
//
//开发者模式，发布时可以将以下文件打包在一起（先后顺序不做要求）
$(function () {
    var uncompressed = [
    //核心功能
        'js/core/ajax.ui.js',
        'js/core/require.ui.js',
    //基础工具
        'js/core/array.ui.js',
        'js/core/cookie.ui.js',
        'js/core/json.ui.js',
        'js/core/location.ui.js',
        'js/core/number.ui.js',
        'js/core/string.ui.js',
        'js/core/time.ui.js'
    ];
    for (var i in uncompressed) {
        var script = document.createElement('script');
        script.src = uncompressed[i];
        script.type = 'text/javascript';
        script.onload = function () {
            console.log('load ' + this.src + ' success');
        };
        document.head.appendChild(script);
    }
});