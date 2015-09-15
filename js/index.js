//开发者模式，分模块加载的顺序有要求
//发布时可以将以下文件打包，打包的先后顺序不做要求
$(function () {
    var uncompressed = [
    //核心功能
        'js/core/is.ui.js',
        'js/core/require.ui.js',
    //基础工具
        'js/core/array.ui.js',
        'js/core/cookie.ui.js',
        'js/core/json.ui.js',
        'js/core/location.ui.js',
        'js/core/number.ui.js',
        'js/core/string.ui.js',
        'js/core/time.ui.js',
    //jQuery扩展
        'js/core/ajax.ui.js'
    ];
    for (var i in uncompressed) {
        var script = document.createElement('script');
        script.src = uncompressed[i];
        script.type = 'text/javascript';
        script.onload = function () {
            $('#J_load_c').append('load ' + this.src + ' <label class="cGreen">success</label><br>');
        };
        document.head.appendChild(script);
    }
    //
    setTimeout(load_test,1000);

});

/**------------------------------------
/*
/*功能测试
/*
*/
function load_test() {
    var testjs = [
    //核心功能
      'js/test/is.ui.js',
    //'js/test/require.ui.js',
    //基础工具
    //'js/test/array.ui.js',
    //'js/test/cookie.ui.js',
    //'js/test/json.ui.js',
    //'js/test/location.ui.js',
    //'js/test/number.ui.js',
    //'js/test/string.ui.js',
    //'js/test/time.ui.js',
    //jQuery扩展
    //'js/test/ajax.ui.js'        
    ];
    for (var i in testjs) {
        var script = document.createElement('script');
        script.src = testjs[i];
        script.type = 'text/javascript';
        document.head.appendChild(script);
    }
}