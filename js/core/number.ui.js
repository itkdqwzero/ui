ui.number = {
    digit_str: function (num, digit) {
        num = num.toFixed(0).toString();
        var len = num.length;
        var d = "";
        for (var i = len; i < digit; i++) {
            d += "0";
        }
        return d + num;
    }
};
