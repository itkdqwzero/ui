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