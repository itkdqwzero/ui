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