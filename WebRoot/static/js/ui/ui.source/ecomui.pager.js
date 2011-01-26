var ecomui = ecomui || {};
(function () {
    var lib = baidu, 
		core = ecui, 
		dom = core.dom, 
        libDom = lib.dom,
		ui = core.ui,
		util = core.util,
		inherits = util.inherits,
		copy = util.copy,
        blank = util.blank,

        g = libDom.g,
		children = dom.children,
		createDom = dom.create,
		$fastCreate = core.$fastCreate,
		setText = dom.setText,
        toCamelCase = core.string.toCamelCase,
        trim = core.string.trim,

        MATH = Math,
        ceil = MATH.ceil,

		DOCUMENT = document,
		UI_CONTROL = ui.Control,
        UI_ITEM = ui.Item,
        UI_ITEMS = ui.Items,
        UI_ITEM_CLASS = UI_ITEM.prototype,
        UI_PAGER_PROPNAMES = ["curPage", "pageSize", "total"],

        UI_PAGER = ecomui.Pager 
            = ui.Pager = function(el, params) {

            var htmls = [],
                bind = params.bind,
                baseClass = params.base,
                o; 

            /*
            this._nCurPage = parseInt(params.curPage, 10);
            this._nPageSize = parseInt(params.pageSize, 10);
            this._nTotal = parseInt(params.total, 10);
            */

            this.setProps(params);
            bind && (this._cBind = (typeof bind == "string" ? core.get(bind) : bind));

            UI_CONTROL.call(this, el, params);

            htmls.push('<div class="' + baseClass + '-body">');

            // 首页/上一页
            htmls.push('<div class="' + baseClass + '-first ' + baseClass + '-item">首页</div><div class="' + baseClass + '-prev ' + baseClass + '-item">上一页</div>');

            // 页码
            var range = this.$getPageNumRange(), 
                pageStart = range[0],
                pageEnd = range[1];

            for (; pageStart <= pageEnd; pageStart++) {
                htmls.push(
                    '<div class="' + baseClass + '-item page-num">' + pageStart + '</div>'       
                )
            }

            // 下一页/尾页
            htmls.push('<div class="' + baseClass + '-next ' + baseClass + '-item">下一页</div><div class="' + baseClass + '-last ' + baseClass + '-item">尾页</div>');
            htmls.push('</div>');

            el.innerHTML = htmls.join("");
            this._eBody = el.firstChild;

            this.$initItems();
            
            // go按钮
            o = this._uGoOp = createDom(baseClass + '-go', '', 'span');
            o.innerHTML = '<input class="' + baseClass + '-input" type="text" style="width:25px" /><button type="button" class="' + baseClass + '-button">转到</button>';
            this._uGoInput = o.firstChild;
            (this._uGoBtn = o.lastChild)._cInput = this._uGoInput;
            this._uGoBtn._cWrapper = this;
            el.appendChild(o);

            // 记录说明文字
            o = createDom(baseClass + '-summary', '', 'span');
            o.innerHTML = "<span>共<em></em>页, <em></em>条记录</span><span style='display:none'>不存在记录</span>";
            this._uSummaryText = o.firstChild;
            this._uNoRecText = o.lastChild;
            el.appendChild(o);
            
            
            // TODO 用firstChild等方法来获取这些control
            o = this.getItems();

            this._uFirst = o[0];
            this._uLast = o[o.length - 1];
            this._uPrev = o[1];
            this._uNext = o[o.length - 2];

            this._uGoBtn.onclick = UI_PAGER_GOBTNCLICK;

            this.refresh();
    },

    UI_PAGER_CLASS = inherits(UI_PAGER, UI_CONTROL),

    UI_PAGER_ITEM = UI_PAGER.Item = function (el, params) {
        UI_ITEM.call(this, el, params); 

        // 页码最小宽度为25px
        var width = Math.max(this.getWidth(), 25);
        this.setSize(width);
    },

    UI_PAGER_ITEM_CLASS = inherits(UI_PAGER_ITEM, UI_ITEM);

    UI_PAGER_CLASS.$setSize = blank;

    /**
     * 获得当前显示的开始/结束页码
     *
     * @return {Array} [开始页, 结束页]
     */
    UI_PAGER_CLASS.$getPageNumRange = function () {
        var cur = this._nCurPage,
            size = this._nPageSize,
            total = this._nTotal,
            pageCount = ceil(total / size),
            start = 1,
            end = pageCount + 0;

        if (pageCount > 11) {
            if (cur > 5) {
                start = cur - 5;
                end = cur + 5;
            }
            else {
                end = 11;
            }
            if (end > pageCount) {
                start = pageCount - 10;
                end = pageCount;
            }
        }

        return [start, end];
    };

    /**
     * 获取页码item
     */
    UI_PAGER_CLASS.$getPageNumControl = function () {
       var i = 0, 
           ret = [], 
           items = this.getItems(),
           o; 
       for (; o = items[i++];) {
            /page-num/.test(o.getBase().className)
                && ret.push(o);
       }
       return ret;
    };

    /**
     * 遍历页码item并绑定回调
     */
    UI_PAGER_CLASS.$eachPageNum = function (func) {
        var i = 0, 
            o,
            items = this.$getPageNumControl();  
        
        for (; o = items[i++];) {
            func.call(o, o.getBase().innerHTML); 
        }
    };

    /**
     * 默认点击处理
     */
    UI_PAGER_ITEM_CLASS.$click = function (event) {
        var base = this.getBase(),
            parent = this.getParent(),
            setCurPage = UI_PAGER_CLASS.setCurPage,
            bindControl = parent._cBind,
            pageCount = ceil(parent._nTotal / parent._nPageSize);

        if (/page-num/.test(base.className)) {
            setCurPage.call(parent, base.innerHTML);   
        }
        else if (/first/.test(base.className)) {
            setCurPage.call(parent, 1);   
        }
        else if (/last/.test(base.className)) {
            setCurPage.call(parent, pageCount);   
        }
        else if (/prev/.test(base.className)) {
            setCurPage.call(parent, parent._nCurPage - 1);   
        }
        else if (/next/.test(base.className)) {
            setCurPage.call(parent, parent._nCurPage + 1);   
        }

        /*
        bindControl
            && bindControl.onpagerclick 
            && bindControl.onpagerclick.call(bindControl, parent.getCurPage(), parent);
        */

        UI_ITEM_CLASS.$click.call(this, event);
    };

    /**
     * 把Pager实例的点击处理转发到其Item上
     * 默认点击事件不受自定义onclick返回函数的影响
     */
    UI_PAGER_ITEM_CLASS.click = function (event) {
        var o = this,
            p = this.getParent();

        o.$click.call(o, event);
        o.isEnabled() && p.onclick 
            && p.onclick.call(o, event);
    };

    /**
     * item改变
     */
    UI_PAGER_CLASS.$alterItems = blank;

    /**
     * 设置属性, 使属性展示出来需要调用refresh
     */
    UI_PAGER_CLASS.setProps = function(options) {
        var ret = {},
            i = 0,
            o;
        for (; o = UI_PAGER_PROPNAMES[i++];) {
            this["_n" + toCamelCase("-" + o)] = options[o] !== undefined ?
                parseInt(options[o], 10) : this["_n" + toCamelCase("-" + o)];
        }
    };

    // 刷新显示
    UI_PAGER_CLASS.refresh = function() {
        if (this._nCurPage && this._nPageSize && this._nTotal) {
            this.getBody().style.display = "";
            this._uGoOp.style.display = "";
            this._uSummaryText.style.display = "";
            this._uNoRecText.style.display = "none";

            this.$setCurPage(this._nCurPage);
            this.setSummary(this._nPageSize, this._nTotal);
        }
        else {
            this.getBody().style.display = "none";
            this._uGoOp.style.display = "none";
            this._uSummaryText.style.display = "none";
            this._uNoRecText.style.display = "";
        }
    };

    // 通过数据刷新显示, 是setProps和refresh结合使用的快捷方式
    UI_PAGER_CLASS.refreshPage = function(options) {
        this.setProps(options);
        this.refresh();
    };

    UI_PAGER_CLASS.setSummary = function(pageSize, total) {
        var summaryEl = this._uSummaryText,
            ems = summaryEl.getElementsByTagName("em");

        setText(ems[0], ceil(total / pageSize));
        setText(ems[1], total);
    };

    /**
     * 跳转按钮点击
     */
    function UI_PAGER_GOBTNCLICK() {
        var val = parseInt(trim(this._cInput.value)),
            wrapper = this._cWrapper,
            pageCount = ceil(wrapper._nTotal / wrapper._nPageSize);

        if (val && val >= 1 && val <= pageCount) {
            wrapper.setCurPage(val);
        }
        else {
            alert("请输入1到" + pageCount + "之间的数字.");
            this._cInput.value = "";
            this._cInput.focus();
        }
    }

    /**
     * 指示指定页码(默认)
     * @param {Number} pageNum 页码, 若为-1则设置到尾页
     *
     * @protected
     */
    UI_PAGER_CLASS.$setCurPage = function (pageNum) {
        var self = this,
            pageNum = parseInt(pageNum, 10),
            pageCount = ceil(this._nTotal / this._nPageSize),
            i = 0,
            j = 0, 
            o,
            items = this.$getPageNumControl();

        if (pageNum == -1) {
           pageNum = pageCount; 
           this._nCurPage = pageCount; 
        }
        else if (pageNum < 1 ) {
           this._nCurPage = 1; 
        }
        else if (pageNum > pageCount) {
           this._nCurPage = pageCount; 
        }
        else {
            this._nCurPage = pageNum;
        }

        var range = this.$getPageNumRange(),
            start = range[0],
            end = range[1];

        for (i = start; i <= end;) {
            // o = createDom("page-num");
            o = items[j];
            o.getBase().innerHTML = i;

            if (i == pageNum) {
                o.alterClass("cur");
                o.setEnabled(false);
            }
            else {
                o.alterClass("cur", true);
                o.setEnabled(true);
            }

            j++;
            i++;
        }

        this._uPrev.setEnabled(this._nCurPage != 1); 
        this._uFirst.setEnabled(this._nCurPage != 1); 
        this._uNext.setEnabled(this._nCurPage != pageCount); 
        this._uLast.setEnabled(this._nCurPage != pageCount); 

    };

    /**
     * 显示当前页码
     * @public
     */
    UI_PAGER_CLASS.setCurPage = function(pageNum) {
        var o = this;        
        o.isEnabled() && o.onpageset 
            && o.onpageset.call(o, pageNum) === false
            || o.$setCurPage.call(o, pageNum);
    };

    /**
     * 获得当前页码
     * @public
     */
    UI_PAGER_CLASS.getCurPage = function() {
        return this._nCurPage + 0;
    };

    /**
     * 获得绑定控件
     * @public
     */
    UI_PAGER_CLASS.getBind = function() {
       return this._cBind; 
    };

    /**
     * 设置绑定控件
     * @public
     */
    UI_PAGER_CLASS.setBind = function(control) {
        this._cBind = control;
    };

    // 把Items的方法复制到Pager的prototype中
    copy(UI_PAGER_CLASS, UI_ITEMS);

 })();
