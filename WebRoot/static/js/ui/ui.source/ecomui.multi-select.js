var ecomui = ecomui || {};
(function() {
	var core = ecui,
        ui = core.ui,
        util = core.util,
        dom = core.dom,

        ieVersion = core.browser.ie,
        setFocused = core.setFocused,
        blank = util.blank,
        $fastCreate = core.$fastCreate,
        createDom = dom.create,
        insertBefore = dom.insertBefore,
        inherits = util.inherits,
        copy = util.copy,
        children = dom.children,
        getPosition = dom.getPosition,
        getStyle = dom.getStyle,
        setText = dom.setText,
        loseFocus = core.loseFocus,

        UI_CONTROL = ui.Control,
        UI_CONTROL_CLASS = UI_CONTROL.prototype,
        UI_EDIT = ui.Edit,
        UI_EDIT_CLASS = UI_EDIT.prototype,
        UI_PANEL = ui.Panel,
        UI_PANEL_CLASS = UI_PANEL.prototype,
        UI_LISTBOX = ui.Listbox,
        UI_LISTBOX_CLASS = UI_LISTBOX.prototype,
        UI_LISTBOX_ITEM = UI_LISTBOX.Item,
        UI_LISTBOX_ITEM_CLASS = UI_LISTBOX_ITEM.prototype,
        UI_ITEM = ui.Item,

	/**
     * 多选下拉构造函数
     */
	UI_MULTISELECT = ecomui.MultiSelect = ui.MultiSelect = function(el, params) {
        var wrapper = createDom(el.className, el.style.cssText),
            name = el.name || params.name || '',
            value = el.value || params.value || '',
            typeClass = params.type;

        insertBefore(wrapper, el);
        wrapper.innerHTML = '<div class="ec-control' + typeClass
            + '-text"></div><div class="ec-control ' + typeClass
            + '-button" style="position:absolute"></div>'
            + '<input readonly="readonly" disabled="disabled" data-shield="true" name="ms_' 
            + (params.msId || new Date().getTime()) + '"/>';


        wrapper.style.cssText = "position:relative;"
            + (ieVersion && ieVersion < 8 ? "display:inline;zoom:1" : "display:inline-block");

        el.className = "ec-panel ec-multiselect-options";
        el.style.position = "absolute";
        el.style.left = "0";

        this._nSize = el.getAttribute("data-size") || params.size || 8;
        this._eInput = wrapper.lastChild;
        this._initDisabled = params.disabled === true;

        this._nLBWidth = el.offsetWidth;
        wrapper.appendChild(el);

		UI_CONTROL.call(this, wrapper, params);

        this._uListBox = $fastCreate(UI_MULTISELECT_LISTBOX, el, this, {name: params.name});
	},

	UI_MULTISELECT_CLASS = inherits(UI_MULTISELECT, UI_CONTROL),

    UI_MULTISELECT_LISTBOX = function(el, params) {
        UI_LISTBOX.call(this, el, params);
        var items = this.getItems(),
            i = 0,
            o;
        for (; o = items[i++];) {
           o.$selectend = UI_MULTISELECT_LISTBOX_ITEM_SELECTEND;
        }
    },
                             
    UI_MULTISELECT_LISTBOX_CLASS = inherits(UI_MULTISELECT_LISTBOX, UI_LISTBOX),

    //改写Listbox的Item构造函数, 让其支持存在input元素时的渲染
    UI_MULTISELECT_LISTBOX_ITEM = UI_LISTBOX.Item = function(el, params) {
        UI_ITEM.call(this, el, params);

        var o;
        if ((o = el.getElementsByTagName("input")[0]) && o.type == "checkbox") {
            this._eInput = o;
            this.setSelected(o.checked === true);
        }
        else {
            el.appendChild(this._eInput = setInput(null, params.parent._sName, 'hidden')).value
                = params.value === undefined ? getText(el) : '' + params.value;
            this.setSelected(!!params.selected);
        }
    },
    UI_MULTISELECT_LISTBOX_ITEM_CLASS = inherits(UI_MULTISELECT_LISTBOX_ITEM, UI_ITEM);
    copy(UI_MULTISELECT_LISTBOX_ITEM.prototype, UI_LISTBOX_ITEM_CLASS);

    UI_MULTISELECT_LISTBOX_ITEM_CLASS.setSelected = function(status) {
        if (this._eInput.type == "checkbox") {
            status = status === undefined ? true : status;
            this.alterClass('selected', !status);
            this._eInput.checked = status;
        }
        else {
            this.alterClass('selected', this._eInput.disabled = status === false);
        }
    };

    UI_MULTISELECT_LISTBOX_ITEM_CLASS.isSelected = function() {
        if (this._eInput.type == "checkbox") {
            return this._eInput.checked;
        }
        else {
            return !this._eInput.disabled;
        }
    };

    UI_MULTISELECT_CLASS.$init = function() {
        UI_CONTROL_CLASS.$init.call(this);

        var listBox = this._uListBox;


        listBox.init();

        // this._uListBox.hide();
        this._uListBox.getOuter().style.visibility = "hidden"; // fix ie6 有异步表格不出滚动条的bug
        this.showSelected();
        this._eInput.defaultValue = this._eInput.value;
        if (this._initDisabled) {
            this.setEnabled(false);
        }
    };

    UI_MULTISELECT_CLASS.$cache = function(style, cacheSize) {
        UI_CONTROL_CLASS.$cache.call(this, style, cacheSize);
        this._uListBox.cache(true, true);
    };

    UI_MULTISELECT_CLASS.$resize = blank;

    UI_MULTISELECT_CLASS.$setSize = function(width, height) {
        UI_CONTROL_CLASS.$setSize.call(this, width, height); 

        var listBox = this._uListBox,
            items = listBox.getItems(),
            len = items.length,
            o = items[0],
            vs = listBox._uVScroll,
            vsWidth = vs && vs.isShow() ? vs.getWidth() : 0,
            invalidWidth = o ? parseInt(getStyle(o.getOuter(), "paddingLeft")) : 0,
            lbWidth = 0;

        if (len <= 1) {
            listBox._uVScroll = false;
        }

        lbWidth = Math.max(width, this._nLBWidth + vsWidth + invalidWidth);

        listBox.setSize(lbWidth,
                o ? Math.min(len, this._nSize) * o._nHeight  : height);

        listBox.getOuter().style.top = height + "px";

        // IE fix
        this.getOuter().className += "";
    };

    UI_MULTISELECT_CLASS.$click = function(event) {
        UI_CONTROL_CLASS.$click.call(this, event);
        var listBox = this._uListBox;
       
        // this._eInput.focus();
        // listBox[listBox.isShow() ? "hide" : "show"]();
        listBox.show();
        listBox.getOuter().style.visibility = ""; // fix ie6 有异步表格不出滚动条的bug
        setFocused(listBox);
    };

    UI_MULTISELECT_LISTBOX_CLASS.$show = function() {
        UI_PANEL_CLASS.$show.call(this);

        /*
        var parent = this.getParent(),
            pos = getPosition(parent.getOuter()),
            optionTop = pos.top + parent.getHeight();

        this.setPosition(pos.left, optionTop);
        */
        this.flush();
    };

    UI_MULTISELECT_LISTBOX_CLASS.$blur = function(event) {
        UI_LISTBOX_CLASS.$blur.call(this, event);   
        this.$hide();
    };

    UI_MULTISELECT_LISTBOX_CLASS.flush = function() {
        var items = this.getItems();
        for (var i = 0, o; o = items[i++];) {
            if (o._eInput.type == "checkbox") {
                o.setSelected(o._eInput.checked);
            }
            else {
                o.setSelected(!o._eInput.disabled)
            }
        } 
    };

    /**
     * 多选框子项选择结束
     */
    function UI_MULTISELECT_LISTBOX_ITEM_SELECTEND(event) {
        UI_LISTBOX_ITEM_CLASS.$selectend.call(this, event);
        this.getParent().getParent().showSelected();
    }

    UI_MULTISELECT_CLASS.showSelected = function() {
        var selected = this._uListBox.getSelected(),
            i = 0,
            o,
            val = [];

        for (; o = selected[i++];) {
            val.push(o.getOuter().firstChild.nodeValue); 
        }

        this._eInput.value = val.join(",");
    };

    /**
     * 启用/禁用多选下拉框
     * @public
     * @param {Boolean} flag 是否可用, true-启用, false-禁用
     */
    UI_MULTISELECT_CLASS.setEnabled = function(flag) {
        UI_CONTROL_CLASS.setEnabled.call(this, flag);
        var allInputs = this._uListBox.getItems();
        for (var i = 0, o; o = allInputs[i++]; ) {
            o._eInput && (o._eInput.disabled = flag !== true);
        }
    };

    /**
     * 获取选中的控件
     * @public
     * 
     * @return {Array} 选中控件组成的数组
     */
    UI_MULTISELECT_CLASS.getSelected = function () {
        return this._uListBox.getSelected();
    };

})();
/* vim:set fdm=marker: */
