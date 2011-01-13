/**
 * TODO 高度问题
 */
var ecomui = ecomui || {};

(function() {
	var lib = baidu, 
		core = ecui, 
		dom = core.dom, 
        libDom = lib.dom,
		ui = core.ui,
		util = core.util,
		inherits = util.inherits,
		copy = util.copy,
        blank = util.blank,

		$fastCreate = core.$fastCreate,
        Timer = core.Timer,
        getParameters = core.getParameters,

        g = libDom.g,
		children = dom.children,
		createDom = dom.create,
        insertHTML = dom.insertHTML,
		setText = dom.setText,
        indexOf = core.array.indexOf,
        getStyle = dom.getStyle,
        hasClass = libDom.hasClass,

        MATH = Math,
        ceil = MATH.ceil,

		DOCUMENT = document,
		UI_CONTROL = ui.Control,
		UI_CONTROL_CLASS = UI_CONTROL.prototype,
        UI_ITEM = ui.Item,
        UI_ITEMS = ui.Items,
        UI_ITEM_CLASS = UI_ITEM.prototype,

        UI_TAB = ui.Tab = function(el, params) {
            // 重组HTML
            var items = children(el),
                tabTitle = createDom("ec-tab-title ec-tab-title", "overflow:hidden;position:relative"),
                //widthRef = createDom("ec-tab-widthref", "height:1px"),
                i = 0,
                o;

            el.insertBefore(tabTitle, items[0]);

            for (; o = items[i]; i++) {
                (o = children(o)[0]._eContent 
                    = children(o)[0].parentNode).className = "ec-tab-content";

                if (getParameters(o).current !== undefined) {
                    params.current = i;    
                };

                o = children(o)[0];
                o.className += " ec-inline-block";
                o.innerHTML = "<span class='ec-inline-block'>" + o.innerHTML + "</span>";
                tabTitle.appendChild(o);
            } 


            this._uTitles = $fastCreate(UI_TAB_TITLES, tabTitle, this, params);
            
            UI_CONTROL.call(this, el, params);

        },

        UI_TAB_CLASS = inherits(UI_TAB, UI_CONTROL), 

        UI_TAB_TITLES = function(el, params) {
            var o = createDom("ec-tab-title-wrapper", "overflow:hidden;position:relative"),
                outer,
                body,
                prev,
                next;

            el.parentNode.insertBefore(o, el);
            o.appendChild(el);
            body = this._eBody = el;

            UI_CONTROL.call(this, el, params);
            this.$initItems();

            outer = this._eBase = o;
            this._nCurIdx = params.current || 0;

            // 滚动按钮
            (prev = this._uPrev = $fastCreate(
                UI_CONTROL, 
                o = createDom("ec-tab-title-prev ec-tab-title-scroll", "position:absolute;"),
                this
            )).$pressstart = UI_TAB_TITLES_SCROLLPRESSSTART;
            outer.insertBefore(o, body);

            (next = this._uNext = $fastCreate(
                UI_CONTROL, 
                o = createDom("ec-tab-title-next ec-tab-title-scroll", "position:absolute"),
                this
            )).$pressstart = UI_TAB_TITLES_SCROLLPRESSSTART;
            outer.insertBefore(o, body);

            prev._nDis = 20;
            next._nDis = -20;
            // TODO
            this._nLeftPadding = 20;
            this._nRightPadding = 20;

            prev.$pressover = next.$pressover = UI_TAB_TITLES_SCROLLPRESSSTART;
            prev.$pressend = next.$pressend = UI_TAB_TITLES_SCROLLPRESSEND;
            prev.$pressout = next.$pressout = UI_TAB_TITLES_SCROLLPRESSOUT;

            prev.hide();
            next.hide();

            this.$init = UI_TAB_TITLES_INIT;

        },

        UI_TAB_TITLES_CLASS = inherits(UI_TAB_TITLES, UI_CONTROL),

        UI_TAB_TITLES_ITEM = UI_TAB_TITLES.Item = function(el, params) {
            UI_ITEM.call(this, el, params); 

            content = this._eContent = el._eContent;
            el._eContent = undefined;
            
            content.style.display = "none";
        },

        UI_TAB_TITLES_ITEM_CLASS = inherits(UI_TAB_TITLES_ITEM, UI_ITEM);
        
        UI_TAB_CLASS.$init = function() {
            UI_CONTROL_CLASS.$init.call(this);
            this._uTitles.init();
        };
        
        UI_TAB_TITLES_CLASS.$alterItems = function() {};

        UI_TAB_TITLES_INIT = function() {
            UI_CONTROL_CLASS.$init.call(this);

            this.select(this._nCurIdx);

            var items = this.getItems(),
                i = 0,
                o,
                width = 0,
                outer = this.getOuter(),
                body = this.getBody(),
                style = body.style;

            // 生成标签容器的宽度
            // TODO 更好的实现方式
            for (; o = items[i++];) {
                width += o._nWidth + o.getInvalidWidth()
            //        + (parseInt(getStyle(o.getOuter(), "marginLeft"), 10) || 0) 
                    + (parseInt(getStyle(o.getOuter(), "marginRight"), 10) || 0);
            }

            this._nItemsWidth = width;
            
            if (width > this.getWidth()){
                style.left = (parseInt(style.left, 10) || 0) + this._nLeftPadding + "px";
                this._uPrev.show();                
                this._uNext.show();                
            };

            outer.style.height = items[0]._nHeight + "px";
            body.style.width = width + "px";

            this.$alterItems();
        };

        /*
        UI_TAB_TITLES_CLASS.$setSize = function(width, height) {
            UI_CONTROL_CLASS.$setSize.call(this, width, height);
        };
        */

        /*
        UI_TAB_CLASS.$cache = function(style, cacheSize) {
            UI_CONTROL_CLASS.$cache.call(style, cacheSize);
            this._uTitles.cache(true, true);
        };
        */

        UI_TAB_CLASS.$setSize = blank;

        UI_TAB_CLASS.$resize = function () {
            this._uTitles.resize();
        };
        /**
         * 标签头控件大小改变
         */
        UI_TAB_TITLES_CLASS.$resize = function() {
            UI_CONTROL_CLASS.$resize.call(this);

            var titles = this,
                outerWidth = this._eBase.offsetWidth,
                style = titles.getBody().style;

            titles.getOuter().style.width = outerWidth + "px";

            if (titles._nItemsWidth > outerWidth) {
                titles._uPrev.show();
                titles._uNext.show();
            }
            else {
                titles.getBody().style.left = 0;
                titles._uPrev.hide();
                titles._uNext.hide();
            }
            
            // alert(titles._nItemsWidth + ":" + outerWidth);

            // ie fix
            titles.$mouseover();
        };

        /**
         * 默认标签选择
         */ 
        UI_TAB_TITLES_CLASS.$select = function(index) {
            var o;

            if (this._nLastIndex !== undefined) { // _nLastIndex可能为0
                o = this.getItems()[this._nLastIndex];
                o.alterClass("selected", true);
                o._eContent.style.display = "none";
            }    

            o = this.getItems()[index];
            o.alterClass("selected");
            o._eContent.style.display = "block";
            this._nLastIndex = index;
        };

        UI_TAB_TITLES_CLASS.select = function(index) {
            var o = this;
            if (o.onselect && o.onselect(index) === false || o.$select(index) === false) {
                return false;
            }
        };

        UI_TAB_TITLES_ITEM_CLASS.$click = function(event) {
            UI_ITEM_CLASS.$click.call(this, event);

            var parent = this.getParent(),
                index = indexOf(parent.getItems(), this),
                outer = this.getOuter(),
                href = outer.getAttribute("data-href");

            if (!href) {
                // 没有定义href的才调用select方法高亮tab
                parent.select(index);
            }
            else {
                /selected/.test(outer.className) || (window.location = href);
            }
        };

        UI_TAB_TITLES_CLASS.moveBody = function(dis) {
            var style = this.getBody().style,
                left = style.left,
                leftPadding = this._nLeftPadding || 20;
                RightPadding = this._nRightPadding || 20;
                rightDiff = this.getOuter().offsetWidth - this._nItemsWidth;


            left = left ? parseInt(left, 10) : 0;

            if (left + dis > leftPadding) {
                style.left = leftPadding + "px";
            }
            else if (left + dis < rightDiff - RightPadding) {
                style.left = rightDiff - RightPadding + "px";
            }
            else {
                style.left = left + dis + "px";
                this._oTimer = new Timer(this.moveBody, 50, this, dis);
            }
        };

        function UI_TAB_TITLES_STOPMOVE(control) {
            var timer = control._oTimer;
            timer && timer.stop();
        }

        UI_TAB_TITLES_SCROLLPRESSSTART = function(event) {
            UI_CONTROL_CLASS.$pressstart.call(this, event);
            this.getParent().moveBody(this._nDis);

            event.preventDefault();
        };

        UI_TAB_TITLES_SCROLLPRESSOVER = function(event) {
            UI_CONTROL_CLASS.$pressover.call(this, event);
            this.getParent().moveBody(this._nDis);
        };

        UI_TAB_TITLES_SCROLLPRESSEND = function(event) {
            UI_CONTROL_CLASS.$pressend.call(this, event);
            UI_TAB_TITLES_STOPMOVE(this.getParent()); 
        };

        UI_TAB_TITLES_SCROLLPRESSOUT = function(event) {
            UI_CONTROL_CLASS.$pressout.call(this, event);
            UI_TAB_TITLES_STOPMOVE(this.getParent()); 
        };

        copy(UI_TAB_TITLES_CLASS, UI_ITEMS);

        /**
         * 缓存子项目的宽度和高度
         */
        UI_TAB_TITLES_CLASS.$cache = function (style, cacheSize) {
            UI_CONTROL_CLASS.$cache.call(this, style, cacheSize);

            for (var i = 0, list = UI_ITEMS[this.getUID()], item; item = list[i++]; ) {
                item.cache(true, true);
            }
        };
})();
