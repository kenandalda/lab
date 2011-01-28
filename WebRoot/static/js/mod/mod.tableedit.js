var ecomui = ecomui || {};
(function () {
    var core = ecui,
        lib = baidu,
        dom = core.dom,
        first = dom.first,
        ui = core.ui,
        
        blank = core.util.blank,
        trim = lib.string.trim,
        addClass = dom.addClass,
        
        ECOM_TABLE_BODY_CLASS = ui.EcomTableBody.prototype;
    

    /**
     * 初始化表格编辑
     */
    ECOM_TABLE_BODY_CLASS.oninit = function () {
        var wrapper = this.getParent(),
            ths = this.getOuter().getElementsByTagName("th"),
            editConf = [];

        for (var i = 0, o, p; o = ths[i]; i++) {
            if (p = o.getAttribute("edit")) {
                p = eval(p);
                editConf.push({"index": i, "name": p});
            }
        }

        wrapper._oEditConf = editConf;
        wrapper._cCurEditRow = null;
        wrapper.cancelAllEdit = ECOM_TABLE_CANCELALLEDIT;

        var ECOM_TABLE_ROW_CLASS = this.constructor.Row.prototype;
        
        addClass(this.getOuter(), "ec-ecom-table-body-edit");
            
        ECOM_TABLE_ROW_CLASS.edit = ECOM_TABLE_EDIT;
        ECOM_TABLE_ROW_CLASS.saveSubmit = ECOM_TABLE_SAVESUMBIT;
        ECOM_TABLE_ROW_CLASS.cancelEdit = ECOM_TABLE_CANCELEDIT;
    };

    /**
     * 单行的编辑
     */
    function ECOM_TABLE_EDIT (link, custParam) {
        var table = this.getParent(),
            wrapper = table.getParent(),
            editConf = wrapper._oEditConf;
        
        table.setSize = blank;
        if (wrapper._cCurEditRow) {
            if (!confirm(wrapper._sEditMsg || "有记录处于编辑状态, 是否继续?")) {
                return;        
            }
            
            wrapper._cCurEditRow.cancelEdit();
        }

        wrapper._cCurEditRow = this;
        wrapper._sCustParam = custParam || "";

        for (var i = 0, o, flag, cell; o = editConf[i++];) {
            flag = o.name;
            cell = first(this.getCol(o.index).getOuter());
            cell._sOldHTML = cell.innerHTML;

            // 操作列
            if (flag === true) {

                cell.innerHTML = "<span class='link'"
					    + " onclick='this.parentNode.parentNode.parentNode.getControl().saveSubmit()'>"
					    + (wrapper._sSaveText || "保存")
						+ "</span>"
						+ " <span class='link'"
						+ " onclick='this.parentNode.parentNode.parentNode.getControl().cancelEdit()'>"
						+ (wrapper._sCancelText || "取消")
						+ "</span>";
            }

            // select
            else if (flag.constructor == Array) {
                var s = ["<select class='ec-ecom-table-edit' name='" + flag[0] + "'>"],
                    text = trim(cell.innerHTML);

                for (var j = 1, len = flag.length; j < len; j += 2) {
                    s.push("<option value='" + flag[j] + "'" 
                        + (flag[j + 1] == text && " selected='selected'")
                        + ">" + flag[j + 1] + "</option>");
                }

                s.push("</select>");
                cell.innerHTML = s.join("");
                first(cell).style.width = cell.offsetWidth + "px";
            }

            // 常规input
            else {
                cell.innerHTML = "<input class='ec-ecom-table-edit' name='" + flag + "' value='" + cell.innerHTML.replace("'", "&#39;") + "'>";
                first(cell).style.width = cell.offsetWidth + "px";
            }
        }
        
        delete table.setSize;
    }

    /**
     * 同步保存表格行数据
     */
    function ECOM_TABLE_SAVESUMBIT () {
          var table = this.getParent(),
            wrapper = table.getParent(),
            editConf = wrapper._oEditConf,
            result = {},
            action = wrapper._fEditSave || window.saveClick;

        for (var i = 0, o, flag, cell, input; o = editConf[i++];) {
            flag = o.name;
            cell = first(this.getCol(o.index).getOuter());
            input = cell.getElementsByTagName(flag.constructor == Array ? "select" : "input")[0];
            input && (result[input.name] = input.value);
        }
        
        action && action(result, wrapper._sCustParam);
    }

    function ECOM_TABLE_CANCELEDIT () {
        var table = this.getParent(),
            wrapper = table.getParent(),
            editConf = wrapper._oEditConf;

        for (var i = 0, o, flag, cell; o = editConf[i++];) {
            cell = first(this.getCol(o.index).getOuter());
            cell.innerHTML = cell._sOldHTML;
        }

        wrapper._cCurEditRow = undefined;
        wrapper._sCustParam = undefined;

        // table.paint();
    }

    function ECOM_TABLE_CANCELALLEDIT () {
        var curEditRow = this._cCurEditRow;
        curEditRow && curEditRow.cancelEdit();
    }

 })();

// vim: set fdm=marker:
