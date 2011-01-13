/**
 * version 0.3
 */

var ecomui = ecomui || {},
    asynMgr = asynMgr || {};

/**
 * IE 6 背景图片缓存
 */
try {
    document.execCommand("BackgroundImageCache", false, true);
} catch (e) {}

(function () {
    /**
     * 适配器
     */
    // {{{
    var lib = baidu, 
        core = ecui, 
        dom = core.dom, 
        libDom = lib.dom,
        ui = core.ui,
        string = core.string,

        init = core.init,
        domQuery = lib.dom.query,
        children = dom.children,
        insertHTML = dom.insertHTML,
        ieVersion = core.browser.ie,
        ffVersion = core.browser.firefox,
        $fastCreate = core.$fastCreate,
        createControl = core.create,
        util = core.util,
        inherits = util.inherits,
        copy = util.copy,
        toNumber = util.toNumber,
        cancel = util.cancel,
        get = core.get,
        query = core.query,
        on = lib.event.on,
        each = lib.array.each,
        blank = util.blank,
        disposeControl = core.dispose,
        loseFocus = core.loseFocus,
        removeDom = dom.remove,
        setText = dom.setText,
        getText = dom.getText,
        toCamelCase = string.toCamelCase,
        libAjax = lib.ajax,
        post = libAjax.post,
        request = libAjax.request,
        jsonToStr = lib.json.stringify,
        queryToJson = lib.url.queryToJson,
        getByteLength = lib.string.getByteLength,

        createDom = dom.create,
        getViewWidth = lib.page.getViewWidth,
        getViewHeight = lib.page.getViewHeight,
        getScrollTop = lib.page.getScrollTop,
        setStyles = lib.dom.setStyles,
        getPosition = dom.getPosition,
        calcHeightRevise = core.calcHeightRevise,
        first = libDom.first,
        last = libDom.last,
        trim = lib.string.trim,

        getParameters = core.getParameters,
        ASYNCSTATEMGR = asynMgr,
        CLICKSHIELD,
        // }}}
        
        DOCUMENT = document,
        UI_LOCKED_TABLE = ui.LockedTable,
        UI_LOCKED_TABLE_CLASS = UI_LOCKED_TABLE.prototype,
        UI_TABLE = ui.Table,
        UI_TABLE_CLASS = UI_TABLE.prototype,
        UI_CONTROL = ui.Control,
        UI_CONTROL_CLASS = UI_CONTROL.prototype,
        UI_CHECKBOX = ui.Checkbox,
        UI_PAGER = ui.Pager,
        UI_PAGER_CLASS = UI_PAGER_CLASS,
        UI_SCROLL = ui.Scroll,
        UI_SCROLL_CLASS = UI_SCROLL.prototype,

        ECOM_TABLE_URL_DEFAULTS = {
            pageParam: "page.curPageNum",
            orderByParam: "orderBy",
            descParam: "desc"
        },

        /**
         * 表格控件
         */
        ECOM_TABLE = ecomui.Table = ui.EcomTable = function (el, params) {
            var defaultUrl = params.defaultUrl,
                tbEl,
                pgEl,
                i = 0,
                o,
                tmp;

            // 给外层容器设置inline-block
            // el.style.cssText += ieVersion && ieVersion < 8 ? "display:inline;zoom:1" : "display:inline-block";
            // el.style.width = el.parentNode.offsetWidth + "px";

            // 表格设置宽度
            // params.width && (tbEl.getElementsByTagName("table")[0].style.width = params.width)
            params.capture = false;

            this._sDefaultUrl = defaultUrl;
            this._sQueryUrl = params.queryUrl || defaultUrl;
            this._sPageUrl = params.pageUrl || defaultUrl;
            this._sSortUrl = params.sortUrl || defaultUrl;
            this._nTbId = params.tbId;

            // 分页, 排序相关参数
            for (o in ECOM_TABLE_URL_DEFAULTS) {
                this["_s" + toCamelCase("-" + o)] = params[o] || ECOM_TABLE_URL_DEFAULTS[o];
            }

            UI_CONTROL.call(this, el, params);

            // 部件
            o = this._eMask 
                = createDom("", 
                        "position:absolute;opacity:0.7;filter:alpha(opacity=70);\
                            background-color:#FFF;top:0;left:0;display:none;\
                            z-index:32765;font-size:14px;text-align:center");
            o.innerHTML = "<span class='ec-ecom-table-loading'></span>";


            this.initRender(el, params);
/*
            
 */           
        },

        ECOM_TABLE_CLASS = inherits(ECOM_TABLE, UI_CONTROL),

        /**
         * 表格主体
         */
        ECOM_TABLE_BODY = ui.EcomTableBody = function (el, params) {
            // 去掉markup里的空文字节点
            el.innerHTML = el.innerHTML.replace(/>(\s+)</g, "><");

            var o, 
                outerWidth;

            o = el.parentNode.getControl();

            try {
                // 记录外层容器的缓存宽度
                outerWidth = (o._nWidth + 0) 
                    || o.getOuter().offsetWidth;
            }
            catch (e) {
                outerWidth = Math.min(
                    el.parentNode.offsetWidth, 
                    getViewWidth() - 80
                ); 
            }

            // FIXME 由于此时样式没加上, 不好读边框宽度, 暂时写死
            outerWidth = outerWidth - 2;

            // 设置外层div宽度
            el.style.width = outerWidth + "px";

            // 渲染表格
            UI_LOCKED_TABLE.call(this, el, params);

            // 显示渲染好的表格
            // this.getOuter().style.visibility = "visible";
            
            // 记录表格索引
            // this._nTbId = params.tbId;
            
            // 是否采用同步操作
            this._bSyncOp = params.syncOp == true;

            // 是否有选择整列表按钮
            this._bCustom = params.custom;
            
            this._bNoData = params.noData === true;
            
            // 如果有操作列
            if (params.rightLock) {
                //初始操作列是展开的
                this._bOpColUnfolded = true;
                
                el = this.getBase(); 
                
                //收缩按钮
                (this._uColToggler = $fastCreate(
                    UI_CONTROL,
                    o = createDom('ec-col-toggler'),     
                    this
                )).$click = ECOM_TABLE_TOGGLERCLICK;
                el.appendChild(o);

                ieVersion >= 8 && (o.style.display = "none");

                //竖条
                (this._uVerticalBar = $fastCreate(
                    ECOM_TABLE_VBAR,
                    o = createDom('ec-v-toggler'),     
                    this
                )).$click = ECOM_TABLE_VBARCLICK;
                o.innerHTML = "<div></div>";
                el.appendChild(o);
                this._uVerticalBar.hide();
                this._uVerticalBar.show = ECOM_TABLE_VBARSHOW;

                // 如果有纵向滚动条, 调整收缩按钮的位置, o代替滚动条
                o = this._uVScroll;
                this._uColToggler.getOuter().style.right = 
                    ((o && o.isShow()) ? o.getWidth() : 0) + "px";

            }

            //浮动表头
            if (params.floatThead) {
                var self = this;

                self._bFloatThead = true;
                on(window, "scroll", function () {
                    ECOM_TABLE_FLOATTHEAD(self);
                });    
            }

            // 双击事件处理, 默认取挂到prototype上的
            this.getOuter().ondblclick = this.ondblclick;
    },

    ECOM_TABLE_BODY_CLASS = inherits(ECOM_TABLE_BODY, UI_LOCKED_TABLE),

    ECOM_PAGER = ui.EcomPager = function (el, params) {
        // 设置外层div宽度
        UI_PAGER.call(this, el, params);
    },
    ECOM_PAGER_CLASS = inherits(ECOM_PAGER, UI_PAGER),
    
    ECOM_TABLE_VBAR = function (el, params) {
        UI_CONTROL.call(this, el, params);
    },

    ECOM_TABLE_VBAR_CLASS = inherits(ECOM_TABLE_VBAR, UI_CONTROL),

    /**
     * 行控件构造函数
     */
    ECOM_TABLE_BODY_ROW = ECOM_TABLE_BODY.Row = function (el, params) {
        UI_LOCKED_TABLE.Row.call(this, el, params);

        // 初始化checkbox
        var o = el.cells[0].getElementsByTagName("input");
        if (o[0] && o[0].type == "checkbox") {
            o = o[0];
            o.value = trim(o.value);
            this._cCheckbox = createControl("checkbox", {
                element: o, 
                superior: o.getAttribute("data-superior")
            });
        }
    },

    ECOM_TABLE_BODY_ROW_CLASS = inherits(ECOM_TABLE_BODY_ROW, UI_LOCKED_TABLE.Row);

    ECOM_TABLE_CLASS.$cache = function (style, cacheSize) {
        UI_CONTROL_CLASS.$cache.call(this, style, cacheSize);

        // 不缓存高度
       // delete this._nHeight; 
        this._uTable && this._uTable.cache();
        this._uPager && this._uPager.cache();
    };

    ECOM_TABLE_CLASS.$init = function () {
       UI_CONTROL_CLASS.$init.call(this);
       this._uTable && this._uTable.init();
       this._uPager && this._uPager.init();

       // 在有表格的情况下重设大小, 防止异步表格遮罩期间高度被清空
       document.body.offsetWidth;
       this._uTable && this.resize(); 
    };

    // 屏蔽setSize, 让其自适应宽高
    ECOM_TABLE_CLASS.$setSize = blank;

    ECOM_TABLE_CLASS.$resize = function () {
        var that = this,
            fn = function() {
                var outer = that.getOuter(),
                    table = that._uTable,
                    pager = that._uPager,
                    width,
                    scrollTop;

                if (table && table.getOuter()) {
                    // 手动记录resize之前滚动条的位置
                    scrollTop = getScrollTop();

                    table.hide();
                    pager && pager.hide();
                    document.body.offsetWidth;

                    // 读取隐藏内部元素后的容器宽度
                    // 设置100% for IE6
                    outer.style.width = "100%";
                    width = outer.offsetWidth;
                    outer.style.width = "";

                    table.show();
                    pager && pager.show();
                    width = ieVersion < 8 ? width : outer.offsetWidth;
                    table.setSize(width);

                    // 调整竖条位置
                    if (table._uVerticalBar && table._uVerticalBar.isShow()) {
                        table._uVerticalBar.resize();
                    }

                    // for IE
                    document.body.offsetWidth;
                    outer.className += "";

                    window.scrollTo(0, scrollTop);
                }
            };

            // 项目中用到css expression设置页面最小宽度, 影响读取表格宽度的准确性
            // 此处加上延时, 让css expression计算完在进行表格大小计算
            // 由于加入延时, 同时此处resize的方式比较特别, 浏览器不会记录之前滚动条的位置, 故需要手动记录
            // 加延时后, ie 8标准模式下有不断resize的问题, 需要特殊处理
            if (ieVersion < 8) {
                setTimeout(fn, 10);
            }
            else {
                fn();
            }
    };

    /**
     * 初始化渲染
     * 在构造函数的内部调用
     */
    ECOM_TABLE_CLASS.initRender = function (el, params) {
        this.oninitrender && (this.oninitrender(el, params) === false)
            || this.$initRender(el, params);
    };

    /**
     * 默认初始化渲染
     */
    ECOM_TABLE_CLASS.$initRender = function (el, params) {
        var tbEl = domQuery(".ec-ecom-table-el", el)[0],
            pgEl = domQuery(".ec-ecom-pager-el", el)[0],
            o = this._eMask;

        try {
            this._uTable = $fastCreate(ECOM_TABLE_BODY, tbEl, this, getParameters(tbEl));
            pgEl && (this._uPager = $fastCreate(ECOM_PAGER, pgEl, this, getParameters(pgEl)));

            el.insertBefore(o, children(el)[0]);
        }
        catch (e) {}
    };

    ECOM_TABLE_CLASS.onresize = function() {
        // alert("onresize: " + this.getWidth());
    };

    ECOM_TABLE_CLASS.onShieldInit = function () {
        CLICKSHIELD = core.ext.clickShield;
    };

   
    /**
     * 初始化
     */
    ECOM_TABLE_BODY_CLASS.$init = function () {
        UI_LOCKED_TABLE_CLASS.$init.call(this);

        var headCell = this.getCol(0).getOuter(),
            o;

        this._uOpCol = this.getCol(this._aCol.length - 1);

        // 初始化表头的checkbox
        o = headCell.getElementsByTagName("input");
        if (o[0] && o[0].type == "checkbox") {
            o = o[0];
            this._cHeadCheckbox = createControl("checkbox", {
                id: o.getAttribute("data-id"),
                element: o
            });
        }

        // 表头点击(排序)
        this._uHead.getBody().cells[0].getControl()
            .constructor.prototype.$click = ECOM_TABLE_HEADCELLCLICK;

        // 整列表选择按钮
        if (this._bCustom) {
            var customBtn = core.get("cbCtnr_" + this._nTbId);
            customBtn && ECOM_TABLE_CUSTOMBTNINIT(customBtn, this);
        }
    };
    
    /**
     * 默认鼠标移动事件, 在表头单元格交界处改变指针样式
     */
    ECOM_TABLE_BODY_CLASS.$mousemove = function (event) {
        var outer = this.getOuter(),
            pos = getPosition(outer),
            offsetX = event.pageX - pos.left + this.getScrollLeft();
       
        this._nOldX = offsetX;
        if (event.pageY - pos.top < this._uHead.getHeight()) {
            for (var i = 0, cols = this.getCols(), o; o = cols[i]; i++) {
                offsetX -= o.getWidth();
                if (Math.abs(offsetX) < 3) {
                    outer.style.cursor = "col-resize";
                    this._nDragCol = i;
                    return;
                }
                else if (offsetX < 0)  {
                    break;
                }
            }
        }
        outer.style.cursor = '';
    };

    /**
     * 默认鼠标点击, 按鼠标样式判断是否进入拖动状态
     */
    ECOM_TABLE_BODY_CLASS.$mousedown = function(event) {
        var outer = this.getOuter();
        if (outer.style.cursor) {
            this.onmousemove = ECOM_TABLE_BODY_DRAGMOVE;
            this.onmouseup = ECOM_TABLE_BODY_DRAGUP;
            // 拖拽时取消选择
            outer.onselectstart = cancel; // ie
            outer.style.MozUserSelect = "none"; // ff
            outer.onmousedown = cancel; // other
        }
    };
    
    /**
     * 拖动状态下的鼠标移动
     */
    function ECOM_TABLE_BODY_DRAGMOVE (event) {
        var outer = this.getOuter(),
            pos = getPosition(outer),
            offsetX = event.pageX - pos.left + this.getScrollLeft(),
            col = this.getCols()[this._nDragCol],
            minWidth = col._nMinWidth || Math.max(50, getText(col.getOuter()).length * 15 + col.getInvalidWidth()),
            deltaWidth = Math.max(minWidth - col._nWidth, offsetX - this._nOldX);

        col._nMinWidth = minWidth;
        
        col.setSize(col._nWidth + deltaWidth);
        this._nOldX += deltaWidth;
        
        this.paint();
        return false;
    }
    
    /**
     * 拖动状态下的鼠标松开
     */
    function ECOM_TABLE_BODY_DRAGUP (event) {
        var outer = this.getOuter();

        delete this.onmousemove;
        delete this.onmouseup;
        outer.onselectstart = blank;
        outer.style.MozUserSelect = "";
        outer.onmousedown = blank;
    }

    /**
     * 双击表头自动扩展列宽
     * TODO 禁用选择
     */
    ECOM_TABLE_BODY_CLASS.ondblclick = function (event) {
        var control = this.getControl();
        if (this.style.cursor == "col-resize") {
            var col = control.getCols()[control._nDragCol],
                maxWidth = ECOM_TABLE_GETMAXCOLWIDTH(control, control._nDragCol);

            col.setSize(maxWidth); 
            control.paint();
            return false;
        }
    };

    /**
     * 获取指定列双击时可以扩展的最大宽度
     * 按照所含字数最多的单元格计算
     * @params {Control} control
     * @params {Number} colIndex
     *
     * @return {Number} 最大宽度
     */
    function ECOM_TABLE_GETMAXCOLWIDTH (control, colIndex) {
        var col = control.getCols()[colIndex],
            rows = control.getRows(),
            ret = 0; // TODO 获得表头对应单元格的最小宽度

        if (col._nMaxWidth) {
            return col._nMaxWidth;
        }

        for (var i = 0, o; o = rows[i++];) {
            o = o.getCols()[colIndex];
            ret = Math.max(ret, 
                (getByteLength(getText(first(o.getOuter())))/2) * 13);
        }

        col._nMaxWidth = ret;
        return ret;
    }

    /**
     * 按文字过滤行
     * @public
     */
    ECOM_TABLE_BODY_CLASS.grepOn = function (text) {
        var rows = this.getRows();
        for (var i = 0, o; o = rows[i++];) {
            each(domQuery("td>div", o.getOuter()), function(n, i) {
                var cellText = getText(n);        
                if (cellText.search(text) != -1) {
                    o._bGrepMatch = true;
                }
            });

            if (o._bGrepMatch === true) {
                o.hide();
                o._bGrepHide = true;
            }
        }
    };



    ECOM_PAGER_CLASS.$init = function () {
        UI_PAGER.$init && UI_PAGER.$init.call(this);
        this.setSize(this.getParent()._uTable.getWidth());
    };


    /**
     * 展开/收起按钮点击
     * @private
     */
    function ECOM_TABLE_TOGGLERCLICK(event) {
        UI_CONTROL_CLASS.$click.call(this, event);

        var table = this.getParent(),
            vBar = table._uVerticalBar;

        // 展开/收起操作列
        ECOM_TABLE_TOGGLEOPCOL(table);
    }

    /**
     * 展开/收起操作列
     * @private
     *
     * @param {ecui.ui.EcomTable} control
     * @param {Boolean} foldFlag 强制操作: true-收起, false-展开, 不传此参数则自动判断
     */
    function ECOM_TABLE_TOGGLEOPCOL(control, foldFlag) {
        var foldFlag = foldFlag || control._bOpColUnfolded,
            col = control.getCol(control.getCols().length - 2);

        control._uOpCol[foldFlag ? "hide" : "show"]();

        if (control._uHScroll && control._uHScroll.isShow()) {
            col.setSize(col.getWidth());
            document.body.offsetWidth;
            control.setSize(control.getParent().getWidth() - control.getParent().getInvalidWidth());
        }
        else {
            document.body.offsetWidth;
            col.setSize(col.getWidth() + (foldFlag ? 1 : -1) * control._uOpCol.getWidth());
        }

        // 收缩按钮/竖条的显示控制
        control._uColToggler.alterClass("o", !foldFlag);
        control._uVerticalBar[foldFlag ? "show" : "hide"]();

        control._bOpColUnfolded = !foldFlag;
    }

    /**
     * 竖条点击
     * @private
     */
    function ECOM_TABLE_VBARCLICK(event) {
        UI_CONTROL_CLASS.$click.call(this, event);
        
        // 展开操作列
        ECOM_TABLE_TOGGLEOPCOL(this.getParent(), false);
    }

    /**
     * 显示竖条
     * @private
     */
    function ECOM_TABLE_VBARSHOW() {
        UI_CONTROL.prototype.show.call(this);
        this.resize();
    }

    /**
     * 表头随浏览器滚动条锁定
     * @private
     */
    function ECOM_TABLE_FLOATTHEAD(t) {
        var headEl = t._uHead.getOuter(),
            lockedHeadEl = t._uLockedHead.getOuter(),
            lockedMainEl = t._uLockedMain.getOuter();
        
        if (t._uColToggler) {
            var colTogglerEl = t._uColToggler.getOuter();
        }

        var outer = t.getOuter();

        var scrollTop = DOCUMENT.body.scrollTop || DOCUMENT.documentElement.scrollTop,
            pos = getPosition(outer),
            top = pos.top + 1,
            left = pos.left;

        var headHeight = headEl.offsetHeight + calcHeightRevise(headEl),
            tbHeightDelta = t.getHeight() - headHeight,
            relativeTop = scrollTop - top;

        var floatStyles = {
            position: "absolute",
            top: relativeTop + "px",
            zIndex: 999
        };
        
        if (scrollTop 
                && relativeTop > 0 
                && relativeTop < tbHeightDelta) 
        {
            setStyles(headEl, floatStyles);
            setStyles(lockedHeadEl, floatStyles);
            setStyles(lockedMainEl, {top: headHeight + "px"});

            //TODO 此处性能优化
            //ecui 1.1.0 fix
            setStyles(lockedHeadEl, {width: lockedHeadEl.getElementsByTagName("table")[0].style.width});

            if (colTogglerEl) {
                setStyles(colTogglerEl, {top: 2 + relativeTop + "px", zIndex: 999});
            }
        }
        
        else {
            setStyles(headEl, {top: 0, zIndex:0});
            setStyles(lockedHeadEl, {position: "static", zIndex:0});
            setStyles(lockedMainEl, {top: ""});

            if (colTogglerEl) {
                setStyles(colTogglerEl, {top: "", zIndex:0});
            }
        }
    };
    
    /**
     * 初始化整列表选择按钮
     */
    function ECOM_TABLE_CUSTOMBTNINIT(customBtn, table) {
        var tbId = table._nTbId;
        
        var    popup = core.get("cbPop_" + tbId),
            popupItems = core.query({"parent": popup}),
            popupItemsLen = popupItems.length;
            
        var    cbCurList = core.get("cball_" + tbId),
            cbWholeList = core.get("cbsall_" + tbId),
            cbCurInferiors = cbCurList.getInferiors();
        
        DOCUMENT.body.appendChild(popup.getOuter());
        
        customBtn.onclick = function () {
            var containerOuter = this.getOuter();
                containerPos = getPosition(containerOuter);

            popup.setPosition(
                containerPos.left + this.getBodyWidth(), 
                containerPos.top
            );

            popup.show();
        };
        
        cbWholeList.onclick = (function () {
            var checked = false;
            return function () {
                var i = cbCurInferiors.length,
                    msg = [
                        "已选择整列表, 子项目不能取消选择",
                        "已取消选择整列表"
                    ];
                
                var msgBox = table.setMsg((!checked) ? msg[0] : msg[1]);
                    
                msgBox.parentNode.parentNode.style.visibility = "visible";
                
                var hcbsall = lib.dom.g("hcbsall_" + tbId);

                while (i--) {
                    cbCurInferiors[i].setChecked(!checked);
                    cbCurList.setEnabled(checked);
                    cbCurInferiors[i].setEnabled(checked);
                }

                hcbsall.value = checked ? 0 : 1;    

                checked = !checked;
            }
        })();

        while (popupItemsLen--) {
            popupItems[popupItemsLen].onclick = function () {
                var cb = core.query({"parent":this})[0];
                cb.click();
            };
        }    
    }
    
    /**
     * 竖条默认resize处理
     */
    ECOM_TABLE_VBAR_CLASS.$resize = function () {
        UI_CONTROL_CLASS.$resize.call(this);

        var table = this.getParent(),
            width = this.getWidth(),
            vScroll = table._uVScroll,
            hScroll = table._uHScroll,
            style = table.getBase().style,
            contentWidth = table.getWidth()
                - (toNumber(style.borderLeftWidth) + toNumber(style.borderRightWidth)),
            o;

        // style 为竖条的样式
        style = this.getOuter().style;

        // 设置竖条的位置
        style.left = contentWidth - width
            - ((vScroll && vScroll.isShow()) ? vScroll.getWidth() : 0)
            + "px";

        // 设置竖条的高度
        if (hScroll && hScroll.isShow()) {
            o = hScroll.isShow() ? hScroll.getHeight() : 0;
        }
        else {
            o = 0;
        }

        this.setSize(0, table.getBodyHeight() - o);
        style.bottom = o + "px";
    };

    /**
     * 表格setSize默认处理
     * 修复滚动条不出现但是站位的问题
     */
    ECOM_TABLE_BODY_CLASS.$setSize = function(width, height) {

        if (this._cVScroll && !this._cVScroll.isShow()) {
            this._cVScroll._nWidth = 0;
        }

        try {
            UI_LOCKED_TABLE_CLASS.$setSize.call(this, width, height);

            if (ffVersion) { // firefox fix
                for (var i = 0, o, lockedRow; lockedRow = this._aLockedRow[i++]; ) {
                    o = lockedRow._cJoint.getCol(this._nLeft).getOuter();
                    o.getElementsByTagName("div")[0].style.height = o.style.height;
                }
            }
        }
        catch (e) {}

        // alert(this.$cache$mainWidth + ":" + this.getBodyWidth());
    };

    /**
     *  表格默认resize处理
     */
    ECOM_TABLE_BODY_CLASS.$resize = function () {
        UI_LOCKED_TABLE_CLASS.$resize.call(this);

        // 修正竖条的大小
        this._uVerticalBar && this._uVerticalBar.resize();
        
        // 修正浮动表头的位置
        this._bFloatThead && ECOM_TABLE_FLOATTHEAD(this);
    };

    /**
     * 表头单元格点击
     */
    function ECOM_TABLE_HEADCELLCLICK(event) {
        var el = this.getOuter(), 
            o;

        if ((o = el.getAttribute("sort")) !== null) {
            ECOM_TABLE_BODY_CLASS.sort.call(this, o);
        }

        UI_CONTROL_CLASS.$click.call(this, event);
    }


    /**
     * 排序
     */
    ECOM_TABLE_BODY_CLASS.sort = function (orderBy) {
        var o = this.getParent();  
        o.isEnabled() && o.onsort
            && o.onsort.call(this, orderBy) === false
            || o.$sort.call(this, orderBy);
    };

    ECOM_TABLE_BODY_CLASS.$sort = function (orderBy) {};

    /**
     * 找出table中被选中行
     * @public
     *
     * @return {Array} 被选中行
     */
    ECOM_TABLE_BODY_CLASS.getChecked = function () {
        var ret = [];
        try {
            var col = this.getCol(0), 
                cbs = core.get("cball_" + this.getParent()._nTbId),
                cbs = (cbs instanceof core.ui.Checkbox) ? cbs : core.query({"parent": cbs})[0],
                cbs = cbs.getInferiors(),
                i = cbs.length;
    
            while (i--) {
                if (cbs[i].isChecked()) {
                    ret.push(cbs[i].getParent());
                }
             }
        } catch (e) {}
        return ret;
    };

    /**
     * 找出table中被选中行个数
     * @public
     *
     * @return {Number} 被选中行的个数
     */ 
    ECOM_TABLE_BODY_CLASS.getCheckedCount = function () {
        return this.getChecked().length;
    };    

    /**
     * 将所有选中checkbox的name/value转成url串
     * @public
     *
     * @return {String} url参数串
     */
    ECOM_TABLE_BODY_CLASS.getCheckedStr = function (name) {
        var ret = [];
        try {
            this.eachRow(function (n, i, cb) {
                if (cb && cb.isChecked()) {
                    ret.push([name || cb.getName(), cb.getValue()].join("="));
                }        
            }); 
        }
        catch (e) {}

        return ret.length > 0 ? ret.join("&") : "";
    };
    
    /**
     * 设置消息
     * @public
     * 
     * @return {HTMLElement} 消息div元素
     */
    ECOM_TABLE_BODY_CLASS.setMsg = function (msg) {
        var msgBox = lib.dom.g("tbMsg_" + this.getParent()._nTbId);
        dom.setText(msgBox, msg);
        return msgBox;
    };


    /**
     * 遍历表格每一行运行回调函数
     *
     * @public
     * @param {Function} func 回调函数
     *
     * @desc func参数的this为行控件
     *        @param {Control} n 行控件
     *        @param {Number}  i 索引
     *        @param {Control} checkbox 该行的checkbox
     */
    ECOM_TABLE_BODY_CLASS.eachRow = function (func) {
        each(this._aRow, function (n, i) {
            var checkbox = n._cCheckbox;
            func && func.call(n, n, i, checkbox);
        });
    };

    /**
     * 选中满足条件的行
     *
     * @public
     * @param {Function} func 回调函数
     *
     * @desc func参数的this为行控件, 返回值确定该行是否选中
     *        @param {Control} n 行控件
     *        @param {Number}  i 索引
     *        @return {Boolean} 是否选中
     */
    ECOM_TABLE_BODY_CLASS.checkRows = function (func) {
        this.eachRow(function (n, i, checkbox) {
            checkbox.setChecked(false);
            if (func && func.call(n, n, i, checkbox)) {
                checkbox.setChecked(true);
            }
        });
    };
    
    /**
     * 判断表格数据是否为空
     * 
     * @public
     */
    ECOM_TABLE_BODY_CLASS.isEmpty = function () {
        return this._bNoData;
    };

    /**
     * 将_uTable下的一些公共方法绑定到到表格容器上
     */
    (function () {
        var methodNames = ["getChecked", "getCheckedCount", "getCheckedStr", "isEmpty", "eachRow", "checkRows"];
        for (var i = 0, o; o = methodNames[i++];) {
            ECOM_TABLE_CLASS[o] = (function () {
                var method = o;
                return function () {
                    var t = this._uTable;
                    return t[method].apply(t, arguments);
                }
            })();
        }
     
     })();

    /**
     * 分页处理
     */
    ECOM_PAGER_CLASS.onpageset = function (pageNum) {};

    /**
     * 锁定表格
     * 内部使用 会触发二次点击屏蔽组件
     */
    ECOM_TABLE_CLASS.setLocked = function (lock, msg) {
        if (lock) {
            this.lock(msg);
            (CLICKSHIELD) && (CLICKSHIELD.lock(this));
        }
        else {
            this.unlock();
            (CLICKSHIELD) && (CLICKSHIELD.unlock(this));
        }
    };

    /**
     * 锁定表格
     */
    ECOM_TABLE_CLASS.lock = function (msg) {
        var mask = this._eMask,
            msg = msg || "请稍候...",
            outer = this.getOuter(),
            height,
            lineHeight;
        height = Math.max(outer.offsetHeight, 100);
        lineHeight = Math.min(height, 
                getScrollTop() + getViewHeight() - Math.min(outer.offsetTop, getScrollTop()));

        setStyles(mask, {
            width: outer.offsetWidth,
            height: height + "px",
            lineHeight: lineHeight + "px",
            display: "block"
        });

        setStyles(outer, {height: height + "px"});

        setText(mask.getElementsByTagName("span")[0], msg);
    };

    /**
     * 解除锁定表格
     */
    ECOM_TABLE_CLASS.unlock = function (msg) {
        var mask = this._eMask,
            outer = this.getOuter();
        mask.style.display = "none";
        document.body.offsetWidth;
        outer.style.height = "";

        // for IE 不显示问题
        document.body.offsetWidth;
        outer.className += "";
    };

    /**
     * 移除所有行
     */
    UI_TABLE_CLASS.removeRows = function() {
        this.paint = blank;

        for (var i = 0, len = this.getRows().length; i < len; i++) {
            try {
                this.removeRow(0);
            }
            catch (e) {}
        }

        delete this.paint;
        this.paint();
    };

    /**
     * 在表格末尾追加新行
     */
    UI_TABLE_CLASS.addRows = function(data) {
        this.paint = blank;

        for (var i = 0, o; o = data[i++];) {
            o !== undefined && this.addRow(o);
        }

        delete this.paint;
        this.paint();
    };

    /**
     * 更新表格数据
     */
    UI_TABLE_CLASS.update = function(data) {
        this.removeRows();    
        this.addRows(data);
    };

    /**
     * 获取表格单元格数据
     * @public
     */
    ECOM_TABLE_CLASS.getCellHTML = function (x, y) {
        var ret = "";
        try {
            ret = this._uTable.
                getRows()[x].getCols()[y].getOuter();
        }
        catch (e) {
            throw new Error("没有找到单元格");
        }

        ret = ret.getElementsByTagName("div")[0].innerHTML;

        return ret;
    };

    /**
     * 获取总行数
     * @public
     * 
     * @return {Number} 行数
     */
    ECOM_TABLE_CLASS.getRowCount = function () {
        return this._uTable.getRows().length;
    };

    /**
     * 获取表头数据
     * @public
     *
     * @return {Array} 包含表头文字的数组
     */
    ECOM_TABLE_CLASS.getHeadData = function() {
        var ths = this._uTable._uHead.getOuter()
                .getElementsByTagName("th"),
            ret = [];

        each(ths, function(n, i) {
            ret.push(getText(n));
        });

        return ret;
    };

    ECOM_TABLE_CLASS.getHeadDataStr = function() {
        return jsonToStr(this.getHeadData());
    };

    /**
     * 获取表体数据
     * @public
     *
     * @return {Array} 包含表体数据的二维数组
     */
    ECOM_TABLE_CLASS.getBodyData = function() {
        var content = this._uTable.getBody().getElementsByTagName("table")[0],
            rows = content.rows,
            ret = [];
        for (var i = 0, o; o = rows[i]; i++) {
            ret.push([]);
            o = o.cells;
            for (var j = 0, p; p = o[j++];) {
                ret[i].push(getText(p));
            }
        } 
        return ret;
    };

    ECOM_TABLE_CLASS.getBodyDataStr = function() {
        // TODO 有死循环
        return jsonToStr(this.getBodyDataStr());
    };

    /**
     * 获取表格控件
     * @public
     *
     * @param {String|Number} 表格控件的id或者索引, 不传此参数则返回第一个表格
     */
    ecomui.getTable = function(name) {
        if (typeof name == "string") {
            return core.get(str);
        }
        else if (typeof name == "number") {
            return core.query({type: ui.EcomTable})[name] || null;
        }
        else {
            return core.query({type: ui.EcomTable})[0] || null;
        }
    };

})();
/* vim:set fdm=marker: */
