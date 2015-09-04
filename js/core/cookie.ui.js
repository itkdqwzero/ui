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
