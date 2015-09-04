/**
* ajax 基于$.ajax 设计
* 主要简化了函数的调用书写格式，并固定了主要参数的位置
* url,success,type,data,datatype与$.ajax一致
*   同时扩展了data参数可为#formID，表示提交整个form表单
*   默认url='';success=function(){};type='POST';data={};datatype='json';
* 参数 args 的格式为Object {}，可延伸配置$.ajax在上面没有列明的其他参数，同时扩展了cache和loading这两个与ajax关联密切的辅助功能
*   async: true, contentType: "application/x-www-form-urlencoded;",
*   cache:{ "key":String, "minute":Number } 本次请求的数据为value，指定存储名key，指定过期时间minute，存储为ui.ajax.cache[key]=value
*   loading:false 需要时是#ID,意图是在ajax请求过程中的“开始和结束”，“显示和隐藏”#ID这个div遮罩层（已存在的html），以达到loading的效果
*/
ui.ajax = function (url, success, type, data, datatype, args) {
    //
    type = !type ? 'POST' : type;
    //
    data = !data ? {} : typeof data == 'string' ? $(data).serializeArray() : data;
    var _data = {};
    $.each(data, function (k, v) {
        if (v && v.name != undefined) {
            k = v.name;
            v = v.value;
        };
        if (k.indexOf('[]') != -1) {
            if (_data[k] == undefined) {
                _data[k] = [];
            };
            _data[k].push(v);
        } else {
            _data[k] = v;
        };
    });
    data = _data;
    //
    datatype = !datatype ? 'json' : datatype;
    //
    var g = {
        async: true,
        contentType: 'application/x-www-form-urlencoded;',
        cache: {
            key: '',
            minute: 5
        },
        loading: false
    }
    $.extend(g, args);
    if (g.cache.key) {
        ui.ajax.cache = !ui.ajax.cache ? {} : ui.ajax.cache;
        //
        if (ui.ajax.cache[g.cache.key]) {
            var now = new Date().getTime();
            var future = parseInt(ui.ajax.cache[g.cache.key].time) + 60 * 1000 * g.cache.minute;
            if (future > now) {
                return success(ui.ajax.cache[g.cache.key]);
            };
        };
    };
    //
    if (g.loading) { ui.ajax.loading(g.loading, true); };
    //
    $.ajax({
        type: type,
        url: url,
        data: data,
        dataType: datatype,
        async: g.async,
        contentType: g.contentType,
        success: function (data) {
            //
            if (g.loading) { ui.ajax.loading(g.loading, false); };
            //
            if (g.cache.key) {
                ui.ajax.cache[g.cachekey] = function () { return data; };
                ui.ajax.cache[g.cachekey].prototype.time = new Date().getTime();
            }
            return success(data);
        },
        error: function (a, b, c) {
            if (console) {
                console.log("ui ajax error: url'" + url + "'");
                console.log(a);
                console.log(b);
                console.log(c);
            };
        }
    });
};
ui.ajax.loading = function (target, show) {
    target = target === true ? $('#J_ui_ajax_loading') : $(target);
    if (!target.length) { return false; };
    //
    var queue = target.data('queue');
    if (show) {
        queue = !queue ? 1 : queue + 1;
        target.stop().fadeIn();
    } else {
        queue = queue - 1;
        if (queue == 0) {
            target.stop().fadeOut();
        }
    }
    target.data('queue', queue);
};
