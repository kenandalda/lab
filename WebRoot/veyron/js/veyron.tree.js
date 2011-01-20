(function () {
    var core = ecui,
        dom = core.dom,
        ui = core.ui,
        util = core.util,

        getStyle = dom.getStyle,
        createDom = dom.create,
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
        var root = this.getRoot();
        if (!root.onnodeclick || root.onnodeclick.call(this, event) !== false) {
            UI_TREE_CLASS.$click.call(this, event);
        }
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
     * 给选中的节点元素加上selected样式后缀
     * @public
     * @override
     *
     * @param {boolean} status 是否选中，默认选中
     */
    var _UI_CHECKBOX_SETCHECKED = UI_CHECKBOX_CLASS.setChecked;
    UI_CHECKBOX_CLASS.setChecked = function (status) {
        if (this.getParent() && (this.getParent() instanceof UI_CHECK_TREE)) {
            var parent = this.getParent();
            var superior;
            // 自定义回调
            var root = parent.getRoot();
            if (!root.onnodecheck || root.onnodecheck.call(parent) !== false) {
                parent.alterClass('selected', status !== true);
                _UI_CHECKBOX_SETCHECKED.call(this, status);

                // 上级复选框所在节点样式
                var superior = this.getSuperior()
                while (superior) {
                    superior.getParent().alterClass('selected', !superior.isChecked());
                    superior = superior.getSuperior();
                }
                root.onnodeclick && root.onnodeclick.call(parent);
            }
        }
        else {
            _UI_CHECKBOX_SETCHECKED.call(this, status);
        }
    };

    /**
     * 给节点加上颜色标识, 即文字后加上颜色方框
     * @public
     *
     * @param {boolean} remove 是否去掉标识, 不传表示加上标识
     */
    UI_CHECK_TREE_CLASS.colorSet =  [
            'red',
            'blue',
            'green',
            'yellow',
            'purple'
    ];
    UI_CHECK_TREE_CLASS.setColorLegend = function (remove) {
        var root = this.getRoot();
        var color;
        if (!root._aColorSet || !root._aColorSet.length) {
            root._aColorSet = [].concat(UI_CHECK_TREE_CLASS.colorSet);
        }
        if (remove === true && this._eLegend) {
            color = this._eLegend.style.backgroundColor;
            root._aColorSet.push(color); 
            removeDom(this._eLegend);
            this._eLegend = null;
        }
        else if (!this._eLegend) {
            color = root._aColorSet.pop();
            var legend = createDom(
                'veyron-check-tree-legend',
                'background-color:' + color,
                'em'
            );
            legend.innerHTML = '&nbsp;';
            this.getBase().insertBefore(legend, this.getBase().firstChild);
            this._eLegend = legend;
        }
        return color;
    };

    /**
     * 获取当前节点对应的颜色
     * @public
     *
     * @return {string} 颜色字符串
     */
    UI_CHECK_TREE_CLASS.getColor = function () {
        var color = ''; 
        if (this._eLegend) {
            color = this._eLegend.style.backgroundColor;
        }
        return color;
    };

    /**
     * 获取包括当前树控件在内的全部选中的子树控件的值。
     * @public
     *
     * @return {Array} 全部选中的值列表
     */
    UI_CHECK_TREE_CLASS.getCheckedValue = function () {
        for (var i = 0, list = this.getChildTrees(), result = this.isChecked() ? [this.getValue()] : [], o; o = list[i++]; ) {
            result = result.concat(o.getCheckedValue());    
        }
        return result;
    }; 
})();
