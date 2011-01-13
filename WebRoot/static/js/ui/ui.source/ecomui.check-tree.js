(function () {

    var core = ecui,
        ui = core.ui,
        util = core.util,

        undefined = void(0),

        createDom = core.dom.create,
        copy = util.copy,
        inherits = util.inherits,

        $connect = core.$connect,
        $fastCreate = core.$fastCreate,
        getParameters = core.getParameters,

        UI_CHECKBOX = ui.Checkbox,

        UI_TREE = ui.Tree,
        UI_TREE_CLASS = UI_TREE.prototype;
	
    /**
     * 初始化树控件
     * params 参数支持的属性如下：
     * name 复选框的表单项提交名称
     * @public
     *
     * @param {Element} el 关联的 Element 对象
     * @param {Object} params 初始化参数
     */
    var UI_CHECK_TREE =
        ui.CheckTree = function (el, params) {
            params = copy(copy({}, params), getParameters(el));

            UI_TREE.call(this, el, params);

			params.value = el.getAttribute('value') || params.value;
			params.checked = el.getAttribute('checked') || params.checked;
            (!params.noRelate) && (this._sSuperior = params.superior);

            var i = 0,
                checkbox = this._uCheckbox = $fastCreate(
                    UI_CHECKBOX,
                    el.insertBefore(createDom('ec-checkbox ' + this.getBaseClass() + '-checkbox'), el.firstChild),
                    this,
                    params
                ),
                childTrees = this.getChildTrees();

			if (!params.noRelate) {
				for (; el = childTrees[i++]; ) {
					params = el._sSuperior;
					el = el._uCheckbox;
					params === undefined
						? el.setSuperior(checkbox)
						: params !== true && $connect(el, el.setSuperior, params);
				}
			}
        },

        UI_CHECK_TREE_CLASS = inherits(UI_CHECK_TREE, UI_TREE);
    /**
     * 计算控件的缓存。
     * 控件缓存部分核心属性的值，提高控件属性的访问速度，在子控件或者应用程序开发过程中，如果需要避开控件提供的方法(setSize、alterClass 等)直接操作 Element 对象，操作完成后必须调用 clearCache 方法清除控件的属性缓存，否则将引发错误。
     * @protected
     *
     * @param {CssStyle} style 基本 Element 对象的 Css 样式对象
     * @param {boolean} cacheSize 是否需要缓存控件大小，如果控件是另一个控件的部件时，不缓存大小能加快渲染速度，默认缓存
     */
    UI_CHECK_TREE_CLASS.$cache = function (style, cacheSize) {
        UI_TREE_CLASS.$cache.call(this, style, cacheSize);
        this._uCheckbox.cache(true, true);
    };

    /**
     * 控件渲染完成后初始化的默认处理。
     * $init 方法在控件渲染完成后调用，参见 create 与 init 方法。
     * @protected
     */
    UI_CHECK_TREE_CLASS.$init = function () {
		var children = this.getChildTrees();
        this._uCheckbox.$init();
        UI_TREE_CLASS.$init.call(this);
		for (var i = 0, child; child = children[i]; i++) {
			child.$init();
		}
    };

    /**
     * 判断树控件是否选中。
     * @public
     *
     * @return {boolean} 是否选中
     */
    UI_CHECK_TREE_CLASS.isChecked = function () {
        return this._uCheckbox.isChecked();
    };

	UI_CHECK_TREE_CLASS.getChecked = function () {
		var list = this.getChildTrees(), res = [];
		(this.isChecked()) && (res.push(this));
		for (var i = 0, child; child = list[i]; i++) {
			res = res.concat(child.getChecked());	
		}
		return res;
	};

	UI_CHECK_TREE_CLASS.getValue = function () {
		return this._uCheckbox.getValue();
	};

	UI_CHECK_TREE_CLASS.setChecked = function (status) {
		this._uCheckbox.setChecked(status);	
	};
})();
