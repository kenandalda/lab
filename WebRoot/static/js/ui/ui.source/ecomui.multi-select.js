﻿/*
MultiSelect - 定义多选下拉框行为的基本操作。
多选下拉框控件，继承自输入框控件，实现了选项组接口，参见下拉框控件。

下拉框控件直接HTML初始化的例子:
<select ecui="type:multi-select;option-size:3" name="test">
    <!-- 这里放选项内容 -->
    <option value="值">文本</option>
    ...
    <option value="值" selected>文本</option>
    ...
</select>

如果需要自定义特殊的选项效果，请按下列方法初始化:
<div ecui="type:multi-select;name:test;option-size:3">
    <!-- 这里放选项内容 -->
    <li ecui="value:值">文本</li>
    ...
</div>

Item属性
_eInput - 多选项的INPUT对象
*/
//{if 0}//
(function () {
    var core = ecui,
        lib = baidu,
        dom = core.dom,
        ui = core.ui,
        util = core.util,

        indexOf = core.array.indexOf,
        createDom = dom.create,
        getText = dom.getText,
        removeDom = dom.remove,
        setInput = dom.setInput,
        copy = util.copy,
        inherits = util.inherits,
        ieVersion = lib.browser.ie,
        restore = core.restore,

        $fastCreate = core.$fastCreate,
        mask = core.mask,

        UI_EDIT = ui.Edit,
        UI_EDIT_CLASS = UI_EDIT.prototype,
        UI_ITEMS = ui.Items,
        UI_SELECT = ui.Select,
        UI_SELECT_CLASS = UI_SELECT.prototype,
        UI_SELECT_ITEM = UI_SELECT.Item,
        UI_SELECT_ITEM_CLASS = UI_SELECT_ITEM.prototype;
//{/if}//
//{if $phase == "define"}//
    /**
     * 初始化多选下拉框控件。
     * params 参数支持的属性如下：
     * @public
     *
     * @param {Element} el 关联的 Element 对象
     * @param {Object} params 初始化参数
     */
    UI_MULTI_SELECT = ui.MultiSelect = function (el, params) {
        UI_SELECT.call(this, el, params);
        removeDom(this.getInput());

	    if (ieVersion < 7) {
            el = this.$getSection("Options").getOuter();
            el.insertBefore(createDom('', 'z-index:-1;top:0;left:0;position:absolute;width:3000;height:3000;', 'iframe'), el.firstChild);
        }
    },
    UI_MULTI_SELECT_CLASS = inherits(UI_MULTI_SELECT, UI_EDIT),
    UI_MULTI_SELECT_ITEM = UI_MULTI_SELECT.Item = function (el, params) {
        UI_SELECT_ITEM.call(this, el, params);

        el = params.parent
            ? params.parent.getBase().appendChild(setInput(null, params.parent.getName(), 'checkbox'))
            : setInput(null, '', 'checkbox');

        el.value = params.value || '';
        el.style.display = 'none';
        this._eInput = el;
    },
    UI_MULTI_SELECT_ITEM_CLASS = inherits(UI_MULTI_SELECT_ITEM, UI_SELECT_ITEM);
//{else}//
    /**
     * 刷新显示区域的选中值列表。
     * @private
     *
     * @param {ecui.ui.MultiSelect} control 多选下拉框控件
     */
    function UI_MULTI_SELECT_FLUSH_TEXT (control) {
        if (control) {
            for (var i = 0, items = control.getItems(), o, text = []; o = items[i++]; ) {
                o.isSelected() && text.push(getText(o.getOuter()));
            }
            control.$getSection('Text').$setBodyHTML(text.join(','));
        }
    }

    copy(UI_MULTI_SELECT_CLASS, UI_ITEMS);

    /**
     * 鼠标单击控件事件的默认处理。
     * 控件点击时将改变当前的选中状态。如果控件处于可操作状态(参见 isEnabled)，click 方法触发 onclick 事件，如果事件返回值不为 false，则调用 $click 方法。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_MULTI_SELECT_ITEM_CLASS.$click = function (event) {
        UI_SELECT_ITEM_CLASS.$click.call(this, event);
        this.setSelected(!this.isSelected());
    };

    /**
     * 销毁控件的默认处理。
     * 页面卸载时将销毁所有的控件，释放循环引用，防止在 IE 下发生内存泄漏，$dispose 方法的调用不会受到 ondispose 事件返回值的影响。
     * @protected
     */
    UI_MULTI_SELECT_ITEM_CLASS.$dispose = function () {
        this._eInput = null;
        UI_SELECT_ITEM.$dispose.call(this);
    };

    /**
     * 判断当前选项是否选中。
     * @protected
     *
     * @return {boolean} 当前项是否选中
     */
    UI_MULTI_SELECT_ITEM_CLASS.isSelected = function () {
        return this._eInput.checked;
    };

    /**
     * 设置当前选项是否选中。
     * @protected
     *
     * @param {boolean} status 当前项是否选中，默认选中
     */
    UI_MULTI_SELECT_ITEM_CLASS.setSelected = function (status) {
        this.alterClass('selected', status === false);
        this._eInput.checked = status !== false;
        UI_MULTI_SELECT_FLUSH_TEXT(this.getParent());
    };

    /**
     * 选项控件发生变化的处理。
     * 在 选项组接口 中，选项控件发生增加/减少操作时调用此方法。
     * @protected
     */
    UI_MULTI_SELECT_CLASS.$alterItems = function () {
        UI_SELECT_CLASS.$alterItems.call(this);
        UI_MULTI_SELECT_FLUSH_TEXT(this);
    };

    /**
     * 控件增加子控件事件的默认处理。
     * 选项组增加子选项时需要判断子控件的类型，并额外添加引用。
     * @protected
     *
     * @param {ecui.ui.Item} child 选项控件
     * @return {boolean} 是否允许增加子控件，默认允许
     */
    UI_MULTI_SELECT_CLASS.$append = function (item) {
        UI_SELECT_CLASS.$append.call(this, item);
        this.getBase().appendChild(setInput(item._eInput, this.getName()));
    };

    /**
     * 计算控件的缓存。
     * 控件缓存部分核心属性的值，提高控件属性的访问速度，在子控件或者应用程序开发过程中，如果需要避开控件提供的方法(setSize、alterClass 等)直接操作 Element 对象，操作完成后必须调用 clearCache 方法清除控件的属性缓存，否则将引发错误。
     * @protected
     *
     * @param {CssStyle} style 基本 Element 对象的 Css 样式对象
     * @param {boolean} cacheSize 是否需要缓存控件大小，如果控件是另一个控件的部件时，不缓存大小能加快渲染速度，默认缓存
     */
    UI_MULTI_SELECT_CLASS.$cache = UI_SELECT_CLASS.$cache;

    /**
     * 界面点击强制拦截事件的默认处理。
     * 控件在下拉框展开时，需要拦截浏览器的点击事件，如果点击在下拉选项区域，则选中当前项，否则直接隐藏下拉选项框，但不会改变控件激活状态。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_MULTI_SELECT_CLASS.$forcibly = function (event) {
        var target = event.getTarget();
        if (target instanceof UI_MULTI_SELECT_ITEM) {
            target.setSelected(!target.isSelected());
            return false;
        }
        this.$getSection('Options').hide();
        mask();
    };

    /**
     * 控件拥有焦点时，键盘弹起事件的默认处理。
     * 如果控件处于可操作状态(参见 isEnabled)，keydown/keypress 方法触发 onkeydown/onkeypress 事件，如果事件返回值不为 false，则调用 $keydown/$keypress 方法。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_MULTI_SELECT_CLASS.$keyup = function (event) {
        if (!this.$getSection('Options').isShow() || UI_EDIT_CLASS.$keyup.call(this, event) === false) {
            return false;
        }

        if (event.which == 13 || event.which == 32) {
            this.getOvered().$click();
        }
        else if (event.which == 27) {
            this.$getSection("Options").hide();
            mask();
            restore();
            return false;
        }
    };

    /**
     * 鼠标在控件区域滚动滚轮事件的默认处理。
     * 如果控件拥有焦点，则当前选中项随滚轮滚动而自动指向前一项或者后一项。如果控件处于可操作状态(参见 isEnabled)，mousewheel 方法触发 onmousewheel 事件，如果事件返回值不为 false，则调用 $mousewheel 方法。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_MULTI_SELECT_CLASS.$mousewheel = function (event) {
        var options = this.$getSection('Options');
        options.isShow() && options.$mousewheel(event);
        return false;
    };

    /**
     * 控件按压状态结束事件的默认处理。
     * 鼠标左键按压控件结束时设置下一次点击事件被拦截，需要根据点击的位置选择是关闭展开的下拉框还是选中选项。如果控件处于可操作状态(参见 isEnabled)，pressend 方法触发 onpressend 事件，如果事件返回值不为 false，则调用 $pressend 方法。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_MULTI_SELECT_CLASS.$pressend = UI_SELECT_CLASS.$pressend;

    /**
     * 控件按压状态开始事件的默认处理。
     * 鼠标左键按压控件开始时显示下拉框。如果控件处于可操作状态(参见 isEnabled)，pressstart 方法触发 onpressstart 事件，如果事件返回值不为 false，则调用 $pressstart 方法。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_MULTI_SELECT_CLASS.$pressstart = UI_SELECT_CLASS.$pressstart;

    /**
     * 控件自动渲染全部完成后的处理。
     * 页面刷新时，部分浏览器会回填输入框的值，需要在回填结束后触发设置控件的状态。
     * @protected
     */
    UI_SELECT_CLASS.$ready = function () {
        UI_MULTI_SELECT_FLUSH_TEXT(this);
    };

    /**
     * 控件移除子控件事件的默认处理。
     * 选项组移除子选项时需要额外移除引用。
     * @protected
     *
     * @param {ecui.ui.Item} child 选项控件
     */
    UI_MULTI_SELECT_CLASS.$remove = function (item) {
        UI_SELECT_CLASS.$remove.call(this, item);
        this.getBase().removeChild(item._eInput);
    };

    /**
     * 设置控件的大小。
     * @protected
     *
     * @param {number} width 宽度，如果不需要设置则将参数设置为等价于逻辑非的值
     * @param {number} height 高度，如果不需要设置则省略此参数
     */
    UI_MULTI_SELECT_CLASS.$setSize = UI_SELECT_CLASS.$setSize;

    /**
     * 获取全部选中的选项控件。
     * @protected
     *
     * @return {Array} 选项控件列表
     */
    UI_MULTI_SELECT_CLASS.getSelected = function () {
        for (var i = 0, items = this.getItems(), o, result = []; o = items[i++]; ) {
            o.isSelected() && result.push(o);
        }
        return result;
    };

    /**
     * 设置下拉框允许显示的选项数量。
     * 如果实际选项数量小于这个数量，没有影响，否则将出现垂直滚动条，通过滚动条控制其它选项的显示。
     * @public
     *
     * @param {number} value 显示的选项数量，必须大于 1
     */
    UI_MULTI_SELECT_CLASS.setOptionSize = UI_SELECT_CLASS.setOptionSize;

    /**
     * 设置控件的值。
     * @public
     *
     * @param {Array} values 控件被选中的值列表
     */
    UI_MULTI_SELECT_CLASS.setValue = function (values) {
        for (var i = 0, items = this.getItems(), o; o = items[i++]; ) {
            o.setSelected(indexOf(values, o._eInput.value) >= 0);
        }
        UI_MULTI_SELECT_FLUSH_TEXT(this);
    };
//{/if}//
//{if 0}//
})();
//{/if}//
