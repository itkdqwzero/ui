(function () {
    //
    var data = function () {
        return [
            'abc',
            11,
            new Date(),
            document.createElement('div'),
            [1, 2, 3],
            {},
            function () { },
            false,
            null,
            undefined,
            '',
            NaN
        ];
    };
    var _data = data();
    var run = function (name) {
        var rt = [];
        for (var i in _data) {
            rt.push(ui[name](_data[i]));
        };
        return '<label class="dib w50 tc">' + rt.join('</label>,<label class="dib w50 tc">') + '</label>';
    };
    var runEqual = function () {
        var rt = [];
        for (var i in _data) {
            var row = [];
            for (var k in _data) {
                row.push(ui.isEqual(_data[i], _data[k]));
            };
            var rowStr = '<label class="dib w50 tc">' + row.join('</label>,<label class="dib w50 tc">') + '</label>';
            rt.push(rowStr);
        }
        return '<div><span class="dib w150 tr">&nbsp;</span>[' + rt.join(']</div><div><span class="dib w150 tr">&nbsp;</span>[') + ']</div>';
    };
    //
    var html = [
    '<div class="f-h4 cGreen">测试is.ui.js</div>',
    '<div class="f13 lh20">',
    '<div>var data=<b>', data.valueOf().toString().replace(/\s/g, '').replace('function(){return', '').replace(';}', '').split(',').join(', '), ';</b></div>',
    '<div>run data[i]</div>',
    '<div><span class="dib w150 tr">ui.isFunction() --> </span>[', run('isFunction'), ']</div>',
    '<div><span class="dib w150 tr">ui.isString() --> </span>[', run('isString'), ']</div>',
    '<div><span class="dib w150 tr">ui.isNumber() --> </span>[', run('isNumber'), ']</div>',
    '<div><span class="dib w150 tr">ui.isDate() --> </span>[', run('isDate'), ']</div>',
    '<div><span class="dib w150 tr">ui.isElement() --> </span>[', run('isElement'), ']</div>',
    '<div><span class="dib w150 tr">ui.isArray() --> </span>[', run('isArray'), ']</div>',
    '<div><span class="dib w150 tr">ui.isObject() --> </span>[', run('isObject'), ']</div>',
    '<div><span class="dib w150 tr">ui.isJson() --> </span>[', run('isJson'), ']</div>',
    '<div><span class="dib w150 tr">ui.isFinite() --> </span>[', run('isFinite'), ']</div>',
    '<div><span class="dib w150 tr">ui.isNaN() --> </span>[', run('isNaN'), ']</div>',
    '<div><span class="dib w150 tr">ui.isBoolean() --> </span>[', run('isBoolean'), ']</div>',
    '<div><span class="dib w150 tr">ui.isNull() --> </span>[', run('isNull'), ']</div>',
    '<div><span class="dib w150 tr">ui.isEmpty() --> </span>[', run('isEmpty'), ']</div>',
    '<div>ui.isEqual() 两组data建立横轴和纵轴，进行队列全等比较 --> </div>',
    runEqual(),
    '</div>'
    ].join('').replace(/true/g,'<b class="cGreen">true</b>');
    $('#J_test_c').append(html);
})()