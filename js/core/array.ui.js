ui.array = {
    clone: function (obj) {
        var rt = [];
        for (var i in obj) {
            if (!ui.isNull(obj[i])) {
                if (ui.isArray(obj[i])) {
                    obj[i] = ui.array.clone(obj[i]);
                }
                rt.push(obj[i]);
            };
        }
        return rt;
    },
    first: function (obj) {
        return obj.slice().shift();
    },
    last: function (obj) {
        return obj.slice().pop();
    },
    map: function (obj, fn) {
        var rt = [];
        var k = 0;
        for (var i in obj) {
            rt[k] = fn(obj[i]);
            k++;
        }
        return rt;
    },
    del: function (obj, val) {
        if (ui.isArray(val)) {
            var clone = ui.array.clone(obj);
            for (var k in val) {
                clone = ui.array.del(clone, val[k]);
            }
            return clone;
        };
        var rt = [];
        for (var i in obj) {
            if (!ui.isEqual(obj[i], val)) {
                rt.push(obj[i]);
            };
        };
        return rt;
    },
    uniq: function (obj) {
        var clone = ui.array.clone(obj);
        for (var k in clone) {
            for (var i = k + 1, ii = clone.length; i < ii; i++) {
                if (!ui.isEqual(clone[i], clone[k])) {
                    clone.splice(i, 1);
                    i--;
                    ii--;
                };
            };
        };
        return clone;
    },
    index: function (obj, val) {
        for (var i in obj) {
            if (ui.isEqual(obj[i], val)) {
                return i;
            };
        };
        return -1;
    },
    has: function (obj, val) {
        return ui.array.index(obj, val) == -1 ? false : true;
    },
    contain: function (obj, val) {
        var rt = [];
        var type = ui.isArray(val) ? 'array' : ui.isJson(val) ? 'json' : '';
        for (var i in obj) {
            var a = true;
            if (ui.isJson(obj[i])) {
                if (type != 'json') { continue; }
                for (var k in val) {
                    var kv = { k: val[k] };
                    if (!ui.json.has(obj[i], kv)) {
                        a = false;
                        break;
                    };
                };
            } else if (ui.isArray(obj[i])) {
                if (type == 'json') { continue; }
                if (type == 'array') {
                    for (var k in val) {
                        if (!ui.array.has(obj[i], val[k])) {
                            a = false;
                            break;
                        };
                    };
                } else {
                    a = ui.array.has(obj[i], val);
                }
            } else {
                a = ui.isEqual(obj[i], val);
            }
            if (a) {
                rt.push(obj[i]);
            }
        }
        return rt;
    },
    one: function (obj, val) {
        return ui.array.contain(obj, val)[0];
    },



    
};
//常用的Array原生方法
// concat(a,b,c,...,n) 合并一个或多个元素，返回新数组
// join() 拼接成字符串
// sort(function) 排序
// pop() 删除数组最后一个元素，返回该元素
// shift() 删除数组第一个元素，返回该元素
// unshift() 向数组头部添加一个或多个元素，返回新的数组长度
// push() 向数组尾部添加一个或多个元素，返回新的数组长度
// reverse() 倒序，改变原数组，不返回新的数组
// slice(start,end) 选定数组下标之间元素，返回元素组成的新数组，包含start但不包含end
// start 或 end 为 -1 是指最后一个元素，-2 指倒数第二个元素，以此类推。
// splice(index,howmany,item1,.....,itemX) 返回被删除的元素的新数组，原数组也被改变，
// 删除从 index（包含）开始的零个或多个元素，并且用参数列表中声明的一个或多个值来替换那些被删除的元素

//返回新数组
//复制     var arr = obj.slice(); 完全复制，一样的下标和长度，去除null值的复制用 ui.array.clone(obj)
//合并     var arr = obj.concat([a,b,c],[d,e],...,[n]);
//
//改变原数组
//删除     obj.splice(index,howmany);
//替换     obj.splice(index,1,itemX);
//插入     obj.splice(index,0,itemX);
//
//取值，不改变原数组
//first    obj.slice().shift();
//last     obj.slice().pop();
//
//
//
//
//
//
//
//