/*
Tab - 定义分页选项卡的操作。
选项卡控件，继承自基础控件，实现了选项组接口。每一个选项卡都包含一个头部区域与内容区域，选项卡控件存在互斥性，只有唯一
的一个选项卡能被选中显卡内容区域。

直接初始化选项卡控件的例子
<div ecui="type:tab;selected:1">
    <!-- 包含内容的选项卡 -->
    <div>
        <label>标题1</label>
        <!-- 这里是内容 -->
        ...
    </div>
    <!-- 仅有标题的选项卡，以下selected定义与控件定义是一致的，可以忽略其中之一 -->
    <label ecui="selected:true">标题2</label>
</div>

属性
_bButton         - 向前向后滚动按钮是否显示
_bKeep           - 是否持续自动滚动
_nStep           - 自动滚动的步长
_nTimeout        - 自动滚动的时间间隔
_nIndex          - 需要移动到的选项序号
_oSelected       - 初始化时临时保存当前被选中的选项卡
_oTimer          - 自动滚动定时器
_aPosition       - 选项卡位置缓存
_cSelected       - 当前选中的选项卡
_uPrev           - 向前滚动按钮
_uNext           - 向后滚动按钮

Item属性
_bSelected       - 初始化时临时保存当前选项卡是否选中
_sContentDisplay - 内容 DOM 元素的布局属性
_eContent        - 内容 DOM 元素
*/
//{if 0}//
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
        UI_ITEM = ui.Item,
        UI_ITEM_CLASS = UI_ITEM.prototype,
        UI_ITEMS = ui.Items;
//{/if}//
//{if $phase == "define"}//
        /**
         * 初始化选项卡控件。
         * params 参数支持的特定属性如下：
         * selected 选中的选项序号，默认为0
         * @protected
         *
         * @param {HTMLElement} el 关联的 Element 对象
         * @param {Object} params 初始化参数
         */
        var UI_TAB = ui.Tab = function (el, params) {
            var i = 0,
                list = children(el),
                __gzip_direct__baseClass = params.base,
                __gzip_direct__typeClass = params.type,
                titleEl = createDom(
                    __gzip_direct__typeClass + '-title ' + __gzip_direct__baseClass + '-title',
                    'position:relative;overflow:hidden'
                );

            this._oSelected = params.selected || 0;

            // 生成选项卡头的的DOM结构
            titleEl.innerHTML = '<div class="' + __gzip_direct__typeClass + '-title-prev '
                + __gzip_direct__baseClass + '-title-prev" style="position:absolute;left:0px;display:none"></div><div class="'
                + __gzip_direct__typeClass + '-title-next '
                + __gzip_direct__baseClass + '-title-next" style="position:absolute;display:none"></div><div class="'
                + __gzip_direct__baseClass + '-title-main" style="position:absolute;white-space:nowrap"></div>';

            // 初始化
            UI_CONTROL.call(this, el, params);

            // 以下使用params代替list
            params = children(titleEl);

            el.appendChild(titleEl);
            for (; el = list[i++]; ) { 
                params[2].appendChild(el); 
            } 
            this.$setBody(params[2]);

            this.$initItems();

            // 滚动按钮
            this._uPrev = $fastCreate(UI_TAB_BUTTON, params[0], this);
            this._uNext = $fastCreate(UI_TAB_BUTTON, params[1], this);
        },

        UI_TAB_CLASS = inherits(UI_TAB, UI_CONTROL),
        UI_TAB_BUTTON = UI_TAB.Button = function (el, params) {
            UI_CONTROL.call(this, el, params);
        },
        UI_TAB_BUTTON_CLASS = inherits(UI_TAB_BUTTON, UI_CONTROL),
        UI_TAB_ITEM = UI_TAB.Item = function (el, params) {
            var parent = params.parent,
                contentEl;

            if (el.tagName != 'LABEL') {
                this.setContent(contentEl = el);
                el = first(el);
                // 这里要检查父节点是否存在，如果不存在表示直接生成的对象
                insertBefore(el, contentEl);
                parent && parent.getBase().appendChild(contentEl);
            }
            setStyle(el, 'display', 'inline-block');

            this._bSelected = params.selected;

            UI_ITEM.call(this, el, params);
        },
        UI_TAB_ITEM_CLASS = inherits(UI_TAB_ITEM, UI_ITEM);
//{else}//
    /**
     * 刷新向前向右滚动按钮的可操作状态。
     * @private
     *
     * @param {ecui.ui.Tab} control Tab 控件对象
     */
    function UI_TAB_FLUSH_BUTTON(control) {
        var left = toNumber(control.getBody().style.left);

        control._uPrev.setEnabled(left < control._uPrev.getWidth());
        control._uNext.setEnabled(
            left > control.getBodyWidth() - control.$cache$bodyWidth - control._uNext.getWidth()
        );
    }

    copy(UI_TAB_CLASS, UI_ITEMS);

    /**
     * 控扭控件按压状态结束事件的默认处理。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_TAB_BUTTON_CLASS.$pressend = function (event) {
        UI_CONTROL_CLASS.$pressend.call(this, event);

        var parent = this.getParent();
        parent._bKeep = false;
        parent._nTimeout = 10;
    };

    /**
     * 控扭控件按压状态开始事件的默认处理。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_TAB_BUTTON_CLASS.$pressstart = function (event) {
        UI_CONTROL_CLASS.$pressstart.call(this, event);

    	var parent = this.getParent();
        parent._bKeep = true;
        parent._nTimeout = 20;
        parent.move(this == parent._uPrev ? -1 : 1);

        event.preventDefault();
    };

    /**
     * 计算控件的缓存。
     * 控件缓存部分核心属性的值，提高控件属性的访问速度，在子控件或者应用程序开发过程中，如果需要避开控件提供的方法(setSize、alterClass 等)直接操作 Element 对象，操作完成后必须调用 clearCache 方法清除控件的属性缓存，否则将引发错误。
     * @protected
     *
     * @param {CssStyle} style 基本 Element 对象的 Css 样式对象
     * @param {boolean} cacheSize 是否需要缓存控件大小，如果控件是另一个控件的部件时，不缓存大小能加快渲染速度，默认缓存
     */
    UI_TAB_ITEM_CLASS.$cache = function (style, cacheSize) {
        UI_ITEM_CLASS.$cache.call(this, style, cacheSize);

        this.$cache$marginLeft = toNumber(style.marginLeft);
        this.$cache$marginRight = toNumber(style.marginRight);
    };

    /**
     * 鼠标单击控件事件的默认处理。
     * 选项卡控件点击时将当前选项卡设置成为选中状态，同时取消同一个选项卡控件组的其它控件的选中状态。如果控件处于可操作状态(参见 isEnabled)，click 方法触发 onclick 事件，如果事件返回值不为 false，则调用 $click 方法。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_TAB_ITEM_CLASS.$click = function (event) {
        UI_ITEM_CLASS.$click.call(this, event);
        this.getParent().setSelected(this);
    };

    /**
     * 销毁控件的默认处理。
     * 页面卸载时将销毁所有的控件，释放循环引用，防止在 IE 下发生内存泄漏，$dispose 方法的调用不会受到 ondispose 事件返回值的影响。
     * @protected
     */
    UI_TAB_ITEM_CLASS.$dispose = function () {
        this._eContent = null;
        UI_ITEM_CLASS.$dispose.call(this);
    };

    /**
     * 获取选项卡对应的内容元素。
     * @public
     *
     * @return {HTMLElement} 选项卡对应的内容 DOM 元素。
     */
    UI_TAB_ITEM_CLASS.getContent = function () {
        return this._eContent;
    };

    /**
     * 设置选项卡对应的内容元素。
     * @public
     *
     * @param {HTMLElement} el 选项卡对应的内容 DOM 元素。
     */
    UI_TAB_ITEM_CLASS.setContent = function (el) {
        this._eContent = el;
        if (el) {
            this._sContentDisplay = el.style.display;
        }
    };

    /**
     * 选项控件发生变化的处理。
     * 在 选项组接口 中，选项控件发生增加/减少操作时调用此方法。
     * @protected
     */
    UI_TAB_CLASS.$alterItems = function () {
        // 第一次进入时不需要调用$setSize函数
        this._aPosition && this.$setSize(this.getWidth());

        for (
            var i = 0,
                pos = this._aPosition = [this._uPrev.getWidth()],
                lastItem = {$cache$marginRight: 0},
                items = this.getItems(),
                o;
            o = items[i++];
        ) {
            pos[i] = pos[i - 1] - MAX(lastItem.$cache$marginRight, o.$cache$marginLeft) - o.getWidth();
            lastItem = o;
        }
    };

    /**
     * 计算控件的缓存。
     * 控件缓存部分核心属性的值，提高控件属性的访问速度，在子控件或者应用程序开发过程中，如果需要避开控件提供的方法(setSize、alterClass 等)直接操作 Element 对象，操作完成后必须调用 clearCache 方法清除控件的属性缓存，否则将引发错误。
     * @protected
     *
     * @param {CssStyle} style 基本 Element 对象的 Css 样式对象
     * @param {boolean} cacheSize 是否需要缓存控件大小，如果控件是另一个控件的部件时，不缓存大小能加快渲染速度，默认缓存
     */
    UI_TAB_CLASS.$cache = function (style, cacheSize) {
        UI_ITEMS.$cache.call(this, style, cacheSize);

        this._uPrev.cache(true, true);
        this._uNext.cache(true, true);

        this.$cache$bodyWidth = this.getBody().offsetWidth;
    };

    /**
     * 获得当前显示的选项卡中左边元素的索引，只在能左右滚动时有效。
     * @protected
     *
     * @return {number} 最左边元素的索引
     */
    UI_TAB_CLASS.$getLeftMostIndex = function () {
        for (var left = toNumber(this.getBody().style.left), pos = this._aPosition, i = pos.length; i--; ) {
            if (left <= pos[i]) {
                return i;
            }
        }
    };

    /**
     * 控件渲染完成后初始化的默认处理。
     * $init 方法在控件渲染完成后调用，参见 create 与 init 方法。
     * @protected
     */
    UI_TAB_CLASS.$init = function () {
        this._uPrev.$init();
        this._uNext.$init();
        UI_ITEMS.$init.call(this);
        for (var i = 0, items = this.getItems(), o; o = items[i++];) {
            o.$setSize(o.getWidth(), o.getHeight());
            if (o._bSelected) {
                this._oSelected = o;
            }
        }
        this.setSelected(this._oSelected);
    };

     /**
     * 控件移除子控件事件的默认处理。
     * 选项组移除子选项时需要额外移除引用。
     * @protected
     *
     * @param {ecui.ui.Tab.Item} child 选项控件
     */
    UI_TAB_CLASS.$remove = function (child) {
         var items = this.getItems(),
             index = indexOf(items, child);
         UI_ITEMS.$remove.call(this, child);

         if (index == items.length - 1) {
            index = 0;
         }
         child._eContent && removeDom(child._eContent);
         this.paint();
         if (this.getSelected() == child) {
             // 跳到被删除项的后一项
             this.setSelected(index);
         }
    };

    /**
     * 设置控件的大小。
     * @protected
     *
     * @param {number} width 宽度，如果不需要设置则将参数设置为等价于逻辑非的值
     * @param {number} height 高度，如果不需要设置则省略此参数
     */
    UI_TAB_CLASS.$setSize = function (width, height) {
        UI_CONTROL_CLASS.$setSize.call(this, width, height);

        // 以下使用height表示style
        var __gzip_direct__prev = this._uPrev,
            __gzip_direct__next = this._uNext,
            height = this.getBody().style;

        width = this.getBodyWidth();
        if (this.$cache$bodyWidth > width) {
            width -= __gzip_direct__next.getWidth();
            __gzip_direct__next.getOuter().style.left = width + 'px';

            if (this._bButton) {
                // 缩小后变大，右边的空白自动填补
                width -= this.$cache$bodyWidth;
                if (toNumber(height.left) < width) {
                    height.left = width + 'px';
                }
            }
            else {
                __gzip_direct__prev.$show();
                __gzip_direct__next.$show();
                height.left = __gzip_direct__prev.getWidth() + 'px';
                this._bButton = true;
            }

            UI_TAB_FLUSH_BUTTON(this);
        }
        else if (this._bButton) {
            __gzip_direct__prev.$hide();
            __gzip_direct__next.$hide();
            height.left = '0px';
            this._bButton = false;
        }
    };

    /**
     * 添加子选项控件。
     * add 方法中如果位置序号不合法，子选项控件将添加在末尾的位置。
     * @public
     *
     * @param {string|HTMLElement|ecui.ui.Item} item 控件的 html 内容/控件对应的 Element 对象/选项控件
     * @param {number} index 子选项控件需要添加的位置序号
     * @param {Object} 子控件初始化参数
     * @return {ecui.ui.Item} 子选项控件
     */
    UI_TAB_CLASS.add = function (item, index, params) {
        if ('string' == typeof item) {
            item = createDom('', '', 'label');
        }
        return UI_ITEMS.add.call(this, item, index, params);
    };

    /**
     * 获得当前选中的选项卡控件。
     *
     * @return {ecui.ui.Tab.Item} 选中的选项卡控件
     */
    UI_TAB_CLASS.getSelected = function () {
        return this._cSelected;
    };

    /**
     * 移动分页选项头部
     * @public
     *
     * @param {number} skip 移动头部指定个数的选项卡数量，正数向后，负数向前
     */
    UI_TAB_CLASS.move = function (skip) {
        if (skip && this._oTimer) {
            // 防止重入
            this._nIndex += skip;
        }
        else {
            var style = this.getBody().style,
                __gzip_direct__pos = this._aPosition,
                items = this.getItems(),
                index = this.$getLeftMostIndex(),
                left = toNumber(style.left),
                toIndex = MAX(
                    skip ? index + skip + (skip < 0 && left != __gzip_direct__pos[index] ? 1 : 0) : this._nIndex,
                    0
                ),
                minRight = this.getBodyWidth() - this.$cache$bodyWidth - this._uNext.getWidth();

            this._oTimer = null;

            if (skip) {
                this._nStep = skip > 0 ? -5 : 5;
            }
            else {
                left += this._nStep;
            }

            while (1) {
                if (left < minRight) {
                    // 已经移动到右边界
                    left = minRight;
                    this._bKeep = false;
                    break;
                }
                else {
                    if (this._nStep > 0 && left >= __gzip_direct__pos[toIndex]) {
                        if (!toIndex) {
                            // 已经移动到左边界
                            this._bKeep = false;
                        }
                        // 向左移动时到达目的地边界，检查是否需要保持移动
                        if (!this._bKeep) {
                            left = __gzip_direct__pos[toIndex];
                            break;
                        }
                        toIndex--;
                    }
                    else if (this._nStep < 0 && left <= __gzip_direct__pos[toIndex]) {
                        // 向右移动时到达目的地边界，检查是否需要保持移动
                        if (!this._bKeep) {
                            left = __gzip_direct__pos[toIndex];
                            break;
                        }
                        toIndex++;
                    }
                    this._nIndex = toIndex;
                    this._oTimer = new Timer(this.move, this._nTimeout, this);
                    break;
                }
            }
            style.left = left + 'px';
            UI_TAB_FLUSH_BUTTON(this);
        }
    };

    /**
     * 设置被选中的选项卡。
     * @public
     *
     * @param {number|ecui.ui.Tab.Item} 选项卡子选项的索引/选项卡子选项控件
     */
    UI_TAB_CLASS.setSelected = function (item) {
        var i = 0,
            items = this.getItems(),
            style = this.getBody().style,
            left = toNumber(style.left),
            o;

        if ('number' == typeof item) {
            item = items[item];
        }
        if (this._cSelected != item) {
            for (; o = items[i++]; ) {
                if (o._eContent) {
                    o._eContent.style.display = o == item ? o._sContentDisplay : 'none';
                }
            }

            this._cSelected && this._cSelected.alterClass('selected', true);

            if (item) {
                item.alterClass('selected');
                o = this._aPosition[indexOf(items, item)];
                if (left < o) {
                    style.left = o + 'px';
                }
                else {
                    o -= item.getWidth() + this._uPrev.getWidth() + this._uNext.getWidth() - this.getBodyWidth();
                    if (left > o) {
                        style.left = o + 'px';
                    }
                }
                UI_TAB_FLUSH_BUTTON(this);
            }

            this._cSelected = item;
        }
    };
//{/if}//
//{if 0}//
})();
//{/if}//
