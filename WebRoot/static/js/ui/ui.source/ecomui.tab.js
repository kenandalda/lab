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

        UI_CONTROL = ui.Control,
        UI_CONTROL_CLASS = UI_CONTROL.prototype,
        UI_TAB = ui.Tab,
        UI_TAB_CLASS = UI_TAB.prototype,
        UI_TAB_BUTTON = UI_TAB.Button,
        UI_TAB_BUTTON_CLASS = UI_TAB_BUTTON.prototype,
        UI_EXT_TWEEN = core.ext.Tween;

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

        ECOM_TAB_CLASS = inherits(ECOM_TAB, UI_TAB),

        ECOM_TAB_ITEM = ECOM_TAB.Item = function (el, params) {
        	UI_TAB.Item.call(this, el, params);

            // 加入关闭按钮
            if (params.closable) {
                var label = this.getBody();
                var closeBtn = createDom(
                    params.base + '-close ' + params.type + '-close', '', 'span');
                closeBtn.innerHTML = 'x';
                $fastCreate(ECOM_TAB_ITEM_CLOSE, closeBtn, this); 
                label.appendChild(closeBtn);
            }
        },
        ECOM_TAB_ITEM_CLASS = inherits(ECOM_TAB_ITEM, UI_TAB.Item),
        ECOM_TAB_ITEM_CLOSE = function (el, params) {
            UI_CONTROL.call(this, el, params);
        },
        ECOM_TAB_ITEM_CLOSE_CLASS = inherits(ECOM_TAB_ITEM_CLOSE, UI_CONTROL);

        /**
         * 动态添加新的选项卡
         * @param {Object} options 选项
         * @param {Function} callback 创建之后的回调函数
         */
        ECOM_TAB_CLASS.addTab = function (options, callback) {
            var el = createDom('', '', 'div'),
                newTab;

            // 默认选项
            var settings = {
                index: null,
                title: '无标题', // 标题
                params: {}, // 控件初始化参数
                background: false // 后台打开
            };
            settings = copy(settings, options);

            el.innerHTML = '<label>' + settings.title + '</label>';
            this.getBody().appendChild(el);
            newTab = this.add(el, settings.index, settings.params);
            newTab.resize();

            if (!settings.background) {
                this.setSelected(newTab);
            }
            callback && callback.call(this, newTab);
            this.resize();
        };

        /**
         * 删除按钮点击 
         */
        ECOM_TAB_ITEM_CLOSE_CLASS.$click = function (event) {
            UI_CONTROL_CLASS.$click.call(this, event);
            var tabItem = this.getParent();
            tabItem.getParent().remove(tabItem);
        };

        // 修复高度问题
        ECOM_TAB_CLASS.setSelected = function (index) {
            UI_TAB_CLASS.setSelected.call(this, index);
            this.resize();
        };

        /* 加入装饰器 */
        ECOM_TAB.Item.prototype.oncreate = function (params) {
            if (!params.decorate) {
                new ecui.ext.LRDecorator(this, 'ecom-tab-item-dtr');
                setStyle(this.getOuter(), "display", "inline-block");
            }            
        };

        /* 动画效果 */
        UI_EXT_TWEEN(UI_TAB_BUTTON_CLASS, {
            pressStep: 10,
            monitor: 'getParent().getBody().style.left'
        });
})();
