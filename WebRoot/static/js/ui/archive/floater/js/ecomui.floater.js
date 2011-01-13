/**
 * 浮动层控件
 */
var ecomui = ecomui || {};
(function () {
    var core = ecui,
        lib = baidu,
        ui = core.ui,
        page = lib.page,
        getViewWidth = page.getViewWidth,
        getViewHeight = page.getViewHeight,
        mask = core.mask,

        UI_FORM = ui.Form,
        UI_FORM_CLASS = UI_FORM.prototype;

    /**
     * 重载ecui Form控件的showModal方法，解决以下问题：
     * 1) 隐藏显示渲染问题
     * 2) 无法自定义透明度
     */
    UI_FORM_CLASS.showModal = function (opacity) {
        var opacity = opacity || 0.3;
        this.show();
        this.getOuter().style.zIndex = 32768;
        mask(opacity);
    };

    /**
     * 显示指定的浮动层
     * @public
     *
     * @param {String} ecId 获取ec控件需要的id
     * @param {Number}  opacity 透明度
     */
    ecomui.showModal = function (ecId, opacity) {
        var floater = core.get(ecId);

        floater.showModal(opacity);
        floater.center();
        floater.getOuter().style.visibility = "";
    };

    /**
     * 隐藏指定的浮动层
     * @public
     *
     * @param {String} ecId 获取ec控件需要的id
     */
    ecomui.hideModal = function (ecId) {
        core.get(ecId).hide(); 
    };
})();
