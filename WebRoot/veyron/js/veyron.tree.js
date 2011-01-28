(function () {
    var core = ecui,
        dom = core.dom,
        ui = core.ui,
        util = core.util,

        getStyle = dom.getStyle,
        createDom = dom.create,
        removeDom = dom.remove,
        moveElements = dom.moveElements,
        first = dom.first,
        children = dom.children,
        trim = core.string.trim,
        insertBefore = dom.insertBefore,
        insertHTML = dom.insertHTML,
        setInput = dom.setInput,
        blank = util.blank,
        inherits = util.inherits,
        copy = util.copy,
        toNumber = util.toNumber,

        $bind = core.$bind,
        $fastCreate = core.$fastCreate,
        getMouseX = core.getMouseX,
        getParameters = core.getParameters,

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
        var root = this.getRoot();
        if (getMouseX(this) > toNumber(getStyle(this.getBase(), 'paddingLeft'))) {
            if (this._bDisabledCheck) {
                return;
            }
            var selected = root._cSelected;

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
            root.onnodeclick && root.onnodeclick.call(this, event);
        }
        else if (root.loadChildren) {
            if (this.getOuter().getAttribute('data-async') && !this.getChildTrees().length) {
                this.alterClass('loading');
                root.loadChildren.call(this);
                this.setFold = blank;
            }
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
        var root = this.getRoot();
        if (getMouseX(this) > toNumber(getStyle(this.getBase(), 'paddingLeft'))) {
                var isChecked = this.isChecked();
                this.setChecked(!isChecked);
                this.setFold = blank;
        }
        else if (root.loadChildren) {
            if (this.getOuter().getAttribute('data-async') && !this.getChildTrees().length) {
                this.alterClass('loading');
                root.loadChildren.call(this);
                this.setFold = blank;
            }
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
            if (parent._bDisabledCheck) {
                return;
            }
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

    /**
     * 添加子树
     * @public
     * @override
     *
     * @param {string} html 子树的html
     */
    UI_CHECK_TREE_CLASS.insertChildTree = function (html) {
        UI_TREE_CLASS.insertChildTree.call(this, html);
        // checkbox 建立关联
        if (this._oSuperior) {
            var superior = this.$getSection('Checkbox');
            for (var i = 0, o, list = this.getChildTrees(), checkbox; o = list[i++];) {
               checkbox = o.$getSection('Checkbox'); 
               checkbox.setChecked(superior.isChecked());
               if (!this._bDisabledCheck) {
                   checkbox.setSuperior(superior);
               }
            }
        }
    };

    /**
     * 树基类: 添加子树
     * @public
     *
     * @param {string} html 子树的html
     */
    UI_TREE_CLASS.insertChildTree = function (html) {
        if (!this.getChildTrees().length) {
            var el = this.getOuter();
            var o = createDom('', 'display:block', 'label');
            moveElements(el, o, true);
            el.appendChild(o);

            var childTrees = this._aTree = [];
            insertBefore(o, el);
            this._eBase = this._eBody = o;
            $bind(o, this);
            el.innerHTML = html;
            UI_TREE_SETITEMS(this, el);

            // 初始化子控件
            for (var i = 0, list = children(el); o = list[i]; ) {
                (childTrees[i++] = UI_TREE_CREATE_CHILD(o, this, undefined)).$setParent(this);
            }
            UI_TREE_FLUSH(this);
            this.alterClass('loading', true);
            if (this._bDisabledCheck) {
                this.getOuter().className += ' ' + this.getBaseClass() + '-disablecheck'; 
            }
        }
    }

     /**
     * 树控件刷新，根据子树控件的数量及显示的状态设置样式，分为 -empty(没有子树控件)、-fold(子树收缩)与普通样式三种。
     * @private
     *
     * @param {ecui.ui.Tree} control 树控件
     */
    function UI_TREE_FLUSH(control) {
        control.setClass(
            control.getBaseClass() + (control._aTree.length ? control._bFold ? '-fold' : '-nonleaf' : '')
        );
    }

    /**
     * 设置树控件的选项组 Element 对象。
     * @private
     *
     * @param {ecui.ui.Tree} tree 树控件
     * @param {HTMLElement} items 子树选项组的 Element 对象
     * @return {HTMLElement} 子树选项组的 Element 对象
     */
    function UI_TREE_SETITEMS(tree, items) {
        tree._eItems = items;
        items.className = tree.getType() + '-items ' + tree.getBaseClass() + '-items';
        items.style.cssText = '';
        return items;
    }

     /**
     * 建立子树控件。
     * @private
     *
     * @param {HTMLElement} el 子树的 Element 对象
     * @param {ecui.ui.Tree} parent 父树控件
     * @param {Object} params 初始化参数，参见 create 方法
     * @return {ecui.ui.Tree} 子树控件
     */
    function UI_TREE_CREATE_CHILD(el, parent, params) {
        el.className = parent.getType() + ' ' + (trim(el.className) || parent.getBaseClass());
        var o = $fastCreate(parent.constructor, el, null, copy(copy({}, params), getParameters(el)));
        o.cache();
        o.init();
        return o;
    }

    UI_TREE_CLASS.oncreate = function (params) {
        if (this.getOuter().getAttribute('data-async')) {
            this.setClass(
                this.getBaseClass() + '-asyncnode'       
            )
        }
        if (this.getOuter().getAttribute('data-disableCheck')) {
            this._bDisabledCheck = true;
            this.getOuter().className += ' ' + this.getBaseClass() + '-disablecheck';
        }
    };

    UI_CHECK_TREE_CLASS.oncreate = function (params) {
        UI_TREE_CLASS.oncreate.call(this, params);
        var checkbox = this._uCheckbox;

        if (this._bDisabledCheck) {
            checkbox.setEnabled(false);
        }

        UI_CHECK_TREE_FLUSH_DISABLED(this);
    };

    function UI_CHECK_TREE_FLUSH_DISABLED (control) {
        var checkbox = control._uCheckbox;
        if (control._bDisabledCheck) {
            for (var i = 0, o, items = checkbox.getInferiors(); o = items[i++]; ) {
                o.setSuperior();
            }
        }
    }
})();
