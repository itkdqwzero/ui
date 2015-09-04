/**
* 异步加载插件，含js和css文件，不依赖jQuery，效果如同预先在head中加载script和link文件
* 固定调用的数据依赖于配置空间ui.config
*   如ui.config={"array":"js/core/array.js","json":"js/core/json.js","number":"js/core/number.js"};
* ui.require(keys,fn)加载指定keys的插件组合，keys为数组，亦可为空格间隔的String
*   如keys=["array","json","number"] 或者 keys="array json number";
* 会记录整个keys的加载状态，也会记录keys中每个key的加载状态，在多处脚本中同时调用，每个keys及key有且只会加载一次
* fn 为回调函数，只有当keys中全部插件文件加载完毕才会执行，有且执行一次    
* 由于加载后的插件自动执行，且保留原本全局变量名字，因此在fn中可直接调用
*/
ui.require = function (keys, fn) {
    keys = typeof keys == 'string' ? keys.split(' ') : keys;
    fn = !fn ? function () { } : fn;
    this.g = !this.g ? {} : this.g;
    //
    var _keys = keys.join('');
    if (this.g[_keys] === true) {
        return fn();
    };
    if (!this.g[_keys]) {
        this.g[_keys] = [fn];
    } else {
        this.g[_keys].push(fn);
    };
    for (var i = 0, ii = keys.length; i < ii; i++) {
        ui.require._key(keys[i], keys);
    }
};
ui.require._key = function (key, keys) {
    if (!ui.config[key]) {
        alert("ui.require error: ui.config['" + key + "'] is undefined");
        return false;
    }
    if (ui.config[key] === true) {
        this.fn(key, keys);
    } else if (ui.config[key].done && ui.config[key].done <= ui.config[key].length) {
        setTimeout(function () {
            ui.require._key(key, keys);
        }, 300);
    } else {
        //
        ui.ajax.loading(true, true);
        //
        ui.config[key].done = 0;
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
    var link = document.createElement('link');
    link.href = url;
    link.rel = 'stylesheet';
    link.onload = function () {
        ui.require._fn(key, keys);
    };
    document.head.appendChild(link);
    //
    ui.config[key].done++;
};
ui.require._js = function (url, key, keys) {
    var script = document.createElement('script');
    script.src = url;
    script.type = 'text/javascript';
    script.onload = function () {
        ui.config[key].done++;
        ui.require._fn(key, keys);
    };
    document.head.appendChild(script);
};
ui.require._fn = function (key, keys) {
    if (!key || ui.config[key].done < ui.config[key].length) {
        return false;
    };
    ui.config[key] = true;
    //
    var done = true;
    for (var i = 0, ii = keys.length; i < ii; i++) {
        key = keys[i];
        if (ui.config[key] !== true) {
            done = false;
        };
    };
    if (done === true) {
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
