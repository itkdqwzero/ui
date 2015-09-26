/**
* ui.js是一套javascript工具库，目的是为了编写程序更为高效
* 部分功能基于jQuery扩展，因此依赖于jQuery，但不受jQuery版本影响
* 部分函数功能及名称参考underscoreJS，但不依赖underscoreJS
* 核心功能ui.require()，不同于requireJS，
*   可直接不重复地加载插件，含js和css文件，加载成功后执行回调函数，加载后的插件全局变量通用
*/
var ui = function () { };
ui.version = '1.0';

//发布时可以将以下文件打包，打包的先后顺序不做要求
//
//    //核心功能
//    'js/core/require.ui.js',

//    //基础工具
//    'js/core/is.ui.js',
//    'js/core/array.ui.js',
//    'js/core/cookie.ui.js',
//    'js/core/json.ui.js',
//    'js/core/location.ui.js',
//    'js/core/number.ui.js',
//    'js/core/string.ui.js',
//    'js/core/time.ui.js',

//    //jQuery扩展
//    'js/core/ajax.ui.js'        
//
