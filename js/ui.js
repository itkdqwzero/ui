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
        loading: true
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
ui.require = function (keys, fn) {
    keys = typeof keys == 'string' ? keys.split(',') : keys;
    fn = !fn ? function () { } : fn;
    ui.require.g = !ui.require.g ? {} : ui.require.g;
    //
    var _keys = keys.join('');
    if (ui.require.g[_keys] === true) {
        return fn();
    };
    if (!ui.require.g[_keys]) {
        ui.require.g[_keys] = [fn];
    } else {
        ui.require.g[_keys].push(fn);
    };
    for (var i = 0, ii = keys.length; i < ii; i++) {
        ui.require.key(keys[i], keys);
    }
};
ui.require.key = function (key, keys) {
    if (this.config[key] === true) {
        this.fn(key, keys);
    } else if (this.config[key].finished && this.config[key].finished <= this.config[key].length) {
        setTimeout(function () {
            ui.require.key(key, keys);
        }, 500);
    } else {
        //
        ui.ajax.loading(true, true);
        //
        this.config[key].finished = 0;
        for (var i = 0, ii = this.config[key].length; i < ii; i++) {
            var url = ui.require.config[key][i];
            if (url.indexOf('.css') != -1) {
                this.css(url, key, keys);
            };
            if (url.indexOf('.js') != -1) {
                this.js(url, key, keys);
            };
        }
    };
};
ui.require.css = function (url, key, keys) {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.onload = function () {
        ui.require.fn(key, keys);
    };
    head.appendChild(link);
    //
    this.config[key].finished++;
};
ui.require.js = function (url, key, keys) {
    $.ajax({
        type: "GET",
        url: url,
        dataType: "script",
        cache: true,
        async: true,
        success: function () {
            ui.require.config[key].finished++;
            ui.require.fn(key, keys);
        }
    });
};
ui.require.fn = function (key, keys) {
    if (!key || this.config[key].finished < this.config[key].length) {
        return false;
    };
    this.config[key] = true;
    //
    var finished = true;
    for (var i = 0, ii = keys.length; i < ii; i++) {
        key = keys[i];
        if (this.config[key] !== true) {
            finished = false;
        };
    };
    if (finished === true) {
        ui.ajax.loading(true, false);
        //
        var _keys = keys.join('');
        if (this.g[_keys].length) {
            for (var i = 0, ii = this.g[_keys].length; i < ii; i++) {
                this.g[_keys][i]();
            };
            this.g[_keys] = true;
        }
    }
};
ui.require.config = {};
