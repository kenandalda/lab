var ecomui = ecomui || {};
(function() {
	var core = ecui,
        ui = core.ui,
        lib = baidu,
        util = core.util,
        dom = core.dom,

        ieVersion = lib.browser.ie,
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
        UI_MULTISELECT = ui.MultiSelect,
        UI_MULTISELECT_CLASS = UI_MULTISELECT.prototype,

	/**
     * 多选下拉构造函数
     */
	ECOM_MULTISELECT = ecomui.MultiSelect = ui.EcomMultiSelect = function(el, params) {
	},

	ECOM_MULTISELECT_CLASS = inherits(ECOM_MULTISELECT, UI_MULTISELECT);
})();
/* vim:set fdm=marker: */
