//ui.array工具类操作数组对象，所有操作均不对原数组进行修改，均返回一个结果
ui.array = {
    //返回数组：复制数组,不同于obj.slice(),此方法会删除null值，并重新排列下标
    clone: function (obj) {
        var rt = [];
        for (var i in obj) {
            var a, k = obj[i];
            if (!ui.isNull(k)) {
                if (ui.isArray(k)) {
                    a = ui.array.clone(k);
                } else if (ui.isJson(k)) {
                    a = ui.json.clone(k);
                } else {
                    a = k;
                }
                rt.push(a);
            };
        }
        return rt;
    },
    //返回元素：数组的第一个元素
    first: function (obj) {
        return obj.slice().shift();
    },
    //返回元素：数组的最后一个元素
    last: function (obj) {
        return obj.slice().pop();
    },
    //返回数组：遍历数组执行回调函数fn(index,value)
    map: function (obj, fn) {
        if([].map&&fn)
            return [].map.call(obj,function(value,index){return fn(index,value);});
        var rt = [];
        var k = 0;
        for (var i in obj) {
            rt[k] = fn(i, obj[i]);
            k++;
        }
        return rt;
    },
    //返回数组：删除数组中某个元素，该元素通常是string/number，也支持删除对象array/json/function
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
    //返回数组：去除数组中重复的元素
    uniq: function (obj) {
        var clone = ui.array.clone(obj);
        for (var k in clone) {
            for (var i = parseInt(k) + 1, ii = clone.length; i < ii; i++) {//在for in 中 k有可能变成字符串 因为for in 有时是用于遍历对象的
                if (ui.isEqual(clone[i], clone[k])) {
                    clone.splice(i, 1);
                    i--;
                    ii--;
                };
            };
        };
        return clone;
    },
    /**
     * 去除数组中的重复
     * 效率更高的算法, 与uniq类似 , 多了纯数字数组的处理
     * 字符串方面的比对没问题. 对象的比对, 不会比对两个对象是否完全一样,只比对是否是同一个引用
     * @param	arrSource 	被处理数组
     * @param	digital		若为true 则用纯数字的算法,能减少三倍用时 , 若数组中有对象, 则不能用此法
     * @return  array 		返回处理后
     */
    unique:function(arrSource,digital){

		if(!digital){//数组中包含对象或字符器的算法
			var arrSource = ui.array.clone(arrSource);
			var indexP=0,indexC=0;
			var currentValue;
			while(indexP<arrSource.length){
				currentValue=arrSource[indexP++];
				indexC=indexP;
				while(indexC<arrSource.length){
					if(arrSource[indexC]==currentValue ){
						arrSource.splice(indexC,1);
					}else
						indexC++
				}
			}
			return arrSource;
		}
		// else{
		//	var result=[];
		// 	var currentValue;
		// 	var index=0;
		// 	var currentLength=arrSource.length;
		// 	var arrSource = ui.array.clone(arrSource).sort();
		// 	while(currentLength){
		// 		currentValue=arrSource[index];
		// 		result.push(arrSource.shift());

		// 		if(index<currentLength){
		// 			while(currentValue==arrSource[index]){
		// 				arrSource.shift();
		// 			}
		// 		}
		// 		currentLength=arrSource.length;
		// 	}
		// }
		else{//只有数字的算法
			var result=[];
			var currentValue;
			var index=0,indexP=0,indexResult=0;
			var arrSource = ui.array.clone(arrSource).sort();
			while(indexP<arrSource.length){
				currentValue=result[indexResult++]=arrSource[indexP++];
				index=indexP;
				if(index<arrSource.length){
					while(currentValue==arrSource[index++]);
					indexP=index;
				}
			}
			return result;
		}

    },
    //返回下标：数组中某个元素的下标，不存在返回-1
    index: function (obj, val) {
        for (var i in obj) {
            if (ui.isEqual(obj[i], val)) {
                return i;
            };
        };
        return -1;
    },
    //返回布尔：判断数组是否包含某个元素,返回true/false，此包含关系需要全等于
    has: function (obj, val) {
        return ui.array.index(obj, val) == -1 ? false : true;
    },
    //返回数组：判断数组中每个元素是否包含了指定值(一个或多个元素），通常指定值为array/json，也支持查找string/number
    //此包含关系不需要全等于，例如 var obj = ["a","ab",["a","ab"],["b","abc"],{"a":"ab"},{"a":"ab","b":"abc"}];
    //  ui.array.contain(obj,{"a":"ab"}) --> [{"a":"ab"},{"a":"ab","b":"abc"}]
    //  ui.array.contain(obj,{"a":"ab","b":"ab"}) --> []
    //  ui.array.contain(obj,["ab","a"]) --> [["a","ab"]]
    //  ui.array.contain(obj,["ab","b"]) --> []
    //  ui.array.contain(obj,"ab") --> ["ab",["a","ab"]]
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
            };
            if (a) {
                rt.push(obj[i]);
            }
        }
        return rt;
    }
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
