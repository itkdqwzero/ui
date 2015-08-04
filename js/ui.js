/* ui plugin based on jQuery */
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
ui.config = {};
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
        ui.require._key(keys[i], keys);
    }
};
ui.require._key = function (key, keys) {
    if (ui.config[key] === true) {
        this.fn(key, keys);
    } else if (ui.config[key].finished && ui.config[key].finished <= ui.config[key].length) {
        setTimeout(function () {
            ui.require._key(key, keys);
        }, 500);
    } else {
        //
        ui.ajax.loading(true, true);
        //
        ui.config[key].finished = 0;
        for (var i = 0, ii = ui.config[key].length; i < ii; i++) {
            var url = ui.config[key][i];
            if (url.indexOf('.css') != -1) {
                this._css(url, key, keys);
            };
            if (url.indexOf('.js') != -1) {
                this._js(url, key, keys);
            };
        }
    };
};
ui.require._css = function (url, key, keys) {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.onload = function () {
        ui.require._fn(key, keys);
    };
    head.appendChild(link);
    //
    ui.config[key].finished++;
};
ui.require._js = function (url, key, keys) {
    $.ajax({
        type: "GET",
        url: url,
        dataType: "script",
        cache: true,
        async: true,
        success: function () {
            ui.config[key].finished++;
            ui.require._fn(key, keys);
        }
    });
};
ui.require._fn = function (key, keys) {
    if (!key || ui.config[key].finished < ui.config[key].length) {
        return false;
    };
    ui.config[key] = true;
    //
    var finished = true;
    for (var i = 0, ii = keys.length; i < ii; i++) {
        key = keys[i];
        if (ui.config[key] !== true) {
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
//
ui.array = {
    del_val: function (val, arr) {
        var rt = [];
        for (var i in arr) {
            if (arr[i] != val) {
                rt.push(arr[i]);
            };
        };
        return rt;
    },
    del_kv: function (kv, arr) {
        var rt = [];
        for (var i in arr) {
            var b = true;
            for (var k in kv) {
                var tmp = { k: kv[k] };
                if (ui.json.is_in(tmp, arr[i]) == -1) {
                    b = false;
                };
            };
            if (b) {
                continue;
            };
            rt.push(arr[i]);
        };
        return rt;
    },
    del_duplicate: function (arr) {
        for (var k in arr) {
            for (var i = k + 1, ii = arr.length; i < ii; i++) {
                if (arr[i] === arr[k]) {
                    arr.splice(i, 1);
                    i--;
                    ii--;
                };
            };
        };
        return arr;
    },
    get_kv: function (kv, arr) {
        return ui.array.get_ones(kv, arr)[0];
    },
    get_ones: function (kv, arr) {
        var rt = [];
        for (var i in arr) {
            var b = true;
            for (var k in kv) {
                var tmp = { k: kv[k] };
                if (ui.json.is_in(tmp, arr[i]) == -1) {
                    b = false;
                };
            };
            if (b) {
                rt.push(arr[i]);
            }
        };
        return rt;
    },
    get_index: function (val, arr) {
        for (var i in arr) {
            if (arr[i] == val) {
                return i;
            };
        };
        return -1;
    },
    is_in: function (val, arr) {
        return ui.array.get_index(val, arr) == -1 ? false : true;
    },
    split_str: function (str) {
        str = str.replace(/\s*/g, '');
        var rt = [];
        for (var i = 0, ii = str.length; i < ii; i++) {
            rt[i] = str.charAt(i);
        };
        return rt;
    }
};
ui.cookie = {
    get: function (name) {
        if (document.cookie.length > 0) {
            var start = document.cookie.lastIndexOf(name + "=");
            if (start != -1) {
                start = start + name.length + 1;
                var end = document.cookie.indexOf(";", start);
                if (end == -1) { end = document.cookie.length; };
                return decodeURI(document.cookie.substring(start, end));
            };
        };
        return "";
    },
    set: function (name, value, days) {
        var d = new Date();
        d.setTime(d.getTime() + 1000 * 60 * 60 * 24 * days);
        document.cookie = name + "=" + encodeURI(value) + ((days == null) ? "" : ";expires=" + d.toGMTString()) + ";path=/";
    },
    del: function (name) {
        var d = new Date();
        d.setTime(t.getTime() - 1);
        var v = this.get(name);
        document.cookie = name + "=" + v + ";expires=" + d.toGMTString() + ";path=/";
    }
};
ui.json = {
    get_one: function (kv, json) {
        for (var k in kv) {
            for (var i in json) {
                if (k == i && kv[k] == json[i]) {
                    return k;
                };
            };
        };
        return {};
    },
    is_in: function (kv, json) {
        return !ui.json.get_one(kv, json) ? false : true;
    },
    join_val: function (json, join) {
        if (!json) {
            return '';
        };
        join = !join ? ',' : join;
        var rt = [];
        for (var i in json) {
            if (json[i] == '') { continue; }
            rt.push(json[i]);
        };
        return rt.join(join);
    },
    parse: function (str) {
        if (typeof str == 'object') {
            return str;
        };
        var json = $.parseJSON(str);
        for (var k in json) {
            if (typeof json[k] == 'string' && json[k].indexOf('{') != -1 && json[k].indexOf('}') != -1) {
                var val = $.parseJSON(json[k]);
                if (val != json[k]) {
                    json[k] = ui.json.parse(json[k]);
                };
            };
        };
        return json;
    }
};
ui.location = {
    search: function (str) {
        var search = !str ? window.location.search : str.split('?').pop();
        if (search == "") { return ""; };

        var p = search.substring(1);
        var a = p.split('&');
        var j = '{';
        for (var i = 0; i < a.length; i++) {
            var point = a[i].indexOf('=');
            if (j != '{') {
                j += ','
            };
            j += '"' + a[i].substr(0, point) + '":"' + a[i].substr(point + 1) + '"';
        };
        j += '}';
        var json = eval('(' + j + ')');
        if (json.fr) {
            json.fr = json.fr.replace(/_and_/g, '&')
        }
        return json;
    },
    active: function (args) {
        var g = {
            val: "current",
            target: "",
            cls: "",
            type: "<",
            tag: "a",
            attr: "href",
            eq: 0
        };
        $.extend(g, args);
        if (g.val == "current") {
            g.val = window.location.pathname + window.location.search;
            g.val = g.val.indexOf('.') == -1 ? g.val + "index.jsp" : g.val;
        };
        var finded = false;
        $(g.target).find(g.tag).each(function () {
            var a = $(this).attr(g.attr);
            a = a == '/' ? "/index.jsp" : a;
            var rt = -1;
            switch (g.type) {
                case '<': rt = g.val.indexOf(a); break;
                case '>': rt = a.indexOf(g.val); break;
                case '=': rt = g.val == a ? 1 : -1; break;
            }
            if (rt != -1) {
                $(this).addClass(g.cls);
                finded = true;
                return false;
            } else {
                $(this).removeClass(g.cls);
            };
        });
        if (finded === false && g.eq != -1) {
            $(g.target).find(g.tag).eq(g.eq).addClass(g.cls);
        }
    }
};
ui.number = {
    digit_str: function (num, digit) {
        num = num.toFixed(0).toString();
        var len = num.length;
        var d = "";
        for (var i = len; i < digit; i++) {
            d += "0";
        }
        return d + num;
    }
};
ui.string = {
    gbk_length: function (str) {
        var n = 0;
        for (var i = str.length; i--; ) {
            if ((str.charCodeAt(i) >= 0) && (this.charCodeAt(i) <= 255)) {
                n += 1;
            } else {
                n += 2;
            };
        };
        return n;
    }
};
ui.time = {
    greet: function () {
        var g = "", t = new Date().getHours();
        if (t > 8 && t < 12) {
            g = "上午好&nbsp;";
        } else if (t >= 12 && t <= 18) {
            g = "下午好&nbsp;";
        } else if (t >= 18 && t <= 23) {
            g = "晚上好&nbsp;";
        } else if (t > 5 && t <= 8) {
            g = "早安 ";
        } else {
            g = "夜深，该休息了&nbsp;"
        };
        return g;
    },
    format: function (format, time) {
        if (typeof time == undefined) {
            time = new Date();
        } else {
            var str = time;
            time = new Date(str);
        }
        var o = {
            "M+": time.getMonth() + 1,
            "d+": time.getDate(),
            "h+": time.getHours(),
            "m+": time.getMinutes(),
            "s+": time.getSeconds(),
            "q+": Math.floor((time.getMonth() + 3) / 3),
            "S": time.getMilliseconds()
        }
        if (time == "NaN") {
            var a = str.split(' ');
            var b = a[0].split('-');
            var c = a[1].split(':');
            o = {
                "M+": b[1],
                "d+": b[2],
                "h+": c[0],
                "m+": c[1],
                "s+": c[2],
                "q+": Math.floor((Number(b[1]) - 1 + 3) / 3)
            }
        }
        if (/(y+)/.test(format)) {
            var yyyy = time == "NaN" ? b[0] : time.getFullYear();
            format = format.replace(RegExp.$1, (yyyy + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    }
};
ui.radio = {
    toggle: function (target) {
        $(target).find('input:radio').each(function () {
            var name = $(this).attr('name');
            var parent = $(this).closest('.J_radio_toggle_c');
            var checked = parent.find('input:radio[name="' + name + '"]:checked').val();
            parent.data('value', checked);
            $(this).click(function () {
                var val = $(this).val();
                //
                var value = parent.data('value');
                //
                if (val == value) {
                    parent.data('value', '');
                    $(this).prop('checked', false);
                } else {
                    parent.data('value', val);
                }
            })
        });
    }
}