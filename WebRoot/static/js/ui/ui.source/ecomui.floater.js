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
        
        contains = lib.dom.contains,
        toArray = lib.lang.toArray,
        each = lib.array.each,
        ieVersion = lib.browser.ie,
        domQuery = lib.dom.query,

        UI_FORM = ui.Form,
        UI_FORM_CLASS = UI_FORM.prototype;

    /**
     * 重载ecui Form控件的showModal方法，解决以下问题：
     * 1) 隐藏显示渲染问题
     * 2) 无法自定义透明度
     */
    UI_FORM_CLASS.showModal = function (opacity, keepPos) {
        var opacity = opacity || 0.3,
            outer = this.getOuter();
        keepPos === undefined && document.body.appendChild(outer);
        this.show();
        outer.style.zIndex = 32768;
        mask(opacity);
    };

    UI_FORM_CLASS.onhide = function () {
         if (ieVersion < 7) {
            each(
                toArray(document.getElementsByTagName('select')),
                function (n, i) {
                    if (n.getAttribute("data-maskhide") == "true") {
                        n.style.visibility = "visible";
                        n.removeAttribute("data-maskhide");
                    }
                });
        }
              
    };

    /**
     * 显示指定的浮动层
     * @public
     *
     * @param {String} ecId 获取ec控件需要的id
     * @param {Number}  opacity 透明度
     */
    ecomui.showModal = function (ecId, opacity, keepPos) {
        var floater = core.get(ecId);

        floater.showModal(opacity, keepPos);
        floater.center();
        floater.getOuter().style.visibility = "";
        
        if (ieVersion < 7) {
            each(
                toArray(document.getElementsByTagName('select')),
                function (n, i) {
                    if (n.style.visibility != "hidden" 
                            && !contains(floater.getOuter(), n)) {
                        n.setAttribute("data-maskhide", "true");
                        n.style.visibility = "hidden";
                    }
                });
        }
        
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

    /**
     * 设置内容区域html
     * @public
     *
     * @param {String} html
     */
    UI_FORM_CLASS.setContent = function (html) {
        domQuery("div.floater-inner", floater.getOuter())[0].innerHTML = html;
    };
})();
