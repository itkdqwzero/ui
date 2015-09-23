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
