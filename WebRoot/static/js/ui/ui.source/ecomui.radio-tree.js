/*
RadioTree - 定义单选框的树形结构的基本操作。
包含单选框的树控件，继承自树控件，每次点击可以选择一个树节点。

树控件直接HTML初始化的例子:
<div ecui="type:radio-tree;fold:true;name:part">
    <!-- 当前节点的文本，如果没有整个内容就是节点的文本 -->
    <label>节点的文本</label>
    <!-- 这里放子控件，如果需要fold某个子控件，将子控件的style="display:none"即可 -->
    <li>子控件文本</li>
    ...
</div>

属性
_eInput    - 树的根节点拥有，保存树对应的提交 INPUT
_cSelected - 树的根节点拥有，保存当前选中的项
*/
(function () {
 
    var core = ecui,
        dom = core.dom,
        ui  = core.ui,
        util = core.util,

        getStyle = dom.getStyle,
        removeDom = dom.remove,
        setInput = dom.setInput,
        blank = util.blank,
        copy = util.copy,
        inherits = util.inherits,
        toNumber = util.toNumber,

        getMouseX = core.getMouseX,
        getParameters = core.getParameters,

        UI_TREE = ui.Tree,
		UI_TREE_CLASS = ui.Tree.prototype,
        UI_CONTROL_CLASS = ui.Control.prototype;
    /**
     * 初始化单选树控件
     * params 参数支持的属性如下：
     * name 单选框的表单项的默认名称
     * value 单选框的表单项的值
     * @public
     *
     * @param {Element} el 关联的 Element 对象
     * @param {Object} params 初始化参数
     */
    var UI_RADIO_TREE = 
        ui.RadioTree = function (el, params) {
            params = copy(copy({}, params), getParameters(el));
            this._sValue = el.getAttribute('value') || params.value;
            this._sName = params.name;
			this._nfixLeftPadding = parseInt(params.fixPadding, 10);
            UI_TREE.call(this, el, params);
        },

    UI_RADIO_TREE_CLASS = inherits(UI_RADIO_TREE, UI_TREE);
    /**
     * 设置当前树控件的表单提交项的值
     * @private
     *
     * @param {ecui.ui.Tree} tree 树控件
     * @param {string} value 树控件的值
     */
    function UI_RADIO_TREE_SETVALUE(tree, value) {
        tree._eInput || tree.getBody().appendChild(tree._eInput = setInput('', tree.getName(), 'hidden'));
        tree._eInput.value = value;
    }

    /**
     * 鼠标单击控件事件的默认处理。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_RADIO_TREE_CLASS.$click = function (event) {
		var n = this._nfixLeftPadding ? this._nfixLeftPadding : 0,
			x = getMouseX(this);
        if (x <= toNumber(getStyle(this.getBase(), 'paddingLeft')) && x >= n) {
            var root = this.getRoot();

            root._cSelected && root._cSelected.alterClass('select', true);
            this.alterClass('select');
            root._cSelected = this;
            UI_RADIO_TREE_SETVALUE(root, this._sValue);

            this.setFold = blank;
        }

        UI_TREE_CLASS.$click.call(this, event);
        delete this.setFold;
    };

    /**
     * 销毁控件的默认处理。
     * 页面卸载时将销毁所有的控件，释放循环引用，防止在 IE 下发生内存泄漏，$dispose 方法的调用不会受到 ondispose 事件返回值的影响。
     * @protected
     */
    UI_RADIO_TREE_CLASS.$dispose = function () {
        this._eInput = null;
        UI_TREE_CLASS.$dispose.call(this);
    };

    /**
     * 获取控件的表单项名称。
     * @public
     *
     * @return {string} INPUT 对象名称
     */
    UI_RADIO_TREE_CLASS.getName = function () {
        return this._sName;
    };

    /**
     * 获取当前树控件选中的项。
     * @public
     *
     * @return {ecui.ui.Tree} 树控件选中的项
     */
    UI_RADIO_TREE_CLASS.getSelected = function () {
        return this.getRoot()._cSelected;
    };

    /**
     * 获取控件的值。
     * @public
     *
     * @return {string} 控件的值
     */
    UI_RADIO_TREE_CLASS.getValue = function () {
        return this._sValue;
    };

    /**
     * 设置当前控件的父控件。
     * @public
     *
     * @param {ecui.ui.Control|HTMLElement} parent 父控件对象/父 Element 对象，忽略参数则将控件移出 DOM 树
     */
    UI_RADIO_TREE_CLASS.setParent = function (parent) {
        var root = this.getRoot();

        UI_TREE_CLASS.setParent.call(this, parent);

        if (root._cSelected == this) {
            this.alterClass('select', true);
            root._cSelected = null;
            UI_RADIO_TREE_SETVALUE(root, '');
        }
        if (this._cSelected) {
            this._cSelected.alterClass('select', true);
            this._cSelected = null;
            this._eInput && removeDom(this._eInput);
        }
    };
})();
