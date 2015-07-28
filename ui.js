var ui = ui || {};
var ui = {
    ajax: function (url, fn, type, data, datatype, args) {
        //
        if (ui.ajax.cachedata == undefined) {
            ui.ajax.cachedata = {};
        }
        //
        if (type == undefined || type == "") {
            type = 'POST';
        }
        //
        if (data == undefined || data == "") {
            data = { 'token': ui.security.token() };
        } else {
            if (typeof data == 'string') { data = $(data).serializeArray(); };
            var _data = {};
            $.each(data, function (k, v) {
                if (v.name != undefined) { k = v.name; v = v.value; }
                if (k.indexOf('[]') != -1) {
                    if (_data[k] == undefined) { _data[k] = []; }
                    _data[k].push(v);
                } else {
                    _data[k] = v;
                };
            });
            data = ui.security.params(_data);
        };
        //
        if (datatype == undefined || datatype == "") {
            datatype = 'json';
        }
        //
        var g = {
            async: true,
            contentType: "application/x-www-form-urlencoded;",
            cachekey: '',
            cachetime: 5,
            ajaxloading: true
        }
        $.extend(g, args);
        if (g.cachekey != '' && ui.ajax.cachedata[g.cachekey] != undefined) {
            var time = new Date();
            var now = time.getTime();
            var future = parseInt(ui.ajax.cachedata[g.cachekey + '_time']) + 60 * 1000 * g.cachetime;
            if (ui.ajax.cachedata[g.cachekey + '_time'] + 60 * 1000 * g.cachetime > now) {
                fn(ui.ajax.cachedata[g.cachekey]);
                return true;
            }
        }
        //
        if (g.ajaxloading) { ui.ajaxloading.show(); }
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
                if (g.ajaxloading) { ui.ajaxloading.hide(); }
                //
                if (g.cachekey != '') {
                    ui.ajax.cachedata[g.cachekey] = data;
                    var time = new Date();
                    ui.ajax.cachedata[g.cachekey + '_time'] = time.getTime();
                }
                fn(data);
            },
            error: function (a, b, c) { alert("ajax error: " + b + "," + c); }
        });
    },
    ajaxloading: {
        hide: function () {
            $('#J_ui_ajax_loading').stop().hide();
        },
        show: function () {
            $('#J_ui_ajax_loading').stop().fadeIn();
        }
    },
    require: {
        g: {},
        config: {
            //前缀下划线表示组件module
            _registerlogin: ['/css/_register.login.css', '/js/_register.login.js'],
            //没有前缀下划线的表示插件plugin
            aui: ['/js/plugin/aui/aui.css', '/js/plugin/aui/aui.js'],
            datepicker: ['/js/plugin/datepicker/wdatepicker.js'],
            isotope: ['/js/plugin/isotope/isotope.v2.min.js'],
            flotpie: ['/js/plugin/flot/jquery.flot.pie.min.js'],
            kindeditor: ['/js/plugin/kindeditor/kindeditor.aui.js'],
            mousewheel: ['/js/plugin/mousewheel.js'],
            swiper: ['/js/plugin/swiper/swiper.css', '/js/plugin/swiper/swiper.min.js']
        },
        key: function (keys, fn) {
            if (fn == undefined) {
                fn = function () { }
            };
            if (typeof keys == 'string') {
                keys = [keys];
            };
            var _keys = keys.join('');
            if (this.g[_keys] == undefined) {
                this.g[_keys] = [fn];
            } else if (this.g[_keys].length != undefined) {
                this.g[_keys].push(fn);
            };
            if (this.g[_keys] === true) {
                fn();
            } else {
                for (var i = 0, ii = keys.length; i < ii; i++) {
                    this._key(keys, i);
                }
            }
        },
        _key: function (keys, i) {
            var key = keys[i];
            if (this.config[key] === true) {
                ui.require._callback(key, keys);
            } else if (this.config[key].finished != undefined && this.config[key].finished < this.config[key].length) {
                setTimeout(function () {
                    ui.require._key(keys, i);
                }, 500);
            } else {
                //
                ui.ajaxloading.show();
                //
                var arr = this.config[key].slice(0);
                this.config[key] = { "length": arr.length, "finished": 0 };
                for (var i = 0, ii = arr.length; i < ii; i++) {
                    if (arr[i].indexOf('.css') != -1) {
                        this._css(arr[i], key, keys);
                    };
                    if (arr[i].indexOf('.js') != -1) {
                        this._js(arr[i], key, keys);
                    };
                }
            };
        },
        _css: function (url, key, keys) {
            var head = document.getElementsByTagName('head')[0];
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            link.onload = function () {
                ui.require.config[key].finished++;
                ui.require._callback(key, keys);
            };
            head.appendChild(link);
        },
        _js: function (url, key, keys) {
            $.ajax({
                type: "GET",
                url: url,
                dataType: "script",
                cache: true,
                async: true,
                success: function () {
                    ui.require.config[key].finished++;
                    ui.require._callback(key, keys);
                },
                error: function (a, b, c) { alert("ui require error " + b + " " + c); }
            });
        },
        _callback: function (key, keys) {
            if (this.config[key].finished >= this.config[key].length) {
                this.config[key] = true;
                //
                var finished = true;
                for (var i = 0, ii = keys.length; i < ii; i++) {
                    var k = keys[i];
                    if (this.config[k] !== true) {
                        finished = false;
                    }
                }
                if (finished) {
                    ui.ajaxloading.hide();
                    var _keys = keys.join('');
                    if (this.g[_keys].length != 0) {
                        for (var i in this.g[_keys]) {
                            this.g[_keys][i]();
                        };
                        this.g[_keys] = true;
                    }
                }

            }
        }
    },
    security: {
        token: function () {
            var a = 'def0!l=k+ghijab.ycz1op89(){vwx45qrstu7623mn}';
            var args = token.split('&');
            for (var i = args.length; i--; ) {
                var tmp = args[i].split('@');
                window['token_' + tmp[0]] = tmp[1];
            }
            var z = token_z;
            var f = token_f;
            var kv = {};
            for (var i = a.length; i--; ) {
                var k = a.charAt(i);
                var v = z.charAt(i);
                kv[v] = k;
            }
            var fn = '';
            for (var i = 0; i < f.length; i++) {
                var c = f.charAt(i);
                if (kv[c] == undefined) {
                    fn += c;
                } else {
                    fn += kv[c];
                }
            }
            return eval('(' + fn + ')()');
        },
        params: function (data) {
            var kv = ui.security._kv();
            var rt = { "token": ui.security.token() };
            if (typeof data == "object") {
                for (var k in data) {
                    var key = ui.security._recursive(k, kv);
                    rt[key] = ui.security._recursive(data[k], kv);
                }
            }
            if (typeof data == "string") {
                rt = ui.security._recursive(data, kv);
            };
            return rt;
        },
        _kv: function () {
            var index = { '0000': '0', '1000': '1', '0001': '2', '0010': '3', '1111': '4', '0011': '5', '0101': '6', '0100': '7', '0110': '8', '0111': '9' };
            var arr = [];
            for (var i = 0; i < 11; i++) {
                var b = 4 * i;
                var c = ui.security.token().substr(b, 4);
                arr.push(index[c]);
            };
            arr.splice(11, 0, '0', '1', '2', '3', '4', '5', '6', '7', '8', '9');
            arr = ui.tool.array.del_duplicate(arr);
            var t = ui.tool.array.per_char('abcdefghijklmnopqrstuvwxyz');
            var a = arr.concat(t);
            var z = ui.tool.array.per_char('1c450abgr67hi23mntuvw9sxopqjkldef8yz');
            var kv = {};
            for (var i = a.length; i--; ) {
                var k = a[i];
                var v = z[i];
                kv[v] = k;
            };
            return kv;
        },
        _recursive: function (str, _kv) {
            var _v = '';
            str = str.toString();
            for (var i = 0; i < str.length; i++) {
                var c = str.charAt(i);
                if (_kv[c] == undefined) {
                    _v += c;
                } else {
                    _v += _kv[c];
                }
            };
            return _v;
        }
    },
    tool: {
        array: {
            per_char: function (str) {
                str = str.replace(/\s*/g, '');
                var rt = [];
                for (var i = str.length; i--; ) {
                    rt[i] = str.charAt(i);
                }
                return rt;
            },
            is_in: function (val, arr) {
                for (var i = arr.length; i--; ) {
                    if (arr[i] == val) { return i; }
                }
                return -1;
            },
            del_val: function (val, arr) {
                var rt = [];
                var len = arr.length;
                for (var i = 0; i < len; i++) {
                    if (arr[i] != val) {
                        rt.push(arr[i]);
                    }
                }
                return rt;
            },
            del_kv: function (kv, arr) {
                var rt = [];
                for (var n = arr.length; n--; ) {
                    var b = true;
                    for (var k in kv) {
                        var tmp = {}; tmp[k] = kv[k];
                        if (ui.tool.json.is_in(tmp, arr[n]) == -1) { b = false; };
                    };
                    if (b) {
                        continue;
                    }
                    rt.push(arr[n]);
                };
                return rt;
            },
            del_duplicate: function (arr) {
                for (var i = 0; i < arr.length; i++) {
                    for (var j = i + 1; j < arr.length; j++) {
                        if (arr[j] === arr[i]) {
                            arr.splice(j, 1);
                            j--;
                        }
                    }
                }
                return arr;
            },
            get_ones: function (kv, arr) {
                var rt = [];
                for (var n = 0, nn = arr.length; n < nn; n++) {
                    var b = true;
                    for (var k in kv) {
                        var tmp = {}; tmp[k] = kv[k];
                        if (ui.tool.json.is_in(tmp, arr[n]) == -1) { b = false; };
                    };
                    if (b) {
                        rt.push(arr[n]);
                    }
                };
                return rt;
            }
        },
        cookie: {
            get: function (name) {
                if (document.cookie.length > 0) { var start = document.cookie.lastIndexOf(name + "="); if (start != -1) { start = start + name.length + 1; var end = document.cookie.indexOf(";", start); if (end == -1) { end = document.cookie.length; }; return decodeURI(document.cookie.substring(start, end)); }; }; return "";
            },
            set: function (name, value, days) {
                var d = new Date(); var t = new Date(); d.setTime(t.getTime() + 1000 * 60 * 60 * 24 * days); document.cookie = name + "=" + encodeURI(value) + ((days == null) ? "" : ";expires=" + d.toGMTString()) + ";path=/";
            },
            del: function (name) {
                var t = new Date(); t.setTime(t.getTime() - 1); var v = this.get(name); document.cookie = name + "=" + v + ";expires=" + t.toGMTString() + ";path=/";
            }
        },
        image: {
            responsive: function (src, kv, w_default) {
                var index = src.lastIndexOf('.') + 1;
                var ext = src.substring(index).toLowerCase();
                if (ui.tool.array.is_in(ext, ['gif', 'jpg', 'jpeg', 'png']) == -1) {
                    return src;
                };
                if (kv == "") {
                    kv = { "320": "200", "480": "320", "640": "480" };
                };
                var ww = $(window).width();
                var w = '';
                for (var k in kv) {
                    num = parseInt(k);
                    if (ww >= num) {
                        w = kv[k];
                    }
                }
                if (w != '') {
                    w = '?w=' + w;
                } else {
                    if (w_default != undefined && w_default != '') {
                        w = '?w=' + w_default;
                    }
                }
                return src + w;
            }
        },
        json: {
            is_in: function (kv, json) {
                for (var k in kv) {
                    for (var i in json) {
                        if (k == i && kv[k] == json[i]) { return k; }
                    }
                }
                return -1;
            },
            get_value: function (json, join) {
                if (json == undefined) { return ''; }
                var rt = [];
                if (join == undefined) { join = ','; }
                for (var i in json) {
                    if (json[i] == '') { continue; }
                    rt.push(json[i]);
                };
                return rt.join(join);
            },
            parse: function (str) {
                if (typeof str != 'string') {
                    return str;
                }
                var json = $.parseJSON(str);
                for (var k in json) {
                    if (typeof json[k] == 'string' && json[k].indexOf('{') != -1 && json[k].indexOf('}') != -1) {
                        var val = $.parseJSON(json[k]);
                        if (val != json[k]) {
                            json[k] = ui.tool.json.parse(json[k]);
                        }
                    }
                };
                return json;
            }
        },
        location: {
            search: function (str) {
                var search = str == undefined ? window.location.search : str.split('?').pop();
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
                if (typeof json.fr != 'undefined') {
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
                    g.val = g.val.indexOf('.') == -1 ? g.val + "index.php" : g.val;
                };
                var finded = false;
                $(g.target).find(g.tag).each(function () {
                    var a = $(this).attr(g.attr);
                    a = a == '/' ? "/index.php" : a;
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
        },
        number: {
            int_str: function (num, digit) {
                num = num.toFixed(0).toString();
                var len = num.length;
                var s = "";
                for (var i = len; i < digit; i++) {
                    s += "0";
                }
                return s + num;
            }
        },
        string: {
            gbk_length: function (str) {
                var n = 0;
                for (var i = str.length; i--; ) {
                    if ((str.charCodeAt(i) >= 0) && (this.charCodeAt(i) <= 255)) {
                        n += 1;
                    } else {
                        n += 2;
                    }
                };
                return n;
            },
            get: function (_var) {
                if (_var == undefined) { return ''; }
                return _var.toString();
            }
        },
        time: {
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
        }
    },
    twinkle: function (args) {
        var g = {
            target: '',
            time: 350,
            times: 3,
            cls: 'twinkle'
        }
        $.extend(g, args);
        $(g.target).addClass(g.cls);
        var i = 0;
        var intervalId = setInterval(function () {
            (function () {
                if (i % 2 == 0) {
                    $(g.target).removeClass(g.cls);
                } else {
                    $(g.target).addClass(g.cls);
                }
                if (i >= g.times) {
                    $(g.target).removeClass(g.cls);
                    clearInterval(intervalId);
                };
                i++;
            })(i, g);
        }, g.time);
    }
};