/**
 * @file ecomui.table.ex_asyn.js
 * @description 为表格控件提供异步功能, 配合asynMgr.js使用
 */
var ecomui = ecomui || {},
    asynMgr = asynMgr || {};

(function () {
    var lib = baidu,
        core = ecui,
        ui = core.ui,
        dom = core.dom,
        libDom = lib.dom,
        libAjax = lib.ajax,

        children = dom.children,
        jsonToStr = lib.json.stringify,
        queryToJson = lib.url.queryToJson,
        toCamelCase = lib.string.toCamelCase,
        request = libAjax.request,
        trim = lib.string.trim,
        each = lib.array.each,
        insertHTML = dom.insertHTML,
        domQuery = lib.dom.query,
        removeDom = dom.remove,

        $fastCreate = core.$fastCreate,
        disposeControl = core.dispose,

        ASYNCSTATEMGR = asynMgr,
        
        ECOM_TABLE = ui.EcomTable,
        ECOM_TABLE_CLASS = ECOM_TABLE.prototype,
        ECOM_PAGER = ui.EcomPager,
        ECOM_PAGER_CLASS = ECOM_PAGER.prototype,
        ECOM_TABLE_BODY = ui.EcomTableBody,
        ECOM_TABLE_BODY_CLASS = ECOM_TABLE_BODY.prototype;

    /**
     * 异步请求管理器
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
     * 获取状态数据中的表格数据
     * @private
     */
    function ECOM_TABLE_GETTBSTATE(control, data) {
        return data["lst_" + control._nTbId] || "";
    }

    /**
     * 改写状态数据中的表格数据
     * @private
     */
    function ECOM_TABLE_SETTBSTATE(control, data, str) {
        data["lst_" + control._nTbId] = str;
        return data;
    }

    /**
     * 提交请求前将数据转成可以提交的格式
     * @private
     */
    function ECOM_TABLE_BEFOREPOST(control, url, options) {
        var data = ASYNCSTATEMGR.convertToUrl(options.data);
        return {
            url: url, 
            data: data
        };
    }

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

    /**
     * 初始化渲染时判断是否调用异步请求
     * 容器内的标记符合规范时, 则调用默认渲染, 否则异步渲染
     */
    ECOM_TABLE_CLASS.oninitrender = function (el, params) {
        var tmp,
            o;
        if ((tmp = children(el)).length >= 1) {
            // 同步渲染, 调用默认的$initRender
            return true;
        }
        else {
            o = this._eMask;
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
        return false;
    };

    /**
     * 根据异步返回HTML重新渲染表格
     * @public
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
     * 覆盖默认排序
     * this为单元格控件
     */    
    ECOM_TABLE_BODY_CLASS.$sort = function (orderBy) {
        var parent = this.getParent().getParent(),
            orderByParam = parent._sOrderByParam,
            descParam = parent._sDescParam,
            sortUrl = parent._sSortUrl,
            desc,
            tmp,
            ecId = "lst_" + parent._nTbId,
            data = ASYNCSTATEMGR.getCurState(ecId),
            sortProps = [
                [orderByParam, orderBy].join("="),
                [descParam, desc = parent.getNextDesc(orderBy)].join("=")
            ].join("&");

        sortProps += "&urlType=sort";
        data = ECOM_TABLE_SETTBSTATE(parent, data, sortProps);

        // 排序参数去重
        for (var o in data) {
             tmp = queryToJson(data[o]);
             if (o != ecId) {
                delete tmp[orderByParam];
                delete tmp[descParam];
                data[o] = jsonToStr(tmp);
             }
        }

        parent.post(sortUrl, {data: data});
    };

    ECOM_TABLE_CLASS.getNextDesc = function (orderBy) {
        // 默认升序(desc为false)
        return this._sOrderByVal == orderBy ? !this._bDesc : false;
    };

    /**
     * 分页处理
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
    
 })();

