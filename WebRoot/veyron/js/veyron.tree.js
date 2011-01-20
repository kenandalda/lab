(function () {
    var core = ecui,
        dom = core.dom,
        ui = core.ui,
        util = core.util,

        getStyle = dom.getStyle,
        removeDom = dom.remove,
        setInput = dom.setInput,
        blank = util.blank,
        inherits = util.inherits,
        toNumber = util.toNumber,

        getMouseX = core.getMouseX,

        UI_TREE = ui.Tree,
        UI_TREE_CLASS = UI_TREE.prototype,
        UI_RADIO_TREE = ui.RadioTree,
        UI_RADIO_TREE_CLASS = UI_RADIO_TREE.prototype,
        UI_CHECKBOX = ui.Checkbox,
        UI_CHECKBOX_CLASS = UI_CHECKBOX.prototype,
        UI_CHECK_TREE = ui.CheckTree,
        UI_CHECK_TREE_CLASS = UI_CHECK_TREE.prototype;

    
    /**
     * [单选树]鼠标单击控件事件的默认处理。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_RADIO_TREE_CLASS.$click = function (event) {
        if (getMouseX(this) > toNumber(getStyle(this.getBase(), 'paddingLeft'))) {
            var root = this.getRoot(),
                selected = root._cSelected;

            if (selected != this) {
                if (selected) {
                    selected.alterClass('selected', true);
                    selected = selected._eInput;
                }
                UI_RADIO_TREE_SETVALUE(this, selected);
                this.alterClass('selected');
                root._cSelected = this;
            }

            this.setFold = blank;
        }

        UI_TREE_CLASS.$click.call(this, event);
        delete this.setFold;
    };

     /**
     * [单选树]设置当前树控件的表单提交项的值
     * @private
     * @override
     *
     * @param {ecui.ui.RadioTree} tree 树控件
     * @param {InputElement} input 输入框 Element 对象
     */
    function UI_RADIO_TREE_SETVALUE(tree, input) {
        tree.getBody().appendChild(tree._eInput = setInput(input, tree._sName, 'hidden'));
        tree._eInput.value = tree._sValue;
    }

     /**
     * [多选树]鼠标单击控件事件的默认处理。
     * @protected
     * @override
     *
     * @param {Event} event 事件对象
     */
    UI_CHECK_TREE_CLASS.$click = function (event) {
        if (getMouseX(this) > toNumber(getStyle(this.getBase(), 'paddingLeft'))) {
            var isChecked = this.isChecked();
            this.setChecked(!isChecked);
            this.setFold = blank;
        }

        UI_TREE_CLASS.$click.call(this, event);
        delete this.setFold;
    };

     /**
     * 设置复选框控件选中状态。
     * @public
     * @override
     *
     * @param {boolean} status 是否选中，默认选中
     */
    var _UI_CHECKBOX_SETCHECKED = UI_CHECKBOX_CLASS.setChecked;
    UI_CHECKBOX_CLASS.setChecked = function (status) {
        _UI_CHECKBOX_SETCHECKED.call(this, status);
        if (this.getParent() && (this.getParent() instanceof UI_CHECK_TREE)) {
            var parent = this.getParent();
            var superior;
            parent.alterClass('selected', status !== true);
            if (superior = this.getSuperior()) {
                superior.getParent().alterClass('selected', !superior.isChecked());
            }
        }
    };

})();
