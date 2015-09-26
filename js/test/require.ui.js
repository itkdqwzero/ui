(function () {
    //
    ui.config = {
        "is": "js/test/is.ui.js",
        "array": ["js/test/array.ui.js"],
        "json": ["js/test/json.ui.js"],
        "cookie": ["js/test/cookie.ui.js"],
        "location": ["js/test/location.ui.js"],
        "number": ["js/test/number.ui.js"],
        "string": ["js/test/string.ui.js"],
        "time": ["js/test/time.ui.js"],
        "array_json": ["js/test/array.ui.js", "js/test/json.ui.js"],
        "array_json_cookie": ["js/test/array.ui.js", "js/test/json.ui.js", "js/test/cookie.ui.js"],
        "location_number_string_time": ["js/test/location.ui.js", "js/test/number.ui.js", "js/test/string.ui.js", "js/test/time.ui.js"],
        "ajax": ["js/test/ajax.ui.js"],
        "dialog": ["js/test/dialog.ui.js"],
        "mask": ["js/test/mask.ui.js"]
    };
    //
    var html = [
    '<div class="f-h4 cGreen m20-t">测试require.ui.js</div>',
    '<div class="f13 lh20">',
        '<div>require加载的方式是script、link标签的原生方式</div>',
        '<div>下面例子将加载后续的测试文件,含js/css文件</div>',
        '<div>首先需要先配置 ui.config，这个是require按需加载的配置列表</div>',
        '<div class="lh20" id="J_require_c">',
            'ui.config = {\n',
                '<pre class="p30-l">',
                    '"is": "js/test/is.ui.js",\n',
                    '"array": ["js/test/array.ui.js"],\n',
                    '"json": ["js/test/json.ui.js"],\n',
                    '"cookie": ["js/test/cookie.ui.js"],\n',
                    '"location": ["js/test/location.ui.js"],\n',
                    '"number": ["js/test/number.ui.js"],\n',
                    '"string": ["js/test/string.ui.js"],\n',
                    '"time": ["js/test/time.ui.js"],\n',
                    '"array_json": ["js/test/array.ui.js", "js/test/json.ui.js"],\n',
                    '"array_json_cookie": ["js/test/array.ui.js", "js/test/json.ui.js", "js/test/cookie.ui.js"],\n',
                    '"ui_plugin_test": ["js/test/dialog.ui.js","js/test/mask.ui.js"],\n',
                '</pre>',
            '};',
        '</div>',
        '<div>配置子项一般是数组格式，只有一个文件的时候也可以写成字符串格式，例如第一个情况加载test/is.ui.js</div>',
        '<div>每个子项的键名是对应一个独立功能的名称，调用时只认键名，例如即使配置了"array_json",如何没有单独配置"array"或"json"，调用ui.require("array");或ui.require("json");会报错！;</div>',
        '<div>但是多个调用时，键名会按顺序用下划线 _ 连接，所以调用ui.require("array json");或者ui.require(["array","json"]);等同于ui.require("array_json");</div>',
        '<div>已被加载的文件不会被二次加载，也就不会二次自动执行，需要触发的函数可以写在回调函数里触发</div>',
        '<div>例如ui.config中test/array.ui.js配置3次，test/json.ui.js配置3次，但它们都会被只加载一次</div>',
        '<div>同理对css文件也是一样，具体代码在test/dialog.ui.js 和 test/mask.ui.js中体现，那边会新增ui.config的配置，并调用ui.require()</div>',
        '<div>开始调用，使用方式：<b>ui.require(keys,fn);</b>加载指定keys的插件组合，keys为Array，亦可为String用空格隔开，也可以传进新的配置对象Json去请求</div>',
        '<div>fn为require成功后的回调函数，可选项</div>',
        '<div class="fb">单个调用：</div>',
        '<div>',
            '<pre>',
                'ui.require("is", function () {\n',
                    '<pre class="p30-l">console.log(\'require "is" success -- string\');\n</pre>',
                '});',
            '</pre>',
        '</div>',
        '<div class="fb">多个调用：</div>',
        '<div>',
            '<pre>',
                'ui.require(["array","json"], function () {\n',
                    '<pre class="p30-l">console.log(\'require ["array", "json"] success -- array\');\n</pre>',
                '});',
            '</pre>',
        '</div>',
        '<div class="fb">或</div>',
        '<div>',
            '<pre>',
                'ui.require("array json cookie", function () {\n',
                    '<pre class="p30-l">console.log(\'require "array json cookie" success -- string\');\n</pre>',
                '});',
            '</pre>',
        '</div>',
        '<div>',
            '<pre>',
                'ui.require("array_json_cookie", function () {\n',
                    '<pre class="p30-l">console.log(\'require "array_json_cookie" success -- string\');\n</pre>',
                '});',
            '</pre>',
        '</div>',
        '<div class="fb">新增配置调用：</div>',
        '<div>',
            '<pre>',
                'ui.require({\n',
                '<pre class="p30-l">',
                '"location": "js/test/location.ui.js",\n',
                '"number": "js/test/number.ui.js",\n',
                '"string": "js/test/string.ui.js",\n',
                '"time": "js/test/time.ui.js"\n',
                '</pre>',
                '}, function () {\n',
                    '<pre class="p30-l">console.log(\'rrequire new config success -- json\');\n</pre>',
                '});',
            '</pre>',
        '</div>',
    '</div>'
    ].join('').replace(/true/g, '<b class="cGreen">true</b>');
    $('#J_test_c').append(html);
    //
    ui.require("is", function () {
        console.log('require "is" success -- string');
    });
    //
    ui.require(["array", "json"], function () {
        console.log('require ["array", "json"] success -- array');
    });
    //
    ui.require("array json cookie", function () {
        console.log('require "array json cookie" success -- string');
    });
    ui.require("array_json_cookie", function () {
        console.log('require "array_json_cookie" success -- string');
    });
    //
    ui.require({ "location": "js/test/location.ui.js", "number": "js/test/number.ui.js", "string": "js/test/string.ui.js", "time": "js/test/time.ui.js" }, function () {
        console.log('require new config success -- json');
    });
})()