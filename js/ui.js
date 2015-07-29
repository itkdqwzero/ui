/* partial ui function is based on jQuery */
ui = function () { };
ui.ajax = function (url, fn, type, data, datatype, args) {
    //
    type = !type ? 'POST' : type;
    //
    data = !data ? {} : data;
    data = data.indexOf('#') != -1 ? $(data).serializeArray() : data;
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
        contentType: "application/x-www-form-urlencoded;",
        cache: {
            key: '',
            minute: 5
        },
        loading: '#J_ui_ajax_loading'
    }
    $.extend(g, args);
    if (g.cache.key) {
        ui.ajax.cache = !ui.ajax.cache ? {} : ui.ajax.cache;
        //
        if (ui.ajax.cache[g.cache.key]) {
            var now = new Date().getTime();
            var future = parseInt(ui.ajax.cache[g.cache.key].time) + 60 * 1000 * g.cache.minute;
            if (future > now) {
                return fn(ui.ajax.cache[g.cache.key]);
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
            return fn(data);
        },
        error: function (a, b, c) {
            if (console) {
                console.log('ui ajax interface error on : ' + url);
                console.log(a);
                console.log(b);
                console.log(c);
            };
        }
    });
};
ui.ajax.loading = function (target, show) {
    var target = $(target);
    if (target.length == 0) { return false; };
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