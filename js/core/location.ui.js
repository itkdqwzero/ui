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
