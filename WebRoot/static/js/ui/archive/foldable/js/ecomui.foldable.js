var ecomui = ecomui || {};

(function() {
 	var lib = baidu, 
		core = ecui, 
		dom = core.dom, 
		ui = core.ui,
		util = core.util,
		inherits = util.inherits,
		copy = util.copy,

        blank = util.blank,
		children = dom.children,
        first = dom.first,
		createDom = dom.create,
        removeDom = dom.remove,
		$fastCreate = core.$fastCreate,
		setText = dom.setText,
        request = baidu.ajax.request,

		DOCUMENT = document,
	 	UI_CONTROL = ui.Control,
        UI_CONTROL_CLASS = UI_CONTROL.prototype,
		ECOM_FOLDABLE_CLASS;
	
	var ECOM_FOLDABLE = ecomui.Foldable 
        = ui.Foldable = function(el, params) {
		var typeClass = params.type,
            label = el.getElementsByTagName("label")[0],
            flag = false,
			contentEl = children(el)[0],
			titleEl = createDom(typeClass + "-title"),
            titleHTML = (flag = (label && label == first(first(el)))) ? label.innerHTML : params.title || "",
			handlerEl = createDom(typeClass + "-handler");

        el.style.position = "relative";
		el.insertBefore(titleEl, contentEl);
		titleEl.innerHTML = titleHTML;
        flag && removeDom(label);
		titleEl.insertBefore(handlerEl, titleEl.firstChild);

		params.capture = false;

		UI_CONTROL.call(this, el, params);

        this._bInitFold = params.initFold || false;
        this._sAsyncUrl = params.asyncUrl;

		this._uTitle = 	$fastCreate(UI_CONTROL, titleEl, this);
		this._uContent = $fastCreate(UI_CONTROL, contentEl, this, {capture: false});
		this._uHandler = $fastCreate(UI_CONTROL, handlerEl, this._uTitle, {capture: false});

		this._uTitle["on" + (params.trigger || "click")] = ECOM_FOLDABLE_TITLECLICK;
	}, 

	ECOM_FOLDABLE_CLASS = inherits(ECOM_FOLDABLE, UI_CONTROL);

    ECOM_FOLDABLE_CLASS.$init = function() {
        UI_CONTROL_CLASS.$init.call(this);

        var initFold = this._bInitFold;

        // 收起默认设置折叠的
		ECOM_FOLDABLE_TOGGLECONTENT.call(this._uTitle, initFold);

        // 默认展开&&异步的, 异步加载内容
        this._sAsyncUrl && !this._bAsyncLoaded && !initFold
            && ECOM_FOLDABLE_LOADCONTENT.call(this, this._sAsyncUrl);
    };

    /**
     * 标题区域点击
     */
	function ECOM_FOLDABLE_TITLECLICK() {
        var control = this.getParent();
        if (control._sAsyncUrl && !control._bAsyncLoaded && !control._bLocked) {
            ECOM_FOLDABLE_LOADCONTENT.call(control, control._sAsyncUrl);
        }
		ECOM_FOLDABLE_TOGGLECONTENT.call(this);
	}

    /**
     * 内容区域变换显示
     */
	function ECOM_FOLDABLE_TOGGLECONTENT(fold) {
		var control = this.getParent(),
			content = control._uContent,
			handler = control._uHandler,
			handlerEl = handler.getBase(),
			isShow = fold !== undefined ? fold : content.isShow();

		isShow ? content.hide() : content.show();
		handlerEl.setAttribute("title", isShow ? "点击展开" : "点击折叠");

		this.alterClass(isShow ? "unfold" : "fold");
		this.alterClass(isShow ? "fold" : "unfold", true);

		// control.$resize();
	}

    /**
     * 异步加载容器内容
     */
    function ECOM_FOLDABLE_LOADCONTENT(url) {
        var self = this;

        this._bLocked = true;

        request(url, {
            method: "POST",
            data: "feReqTime=" + new Date().getTime(),
            onsuccess: (function() {
                return function(xhr, res) {
                    ECOM_FOLDABLE_LOADSUCCESS.call(self, xhr, res);
                };
            })(),
            onfailure: (function() {
                return function(xhr, res) {
                    ECOM_FOLDABLE_LOADERROR.call(self, xhr, res);
                };
            })()
        });       
    }

    function ECOM_FOLDABLE_LOADSUCCESS(xhr, res) {
        // TODO 判断是否返回正确的html
        var validRes = true;

        if (validRes) {
            this._uContent.getOuter().innerHTML = res;    
            this._bLocked = false;
            this._bAsyncLoaded = true;
            // 回调
            this.onloadcsuccess && this.onloadsuccess(xhr, res);
        }
        else {
            ECOM_FOLDABLE_TOGGLECONTENT(false);
            alert("异步返回不正确, 请稍后重试.");
        }
    }

    function ECOM_FOLDABLE_LOADERROR(xhr, res) {
        alert(xhr.status);
    }


    /**
     * 屏蔽$setSize方法, 让控件自适应大小
     */
    ECOM_FOLDABLE_CLASS.$setSize = blank;

 })();
