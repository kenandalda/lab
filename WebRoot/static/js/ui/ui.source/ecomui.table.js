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
        UI_ITEM = ui.Item,
        UI_ITEM_CLASS = UI_ITEM.prototype,
        UI_ITEMS = ui.Items,
        UI_CHECKBOX = ui.Checkbox,
        UI_CHECKBOX_CLASS = UI_CHECKBOX.prototype,

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


            if ((tmp = children(el)).length >= 1) {
                tbEl = domQuery(".ec-ecom-table-el", el)[0];
                pgEl = domQuery(".ec-ecom-pager-el", el)[0];
                // 同步渲染
                this._uTable = $fastCreate(ECOM_TABLE_BODY, tbEl, this, getParameters(tbEl));
                pgEl && (this._uPager = $fastCreate(ECOM_PAGER, pgEl, this, getParameters(pgEl)));

                el.insertBefore(o, children(el)[0]);
            }
            else {
                el.appendChild(o);
                // 如果当前页面有保存的状态, 则恢复状态
                if (jsonToStr(o = ASYNCSTATEMGR.getCurState("lst_" + this._nTbId)) != "{}") {
                    this.recover(o); 
                }
                else {
                    // 如果当前页面没有保存的状态, 则请求默认地址进行初始化
                    this.post(params.defaultUrl);
                }
            }
            
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
            if (params.custom) {
                this._sAllDataName = typeof params.custom == 'string' ? params.custom : 'isAllData';
            }
            
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
            if (ieVersion < 7) {
                setTimeout(fn, 10);
            }
            else {
                fn();
            }
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
            this._cCheckCurPage = createControl("checkbox", {
                id: o.getAttribute("data-id"),
                element: o
            });
        }
        // 当前页/整列表选择控件
        else if ((o = headCell.getElementsByTagName('div'))
            && o[0] && o[0].className == 'cb-ctnr') 
        {
            o = o[0];
            var dataId = o.getAttribute('data-id');
            this._cHeadPopup = createControl('ecom-table-body-head-popup', {
                id: 'cbctnr_' + dataId,
                cbid: 'cball_' + dataId,
                allDataName: this._sAllDataName,
                element: o
            })
            o = this._cHeadPopup.getItems();
            this._cCheckCurPage = o[0]._uCheckbox;
            this._cCheckAllData = o[1]._uCheckbox;
        }


        // 表头点击(排序)
        this._uHead.getBody().cells[0].getControl()
            .constructor.prototype.$click = ECOM_TABLE_HEADCELLCLICK;

    };


    /**
     * 异步提交, 成功后写状态
     */
    ECOM_TABLE_CLASS.post = function (url, options) {
        var asyncMgr = this._oAsyncMgr 
            = new ASYNCMGR();

        this.setLocked(true);

        asyncMgr.beforePost = ECOM_TABLE_BEFOREPOST;
        asyncMgr.onerror = this.onReqError;

        asyncMgr.post(this, url, options)
            .$success = function (control, xhr, res, reqInfo) {
                this.constructor.prototype.$success.call(this, control, xhr, res, reqInfo);

                var data = reqInfo.data;
                ASYNCSTATEMGR.updateStateData(data)
                control.onReqSuccess && control.onReqSuccess.call(this, control, xhr, res);
            };

        return asyncMgr;
    };

    /**
     * 异步恢复, 成功后不会写hash
     * @public
     */
    ECOM_TABLE_CLASS.recover = function (data) {
        var asyncMgr = this._oAsynMgr = new ASYNCMGR(),
            urlType = queryToJson(ECOM_TABLE_GETTBSTATE(this, data)).urlType || "default",
            url = this["_s" + toCamelCase("-" + urlType) + "Url"];

        this.setLocked(true);

        asyncMgr.beforePost = ECOM_TABLE_BEFOREPOST;
        asyncMgr.post(this, url, {data: data})
            .$success = function(control, xhr, res, reqInfo) {
                this.constructor.prototype.$success.call(this, control, xhr, res, reqInfo);
                control.onReqSuccess && control.onReqSuccess.call(this, control, xhr, res);
        };

        return asyncMgr;
    };

    /**
     * 获取状态数据中的表格数据
     */
    function ECOM_TABLE_GETTBSTATE(control, data) {
        return data["lst_" + control._nTbId] || "";
    }

    /**
     * 改写状态数据中的表格数据
     */
    function ECOM_TABLE_SETTBSTATE(control, data, str) {
        data["lst_" + control._nTbId] = str;
        return data;
    }

    /**
     * 提交请求前将数据转成可以提交的格式
     */
    function ECOM_TABLE_BEFOREPOST(control, url, options) {
        var data = ASYNCSTATEMGR.convertToUrl(options.data);
        return {
            url: url, 
            data: data
        };
    }

    /**
     * 异步查询, 封装ECOM_TABLE_CLASS.post
     * @public
     */
    ECOM_TABLE_CLASS.asynQuery = function (data) {
        var o = ECOM_TABLE_GETTBSTATE(this, data),
            data;

        o += "&urlType=query";
        data = ECOM_TABLE_SETTBSTATE(this, data, o);

        this.post(this._sQueryUrl, {data: data});
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
     * 默认排序
     * this为单元格控件
     */    
    ECOM_TABLE_BODY_CLASS.$sort = function (orderBy) {
        var parent = this.getParent().getParent(),
            orderByParam = parent._sOrderByParam,
            descParam = parent._sDescParam,
            sortUrl = parent._sSortUrl,
            desc,
            data = ASYNCSTATEMGR.getCurState("lst_" + parent._nTbId),
            sortProps = [
                [orderByParam, orderBy].join("="),
                [descParam, desc = parent.getNextDesc(orderBy)].join("=")
            ].join("&");

        sortProps += "&urlType=sort";

        data = ECOM_TABLE_SETTBSTATE(parent, data, sortProps);
        parent.post(sortUrl, {data: data});
    };

    ECOM_TABLE_CLASS.getNextDesc = function (orderBy) {
        // 默认升序(desc为false)
        return this._sOrderByVal == orderBy ? !this._bDesc : false;
    };

    /**
     * 排序
     */
    ECOM_TABLE_BODY_CLASS.sort = function (orderBy) {
        var o = this.getParent();  
        o.isEnabled() && o.onsort
            && o.onsort.call(this, orderBy) === false
            || o.$sort.call(this, orderBy);
    };

    /**
     * 根据异步返回HTML重新渲染表格
     */
    ECOM_TABLE_CLASS.renderBody = function (html) {
        var outer = this.getOuter(),
            self = this,
            tbEl,
            pgEl;

        if (this._uTable) {
            this._uTable.setEnabled(false); // 禁用控件, 防止闭包里的overedControl记住控件
            disposeControl(this._uTable);
            removeDom(domQuery(".ec-ecom-table-el", outer)[0]);
        }

        if (this._uPager) {
            this._uPager.setEnabled(false); // 禁用控件, 防止闭包里的overedControl记住控件
            disposeControl(this._uPager);
            // 可能没有分页
            try {
                removeDom(domQuery(".ec-ecom-pager-el", outer)[0]);
            } catch (e) {}
        }

        // 删除其他无用的DOM
        each(children(outer), function(n, i) {
           if (n != self._eMask) {
                removeDom(n);
           }    
        });


        insertHTML(this._eMask, "afterEnd", html);

        tbEl = domQuery(".ec-ecom-table-el", outer)[0];
        pgEl = domQuery(".ec-ecom-pager-el", outer)[0];

        if (tbEl) {
            this._uTable = $fastCreate(ECOM_TABLE_BODY, tbEl,
                this, getParameters(tbEl)
            );

            this._uTable.cache();
            this._uTable.init();
        }

        if (pgEl) {
            this._uPager = $fastCreate(ECOM_PAGER, pgEl,
                this, getParameters(pgEl)
            );
            this._uPager.cache();
            this._uPager.init();
        }

        // 清除上一次异步设置的高度
        this.resize();
    };

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
     * 分页请求
     */
    ECOM_PAGER_CLASS.onpageset = function (pageNum) {

        var parent = this.getParent(),
            pageParam = parent._sPageParam,
            pageUrl = "" + parent._sPageUrl,
            pageProps = [pageParam, pageNum].join("="),
            data = ASYNCSTATEMGR.getCurState("lst_" + parent._nTbId);

        // 同步分页
        if (parent._uTable._bSyncOp) {
            parent.setLocked(true);
            location.href = document.forms['query'].action + "?" 
                + pageParam + "=" + pageNum;            
            return;
        }

        if (parent._sOrderByVal) {
            pageProps += "&" + [
                [parent._sOrderByParam, parent._sOrderByVal].join("="),
                [parent._sDescParam, parent._bDesc].join("=")
            ].join("&");
        }

        pageProps += "&urlType=page";

        // 改写异步状态中的表格状态
        data = ECOM_TABLE_SETTBSTATE(parent, data, pageProps);

        parent.post(pageUrl, {data: data});
        return false;
    };

    /**
     * 当前页/整列表选择控件
     */
    var ECOM_TABLE_BODY_HEAD_POPUP 
        = ui.EcomTableBodyHeadPopup
        = function (el, params) {
        el.innerHTML = '<div class="' + params.type + '-content" style="position:absolute;z-index:32765">'
            + '<div><input type="checkbox" data-id="' + params.cbid + '"/>当前页</div>'
            + '<div><input type="checkbox" name="' + params.allDataName + '" />整列表</div>'
            + '</div>';
        UI_CONTROL.call(this, el, params);    
        var body = first(el);
        this.$setBody(body);
        this.$initItems();
        document.body.appendChild(body);
        body.style.display = 'none';
    },
    ECOM_TABLE_BODY_HEAD_POPUP_CLASS = inherits(ECOM_TABLE_BODY_HEAD_POPUP, UI_CONTROL),
    ECOM_TABLE_BODY_HEAD_POPUP_ITEM = ECOM_TABLE_BODY_HEAD_POPUP.Item = function (el, params) {
        UI_ITEM.call(this, el, params);
        var parent = this.getParent(),
            checkbox = first(el),
            cbid = checkbox.getAttribute('data-id');
        this._uCheckbox = createControl('checkbox', {
            id: cbid || 'cbsall' + new Date().getTime(),
            element: checkbox
        });
        if (cbid) {
            // 当前页
            this._uCheckbox.$click = ETBHP_ITEM_CPCLICK;
        }
        else {
            // 整列表
            this._uCheckbox.$click = ETBHP_ITEM_ADCLICK;
        }
    },
    ECOM_TABLE_BODY_HEAD_POPUP_ITEM_CLASS = inherits(ECOM_TABLE_BODY_HEAD_POPUP_ITEM, UI_ITEM);
    copy(ECOM_TABLE_BODY_HEAD_POPUP_CLASS, UI_ITEMS);

    // 选择控件点击, 弹出子菜单
    ECOM_TABLE_BODY_HEAD_POPUP_CLASS.$click = function (event) {
        UI_CONTROL_CLASS.$click.call(this, event);
        var body = this.getBody();
        body.style.display = 'block';
    };
    ECOM_TABLE_BODY_HEAD_POPUP_CLASS.$blur = function (event) {
        UI_CONTROL_CLASS.$blur.call(this, event);
        this.getBody().style.display = 'none';
    }
    // 弹出菜单子选项点击
    ECOM_TABLE_BODY_HEAD_POPUP_ITEM_CLASS.$click = function (event) {
        UI_ITEM_CLASS.$click.call(this, event);    
        this._uCheckbox.click();
        // this.getParent().hide();
    };
    ECOM_TABLE_BODY_HEAD_POPUP_CLASS.$alterItems = blank;
    function ETBHP_ITEM_CPCLICK (event) {
        UI_CHECKBOX_CLASS.$click.call(this, event);
    }
    function ETBHP_ITEM_ADCLICK (event) {
        UI_CHECKBOX_CLASS.$click.call(this, event);
        var table = this.getParent().getParent().getParent().getParent(),
            allDataChecked = this.isChecked(),
            checkCurPage = table._cCheckCurPage;

        checkCurPage.setEnabled(!allDataChecked);
        for (var i = 0, o, items = checkCurPage.getInferiors(); o = items[i++]; ) {
            o.setEnabled(!allDataChecked);
        }
        table.getParent()._bAllDataChecked = allDataChecked;
    }

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
     * ajax工具
     */
    var ASYNCMGR = ECOM_TABLE.AsyncMgr = function () {},
        ASYNCMGR_CLASS = ASYNCMGR.prototype,
        callbackNames = ["success", "error"];

    /**
     * 提交数据
     */
    ASYNCMGR_CLASS.post = function (ecId, url, options) {
        var control = typeof ecId == "string" ? core.get(ecId) : ecId,
            options = options || {},
            newUrl,
            newData,
            o = {},
            self = this;

        if (this.beforePost) {
            o = this.beforePost(control, url, options);
        }

        newUrl = o.url || url;
        newData = o.data || options.data || "";

        request(newUrl, {
            method: "POST",
            async: true,
            data: newData + "&feReqTime=" + new Date().getTime(),
            onsuccess: (function () {
                return function (xhr, res) {
                    self.success.call(self, control, xhr, res, 
                        {url:url, data:options.data || {}});
                }    
            })(),
            onfailure: (function () {
                return function (xhr, res) {
                    self.error.call(self, control, xhr, res);
                }
            })()
        });

        return this;
    };

    /**
     * 默认请求成功回调
     * @protected
     */
    ASYNCMGR_CLASS.$success = function (control, xhr, res, reqInfo) {
        var o;
        try {
            var data = trim(res).replace(/\$tbId/g, control._nTbId);
        }
        // TODO 识别错误页面html并报错
        catch(e) {
            alert(["JSON数据解析错误", e.name, e.message].join("\n"));
            control.setLocked(false);
            return;
        }

        data != "" && control.renderBody(data);
        control.setLocked(false);

        // 如果有排序, 则给table保存排序参数
        o = queryToJson(
            ECOM_TABLE_GETTBSTATE(control, reqInfo.data)
        );

        if (o[control._sOrderByParam]) {
            control._sOrderByVal = o[control._sOrderByParam];
            control._bDesc = eval(o[control._sDescParam]);
        }
    };

    /**
     * 默认请求错误回调
     * @protected
     */
    ASYNCMGR_CLASS.$error = function (control, xhr, res) {
        // 打印错误信息 
        alert([
            "请求错误, 请稍后重试",
            "状态码: " + xhr.status,
            "信息: " + xhr.statusText
        ].join("\n"));

        control.setLocked(false);
    };

    (function () {
        
        for (var i = 0, o; o = callbackNames[i++];) {
            ASYNCMGR_CLASS[o] = new Function(
                 'control', 'xhr', 'res', 'reqInfo',
                 'var o=this;o.on' + o + '&&o.on' + o 
                    + '.call(o, control, xhr, res, reqInfo)===false||o.$' + o + '.call(o, control, xhr, res, reqInfo)'
            );       
        }

     })();

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
