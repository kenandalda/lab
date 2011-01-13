/*
Tab - 定义分页选项卡的操作。
*/
(function () {

    var core = ecui,
        dom = core.dom,
        ui = core.ui,
        util = core.util,

        MAX = Math.max,

        indexOf = core.array.indexOf,
        children = dom.children,
        createDom = dom.create,
        removeDom = dom.remove,
        first = dom.first,
        insertBefore = dom.insertBefore,
        setStyle = dom.setStyle,
        blank = util.blank,
        copy = util.copy,
        inherits = util.inherits,
        toNumber = util.toNumber,

        $fastCreate = core.$fastCreate,
        Timer = core.Timer,

        UI_TAB = ui.Tab;

        /**
         * 初始化选项卡控件。
         * params 参数支持的特定属性如下：
         * selected 选中的选项序号，默认为0
         * @protected
         *
         * @param {HTMLElement} el 关联的 Element 对象
         * @param {Object} params 初始化参数
         */
        var ECOM_TAB = ui.EcomTab = function (el, params) {
            UI_TAB.call(this, el, params);
        },

        ECOM_TAB_CLASS = inherits(ECOM_TAB, UI_TAB);

        ECOM_TAB.Item = UI_TAB.Item;

        // 加入装饰器
        ECOM_TAB.Item.prototype.oncreate = function (params) {
            if (!params.decorate) {
                new ecui.ext.LRDecorator(this, 'ecom-tab-item-dtr');
                setStyle(this.getOuter(), "display", "inline-block");
            }            
        };

})();
