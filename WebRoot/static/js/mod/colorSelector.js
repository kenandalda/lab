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
        setStyles = libDom.setStyles,
        first = dom.first,

        UI_CONTROL = ui.Control,
        UI_CONTROL_CLASS = UI_CONTROL.prototype,
        UI_RADIO = ui.Radio,
        UI_RADIO_CLASS = UI_RADIO.prototype;
        
    /**
     * 颜色选择器
     */
    COLOR_SELECTOR = ui.ColorSelector = function (el, params) {
        UI_CONTROL.call(this, el, params);

        this._aColorSet = colorSet[params.colorSet || 0];

        var typeClass = params.type,
            baseClass = params.base,
            len = this._aColorSet.length,
            tipEl = createDom(typeClass + "-tip " + baseClass + "-tip"),
            subEls;

        for (var i = 0, html = []; i < len; i++) {
            html.push("<div type='color' class='" + typeClass + "-sub " + baseClass + "-sub'></div>");
        }

        el.innerHTML = "<div class='" + typeClass + "-main'>" + html.join("") + "</div>";
        subEls = children(first(el));

        for (var i = 0, o, html = [], subCtrl; o = this._aColorSet[i]; i++) {
            subCtrl = $fastCreate(
                COLOR_SELECTOR_SUB,
                subEls[i],
                this,
                {name: params.name, colorId: o[0], colorName: o[1], colorValue: o[2]}
            )
        }

        // 全选
        if (params.selectAll) {
            var wrap = createDom(baseClass + "-all-wrap");
            wrap.innerHTML = "<div type='color' class='" + typeClass + "-sub " + baseClass + "-all'></div>" + 
                             "<p>全部</p>";
            setStyle(wrap, "display", "inline-block");
           this._cSelectAll = $fastCreate(
                COLOR_SELECTOR_SUB,
                first(wrap),
                this,
                {name: params.name, colorId: 0, colorName: "全部", colorValue: "transparent"}
            )
            el.insertBefore(wrap, first(el));
        }

        // 浮动提示
        setStyle(tipEl, 'display', 'none');
        document.body.appendChild(tipEl);
        this._uTip = $fastCreate(
            COLOR_SELECTOR_TIP,
            tipEl,
            this
        );
    },
    
    COLOR_SELECTOR_CLASS = inherits(COLOR_SELECTOR, UI_CONTROL),

    /**
     * 颜色组别
     */
    colorSet = COLOR_SELECTOR.colorSet = [
        [ 
            ['1', "红色", "#FF0000"],
            ['2', "橙色", "#FF8400"],
            ['3', "黄色", "#FFEA00"],
            ['4', "绿色", "#8CD400"],
            ['5', "青色", "#0016ED"],
            ['6', "蓝色", "#00A3EF"],
            ['7', "紫色", "#6800b1"],
            ['8', "粉色", "#ff6fcc"],
            ['9', "白色", "#ffffff"],
            ['10', "灰色", "#666666"],
            ['11', "黑色", "#000000"],
            ['12', "棕色", "#884902"]
        ] 
    ];

    /**
     * 获得指定指定子radio控件
     * @public
     * @param {Number} index 子控件索引
     */
    COLOR_SELECTOR_CLASS.getSub = function (index) {
        var allSubs = core.query({parant: this, custom: function (o) {
            return o instanceof COLOR_SELECTOR_SUB;
        }});
        return allSubs[index];
    };
    
    /**
     * 子项目radio
     */
    var COLOR_SELECTOR_SUB = COLOR_SELECTOR.Sub = function (el, params) {
        UI_RADIO.call(this, el, params);
        setStyle(el, "display", "inline-block");
        setStyle(el, "backgroundColor", params.colorValue);

        this._sColorName = params.colorName;
        this._sColorId = params.colorId;
    },
    
    COLOR_SELECTOR_SUB_CLASS = inherits(COLOR_SELECTOR_SUB, UI_RADIO);

    COLOR_SELECTOR_SUB_CLASS.onmouseover = function (event) {
       var tip = this.getParent()._uTip,
              me = this.getOuter();
              tipEl = tip.getOuter();
       tipEl.innerHTML = this._sColorName;
       var position = libDom.getPosition(me);
       var top = position.top + me.offsetHeight + 'px',
           left = position.left + me.offsetWidth / 2 + 'px';
       setStyles(tipEl, {top: top, left: left});
       tip.show(); 
    };
    COLOR_SELECTOR_SUB_CLASS.onmouseout = function (event) {
       this.getParent()._uTip.hide(); 
    };

    /**
     * TIP
     */
    var COLOR_SELECTOR_TIP = COLOR_SELECTOR.Tip = function (el, params) {
        UI_CONTROL.call(this, el, params);
        setStyle(el, 'position', 'absolute');
    },
    COLOR_SELECTOR_TIP_CLASS = inherits(COLOR_SELECTOR_TIP, UI_CONTROL);

 }) ();
