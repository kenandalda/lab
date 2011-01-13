/**
 * 星云的分页控件
 * 继承子Pager
 */
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
        first = dom.first,
		createDom = dom.create,
		$fastCreate = core.$fastCreate,
		setText = dom.setText,
        hideDom = libDom.hide,
        showDom = libDom.show,
        setStyle = dom.setStyle,
        toCamelCase = core.string.toCamelCase,
        trim = core.string.trim,

        MATH = Math,
        ceil = MATH.ceil, 
		DOCUMENT = document,
		UI_CONTROL = ui.Control,
        UI_PAGER = ui.Pager,
        UI_PAGER_CLASS = UI_PAGER.prototype,

    XY_PAGER = ui.XyPager = function (el, params) {
        var typeClass = params.type,
            o;

        // 加入省略号
        o = this._eEllipsis = createDom(typeClass + "-ellipsis");
        o.innerHTML = "...";
        hideDom(o);

        // 调用父类的构造函数
        this.$getPageNumRange = GET_INIT_RANGE;
        UI_PAGER.call(this, el, params);
        delete this.$getPageNumRange;

        first(el).insertBefore(o, this.getItems()[5].getOuter());
        this._uNoRecText.innerHTML = "&nbsp;";

        this.refresh();

        if (params.sync) {
            this._sSyncId = params.sync;
        }
    },
    XY_PAGER_CLASS = inherits(XY_PAGER, UI_PAGER);

    function GET_INIT_RANGE() {
        return [1, 5];
    }

    /**
     * 隐藏首页/尾页/转到
     * @private
     */
    function HIDE_UNUSED (control) {
        control._uFirst.hide();
        control._uLast.hide();
        hideDom(control._uSummaryText);
        hideDom(control._uGoOp);
    }
    
    XY_PAGER_CLASS.refresh = function () {
        UI_PAGER_CLASS.refresh.call(this);
        HIDE_UNUSED(this);
    };

    /**
     * 获得当前显示的开始/结束页码
     * 覆盖Pager中的同名方法
     * @return {Array} [开始页, 结束页]
     */
    XY_PAGER_CLASS.$getPageNumRange = function () {
        var cur = this._nCurPage,
            size = this._nPageSize,
            total = this._nTotal,
            pageCount = ceil(total / size),
            start = 1,
            end = pageCount + 0;

        if (pageCount > 5) {
            if (cur <= 2) {
                start = 1;
            }    
            else if (cur > 2) {
                if (end - cur < 5) {
                    start = end - 4;
                }
                else {
                    start = cur - 1;    
                }
            }
        }

        return [start, end];
    };

    /**
     * 指示指定页码(默认)
     * 覆盖Pager中的同名方法
     * @param {Number} pageNum 页码, 若为-1则设置到尾页
     *
     * @protected
     */
    XY_PAGER_CLASS.$setCurPage = function (pageNum) {
        var pageNum = parseInt(pageNum, 10),
            pageCount = ceil(this._nTotal / this._nPageSize),
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
                
        for (var i = 0, o, p; o = items[i]; i++) {
            if (end - start < 5) {
                p = o.getBase().innerHTML = start + i;
                if (p > end) {
                    o.hide();
                }
                else {
                    o.show();
                }
            }
            else {
                o.show();
                p  = o.getBase().innerHTML = i < 3 ? start + i : end - (4 - i);
            }
            if (p == pageNum) {
                o.alterClass("cur");
                o.setEnabled(false);
            }
            else {
                o.alterClass("cur", true);
                o.setEnabled(true);
            }
        }

        if (pageCount - start < 5) { 
            hideDom(this._eEllipsis);
        }
        else {		
            showDom(this._eEllipsis);
        }

        this._uPrev.setEnabled(this._nCurPage != 1); 
        this._uFirst.setEnabled(this._nCurPage != 1); 
        this._uNext.setEnabled(this._nCurPage != pageCount); 
        this._uLast.setEnabled(this._nCurPage != pageCount); 

        // 同步对应的分页控件
        if (o = core.get(this._sSyncId)) {
            o._nTotal = this._nTotal + 0;
            o._nPageSize = this._nPageSize + 0;
            this.$setCurPage = blank;
            o.$setCurPage(pageNum);
            delete this.$setCurPage;
        }
    };
        
 })();
