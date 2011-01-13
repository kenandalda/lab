(function () {
    var lib = baidu,
        core = ecui,
        ui = core.ui,
        dom = core.dom,
        libDom = lib.dom,
        util = core.util,

        $fastCreate = core.$fastCreate,
        createDom = core.dom.create,
        children = libDom.children,
        inherits = util.inherits,
        setStyle = dom.setStyle,
        first = dom.first,
        last = dom.last,
        setText = dom.setText,
        getPosition = dom.getPosition,
        getView = util.getView,

        UI_CONTROL = ui.Control,
        UI_CONTROL_CLASS = UI_CONTROL.prototype,
        UI_CHECKBOX = ui.Checkbox,
        UI_CHECKBOX_CLASS = UI_CHECKBOX.prototype;
        
    /**
     * 二级筛选器
     */
    var SUB_FILTER = ui.SubFilter = function (el, params) {
        var typeClass = params.type,
            baseClass = params.base,
            o;

        setStyle(el, "display", "inline-block");

        UI_CONTROL.call(this, el, params);

        o = createDom(typeClass + "-content " + baseClass + "-content", "position:absolute;display:none");
        o.innerHTML = "<div class='" + typeClass + "-main'></div>" 
            + "<div class='" + typeClass + "-op'>"
            + "<div class='" + typeClass + "-confirm'>确定</div>"
            + "<div class='" + typeClass + "-cancel'>取消</div>"
            + "</div>";

        this._uContent = $fastCreate(
           SUB_FILTER_CONTENT,
           o,
           this
        );
        document.body.appendChild(o);
        
    },
    
    SUB_FILTER_CLASS = inherits(SUB_FILTER, UI_CONTROL);

    SUB_FILTER_CLASS.$click = function (event) {
        UI_CONTROL_CLASS.$click.call(this, event);
        this._uContent.show();    
    };

    SUB_FILTER_CLASS.onblur = function (event) {
        this._uContent.hide();
    };

    /**
     * 下拉内容区域
     */
    var SUB_FILTER_CONTENT = ui.SubFilter.Content = function (el, params) {
       UI_CONTROL.call(this, el, params); 
        
       var mainEl = this._eMain = first(el),
           o; 

        this._uConfirm = $fastCreate(
            UI_CONTROL,    
            first(last(el)),
            this
        );

        setStyle(this._uConfirm.getOuter(), "display", "inline-block");

        this._uCancel = $fastCreate(
            UI_CONTROL,
            last(last(el)),
            this
        );

        setStyle(this._uCancel.getOuter(), "display", "inline-block");
    },

    SUB_FILTER_CONTENT_CLASS = inherits(SUB_FILTER_CONTENT, UI_CONTROL);

    SUB_FILTER_CLASS.alterContent = function () {
        var content = this._uContent,
            mainEl = content._eMain;
            mainEl.innerHTML = this.generateContent();

        core.init(mainEl);
    };
    SUB_FILTER_CONTENT_CLASS.$show = function (event) {
         
        if (!this._bHasContent) {
            /*
            var mainEl = this._eMain;
            mainEl.innerHTML = this.getParent().generateContent();
            core.init(mainEl);
            */
            this.getParent().alterContent();
            this._bHasContent = true;
        }

        UI_CONTROL_CLASS.$show.call(this, event); 

        // 定位 
        var outer = this.getParent().getOuter(),
            pos = getPosition(outer),
            view = getView(),
            calWidth = this.getOuter().offsetWidth,
            calHeight = this.getOuter().offsetHeight,

            left = view.right < pos.left + calWidth ? 
                pos.left + outer.offsetWidth - calWidth : pos.left,
            top = view.bottom < pos.top + outer.offsetHeight + calHeight ?
                pos.top - calHeight : pos.top + outer.offsetHeight;

        // 设置显示位置
        this.setPosition(left, top);
    };

 }) ();
