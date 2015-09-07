ui.array = {
    del: function (obj, arr) {
        if (typeof obj != "object") {
            return this.del_val(obj, arr);
        } else if (typeof obj == "array") {
            return this.del_obj(obj, arr);
        } else {
            return this.del_kv(obj, arr);
        };
        //
        this.del_val = function (val, arr) {
            var rt = [];
            for (var i in arr) {
                if (arr[i] != val) {
                    rt.push(arr[i]);
                };
            };
            return rt;
        };
        this.del_obj = function (obj, arr) {
            for (var i in obj) {
                arr = ui.array.del(obj[i], arr);
            }
            return arr;
        }
        this.del_kv = function (kv, arr) {
            var rt = [];
            for (var i in arr) {
                var b = true;
                for (var k in kv) {
                    var tmp = { k: kv[k] };
                    if (!ui.json.has(tmp, arr[i])) {
                        b = false;
                    };
                };
                if (b) {
                    continue;
                };
                rt.push(arr[i]);
            };
            return rt;
        }
    },
    unique: function (arr) {
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
    one: function (kv, arr) {
        return ui.array.ones(kv, arr)[0];
    },
    contain: function (kv, arr) {
        var rt = [];
        for (var i in arr) {
            var b = true;
            for (var k in kv) {
                var tmp = { k: kv[k] };
                if (!ui.json.has(tmp, arr[i])) {
                    b = false;
                };
            };
            if (b) {
                rt.push(arr[i]);
            }
        };
        return rt;
    },
    index: function (val, arr) {
        for (var i in arr) {
            if (arr[i] == val) {
                return i;
            };
        };
        return -1;
    },
    has: function (val, arr) {
        return ui.array.index(val, arr) == -1 ? false : true;
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