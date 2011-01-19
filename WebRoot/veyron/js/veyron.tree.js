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
        UI_RADIO_TREE_CLASS = UI_RADIO_TREE.prototype;

    
    /**
     * 鼠标单击控件事件的默认处理。
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
     * 设置当前树控件的表单提交项的值
     * @private
     *
     * @param {ecui.ui.RadioTree} tree 树控件
     * @param {InputElement} input 输入框 Element 对象
     */
    function UI_RADIO_TREE_SETVALUE(tree, input) {
        tree.getBody().appendChild(tree._eInput = setInput(input, tree._sName, 'hidden'));
        tree._eInput.value = tree._sValue;
    }
})();
