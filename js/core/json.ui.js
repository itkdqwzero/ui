ui.json = {
    keys: function (obj) {
        if (!ui.isObject(obj)) {
            return [];
        };
        if (Object.keys) {
            return Object.keys(obj);
        };
        var keys = [];
        for (var key in obj) {
            if (ui.json.has(obj, key)) {
                keys.push(key);
            };
        };
        return keys;
    },
    has: function (obj, key) {
        return hasOwnProperty.call(obj, key);
    },





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