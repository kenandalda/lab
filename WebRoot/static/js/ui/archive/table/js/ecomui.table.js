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
        children = dom.children,
        insertHTML = dom.insertHTML,
        ieVersion = core.browser.ie,
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
        toCamelCase = string.toCamelCase,
        libAjax = lib.ajax,
        post = libAjax.post,
        request = libAjax.request,
        jsonToStr = lib.json.stringify,
        queryToJson = lib.url.queryToJson,

        createDom = dom.create,
        setStyles = lib.dom.setStyles,
        getPosition = dom.getPosition,
        calcHeightRevise = core.calcHeightRevise,
        first = libDom.first,
        last = libDom.last,
        trim = lib.string.trim,

        getParameters = core.getParameters,
        ASYNCSTATEMGR = asynMgr,
        // }}}
        
        DOCUMENT = document,
        UI_LOCKED_TABLE = ui.LockedTable,
        UI_LOCKED_TABLE_CLASS = UI_LOCKED_TABLE.prototype,
        UI_CONTROL = ui.Control,
        UI_CONTROL_CLASS = UI_CONTROL.prototype,
        UI_CHECKBOX = ui.Checkbox,
        UI_PAGER = ui.Pager,
        UI_PAGER_CLASS = UI_PAGER_CLASS,

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
                o;

            // 给外层容器设置inline-block
            el.style.cssText += ieVersion && ieVersion < 8 ? "display:inline;zoom:1" : "display:inline-block";

            // 表格设置宽度
            params.width && (tbEl.getElementsByTagName("table")[0].style.width = params.width)
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

            el.appendChild(o);

            if ((o = children(el)).length > 1) {
                tbEl = o[0];
                pgEl = o[1];
                // 同步渲染
                this._uTable = $fastCreate(ECOM_TABLE_BODY, tbEl, this, getParameters(tbEl));
                this._uPager = $fastCreate(ECOM_PAGER, pgEl, this, getParameters(pgEl));

                // this._uPager.onpageset = ECOM_TABLE_PAGESET;
            }
            else {
                // 如果当前页面有保存的状态, 则恢复状态
                if (jsonToStr(o = ASYNCSTATEMGR.getCurState("lst_" + this._nTbId)) != "{}") {
                    this.recover(o); 
                }
                else {
                    // 如果当前页面没有保存的状态, 则请求默认地址进行初始化
                    this.post(params.defaultUrl);
                }
            }
            
            this.getOuter().style.position = "relative";
        },

        ECOM_TABLE_CLASS = inherits(ECOM_TABLE, UI_CONTROL),

        /**
         * 表格主体
         */
        ECOM_TABLE_BODY = ui.EcomTableBody = function (el, params) {
            // 去掉markup里的空文字节点
            // el.innerHTML = el.innerHTML.replace(/>(\s+)</g, "><");

            // 设置外层div宽度
            el.style.width = el.parentNode.parentNode.offsetWidth + "px";

            var o;

            // 渲染表格
            UI_LOCKED_TABLE.call(this, el, params);

            // 显示渲染好的表格
            this.getOuter().style.visibility = "visible";
            
            // 记录表格索引
            // this._nTbId = params.tbId;
            
            // 是否有选择整列表按钮
            this._bCustom = params.custom;
            
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
            this._cCheckbox = createControl("checkbox", {element: o, superior: o.getAttribute("data-superior")});
        }
    },

    ECOM_TABLE_BODY_ROW_CLASS = inherits(ECOM_TABLE_BODY_ROW, UI_LOCKED_TABLE.Row);

    ECOM_TABLE_CLASS.$cache = function (style, cacheSize) {
        UI_CONTROL_CLASS.$cache.call(this, style, cacheSize);
        this._uTable && this._uTable.cache();
        this._uPager && this._uPager.cache();
    };

    ECOM_TABLE_CLASS.$init = function () {
       UI_CONTROL_CLASS.$init.call(this);
       this._uTable && this._uTable.init();
       this._uPager && this._uPager.init();
    };

    ECOM_TABLE_CLASS.$setSize = function (width, height) {
        UI_CONTROL_CLASS.$setSize.call(this, width, height);    
        this._uTable && this._uTable.$setSize(this, width, height);
        this._uPager && this._uPager.$setSize(this, width, height);
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
            this._cHeadCheckbox = createControl("checkbox", {id: o.getAttribute("data-id"), element: o});
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

    ECOM_TABLE_CLASS.$setSize = blank;

    /**
     * 异步提交, 成功后写状态
     */
    ECOM_TABLE_CLASS.post = function (url, options) {
        var asyncMgr = this._oAsyncMgr 
            = new ASYNCMGR();

        this.setLocked(true);

        asyncMgr.beforePost = ECOM_TABLE_BEFOREPOST;
        asyncMgr.post(this, url, options)
            .$success = function (control, xhr, res, reqInfo) {
                this.constructor.prototype.$success.call(this, control, xhr, res, reqInfo);

                /* 用hash记录状态 {{{
                var mark = "tb-" + new Date().getTime(),
                    asyncMap = window.asyncMap || {};

                asyncMap[mark] = reqInfo;
                window.asyncMap = asyncMap;

                // requires hash.listener.js
                hashListener.setHash("#" + mark);
                control._sHash = mark;
                }}}*/

                var data = reqInfo.data;
                ASYNCSTATEMGR.updateStateData(data)
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
        asyncMgr.post(this, url, {data: data});

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
        var foldFlag = foldFlag || control._bOpColUnfolded;
            col = control.getCol(control.getCols().length - 2),
            tableWidth = control.getWidth(),
            tableBodyWidth = control.getBody().offsetWidth;

        control._uOpCol[foldFlag ? "hide" : "show"]();
        col.setSize(col.getWidth() + (foldFlag ? 1 : -1) * control._uOpCol.getWidth());

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
            hScroll.setValue(hScroll.getTotal());
            o = hScroll.isShow() ? hScroll.getHeight() : 0;
        }
        else {
            o = 0;
        }

        this.setSize(0, table.getBodyHeight() - o);
        style.bottom = o + "px";
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
            tbEl,
            pgEl;

        if (this._uTable) {
            this._uTable.setEnabled(false); // 禁用控件, 防止闭包里的overedControl记住控件
            disposeControl(this._uTable);
            removeDom(children(outer)[1]);
        }

        if (this._uPager) {
            this._uPager.setEnabled(false); // 禁用控件, 防止闭包里的overedControl记住控件
            disposeControl(this._uPager);
            removeDom(children(outer)[1]);
        }

        insertHTML(this._eMask, "afterEnd", html);

        tbEl = children(outer)[1];
        pgEl = children(outer)[2];

        /*
        this._uTable = createControl("ecom-table-body",
            copy({parent:this, element:tbEl}, getParameters(tbEl))
        );
        this._uPager = createControl("ecom-pager",
            copy({parent:this, element:pgEl}, getParameters(pgEl))
        );
        */

        this._uTable = $fastCreate(ECOM_TABLE_BODY, tbEl,
            this, getParameters(tbEl)
        );

        this._uPager = $fastCreate(ECOM_PAGER, pgEl,
            this, getParameters(pgEl)
        );

        this._uTable.cache();
        this._uPager.cache();

        this._uTable.init();
        this._uPager.init();

        window.timeLog && window.d 
            && (document.getElementById("timer").getElementsByTagName("em")[2].innerHTML
                    = new Date() - d);


        // this._uPager.onpageset = ECOM_TABLE_PAGESET;
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
     *		@param {Control} n 行控件
     *		@param {Number}  i 索引
     *		@param {Control} checkbox 该行的checkbox
     */
    ECOM_TABLE_BODY_CLASS.eachRow = function (func) {
        each(this._aRow, function (n, i) {
            var checkbox = ecui.query({parent: n.getCol(0)})[0];
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
     *		@param {Control} n 行控件
     *		@param {Number}  i 索引
     *		@return {Boolean} 是否选中
     */
    ECOM_TABLE_BODY_CLASS.checkRows = function (func) {
        this.eachRow(function (n, i, checkbox) {
            checkbox.setChecked(false);
            if (func && func.call(n, n, i)) {
                checkbox.setChecked(true);
            }
        });
    };

    /**
     * 分页请求
     */
    ECOM_PAGER_CLASS.onpageset = function (pageNum) {

        var parent = this.getParent(),
            pageParam = parent._sPageParam,
            pageUrl = "" + parent._sPageUrl,
            pageProps = [pageParam, pageNum].join("="),
            data = ASYNCSTATEMGR.getCurState("lst_" + parent._nTbId);

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
     * 锁定表格
     */
    ECOM_TABLE_CLASS.setLocked = function (lock, msg) {
        var mask = this._eMask,
            msg = msg || "请稍候...",
            outer = this.getOuter();

        if (lock) {
            setStyles(mask, {
                width: outer.offsetWidth,
                height: outer.offsetHeight,
                lineHeight: outer.offsetHeight + "px",
                display: "block"
            });
            setText(mask, msg);
        }
        else {
            mask.style.display = "none";
        }
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
        
        window.d && (window.d = new Date());

        if (this.beforePost) {
            o = this.beforePost(control, url, options);
        }

        newUrl = o.url || url;
        newData = o.data || options.data;

        request(newUrl, {
            method: "POST",
            async: true,
            data: newData + "&feReqTime=" + new Date().getTime(),
            onsuccess: (function () {
                return function (xhr, res) {

                    // FIXME 调试信息
                    window.timeLog && window.d 
                        && (document.getElementById("timer").getElementsByTagName("em")[1].innerHTML
                                = new Date() - d);


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
            var data = trim(res);

        }
        // TODO 识别错误页面html并报错
        catch(e) {
            alert(["JSON数据解析错误", e.name, e.message].join("\n"));
            control.setLocked(false);
            return;
        }

        control.renderBody(data);
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

})();
/* vim:set fdm=marker: */
