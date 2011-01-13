/**
 * 给表格的每一行运行回调函数
 *
 * @public
 * @param {Function} func 回调函数
 *
 * @desc func参数的this为行控件
 *		@param {Control} n 行控件
 *		@param {Number}  i 索引
 *		@param {Control} cb 该行的checkbox
 */
ecomui.Table.prototype.eachRow = function(func) {
    baidu.array.each(this._aRow, function(n, i) {
        var cb = ecui.query({parent: n.getCol(0)})[0];
        func && func.call(n, n, i, cb);
    });
}

/**
 * 选中满足条件的行
 *
 * @public
 * @param {Function} func 回调函数
 *
 * @desc func参数的this为行控件, 返回值确定该行是否选中
 *		@param {Control} n 行控件
 *		@param {Number}  i 索引
 *		@return {Boolean} 是否选中
 */
ecomui.Table.prototype.checkRows = function(func) {
    
    this.eachRow(function(n, i, cb) {
        cb.setChecked(false);
        if (func && func.call(n, n, i)) {
            cb.setChecked(true);
        }
    });
}

/* 使用 */
/*
var t = ecui.get("lst_0");
t.eachRow(function(n, i, cb) {
	if (cb.isChecked()) {
		console.log(i);
	}	
})

t.checkRows(function(n, i) {
     var text = ecui.dom.getText(n.getBase().cells[1]);
    return text.match(/(2|4)/);
})

*/
