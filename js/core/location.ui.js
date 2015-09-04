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