ui.isFunction = function (obj) {
    return toString.call(obj) === '[object Function]' || typeof obj == 'function';
};
//
ui.isString = function (obj) {
    return toString.call(obj) === '[object String]';
};
//
ui.isNumber = function (obj) {
    return toString.call(obj) === '[object Number]';
};
//
ui.isDate = function (obj) {
    return toString.call(obj) === '[object Date]';
};
//
ui.isElement = function (obj) {
    return !!(obj && obj.nodeType === 1);
};
//
ui.isArray = Array.isArray || function (obj) {
    return toString.call(obj) === '[object Array]';
};
ui.isObject = function (obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
};
ui.isJson = function (obj) {
    return typeof (obj) == "object" && toString.call(obj) == "[object Object]" && !obj.length;
};
//
ui.isFinite = function (obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
};
ui.isNaN = function (obj) {
    return ui.isNumber(obj) && isNaN(obj);
};
ui.isBoolean = function (obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
};
ui.isNull = function (obj) {
    return obj === null || obj === void 0;
};
//
ui.isEmpty = function (obj) {
    if (ui.isNull(obj) || ui.isNaN(obj)) { return true; };
    if (ui.isArray(obj) || ui.isString(obj)) { return obj.length === 0; };
    if (ui.isJson(obj)) { return ui.json.keys(obj).length === 0; };
    return false;
};
ui.isEqual = function (a, b) {
    return ui.isEqual._eq(a, b);
}
ui.isEqual._eq = function (a, b, aStack, bStack) {
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    if (a == null || b == null) return a === b;
    if (a !== a) return b !== b;
    var type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
    return ui.isEqual._deepEq(a, b, aStack, bStack);
};
ui.isEqual._deepEq = function (a, b, aStack, bStack) {
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
        case '[object RegExp]':
        case '[object String]':
            return '' + a === '' + b;
        case '[object Number]':
            if (+a !== +a) { return +b !== +b };
            return +a === 0 ? 1 / +a === 1 / b : +a === +b;
        case '[object Date]':
        case '[object Boolean]':
            return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
        if (typeof a != 'object' || typeof b != 'object') return false;
        var aCtor = a.constructor, bCtor = b.constructor;
        if (aCtor !== bCtor && !(ui.isFunction(aCtor) && aCtor instanceof aCtor && ui.isFunction(bCtor) && bCtor instanceof bCtor) && ('constructor' in a && 'constructor' in b)) {
            return false;
        }
    }
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
        if (aStack[length] === a) {
            return bStack[length] === b;
        };
    }
    aStack.push(a);
    bStack.push(b);

    if (areArrays) {
        length = a.length;
        if (length !== b.length) {
            return false;
        };
        while (length--) {
            if (!eq(a[length], b[length], aStack, bStack)) {
                return false;
            };
        }
    } else {
        var keys = ui.json.keys(a), key;
        length = keys.length;
        if (ui.json.keys(b).length !== length) {
            return false;
        };
        while (length--) {
            key = keys[length];
            if (!(ui.json.has(b, key) && eq(a[key], b[key], aStack, bStack))) {
                return false;
            };
        }
    }
    aStack.pop();
    bStack.pop();
    return true;
};