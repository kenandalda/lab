(function () {








//__gzip_unitize__i
//__gzip_unitize__list
//__gzip_unitize__o
//__gzip_unitize__params
    var core = ecui = {},
        array = core.array = {},
        dom = core.dom = {},
        ext = core.ext = {},
        string = core.string = {},
        ui = core.ui = {},
        util = core.util = {};

    //__gzip_original__libArray
    //__gzip_original__libBrowser
    //__gzip_original__libDom
    //__gzip_original__libString
    var lib = baidu,
        libArray = lib.array,
        libBrowser = lib.browser,
        libDom = lib.dom,
        libString = lib.string;

    //__gzip_original__WINDOW
    ///__gzip_original__DOCUMENT
    //__gzip_original__DATE
    //__gzip_original__MATH
    //__gzip_original__REGEXP
    //__gzip_original__ABS
    //__gzip_original__CEIL
    ///__gzip_original__FLOOR
    ///__gzip_original__MAX
    ///__gzip_original__MIN
    //__gzip_original__POW
    ///__gzip_original__ROUND
    ///__gzip_original__PARSEINT
    //__gzip_original__ISNAN
    var undefined,
        WINDOW = window,
        DOCUMENT = document,
        DATE = Date,
        MATH = Math,
        REGEXP = RegExp,
        ABS = MATH.abs,
        CEIL = MATH.ceil,
        FLOOR = MATH.floor,
        MAX = MATH.max,
        MIN = MATH.min,
        POW = MATH.pow,
        ROUND = MATH.round,
        PARSEINT = parseInt,
        ISNAN = isNaN;

    //__gzip_original__isStrict
    //__gzip_original__isWebkit
    ///__gzip_original__ieVersion
    ///__gzip_original__firefoxVersion
    //__gzip_original__operaVersion
    var isStrict = libBrowser.isStrict,
        isWebkit = libBrowser.isWebkit,

        ieVersion = libBrowser.ie,

        firefoxVersion = libBrowser.firefox,
        operaVersion = libBrowser.opera;

        /**
         * 查询数组中指定对象的位置序号。
         * indexOf 方法返回完全匹配的对象在数组中的序号，如果在数组中找不到指定的对象，返回 -1。
         * @public
         * 
         * @param {Array} list 数组对象
         * @param {Object} obj 需要查询的对象
         * @return {number} 位置序号，不存在返回 -1
         */
     var indexOf = array.indexOf = libArray.indexOf,

        /**
         * 从数组中移除对象。
         * @public
         * 
         * @param {Array} list 数组对象
         * @param {Object} obj 需要移除的对象
         */
        remove = array.remove = libArray.remove,

        /**
         * 为 Element 对象添加新的样式。
         * @public
         * 
         * @param {HTMLElement} el Element 对象
         * @param {string} className 样式名，可以是多个，中间使用空白符分隔
         */
        addClass = dom.addClass = libDom.addClass,

        /**
         * 获取 Element 对象的所有深度为1的子 Element 对象。
         * @public
         * 
         * @param {HTMLElement} el Element 对象
         * @return {Array} Element 对象数组
         */
        children = dom.children = libDom.children,

        /**
         * 判断一个 Element 对象是否包含另一个 Element 对象。
         * contain 方法会将两个 Element 对象相同也认为是包含。
         * @public
         * 
         * @param {HTMLElement} container 包含的 Element 对象
         * @param {HTMLElement} contained 被包含的 Element 对象
         * @return {boolean} contained 对象是否被包含于 container 对象的 DOM 节点上
         */
        contain = dom.contain = function (container, contained) {
            return container == contained || libDom.contains(container, contained);
        },

        /**
         * 创建 Element 对象。
         * @public
         * 
         * @param {string} className 样式名称
         * @param {string} cssText 样式文本
         * @param {string} tagName 标签名称，默认创建一个空的 div 对象
         * @return {HTMLElement} 创建的 Element 对象
         */
        createDom = dom.create = function (className, cssText, tagName) {
            tagName = DOCUMENT.createElement(tagName || 'DIV');
            if (className) {
                tagName.className = className;
            }
            if (cssText) {
                tagName.style.cssText = cssText;
            }
            return tagName;
        },

        /**
         * 获取 Element 对象的第一个子 Element 对象。
         * @public
         *
         * @param {HTMLElement} el Element 对象
         * @return {HTMLElement} 子 Element 对象
         */
        first = dom.first = libDom.first,

        /**
         * 获取 Element 对象的父 Element 对象。
         * @public
         *
         * @param {HTMLElement} el Element 对象
         * @return {HTMLElement} 父 Element 对象，如果没有，返回 null
         */
        getParent = dom.getParent = ieVersion ? function (el) {
            return el.parentElement;
        } : function (el) {
            return el.parentNode;
        },

        /**
         * 获取 Element 对象的页面位置。
         * getPosition 方法将返回指定 Element 对象的位置信息。属性如下：
         * left {number} X轴坐标
         * top  {number} Y轴坐标
         * @public
         *
         * @param {HTMLElement} el Element 对象
         * @return {Object} 位置信息
         */
        getPosition = dom.getPosition = function (element) {
            var top = 0,
                left = 0,
                body = DOCUMENT.body,
                html = getParent(body);

            if (ieVersion) {
                if(!isStrict) {
                    o = getStyle(body);
                    if (ISNAN(top = PARSEINT(o.borderTopWidth))) {
                        top = -2;
                    }
                    if (ISNAN(left = PARSEINT(o.borderLeftWidth))) {
                        left = -2;
                    }
                }

                o = element.getBoundingClientRect();
                top += html.scrollTop + body.scrollTop - html.clientTop + FLOOR(o.top);
                left += html.scrollLeft + body.scrollLeft - html.clientLeft + FLOOR(o.left);
            }
            else if (element == html) {
                top = html.scrollTop + body.scrollTop;
                left = html.scrollLeft + body.scrollLeft;
            }
            else {
                for (o = element; o; o = o.offsetParent) {
                    top += o.offsetTop;
                    left += o.offsetLeft;
                }

                if (operaVersion || (isWebkit && getStyle(element, 'position') == 'absolute')) {
                    top -= body.offsetTop;
                }

                for (
                    var o = getParent(element),
                        style = getStyle(element);
                    o != html;
                    o = getParent(o), style = element
                ) {
                    left -= o.scrollLeft;
                    if (!operaVersion) {
                        element = getStyle(o);
                        body =
                            firefoxVersion && element.overflow != 'visible' && style.position == 'absolute' ? 2 : 1;
                        top += toNumber(html.borderTopWidth) * body - o.scrollTop;
                        left += toNumber(html.borderLeftWidth) * body;
                    }
                    else if (o.tagName != 'TR') {
                        top -= o.scrollTop;
                    }
                }
            }

            return {top: top, left: left};
        },

        /**
         * 获取 Element 对象的 CssStyle 对象或者是指定的样式值。
         * getStyle 方法如果不指定样式名称，将返回 Element 对象的当前 CssStyle 对象。
         * @public
         *
         * @param {HTMLElement} el Element 对象
         * @param {string} name 样式名称
         * @return {CssStyle|Object} CssStyle 对象或样式值
         */
        getStyle = dom.getStyle = function (el, name) {
            return name ? libDom.getStyle(el, name) :
                el.currentStyle || (ieVersion ? el.style : getComputedStyle(el, null));
        },

        /**
         * 获取 Element 对象的文本。
         * @public
         *
         * @param {HTMLElement} el Element 对象
         * @return {string} Element 对象的文本
         */
        getText = dom.getText = firefoxVersion ? function (el) {
            return el.textContent;
        } : function (el) {
            return el.innerText;
        },

        /**
         * 将 Element 对象插入指定的 Element 对象之后。
         * @public
         *
         * @param {HTMLElement} el 被插入的 Element 对象
         * @param {HTMLElement} target 目标 Element 对象
         * @return {HTMLElement} 被插入的 Element 对象
         */
        insertAfter = dom.insertAfter = libDom.insertAfter,

        /**
         * 将 Element 对象插入指定的 Element 对象之前。
         * @public
         *
         * @param {HTMLElement} el 被插入的 Element 对象
         * @param {HTMLElement} target 目标 Element 对象
         * @return {HTMLElement} 被插入的 Element 对象
         */
        insertBefore = dom.insertBefore = libDom.insertBefore,

        /**
         * 向指定的 Element 对象内插入一段 html 代码。
         * @public
         * 
         * @param {HTMLElement} el Element 对象
         * @param {string} position 插入 html 的位置信息，取值为 beforeBegin,afterBegin,beforeEnd,afterEnd
         * @param {string} html 要插入的 html 代码
         */
        insertHTML = dom.insertHTML = libDom.insertHTML,

        /**
         * 获取 Element 对象的最后一个子 Element 对象。
         * @public
         *
         * @param {HTMLElement} el Element 对象
         * @return {HTMLElement} 子 Element 对象
         */
        last = dom.last = libDom.last,

        /**
         * 将指定的 Element 对象的内容移动到目标 Element 对象中。
         * @public
         *
         * @param {HTMLElement} source 指定的 Element 对象
         * @param {HTMLElement} target 目标 Element 对象
         * @param {boolean} all 是否移动所有的 DOM 对象，默认仅移动 ElementNode 对象
         */
        moveElements = dom.moveElements = function (source, target, all) {
            //__transform__el_o
            for (var el = source.firstChild; el; el = source) {
                source = el.nextSibling;
                if (all || el.nodeType == 1) {
                    target.appendChild(el);
                }
            }
        },

        /**
         * 获取 Element 对象的下一个子 Element 对象。
         * @public
         *
         * @param {HTMLElement} el Element 对象
         * @return {HTMLElement} 子 Element 对象
         */
        next = dom.next = libDom.next,

        /**
         * 设置页面加载完毕后自动执行的方法。
         * @public
         *
         * @param {Function} func 需要自动执行的方法
         */
        ready = dom.ready = libDom.ready,

        /**
         * 从页面中移除 Element 对象。
         * @public
         * 
         * @param {HTMLElement} el Element 对象
         * @return {HTMLElement} 被移除的 Element 对象
         */
        removeDom = dom.remove = function (el) {
            var parent = getParent(el);
            if (parent) {
                parent.removeChild(el);
            }
            return el;
        },

        /**
         * 删除 Element 对象中的样式。
         * @public
         * 
         * @param {HTMLElement} el Element 对象
         * @param {string} className 样式名，可以是多个，中间用空白符分隔
         */
        removeClass = dom.removeClass = libDom.removeClass,

        /**
         * 设置输入框的表单项属性。
         * 如果没有指定一个表单项，setInput 方法将创建一个表单项。
         * @public
         *
         * @param {HTMLElement} el InputElement 对象
         * @param {string} name 新的表单项名称，默认与 el 相同
         * @param {string} type 新的表单项类型，默认为 el 相同
         * @return {HTMLElement} 设置后的 InputElement 对象
         */
        setInput = dom.setInput = function (el, name, type) {
            if (!el) {
                if (ieVersion) {
                    return createDom('', '', '<input type="' + (type || '') + '" name="' + (name || '') + '">');
                }

                el = createDom('', '', 'input');
            }

            name = name === undefined ? el.name : name;
            type = type === undefined ? el.type : type;
            if (el.name != name || el.type != type) {
                if (ieVersion) {
                    insertHTML(
                        el,
                        'afterEnd',
                        '<input type="' + type + '" name="' + name + '" class="' + el.className +
                            '" style="' + el.style.cssText + '" ' + (el.disabled ? 'disabled' : '') +
                            (el.readOnly ? ' readOnly' : '') + '>'
                    );
                    name = el;
                    (el = el.nextSibling).value = name.value;
                    if (type == 'radio') {
                        el.checked = name.checked;
                    }
                    removeDom(name);
                }
                else {
                    el.type = type;
                    el.name = name;
                }
            }
            return el;
        },

        /**
         * 设置 Element 对象的样式值。
         * @public
         *
         * @param {HTMLElement} el Element 对象
         * @param {string} name 样式名称
         * @param {string} value 样式值
         */
        setStyle = dom.setStyle = libDom.setStyle,

        /**
         * 设置 Element 对象的文本。
         * @public
         *
         * @param {HTMLElement} el Element 对象
         * @param {string} text Element 对象的文本
         */
        setText = dom.setText = firefoxVersion ? function (el, text) {
            el.textContent = text;
        } : function (el, text) {
            el.innerText = text;
        },

        /**
         * 对目标字符串进行 html 编码。
         * encodeHTML 方法对四个字符进行编码，分别是 &<>"
         * @public
         *
         * @param {string} source 目标字符串
         * @return {string} 结果字符串
         */
        encodeHTML = string.encodeHTML = libString.encodeHTML,

        /**
         * 根据字节长度截取字符串
         * 
         * @param {string} source 目标字符串
         * @param {number} length 需要截取的字节长度
         * @param {number|Function} count 一个非 ascii 字符对应几个字节，或者是计算字节的函数
         * @return {string} 结果字符串
         */
        sliceByte = string.sliceByte = function (source, length, count) {
            for (
                var i = 0,
                    func = 'number' == typeof count ? function (charCode) {
                        return charCode > 127 ? count : 1;
                    } : count;
                i < source.length;
                i++
            ) {
                length -= func(source.charCodeAt(i));
                if (length < 0) {
                    return source.slice(0, i);
                }
            }

            return source;
        },

        /**
         * 驼峰命名法转换。
         * toCamelCase 方法将 xxx-xxx 字符串转换成 xxxXxx。
         * @public
         *
         * @param {string} source 目标字符串
         * @return {string} 结果字符串
         */
        toCamelCase = string.toCamelCase =
            libString.toCamelCase,

        /**
         * 将目标字符串中常见全角字符转换成半角字符
         * 
         * @param {string} source 目标字符串
         * @return {string} 结果字符串
         */
        toHalfWidth = string.toHalfWidth = libString.toHalfWidth,

        /**
         * 过滤字符串两端的空白字符。
         * @public
         *
         * @param {string} source 目标字符串
         * @return {string} 结果字符串
         */
        trim = string.trim = function (source) {
            return source.replace(/(^[\s\t\xa0\u3000]+)|([\u3000\xa0\s\t]+$)/g, '');
        },

        /**
         * 挂载事件。
         * @public
         *
         * @param {Object} obj 响应事件的对象
         * @param {string} type 事件类型
         * @param {Function} func 事件处理函数
         */
        attachEvent = util.attachEvent = function (obj, type, func) {
            if (obj.attachEvent) {
                obj.attachEvent('on' + type, func);
            }
            else {
                obj.addEventListener(type, func, false);
            }
        },

        /*
         * 空函数。
         * blank 方法不应该被执行，也不进行任何处理，它用于提供给不需要执行操作的事件方法进行赋值，与 blank 类似的用于给事件方法进行赋值，而不直接被执行的方法还有 cancel。
         * @public
         */
        blank = util.blank = function () {
        },

        /*
         * 返回 false。
         * cancel 方法不应该被执行，它每次返回 false，用于提供给需要返回逻辑假操作的事件方法进行赋值，例如需要取消默认事件操作的情况，与 cancel 类似的用于给事件方法进行赋值，而不直接被执行的方法还有 blank。
         * @public
         *
         * @return {boolean} false
         */
        cancel = util.cancel = function () {
            return false;
        },

        /**
         * 对象属性复制。
         * @public
         *
         * @param {Object} des 目标对象
         * @param {Object} src 源对象
         */
        copy = util.copy = lib.object.extend,

        /**
         * 卸载事件。
         * @public
         *
         * @param {Object} obj 响应事件的对象
         * @param {string} type 事件类型
         * @param {Function} func 事件处理函数
         */
        detachEvent = util.detachEvent = function (obj, type, func) {
            if (obj.detachEvent) {
                obj.detachEvent('on' + type, func);
            }
            else {
                obj.removeEventListener(type, func, false);
            }
        },

        /**
         * 在 prototype 链的 constructor 上查找指定的属性。
         * @public
         *
         * @param {Object} object 需要查找属性的对象
         * @param {string} name 属性名称
         * @param {Object} 属性值
         */
        findConstructor = util.findConstructor = function (object, name) {
            for (; object; object = object.superClass) {
                object = object.constructor;
                if (object[name]) {
                    return object[name];
                }
            }
        },

        /**
         * 获取浏览器可视区域的相关信息。
         * getView 方法将返回浏览器可视区域的信息。属性如下：
         * top    {number} 可视区域最小X轴坐标
         * right  {number} 可视区域最大Y轴坐标
         * bottom {number} 可视区域最大X轴坐标
         * left   {number} 可视区域最小Y轴坐标
         * width  {number} 可视区域的宽度
         * height {number} 可视区域的高度
         * @public
         *
         * @return {Object} 浏览器可视区域信息
         */
        getView = util.getView = function () {
            //__gzip_original__clientWidth
            //__gzip_original__clientHeight
            var body = DOCUMENT.body,
                html = getParent(body),
                client = isStrict ? html : body,
                scrollTop = html.scrollTop + body.scrollTop,
                scrollLeft = html.scrollLeft + body.scrollLeft,
                clientWidth = client.clientWidth,
                clientHeight = client.clientHeight;

            return {
                top: scrollTop,
                right: scrollLeft + clientWidth,
                bottom: scrollTop + clientHeight,
                left: scrollLeft,
                width: clientWidth,
                height: clientHeight,
                maxWidth: MAX(html.scrollWidth, body.scrollWidth, clientWidth),
                maxHeight: MAX(html.scrollHeight, body.scrollHeight, clientHeight)
            };
        },

        /**
         * 类继承。
         * @public
         *
         * @param {Function} subClass 子类
         * @param {Function} superClass 父类
         * @return {Object} subClass 的 prototype 属性
         */
        inherits = util.inherits = function (subClass, superClass) {
            lib.lang.inherits(subClass, superClass);
            return subClass.prototype;
        },

        /**
         * 将字符串解析成 json 对象。
         * 
         * @param {string} source 需要解析的字符串
         * @return {Object} 解析结果 json 对象
         */
        parse = util.parse = lib.json.parse,

        /**
         * 将 json 对象序列化。
         * 
         * @param {Object} value 需要序列化的 json 对象
         * @return {string} 序列化后的字符串
         */
        stringify = util.stringify = lib.json.stringify,

        /**
         * 将对象转换成数值。
         * toNumber 方法会省略数值的符号，例如字符串 9px 将当成数值的 9，不能识别的数值将默认为 0。
         * @public
         *
         * @param {Object} obj 需要转换的对象
         * @return {number} 对象的数值
         */
        toNumber = util.toNumber = function (obj) {
            return PARSEINT(obj) || 0;
        };






//__gzip_unitize__event
    var $bind,
        $connect,
        $create,
        $fastCreate,
        $register,
        calcHeightRevise,
        calcLeftRevise,
        calcTopRevise,
        calcWidthRevise,

        /**
         * 创建 ECUI 控件。
         * 标准的创建 ECUI 控件 的工厂方法，所有的 ECUI 控件 都应该通过 create 方法或者 $create 方法生成。params 参数对象支持的属性如下：
         * id        {string} 当前控件的 id，提供给 $connect 与 get 方法使用
         * base      {string} 控件的基本样式，参见 getBaseClass 方法，如果忽略此参数将使用基本 Element 对象的 className 属性
         * element   {HTMLElement} 与控件绑捆的 Element 对象，参见 getBase 方法，如果忽略此参数将创建 Element 对象与控件绑捆
         * parent    {ecui.ui.Control} 父控件对象或者父 Element 对象
         * type      {string} 控件的默认样式，通常情况下省略此参数，使用 "ec-控件名称" 作为控件的默认样式
         * @public
         *
         * @param {string} type 控件的名称
         * @param {Object} params 初始化参数，参见 ECUI 控件
         * @return {ecui.ui.Control} ECUI 控件
         */
        createControl = core.create = function (type, params) {
            type = $create(type, params);
            type.cache();
            type.init();
            return type;
        },

        disposeControl,
        drag,

        /**
         * 从指定的 DOM 节点开始，依次向它的父节点查找绑定的 ECUI 控件。
         * findControl 方法，会返回从当前 DOM 节点开始，依次向它的父节点查找到的第一个绑定的 ECUI 控件。findControl 方法一般在控件创建时使用，用于查找父控件对象。
         * @public
         *
         * @param {HTMLElement} el Element 对象
         * @return {ecui.ui.Control} ECUI 控件对象，如果不能找到，返回 null
         */
        findControl = core.findControl = function (el) {
            for (; el; el = getParent(el)) {
                if (el.getControl) {
                    return el.getControl();
                }
            }

            return null;
        },

        getAttributeName,
        getFocused,
        getKey,
        getMouseX,
        getMouseY,
        getParameters,
        getPressed,
        getScrollNarrow,
        getStatus,
        intercept,
        isFixedSize,
        loseFocus,
        mask,
        query,
        restore,
        setFocused,
        standardEvent,

        /**
         * 创建一个定时器对象，从第4个参数起都是传入 func 中的变量
         * @public
         *
         * @param {Function} func 定时器需要调用的函数
         * @param {number} delay 定时器延迟调用的毫秒数，如果为负数表示需要连续触发
         * @param {Object} caller 调用者，在 func 被执行时，this 指针指向的对象，可以为空
         */
        Timer = core.Timer = function (func, delay, caller) {
            var args = Array.prototype.slice.call(arguments, 3),
                handle = (delay < 0 ? setInterval : setTimeout)(function () {
                    func.apply(caller, args);
                    if (delay >= 0) {
                        func = caller = args = null;
                    }
                }, ABS(delay));

            /**
             * 中止定时调用操作
             * @public
             */
            this.stop = function () {
                (delay < 0 ? clearInterval : clearTimeout)(handle);
                func = caller = args = null;
            };
        },

        eventNames = [
            'mousedown', 'mouseover', 'mousemove', 'mouseout', 'mouseup',
            'pressstart', 'pressover', 'pressmove', 'pressout', 'pressend',
            'click', 'focus', 'blur', 'keydown', 'keypress', 'keyup', 'mousewheel',
            'change', 'resize', 'create', 'init'
        ];


/*
Control - ECUI 的核心组成部分，定义了基本的控件行为。
基础控件是 ECUI 的核心组成部分，对 DOM 树上的节点区域进行封装。基础控件扩展了 Element 节点的标准事件(例如得到与失去焦
点、鼠标按压事件等)，提供了方法对控件的基本属性(例如控件大小、位置与显示状态等)进行改变，是一切控件实现的基础。基本控
件支持四种状态：得到焦点(focus)、鼠标移入(over)、按压时鼠标移入(press)与失效(disabled)

基本控件直接HTML初始化的例子，id指定名称，可以通过ecui.get(id)的方式访问控件:
<div ecui="type:control;id:test">
    <!-- 这里控件包含的内容 -->
    ...
</div>

属性
_bCapture                - 控件是否响应浏览器事件状态
_bFocusable              - 控件是否允许获取焦点状态
_bEnabled                - 控件的状态，为false时控件不处理任何事件
_bCache                  - 是否处于缓存状态
_nWidth                  - 控件的宽度缓存
_nHeight                 - 控件的高度缓存
_sUID                    - 控件的ID
_sBaseClass              - 控件定义时的基本样式
_sClass                  - 控件当前使用的样式
_sType                   - 控件的类型样式，通常是ec-控件类型
_sWidth                  - 控件的基本宽度值，可能是百分比或者空字符串
_sHeight                 - 控件的基本高度值，可能是百分比或者空字符串
_sDisplay                - 控件的布局方式，在hide时保存，在show时恢复
_eBase                   - 控件的基本标签对象
_eBody                   - 控件用于承载子控件的载体标签，通过setBodyElement函数设置这个值，绑定当前控件
_cParent                 - 父控件对象
$cache$borderTopWidth    - 上部边框线宽度缓存
$cache$borderLeftWidth   - 左部边框线宽度缓存
$cache$borderRightWidth  - 右部边框线宽度缓存
$cache$borderBottomWidth - 下部边框线宽度缓存
$cache$paddingTop        - 上部内填充宽度缓存
$cache$paddingLeft       - 左部内填充宽度缓存
$cache$paddingRight      - 右部内填充宽度缓存
$cache$paddingBottom     - 下部内填充宽度缓存
$cache$position          - 控件布局方式缓存
*/


    /**
     * 初始化基础控件。
     * params 参数支持的属性如下：
     * type    控件的类型样式
     * base    控件的基本样式
     * capture 是否需要捕获鼠标事件，默认捕获
     * focus   是否允许获取焦点，默认允许
     * enabled 是否可用，默认可用
     * @protected
     *
     * @param {HTMLElement} el 关联的 Element 对象
     * @param {Object} params 初始化参数
     */
    ///__gzip_original__UI_CONTROL
    var UI_CONTROL =
        ui.Control = function (el, params) {
            this._bCapture = params.capture !== false;
            this._bFocusable = params.focus !== false;
            this._bEnabled = params.enabled !== false;
            this._sBaseClass = this._sClass = params.base;
            this._sUID = params.uid;
            this._sType = params.type;
            this._eBase = this._eBody = el;
            this._cParent = null;

            this._sWidth = el.style.width;
            this._sHeight = el.style.height;

            $bind(el, this);
        },
        UI_CONTROL_CLASS = UI_CONTROL.prototype,

        UI_CONTROL_READY_LIST;


/*
Label - 定义事件转发的基本操作。
标签控件，继承自基础控件，将事件转发到指定的控件上，通常与 Radio、Checkbox 等控件联合使用，扩大点击响应区域。

标签控件直接HTML初始化的例子:
<div ecui="type:label;for:checkbox"></div>

属性
_cFor - 被转发的控件对象
*/


    /**
     * 初始化标签控件。
     * params 参数支持的属性如下：
     * for 被转发的控件 id
     * @public
     *
     * @param {Element} el 关联的 Element 对象
     * @param {Object} params 初始化参数
     */
    //__gzip_original__UI_LABEL
    var UI_LABEL =
        ui.Label = function (el, params) {
            UI_CONTROL.call(this, el, params);

            $connect(this, this.setFor, params['for']);
        },
        UI_LABEL_CLASS = inherits(UI_LABEL, UI_CONTROL);


/*
Progress - 定义进度显示的基本操作。
进度条控件，继承自基础控件，面向用户显示一个任务执行的程度。

进度条控件直接HTML初始化的例子:
<div ecui="type:progress;rate:0.5"></div>

属性
_eText - 内容区域
_eMask - 完成的进度比例内容区域
*/


    /**
     * 初始化进度条控件。
     * params 参数支持的属性如下：
     * rate 初始的百分比
     * @public
     *
     * @param {Element} el 关联的 Element 对象
     * @param {Object} params 初始化参数
     */
    //__gzip_original__UI_PROGRESS
    var UI_PROGRESS =
        ui.Progress = function (el, params) {
            UI_CONTROL.call(this, el, params);

            var text = el.innerHTML;

            el.innerHTML = '<div class="' + params.base +
                '-text" style="position:absolute;top:0px;left:0px"></div><div class="' + params.base +
                '-mask" style="position:absolute;top:0px;left:0px"></div>';
            this._eText = el.firstChild;
            this._eMask = el.lastChild;

            this.setText(params.rate || 0, text);
        },
        UI_PROGRESS_CLASS = inherits(UI_PROGRESS, UI_CONTROL);


/*
Form - 定义独立于文档布局的内容区域的基本操作。
窗体控件，继承自基础控件，内部包含了三个部件，分别是标题栏(基础控件)、关闭按钮(基础控件)与内容区域(截面控件)。窗体控件
仿真浏览器的多窗体效果，如果在其中包含 iframe 标签，可以在当前页面打开一个新的页面，避免了使用 window.open 在不同浏览
器下的兼容性问题。多个窗体控件同时工作时，当前激活的窗体在最上层。窗体控件的标题栏默认可以拖拽，窗体可以设置置顶方式显
示，在置顶模式下，只有当前窗体可以响应操作。窗体控件的 z-index 从4096开始，页面开发请不要使用大于或等于4096的 z-index 
值。

窗体控件直接HTML初始化的例子:
<div ecui="type:form;hide:true">
    <!-- 标题可以没有 -->
    <label>窗体的标题</label>
    <!-- 这里放窗体的内容 -->
    ...
</div>

属性
_bHide      - 初始是否自动隐藏
_bAuto      - 标题栏是否自适应宽度
_uTitle     - 标题栏
_uClose     - 关闭按钮
*/


    /**
     * 初始化窗体控件。
     * params 参数支持的属性如下：
     * hide 初始是否自动隐藏
     * titleAuto title 是否自适应宽度，默认自适应宽度
     * @public
     *
     * @param {Element} el 关联的 Element 对象
     * @param {Object} params 初始化参数
     */
    //__gzip_original__UI_FORM
    //__gzip_original__UI_FORM_TITLE
    //__gzip_original__UI_FORM_CLOSE
    var UI_FORM =
        ui.Form = function (el, params) {
            UI_CONTROL.call(this, el, params);

            // 生成标题控件与内容区域控件对应的Element对象
            //__gzip_original__baseClass
            var baseClass = params.base,
                o = createDom(baseClass + '-main', 'position:relative;overflow:auto'),
                titleEl = first(el);

            moveElements(el, o, true);

            if (titleEl && titleEl.tagName == 'LABEL') {
                el.innerHTML = '<div class="ec-control ' + baseClass + '-close" style="position:absolute"></div>';
                el.insertBefore(titleEl, el.firstChild);
                titleEl.className = 'ec-control ' + titleEl.className + ' ' + baseClass + '-title';
                titleEl.style.cssText += ';position:absolute';
            }
            else {
                el.innerHTML = '<div class="ec-control ' + baseClass +
                    '-title" style="position:absolute"></div><div class="ec-control ' +
                    baseClass + '-close" style="position:absolute"></div>';
                titleEl = el.firstChild;
            }
            titleEl.onselectstart = cancel;

            el.style.overflow = 'hidden';
            el.appendChild(o);

            this._bHide = params.hide;
            this._bAuto = params.titleAuto !== false;

            // 初始化标题区域
            this._uTitle = $fastCreate(UI_FORM_TITLE, titleEl, this);

            // 初始化关闭按钮
            this._uClose = $fastCreate(UI_FORM_CLOSE, titleEl.nextSibling, this);

            // 计算当前窗体显示的层级
            this.getOuter().style.zIndex = UI_FORM_ALL.push(this) + 4095;
        },
        UI_FORM_CLASS = inherits(UI_FORM, UI_CONTROL),

        /**
         * 初始化窗体控件的标题栏部件。
         * @public
         *
         * @param {Element} el 关联的 Element 对象
         * @param {Object} params 初始化参数
         */
        UI_FORM_TITLE = UI_FORM.Title = function (el, params) {
            UI_CONTROL.call(this, el, params);
        },
        UI_FORM_TITLE_CLASS = inherits(UI_FORM_TITLE, UI_CONTROL),

        /**
         * 初始化窗体控件的关闭按钮部件。
         * @public
         *
         * @param {Element} el 关联的 Element 对象
         * @param {Object} params 初始化参数
         */
        UI_FORM_CLOSE = UI_FORM.Close = function (el, params) {
            UI_CONTROL.call(this, el, params);
        },
        UI_FORM_CLOSE_CLASS = inherits(UI_FORM_CLOSE, UI_CONTROL),

        UI_FORM_ALL = []; // 当前全部初始化的窗体


/*
Collection - 定义批量控件集的事件与基本操作。
集合控件，继承自基础控件，将大量子控件组合而成的控件。集合控件统一管理，所有子控件的事件允许调用统一的事件方法，可用于日
历、调色板等。

网格控件直接HTML初始化的例子:
<div ecui="type:collection"></div>

属性
_aItem  - 子控件集合
*/


    /**
     * 初始化网格控件。
     * @public
     *
     * @param {Element} el 关联的 Element 对象
     * @param {Object} params 初始化参数
     */
    //__gzip_original__UI_COLLECTION
    //__gzip_original__UI_COLLECTION_ITEM
    var UI_COLLECTION =
        ui.Collection = function (el, params) {
            UI_CONTROL.call(this, el, params);

            this._aItem = [];
            for (var i = 0, list = children(el), o; o = list[i]; ) {
                // 设置子控件在整个网格中的序号
                this._aItem[i++] = $fastCreate(UI_COLLECTION_ITEM, o, this);
            }
        },
        UI_COLLECTION_CLASS = inherits(UI_COLLECTION, UI_CONTROL),

        /**
         * 初始化网格控件的选项部件。
         * @public
         *
         * @param {Element} el 关联的 Element 对象
         * @param {Object} params 初始化参数
         */
        UI_COLLECTION_ITEM = UI_COLLECTION.Item = function (el, params) {
            UI_CONTROL.call(this, el, params);
        },
        UI_COLLECTION_ITEM_CLASS = inherits(UI_COLLECTION_ITEM, UI_CONTROL);


/*
Calendar - 定义日历显示的基本操作。
日历控件，继承自基础控件，内部包含了两个部件，分别是星期名称(网格控件)与日期(网格控件)。在日期网格控件里，第一行包含上
个月最后几天的信息，最后一行包含下个月最前几天的信息。日历控件不包含年/月/日的快速选择与切换，如果需要实现这些功能，请
将下拉框(选择月份)、输入框(输入年份)等组合使用建立新的控件或直接在页面上布局并调用接口。

日历控件直接HTML初始化的例子:
<div ecui="type:calendar;year:2009;month:11"></div>

属性
_nYear      - 年份
_nMonth     - 月份(0-11)
_uName      - 星期名称网格
_uDate      - 日期网格

子控件属性
_nDay       - 从本月1号开始计算的天数，如果是上个月，是负数，如果是下个月，会大于当月最大的天数
*/


    /**
     * 初始化日历控件。
     * params 参数支持的属性如下：
     * year    日历控件的年份
     * month   日历控件的月份(1-12)
     * @public
     *
     * @param {Element} el 关联的 Element 对象
     * @param {Object} params 初始化参数
     */
    //__gzip_original__UI_CALENDAR
    //__gzip_original__UI_CALENDAR_DATE_COLLECTION
    var UI_CALENDAR =
        ui.Calendar = function (el, params) {
            UI_CONTROL.call(this, el, params);

            el.style.overflow = 'auto';

            // 分别插入日期网格与星期名称网格需要使用的层，星期名称网格初始化
            for (var i = 0, html = [], baseClass = params.base; i < 7; ) {
                html[i] =
                    '<div class="ec-collection-item ' + baseClass + '-name-item" style="float:left">' +
                        ['日', '一', '二', '三', '四', '五', '六'][i++] + '</div>';
            }
            html[i] =
                '</div><div class="ec-collection ' + baseClass + '-date" style="padding:0px;border:0px">';
            for (; ++i < 50; ) {
                html.push('<div class="ec-collection-item ' + baseClass + '-date-item" style="float:left"></div>');
            }

            el.innerHTML =
                '<div class="ec-collection ' + baseClass + '-name" style="padding:0px;border:0px">' +
                    html.join('') + '</div>';

            this._uName = $fastCreate(UI_COLLECTION, el.firstChild, this);
            this._uDate = $fastCreate(UI_CALENDAR_DATE_COLLECTION, el.lastChild, this);

            this.setDate(params.year, params.month);
        },
        UI_CALENDAR_CLASS = inherits(UI_CALENDAR, UI_CONTROL),

        /**
         * 初始化日历控件的日期集合部件。
         * @public
         *
         * @param {Element} el 关联的 Element 对象
         * @param {Object} params 初始化参数
         */
         UI_CALENDAR_DATE_COLLECTION = UI_CALENDAR.Date = function (el, params) {
            UI_COLLECTION.call(this, el, params);
        },
        UI_CALENDAR_DATE_COLLECTION_CLASS = inherits(UI_CALENDAR_DATE_COLLECTION, UI_COLLECTION);


/*
Item/Items - 定义选项操作相关的基本操作。
选项控件，继承自基础控件，用于弹出菜单、下拉框、交换框等控件的单个选项，通常不直接初始化。选项控件必须用在使用选项组接
口(Items)的控件中，选项控件支持移入操作的缓存，不会因为鼠标移出而改变状态，因此可以通过函数调用来改变移入移出状态，选
控件默认屏蔽了 DOM 的文本选中操作。选项组不是控件，是一组对选项进行操作的方法的集合，提供了基本的增/删操作，以及对选项
控件的状态控制的接口，通过将 ecui.ui.Items 对象下的方法复制到类的 prototype 属性下继承接口，最终对象要正常使用还需要在
类构造器中调用 $initItems 方法。
*/


    /**
     * 初始化选项控件。
     * params 参数支持的属性如下：
     * parent 父控件对象
     * @public
     *
     * @param {Element} el 关联的 Element 对象
     * @param {string|Object} params 参数
     */
    //__gzip_original__UI_ITEM
    ///__gzip_original__UI_ITEMS
    var UI_ITEM =
        ui.Item = function (el, params) {
            UI_CONTROL.call(this, el, params);

            el.onselectstart = cancel;
            el.style.overflow = 'hidden';
        },
        UI_ITEM_CLASS = inherits(UI_ITEM, UI_CONTROL),

        UI_ITEMS = ui.Items = {};



/*
Popup - 定义弹出菜单项的基本操作。
弹出菜单控件，继承自基础控件，实现了选项组接口。弹出式菜单操作时不会改变当前已经激活的对象，任何点击都将导致弹出菜单消
失，弹出菜单默认向右展开子菜单，如果右部已经到达浏览器最边缘，将改为向左显示。

弹出菜单控件直接HTML初始化的例子:
<div ecui="type:popup;name:test">
    <!-- 这里放选项内容 -->
    <li>菜单项</li>
    ...
    <!-- 包含子菜单项的菜单项 -->
    <li>
        <label>菜单项</label>
        <!-- 这里放子菜单项 -->
        <li>子菜单项</li>
        ...
    </li>
    ...
</div>

属性
_nOptionSize - 弹出菜单选项的显示数量，不设置将全部显示
_cSuperior   - 上一级被激活的弹出菜单控件
_cInferior   - 下一级被激活的弹出菜单控件
_uPrev       - 向上滚动按钮
_uNext       - 向下滚动按钮

子菜单项属性
_cPopup      - 是否包含下级弹出菜单
*/


    /**
     * 初始化弹出菜单控件。
     * params 参数支持的属性如下：
     * optionSize 弹出菜单选项的显示数量，不设置将全部显示
     * @public
     *
     * @param {HTMLElement} el 关联的 Element 对象
     * @param {Object} params 初始化参数
     */
    //__gzip_original__UI_POPUP
    //__gzip_original__UI_POPUP_BUTTON
    //__gzip_original__UI_POPUP_ITEM
    var UI_POPUP =
        ui.Popup = function (el, params) {
            UI_CONTROL.call(this, el, params);

            //__gzip_original__baseClass
            //__gzip_original__buttonParams
            var baseClass = params.base,
                buttonParams = {focus: false};

            removeDom(el);
            el.style.cssText += ';position:absolute;overflow:hidden';
            if (this._nOptionSize = params.optionSize) {
                var o = createDom(baseClass + '-main', 'position:absolute;top:0px;left:0px');

                moveElements(el, o);

                el.innerHTML =
                    '<div class="ec-control ' + baseClass +
                        ('-prev" onselectstart="return false" style="position:absolute;top:0px;left:0px"></div>' +
                        '<div class="ec-control ') + baseClass +
                        '-next" onselectstart="return false" style="position:absolute"></div>';

                this.$setBody(el.insertBefore(o, el = el.firstChild));

                this._uPrev = $fastCreate(UI_POPUP_BUTTON, el, this, buttonParams);
                this._uNext = $fastCreate(UI_POPUP_BUTTON, el.nextSibling, this, buttonParams);
            }

            // 初始化菜单项
            this.$initItems();
        },
        UI_POPUP_CLASS = inherits(UI_POPUP, UI_CONTROL),

        /**
         * 初始化弹出菜单控件的按钮部件。
         * @public
         *
         * @param {HTMLElement} el 关联的 Element 对象
         * @param {Object} params 初始化参数
         */
        UI_POPUP_BUTTON = UI_POPUP.Button = function (el, params) {
            UI_CONTROL.call(this, el, params);
        },
        UI_POPUP_BUTTON_CLASS = inherits(UI_POPUP_BUTTON, UI_CONTROL),

        /**
         * 初始化弹出菜单控件的选项部件。
         * @public
         *
         * @param {HTMLElement} el 关联的 Element 对象
         * @param {Object} params 初始化参数
         */
        UI_POPUP_ITEM = UI_POPUP.Item = function (el, params) {
            var o = first(el),
                childParams = {};

            if (o && o.tagName == 'LABEL') {
                // 需要生成子菜单
                insertBefore(o, el);
                o.style.display = 'block';
                o.className = el.className;
                el.className = 'ec-popup ' + findControl(getParent(el)).getBaseClass();
                copy(childParams, params);
                this._cPopup = $fastCreate(UI_POPUP, el, this, childParams);
                el = o;
            }

            UI_ITEM.call(this, el, params);

            UI_POPUP_ITEM_FLUSH(this);
        },
        UI_POPUP_ITEM_CLASS = inherits(UI_POPUP_ITEM, UI_ITEM),

        UI_POPUP_CHAIN_FIRST,
        UI_POPUP_CHAIN_LAST;



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
_oSelected       - 初始化时临时保存当前被选中的选项卡
_aPosition       - 选项卡位置缓存
_cSelected       - 当前选中的选项卡
_uPrev           - 向前滚动按钮
_uNext           - 向后滚动按钮

Item属性
_sContentDisplay - 内容 DOM 元素的布局属性
_eContent        - 内容 DOM 元素
*/


    /**
     * 初始化选项卡控件。
     * params 参数支持的特定属性如下：
     * selected 选中的选项序号，默认为0
     * @protected
     *
     * @param {HTMLElement} el 关联的 Element 对象
     * @param {Object} params 初始化参数
     */
    //__gzip_original__UI_TAB
    //__gzip_original__UI_TAB_BUTTON
    //__gzip_original__UI_TAB_ITEM
    var UI_TAB =
        ui.Tab = function (el, params) {
            UI_CONTROL.call(this, el, params);

            //__gzip_original__baseClass
            //__gzip_original__typeClass
            var typeClass = params.type,
                baseClass = params.base,
                o = createDom(typeClass + '-title ' + baseClass + '-title', 'position:relative;overflow:hidden');

            this._oSelected = params.selected || 0;

            // 生成选项卡头的的DOM结构
            o.innerHTML = '<div class="' + typeClass + '-title-prev ' + baseClass +
                ('-title-prev" onselectstart="return false" style="position:absolute;left:0px;display:none"></div>' +
                    '<div class="') +
                typeClass + '-title-next ' + baseClass +
                ('-title-next" onselectstart="return false" style="position:absolute;display:none"></div>' +
                    '<div class="') +
                baseClass + '-title-main" style="position:absolute;white-space:nowrap"></div>';

            moveElements(el, params = o.lastChild);
            el.appendChild(o);
            this.$setBody(params);

            this.$initItems();

            // 滚动按钮
            this._uNext = $fastCreate(UI_TAB_BUTTON, params = params.previousSibling, this);
            this._uPrev = $fastCreate(UI_TAB_BUTTON, params.previousSibling, this);
        },
        UI_TAB_CLASS = inherits(UI_TAB, UI_CONTROL),

        /**
         * 初始化选项卡控件的按钮部件。
         * @protected
         *
         * @param {HTMLElement} el 关联的 Element 对象
         * @param {Object} params 初始化参数
         */
        UI_TAB_BUTTON = UI_TAB.Button = function (el, params) {
            UI_CONTROL.call(this, el, params);
        },
        UI_TAB_BUTTON_CLASS = inherits(UI_TAB_BUTTON, UI_CONTROL),

        /**
         * 初始化选项卡控件的选项部件。
         * params 参数支持的特定属性如下：
         * selected 当前项是否被选中
         * @protected
         *
         * @param {HTMLElement} el 关联的 Element 对象
         * @param {Object} params 初始化参数
         */
        UI_TAB_ITEM = UI_TAB.Item = function (el, params) {
            //__gzip_original__parent
            var parent = params.parent,
                contentEl;

            if (el.tagName != 'LABEL') {
                this.setContent(contentEl = el);
                // 这里要检查父节点是否存在，如果不存在表示直接生成的对象
                insertBefore(el = first(el), contentEl);
            }

            setStyle(el, 'display', 'inline-block');

            if (parent && params.selected) {
                parent._oSelected = this;
            }

            UI_ITEM.call(this, el, params);
        },
        UI_TAB_ITEM_CLASS = inherits(UI_TAB_ITEM, UI_ITEM);


/*
Edit - 定义输入数据的基本操作。
输入框控件，继承自基础控件，实现了对原生 InputElement 的功能扩展，包括光标的控制、输入事件的实时响应(每次改变均触发事
件)，以及 IE 下不能动态改变输入框的表单项名称的模拟处理。输入框控件默认使用文本输入框，对于需要使用加密框的场景，可以
使用 &lt;input type="password" ecui="type:edit"&gt; 的方式初始化。

输入框控件直接HTML初始化的例子:
<input ecui="type:edit" name="test" value="test" />
或:
<div ecui="type:edit;name:test;value:test">
    <!-- 如果ec中不指定name,value，也可以在input中指定 -->
    <input name="test" value="test" />
</div>

属性
_bHidden - 输入框是否为hidden类型
_nLock   - 锁定的次数
_eInput  - INPUT对象
*/


    /**
     * 初始化输入框控件。
     * params 参数支持的属性如下：
     * name  输入框的名称
     * value 输入框的默认值
     * input 输入框的类型，默认为 text
     * hidden 输入框是否隐藏，隐藏状态下将不会绑定键盘事件
     * @public
     *
     * @param {Element} el 关联的 Element 对象
     * @param {Object} params 初始化参数
     */
    var UI_EDIT =
        ui.Edit = function (el, params) {
            var input = el;

            if (el.tagName == 'INPUT') {
                // 检查是否存在Input，如果没有生成一个Input
                el = createDom(input.className, input.style.cssText + ';overflow:hidden');

                input.className = '';
                input.style.cssText = 'border:0px';
                insertBefore(el, input).appendChild(input);
            }
            else {
                el.style.overflow = 'hidden';
                if (input = el.getElementsByTagName('input')[0]) {
                    input.style.border = '0px';
                }
                else {
                    input = setInput(null, params.name, params.input);
                    input.style.border = '0px';
                    input.value = params.value || '';
                    el.appendChild(input);
                }
            }
            if (this._bHidden = params.hidden) {
                input.style.display = 'none';
            }
            setStyle(el, 'display', 'inline-block');

            this._nLock = 0;
            this._eInput = input;
            UI_EDIT_BIND_EVENT(this);

            UI_CONTROL.call(this, el, params);
        },

        UI_EDIT_CLASS = inherits(UI_EDIT, UI_CONTROL),
        UI_EDIT_INPUT = {},

        /**
         * 输入框失去焦点事件处理函数。
         * @private
         *
         * @param {Event} event 事件对象
         */
        UI_EDIT_INPUT_BLUR = UI_EDIT_INPUT.blur = function (event) {
            event = findControl(standardEvent(event).target);
            // 设置默认失去焦点事件，阻止在blur事件中再次回调
            event.$blur = UI_CONTROL_CLASS.$blur;
            event.isEnabled() && loseFocus(event);
            delete event.$blur;
        },

        /**
         * 输入框获得焦点事件处理函数。
         * @private
         *
         * @param {Event} event 事件对象
         */
        UI_EDIT_INPUT_FOCUS = UI_EDIT_INPUT.focus = function (event) {
            event = findControl(standardEvent(event).target);
            // 设置默认获得焦点事件，阻止在focus事件中再次回调
            event.$focus = UI_CONTROL_CLASS.$focus;
            // 如果控件处于不可操作状态，不允许获得焦点
            event.isEnabled() ? setFocused(event) : event._eInput.blur();
            delete event.$focus;
        };


/*
FormatEdit - 定义格式化输入数据的基本操作。
格式化输入框控件，继承自输入框控件，对输入的数据内容格式进行限制。

输入框控件直接HTML初始化的例子:
<input ecui="type:format-edit" name="test" />
或:
<div ecui="type:format-edit;name:test;value:test">
    <!-- 如果ec中不指定name,value，也可以在input中指定 -->
    <input name="test" value="test" />
</div>

属性
_bSymbol    - 是否自动进行全半角转换
_bTrim      - 字符串是否需要过滤两端空白
_nMinLength - 允许提交的最小长度
_nMaxLength - 允许提交的最大长度
_nMinValue  - 允许提交的最小值
_nMaxValue  - 允许提交的最大值
_sEncoding  - 字节码编码集
_sLeft      - 每次操作左边的字符串
_sSelection - 每次操作被替换的字符串
_sRight     - 每次操作右边的字符串
_sInput     - 每次操作输入的字符串
_oKeyMask   - 允许提交的字符限制正则表达式
_oFormat    - 允许提交的格式正则表达式
*/


    /**
     * 初始化格式化输入框控件。
     * params 参数支持的属性如下：
     * symbol 是否进行全角转半角操作，默认为 true
     * trim 是否进行前后空格 trim，默认为 true (注：粘贴内容也会进行前后空格过滤)
     * encoding 字符编码，允许 utf8 与 gb2312，如果不设置表示基于字符验证长度
     * keyMask 允许的字符集，自动添加正则表达式的[]，需要注意需要转义的字符
     * minLength 最小长度限制
     * maxLength 最大长度限制
     * minValue 数字允许的最小值
     * maxValue 数字允许的最大值
     * format 字行串的正则表达式，自动添加正则表达式的^$
     *
     * @public
     *
     * @param {Element} el 关联的 Element 对象
     * @param {Object} params 初始化参数
     */
    var UI_FORMAT_EDIT =
        ui.FormatEdit = function (el, params) {
            // 为FormatEdit注册方法
            UI_EDIT.call(this, el, params);

            this._bSymbol = params.symbol !== false;
            this._bTrim = params.trim !== false;
            this._sEncoding = params.encoding;
            this._oKeyMask = params.keyMask ? new REGEXP('[' + params.keyMask + ']', 'g') : null;
            this._nMinLength = params.minLength;
            this._nMaxLength = params.maxLength;
            this._nMinValue = params.minValue;
            this._nMaxValue = params.maxValue;
            this._oFormat = params.format ? new REGEXP('^' + params.format + '$') : null;
        },

        UI_FORMAT_EDIT_CLASS = inherits(UI_FORMAT_EDIT, UI_EDIT);


/*
Checkbox - 定义单个设置项选择状态的基本操作。
复选框控件，继承自输入框控件，实现了对原生 InputElement 复选框的功能扩展，支持复选框之间的主从关系定义。当一个复选框的
“从复选框”选中一部分时，“主复选框”将处于半选状态，这种状态逻辑意义上等同于未选择状态，但显示效果不同，复选框的主从关系
可以有多级。

复选框控件直接HTML初始化的例子:
<input ecui="type:checkbox;checked:true" type="checkbox" name="test" value="test" checked="checked" />
也可以使用其它标签初始化:
<div ecui="type:checkbox;checked:true;name:test">
    <!-- 如果ec中不指定name，也可以在input中指定 -->
    <input name="test" />
</div>

属性
_nStatus   - 复选框当前的状态，0--全选，1--未选，2--半选
_cSuperior - 复选框的上级管理者
_aInferior - 所有的下级复选框
*/


    /**
     * 初始化复选框控件。
     * params 参数支持的属性如下：
     * checked  控件是否默认选中
     * superior 管理复选框的 id
     * @public
     *
     * @param {Element} el 关联的 Element 对象
     * @param {Object} params 初始化参数
     */
    var UI_CHECKBOX =
        ui.Checkbox = function (el, params) {
            params.hidden = true;
            params.input = 'checkbox';

            UI_EDIT.call(this, el, params);
            el = this.getInput();
            if (params.checked) {
                el.checked = true;
            }

            this._aInferior = [];

            $connect(this, this.setSuperior, params.superior);
        },

        UI_CHECKBOX_CLASS = inherits(UI_CHECKBOX, UI_EDIT);


/*
Radio - 定义一组选项中选择唯一选项的基本操作。
单选框控件，继承自输入框控件，实现了对原生 InputElement 单选框的功能扩展，支持对选中的图案的选择。单选框控件需要分组后
使用，在表单项提交中，一组单选框控件中的第一个单选框保存提交用的表单内容。

单选框控件直接HTML初始化的例子:
<input ecui="type:radio" type="radio" name="test" checked="checked" />
也可以使用其它标签初始化:
<div ecui="type:radio;name:test;checked:true"></div>
*/


    /**
     * 初始化单选框控件。
     * params 参数支持的属性如下：
     * checked 控件是否默认选中
     * name    控件所属组的名称
     * value   控件的值
     * @public
     *
     * @param {Element} el 关联的 Element 对象
     * @param {Object} params 初始化参数
     */
    var UI_RADIO =
        ui.Radio = function (el, params) {
            params.hidden = true;
            params.input = 'radio';

            UI_EDIT.call(this, el, params);
            el = this.getInput();
            if (params.checked) {
                el.checked = true;
            }
        },

        UI_RADIO_CLASS = inherits(UI_RADIO, UI_EDIT);


/*
Tree - 定义树形结构的基本操作。
树控件，继承自基础控件，不可以被改变大小。树控件可以包含普通子控件或者子树控件，普通子控件显示在它的文本区域，如果是子
树控件，将在专门的子树控件区域显示。子树控件区域可以被收缩隐藏或是展开显示，默认情况下点击树控件就改变子树控件区域的状
态。

树控件直接HTML初始化的例子:
<div ecui="type:tree;fold:true">
    <!-- 当前节点的文本，如果没有整个内容就是节点的文本 -->
    <label>节点的文本</label>
    <!-- 这里放子控件，如果需要fold某个子控件，将子控件的style="display:none"即可 -->
    <li>子控件文本</li>
    ...
</div>

属性
_sItemsDisplay - 隐藏时_eItems的状态，在显示时恢复
_eItems        - 子控件区域Element对象
_aTree         - 子控件集合
*/


    /**
     * 初始化树控件。
     * params 参数支持的属性如下：
     * fold 子树是否收缩，默认为展开
     * @public
     *
     * @param {Element} el 关联的 Element 对象
     * @param {Object} params 初始化参数
     */
    var UI_TREE =
        ui.Tree = function (el, params) {
            var tmpEl = first(el),
                childTrees = this._aTree = [];

            params = copy(copy({}, params), getParameters(el));

            UI_CONTROL.call(this, el, params);

            // 检查是否存在label标签，如果是需要自动初始化树的子结点
            if (tmpEl && tmpEl.tagName == 'LABEL') {

                // 初始化子控件
                for (var i = 0, childItems = createDom(), elements = children(el), o; o = elements[i + 1]; ) {
                    childItems.appendChild(o);
                    childTrees[i++] = UI_TREE_CREATE_CHILD(o, this, params);
                }

                moveElements(tmpEl, el);
                removeDom(tmpEl);
                UI_TREE_SETITEMS(this, childItems);
                insertAfter(childItems, el);
            }

            // 改变默认的展开状态
            if (el.style.display == 'none' || params.fold) {
                el.style.display = '';
                this.setFold();
            }
            else {
                UI_TREE_FLUSH(this);
            }
        },

        UI_TREE_CLASS = inherits(UI_TREE, UI_CONTROL);



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
_sName     - 节点项的名称
_sValue    - 节点项的值
_eInput    - 树的根节点拥有，保存树对应的提交 INPUT
_cSelected - 树的根节点拥有，保存当前选中的项
*/


    /**
     * 初始化单选树控件。
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
            this._sName = params.name;
            this._sValue = el.getAttribute('value') || params.value;
            UI_TREE.call(this, el, params);
        },

    UI_RADIO_TREE_CLASS = inherits(UI_RADIO_TREE, UI_TREE);



/*
CheckTree - 定义包含复选框的树形结构的基本操作。
包含复选框的树控件，继承自树控件。每一个选项包含一个复选框进行选择，除非特别的指定，否则子节点的复选框与父节点的复选框
自动联动。

树控件直接HTML初始化的例子:
<div ecui="type:check-tree;fold:true;id:parent;name:part">
    <!-- 当前节点的文本，如果没有整个内容就是节点的文本 -->
    <label>节点的文本</label>
    <!-- 这里放子控件，如果需要fold某个子控件，将子控件的style="display:none"即可 -->
    <li ecui="superior:other">子控件文本</li>
    <li>子控件文本(复选框默认与父控件复选框联动)</li>
    ...
</div>

属性
_oSuperior - 关联的父复选框控件ID，默认与父控件复选框关联
_uCheckbox - 复选框控件
*/


    /**
     * 初始化复选树控件。
     * params 参数支持的属性如下：
     * name 复选框的表单项的默认名称
     * value 复选框的表单项的值
     * superior 父复选框的标识，如果为true表示自动使用上级树节点作为父复选框，其它等价false的值表示不联动
     * @public
     *
     * @param {Element} el 关联的 Element 对象
     * @param {Object} params 初始化参数
     */
    var UI_CHECK_TREE =
        ui.CheckTree = function (el, params) {
            params = copy(copy({}, params), getParameters(el));

            UI_TREE.call(this, el, params);

            this._oSuperior = params.superior;

            var i = 0,
                checkbox = this._uCheckbox = $fastCreate(
                    UI_CHECKBOX,
                    el.insertBefore(createDom('ec-checkbox ' + this.getBaseClass() + '-checkbox'), el.firstChild),
                    this,
                    params
                ),
                childTrees = this.getChildTrees();

            for (; el = childTrees[i++]; ) {
                if (params = el._oSuperior) {
                    el = el._uCheckbox;
                    params === true
                        ? el.setSuperior(checkbox)
                        : $connect(el, el.setSuperior, params);
                }
            }
        },

        UI_CHECK_TREE_CLASS = inherits(UI_CHECK_TREE, UI_TREE);


/*
Color - 色彩类，定义从 RGB 到 HSL 之间的互相转化

属性
_nRed        - 红色值(0-255)
_nGreen      - 绿色值(0-255)
_nBlue       - 蓝色值(0-255)
_nHue        - 色调(0-1)
_nSaturation - 饱和度(0-1)
_nLight      - 亮度(0-1)
*/


    /**
     * 初始化色彩对象。
     * @public
     *
     * @param {string} color 6 字符色彩值(如FFFFFF)，如果为空将使用000000
     */
    var Color = core.Color = function (rgb) {
            if (rgb) {
                this.setRGB(
                    PARSEINT(rgb.substring(0, 2), 16),
                    PARSEINT(rgb.substring(2, 4), 16),
                    PARSEINT(rgb.substring(4, 6), 16)
                );
            }
            else {
                this.setRGB(0, 0, 0);
            }
        },

        COLOR_CLASS = Color.prototype;

/*
HTMLPalette - 定义拾色器的基本操作
拾色器控件，继承自基础控件，内部包含了多个部件，分别是色彩选择区(基础控件)、色彩选择区箭头(基础控件)、亮度条选择区(基
础控件)、亮度条选择区箭头(基础控件)、基本色彩选择区(基础控件组)、色彩显示区(基础控件)、输入区域(输入框控件组)与确认按
钮(基础控件)。

拾色器控件直接HTML初始化的例子:
<div ecui="type:palette">
</div>

属性
_uMain            - 左部色彩选择区
_uMain._uIcon     - 左部色彩选择区箭头
_uLightbar        - 中部亮度条选择区
_uLightbar._uIcon - 中部亮度条选择区箭头
_uColor           - 右部色彩显示区
_uConfirm         - 确认按钮
_aValue           - 右部输入区域
*/


    /**
     * 初始化拾色器控件。
     * @public
     *
     * @param {Element} el 关联的 Element 对象
     * @param {Object} params 初始化参数
     */
    var UI_PALETTE =
        ui.Palette = function (el, params) {
            var i = 1,
                inlineBlock = ieVersion < 8 ? 'display:inline;zoom:1' : 'display:inline-block',
                __gzip_direct__baseClass = params.base,
                __gzip_direct__params = {capture: false},
                list = [
                    '<div class="' + __gzip_direct__baseClass + '-left" style="float:left"><div class="ec-control '
                        + __gzip_direct__baseClass
                        + '-image" style="position:relative;overflow:hidden"><div class="ec-control '
                        + __gzip_direct__baseClass
                        + '-cross" style="position:absolute"><div></div></div></div></div><div class="'
                        + __gzip_direct__baseClass + '-mid" style="float:left"><div class="ec-control '
                        + __gzip_direct__baseClass + '-lightbar" style="position:relative">'
                ];

            for (; i < 257; ) {
                list[i++] = '<div style="height:1px;overflow:hidden"></div>';
            }

            list[i++] = '<div class="ec-control ' + __gzip_direct__baseClass
                + '-arrow" style="position:absolute"><div></div></div></div></div><div class="'
                + __gzip_direct__baseClass
                + '-right" style="float:left"><p>基本颜色</p><div class="'
                + __gzip_direct__baseClass + '-basic" style="white-space:normal">';

            for (; i < 306; ) {
                list[i++] = '<div class="ec-control ' + __gzip_direct__baseClass + '-area" style="' + inlineBlock
                    + ';background:#' + UI_PALETTE_BASIC_COLOR[i - 259] + '"></div>';
            }

            list[i] = '</div><table cellspacing="0" cellpadding="0" border="0"><tr><td class="'
                + __gzip_direct__baseClass + '-color" rowspan="3"><div class="ec-control '
                + __gzip_direct__baseClass + '-show"></div><input class="ec-edit '
                + __gzip_direct__baseClass + '-value"></td><th>色调:</th><td><input class="ec-edit '
                + __gzip_direct__baseClass + '-edit"></td><th>红:</th><td><input class="ec-edit '
                + __gzip_direct__baseClass + '-edit"></td></tr><tr><th>饱和度:</th><td><input class="ec-edit '
                + __gzip_direct__baseClass + '-edit"></td><th>绿:</th><td><input class="ec-edit '
                + __gzip_direct__baseClass + '-edit"></td></tr><tr><th>亮度:</th><td><input class="ec-edit '
                + __gzip_direct__baseClass + '-edit"></td><th>蓝:</th><td><input class="ec-edit '
                + __gzip_direct__baseClass + '-edit"></td></tr></table><div class="ec-control '
                + __gzip_direct__baseClass + '-button">确定</div><div class="ec-control '
                + __gzip_direct__baseClass + '-button">取消</div></div>';

            el.innerHTML = list.join('');

            UI_CONTROL.call(this, el, params);

            // 初始化色彩选择区
            el = el.firstChild;
            params = this._uMain = $fastCreate(UI_PALETTE_AREA, list = el.firstChild, this);
            params._uIcon = $fastCreate(UI_PALETTE_AREA, list.lastChild, params, __gzip_direct__params);

            // 初始化亮度条选择区
            el = el.nextSibling;
            params = this._uLightbar = $fastCreate(UI_PALETTE_AREA, list = el.firstChild, this);
            params._uIcon = $fastCreate(UI_PALETTE_AREA, list.lastChild, params, __gzip_direct__params);

            // 初始化基本颜色区
            el = children(el.nextSibling);
            (this._uBasic = $fastCreate(UI_COLLECTION, el[1], this)).$click = UI_PALETTE_BUTTON_CLASS.$click;

            // 初始化颜色输入框区域
            list = el[2].getElementsByTagName('td');
            this._uColor = $fastCreate(UI_CONTROL, list[0].firstChild, this);

            this._aValue = [$fastCreate(UI_PALETTE_EDIT, list[0].lastChild, this)];
            for (i = 1; i < 7; ) {
                this._aValue[i] = $fastCreate(
                    UI_PALETTE_EDIT,
                    list[i++].lastChild,
                    this,
                    {keyMask: '0-9', maxValue: 255, maxLength: 3}
                );
            }

            this._uConfirm = $fastCreate(UI_PALETTE_BUTTON, el[3], this);
            this._uCancel = $fastCreate(UI_PALETTE_BUTTON, el[4], this);
        },

        UI_PALETTE_CLASS = inherits(UI_PALETTE, UI_CONTROL),
        UI_PALETTE_AREA = UI_PALETTE.Area = function (el, params) {
            UI_CONTROL.call(this, el, params);
        },
        UI_PALETTE_AREA_CLASS = inherits(UI_PALETTE_AREA, UI_CONTROL),
        UI_PALETTE_BUTTON = UI_PALETTE.Button = function (el, params) {
            UI_CONTROL.call(this, el, params);
        },
        UI_PALETTE_BUTTON_CLASS = inherits(UI_PALETTE_BUTTON, UI_CONTROL),
        UI_PALETTE_EDIT = UI_PALETTE.Edit = function (el, params) {
            UI_FORMAT_EDIT.call(this, el, params);
        },
        UI_PALETTE_EDIT_CLASS = inherits(UI_PALETTE_EDIT, UI_FORMAT_EDIT),
        UI_PALETTE_BASIC_COLOR = [
            'FF8080', 'FFFF80', '80FF80', '00FF80', '80FFFF', '0080F0', 'FF80C0', 'FF80FF',
            'FF0000', 'FFFF00', '80FF00', '00FF40', '00FFFF', '0080C0', '8080C0', 'FF00FF',
            '804040', 'FF8040', '00FF00', '008080', '004080', '8080FF', '800040', 'FF0080',
            '800000', 'FF8000', '008000', '008040', '0000FF', '0000A0', '800080', '8000FF',
            '400000', '804000', '004000', '004040', '000080', '000040', '400040', '400080',
            '000000', '808000', '808040', '808080', '408080', 'C0C0C0', '400040', 'FFFFFF'
        ];


/*
Scroll - 定义在一个区间轴内移动的基本操作。
滚动条控件，继承自基础控件，滚动条控件，内部包含三个部件，分别是向前(滚动条的当前值变小)滚动按钮(基础控件)、向后(滚动
条的当前值变大)滚动按钮(基础控件)与滑动块(基础控件)。滚动条控件是滚动行为的虚拟实现，不允许直接初始化，它的子类通常情
况下也不会被直接初始化，而是作为控件的一部分用于控制父控件的行为。

属性
_nTotal         - 滚动条区域允许设置的最大值
_nStep          - 滚动条移动一次时的基本步长
_nValue         - 滚动条当前设置的值
_oTimer         - 定时器的句柄，用于连续滚动处理
_cButton        - 当前正在执行动作的按钮，用于连续滚动的控制
_uPrev          - 向前滚动按钮
_uNext          - 向后滚动按钮
_uBlock         - 滑动块

滑动块属性
_oRange         - 滑动块的合法滑动区间
*/


    /**
     * 初始化滚动条控件。
     * @protected
     *
     * @param {Element} el 关联的 Element 对象
     * @param {Object} params 初始化参数
     */
    var UI_SCROLL =
        ui.Scroll = function (el, params) {
            var __gzip_direct__baseClass = params.base,
                __gzip_direct__typeClass = params.type,
                __gzip_direct__params = {focus: false};

            params.focus = false;

            // 屏蔽IE下的选中操作
            el.onselectstart = cancel;

            el.innerHTML = '<div class="'
                + __gzip_direct__typeClass + '-prev '
                + __gzip_direct__baseClass + '-prev" style="position:absolute;top:0px;left:0px"></div><div class="'
                + __gzip_direct__typeClass + '-next '
                + __gzip_direct__baseClass + '-next" style="position:absolute;top:0px;left:0px"></div><div class="'
                + __gzip_direct__typeClass + '-block '
                + __gzip_direct__baseClass + '-block" style="position:absolute"></div>';

            UI_CONTROL.call(this, el, params);

            // 使用 el 代替 children
            el = children(el);

            // 初始化滚动条控件
            this._nValue = this._nTotal = 0;
            this._nStep = 1;

            // 创建向前/向后滚动按钮与滑动块
            this._uPrev = $fastCreate(UI_SCROLL_BUTTON, el[0], this, __gzip_direct__params);
            this._uNext = $fastCreate(UI_SCROLL_BUTTON, el[1], this, __gzip_direct__params);
            this._uBlock = $fastCreate(UI_SCROLL_BLOCK, el[2], this, __gzip_direct__params);
        },

        UI_SCROLL_CLASS = inherits(UI_SCROLL, UI_CONTROL),
        UI_SCROLL_BLOCK = UI_SCROLL.Block = function (el, params) {
            UI_CONTROL.call(this, el, params);
        },
        UI_SCROLL_BLOCK_CLASS = inherits(UI_SCROLL_BLOCK, UI_CONTROL),
        UI_SCROLL_BUTTON = UI_SCROLL.Button = function (el, params) {
            UI_CONTROL.call(this, el, params);
        },
        UI_SCROLL_BUTTON_CLASS = inherits(UI_SCROLL_BUTTON, UI_CONTROL);


    /**
     * 初始化垂直滚动条控件。
     * @public
     *
     * @param {Element} el 关联的 Element 对象
     * @param {Object} params 初始化参数
     */
    var UI_VSCROLL = ui.VScroll = function (el, params) {
            UI_SCROLL.call(this, el, params);
        },

        UI_VSCROLL_CLASS = inherits(UI_VSCROLL, UI_SCROLL);


    /**
     * 初始化水平滚动条控件。
     * @public
     *
     * @param {Element} el 关联的 Element 对象
     * @param {Object} params 初始化参数
     */
    var UI_HSCROLL = ui.HScroll = function (el, params) {
            UI_SCROLL.call(this, el, params);
        },

        UI_HSCROLL_CLASS = inherits(UI_HSCROLL, UI_SCROLL);


﻿/*
Panel - 定义在一个小区域内截取显示大区域内容的基本操作。
截面控件，继承自基础控件，内部包含三个部件，分别是垂直滚动条、水平滚动条与两个滚动条之间的夹角(基础控件)。截面控件的内
容区域可以超过控件实际大小，通过拖拽滚动条显示完整的内容，截面控件可以设置参数决定是否自动显示水平/垂直滚动条，如果设
置不显示水平/垂直滚动条，水平/垂直内容超出的部分将直接被截断，当设置两个滚动条都不显示时，层控件从显示效果上等同于基础
控件。在层控件上滚动鼠标滑轮，将控制层控件往垂直方向(如果没有垂直滚动条则在水平方向)前移或者后移滚动条，在获得焦点后，
通过键盘的方向键也可以操作层控件的滚动条。

层控件直接HTML初始化的例子:
<div ecui="type:panel;vertical-scroll:true;horizontal-scroll:true;wheel-delta:20;absolute:true">
    <!-- 这里放内容 -->
    ...
</div>

属性
_bAbsolute                - 是否包含绝对定位的Element
_nWheelDelta              - 鼠标滚轮滚动一次的差值
_eBrowser                 - 用于浏览器原生的滚动条实现的Element
_uVScroll                 - 垂直滚动条控件
_uHScroll                 - 水平滚动条控件
_uCorner                  - 夹角控件
$cache$layoutWidthRevise  - layout区域的宽度修正值
$cache$layoutHeightRevise - layout区域的高度修正值
$cache$mainWidth          - layout区域的实际宽度
$cache$mainHeight         - layout区域的实际高度
*/


    /**
     * 初始化浏览器原生滚动条控件。
     * @protected
     *
     * @param {Element} el 关联的 Element 对象
     * @param {Object} params 初始化参数
     */
    var UI_BROWSER_SCROLL = function (el, params) {
            params.capture = false;
            UI_CONTROL.call(this, el, params);
            el.lastChild || el.appendChild(createDom(null, 'padding:0px;border:0px'));
            detachEvent(el, 'scroll', this.scroll);
            attachEvent(el, 'scroll', this.scroll);

            this._sTotal = params.total;
            this._sOverflow = params.overflow;
            this._sScrollValue = params.scrollValue;
            this._sScrollTotal = params.scrollTotal;
        },
        UI_BROWSER_SCROLL_CLASS = inherits(UI_BROWSER_SCROLL, UI_CONTROL);


    /**
     * 初始化浏览器原生垂直滚动条控件。
     * @public
     *
     * @param {Element} el 关联的 Element 对象
     * @param {Object} params 初始化参数
     */
    var UI_BROWSER_VSCROLL = function (el, params) {
            params.total = 'height';
            params.overflow = 'overflowY';
            params.scrollValue = 'scrollTop';
            params.scrollTotal = 'scrollHeight';
            UI_BROWSER_SCROLL.call(this, el, params);
        },
        UI_BROWSER_VSCROLL_CLASS = inherits(UI_BROWSER_VSCROLL, UI_BROWSER_SCROLL);


    /**
     * 初始化浏览器原生水平滚动条控件。
     * @public
     *
     * @param {Element} el 关联的 Element 对象
     * @param {Object} params 初始化参数
     */
    var UI_BROWSER_HSCROLL = function (el, params) {
            params.total = 'width';
            params.overflow = 'overflowX';
            params.scrollValue = 'scrollLeft';
            params.scrollTotal = 'scrollWidth';
            UI_BROWSER_SCROLL.call(this, el, params);
        },
        UI_BROWSER_HSCROLL_CLASS = inherits(UI_BROWSER_HSCROLL, UI_BROWSER_SCROLL);


    /**
     * 初始化夹角控件。
     * @public
     *
     * @param {Element} el 关联的 Element 对象
     * @param {Object} params 初始化参数
     */
    var UI_BROWSER_CORNER = blank,
        UI_BROWSER_CORNER_CLASS = inherits(UI_BROWSER_CORNER, UI_CONTROL);


    /**
     * 初始化层控件，层控件支持自动展现滚动条控件，允许指定需要自动展现的垂直或水平滚动条。
     * params 参数支持的属性如下：
     * vScroll    是否自动展现垂直滚动条，默认展现
     * hScroll    是否自动展现水平滚动条，默认展现
     * browser    是否使用浏览器原生的滚动条，默认使用模拟的滚动条
     * absolute   是否包含绝对定位的Element，默认不包含
     * wheelDelta 鼠标滚轮的步长，即滚动一次移动的最小步长单位，默认总步长(差值*步长)为不大于20像素的最大值
     * @public
     *
     * @param {Element} el 关联的 Element 对象
     * @param {Object} params 初始化参数
     */
    var UI_PANEL =
        ui.Panel = function (el, params) {
            var i = 0,
                j = 0,
                __gzip_direct__baseClass = params.base,
                noBrowser = !params.browser,
                vscroll = params.vScroll !== false,
                hscroll = params.hScroll !== false,
                list = [
                    [vscroll, '_uVScroll', noBrowser ? UI_VSCROLL : UI_BROWSER_VSCROLL],
                    [hscroll, '_uHScroll', noBrowser ? UI_HSCROLL : UI_BROWSER_HSCROLL],
                    [vscroll && hscroll, '_uCorner', noBrowser ? UI_CONTROL : UI_BROWSER_CORNER]
                ],
                o = createDom(el.className, el.style.cssText + ';overflow:hidden');

            o.innerHTML =
                (noBrowser && vscroll
                    ? '<div class="ec-vscroll ' + __gzip_direct__baseClass
                        + '-vscroll" style="position:absolute"></div>'
                    : ''
                )
                + (noBrowser && hscroll
                    ? '<div class="ec-hscroll ' + __gzip_direct__baseClass
                        + '-hscroll" style="position:absolute"></div>'
                    : ''
                )
                + (noBrowser && vscroll && hscroll
                    ? '<div class="' + params.type + '-corner ' + __gzip_direct__baseClass
                        + '-corner" style="position:absolute"></div>'
                    : '<div style="position:absolute;top:0px;left:0px;overflow:auto;padding:0px;border:0px"><div style="padding:0px;border:0px"></div></div>'
                )
                + '<div class="' + __gzip_direct__baseClass
                    + '-layout" style="position:relative;overflow:hidden"></div>';
            el.style.cssText = 'position:absolute;top:0px;left:0px' + (hscroll ? ';white-space:nowrap' : '');
            el.className = __gzip_direct__baseClass + '-main';
            insertBefore(o, el).lastChild.appendChild(el);

            UI_CONTROL.call(this, o, params);
            this.$setBody(el);

            this._bAbsolute = params.absolute;
            this._nWheelDelta = params.wheelDelta;

            // 以下使用 el 表示 elements
            if (noBrowser) {
                el = children(o);
            }
            else {
                el = [el = this._eBrowser = o.firstChild, el, el];
            }

            // 生成中心区域的Element层容器，滚动是通过改变容器的left与top属性实现
            for (; o = list[i++]; ) {
                if (o[0]) {
                    this[o[1]] = $fastCreate(o[2], el[j++], this);
                }
            }
        },

        UI_PANEL_CLASS = inherits(UI_PANEL, UI_CONTROL);


﻿/*
Listbox - 定义了多项选择的基本操作。
多选框控件，继承自截面控件，实现了选项组接口，扩展了多选的 SelectElement 的功能，允许使用鼠标拖拽进行多项选择，多个交
换框，可以将选中的选项在互相之间移动。多选框控件也可以单独的使用，选中的选项在表单提交时将被提交。

多选框控件直接HTML初始化的例子:
<div ecui="type:listbox;name:test">
    <!-- 这里放选项内容 -->
    <li>选项</li>
    ...
</div>

属性
_sName  - 多选框内所有input的名称

选项属性
_eInput - 选项对应的input，form提交时使用
*/


    /**
     * 初始化多选框控件。
     * @public
     *
     * @param {Element} el 关联的 Element 对象
     * @param {Object} params 初始化参数
     */
    var UI_LISTBOX =
        ui.Listbox = function (el, params) {
            params.hScroll = false;
            params.vScroll = true;
            this._sName = params.name || '';

            UI_PANEL.call(this, el, params);

            this._cScroll = this.$getSection('VScroll');
            this.$initItems();
        },

        UI_LISTBOX_CLASS = inherits(UI_LISTBOX, UI_PANEL),
        UI_LISTBOX_ITEM = UI_LISTBOX.Item = function (el, params) {
            UI_ITEM.call(this, el, params);
            el.appendChild(this._eInput = setInput(null, params.parent._sName, 'hidden')).value
                = params.value === undefined ? getText(el) : '' + params.value;
            this.setSelected(!!params.selected);
        },
        UI_LISTBOX_ITEM_CLASS = inherits(UI_LISTBOX_ITEM, UI_ITEM);


﻿/*
Select - 定义模拟下拉框行为的基本操作。
下拉框控件，继承自输入框控件，实现了选项组接口，内部包含了三个部件，分别是下拉框显示的文本(选项控件)、下拉框的按钮(基础控件)与下拉选项框
(截面控件，只使用垂直滚动条)。下拉框控件扩展了原生 SelectElement 的功能，允许指定下拉选项框的最大选项数量，在屏幕显示
不下的时候，会自动显示在下拉框的上方。在没有选项时，下拉选项框有一个选项的高度。下拉框控件允许使用键盘与滚轮操作，在下
拉选项框打开时，可以通过回车键或鼠标点击选择，上下键选择选项的当前条目，在关闭下拉选项框后，只要拥有焦点，就可以通过滚
轮上下选择选项。

下拉框控件直接HTML初始化的例子:
<select ecui="type:select;option-size:3" name="test">
    <!-- 这里放选项内容 -->
    <option value="值">文本</option>
    ...
    <option value="值" selected>文本</option>
    ...
</select>

如果需要自定义特殊的选项效果，请按下列方法初始化:
<div ecui="type:select;name:test;option-size:3">
    <!-- 这里放选项内容 -->
    <li ecui="value:值">文本</li>
    ...
</div>

属性
_nOptionSize  - 下接选择框可以用于选择的条目数量
_cSelected    - 当前选中的选项
_uText        - 下拉框的文本框
_uButton      - 下拉框的按钮
_uOptions     - 下拉选择框
*/


    /**
     * 初始化下拉框控件。
     * params 参数支持的属性如下：
     * optionSize 下拉框最大允许显示的选项数量，默认为5
     * @public
     *
     * @param {Element} el 关联的 Element 对象
     * @param {Object} params 初始化参数
     */
    var UI_SELECT =
        ui.Select = function (el, params) {
            params.hidden = true;

            var i = 0,
                __gzip_direct__typeClass = params.type,
                __gzip_direct__params = {capture: false},
                name = el.name || params.name || '',
                value = el.value || params.value || '',
                elements = el.options,
                o,
                html = [],
                optionsEl = createDom(
                    'ec-panel ' + params.base + '-options',
                    'position:absolute;z-index:65535;display:none'
                );

            if (elements) {
                // 移除select标签
                el = insertBefore(createDom(el.className, el.style.cssText), el);
                removeDom(el.nextSibling);

                // 转化select标签
                for (; o = elements[i]; i++) {
                    // 这里的text不进行转义，特殊字符不保证安全
                    html[i] = '<div ' + getAttributeName() + '="value:' + encodeHTML(o.value) + '">'
                        + o.text + '</div>';
                }
                optionsEl.innerHTML = html.join('');
            }
            else {
                moveElements(el, optionsEl);
            }

            el.innerHTML = '<div class="ec-item ' + __gzip_direct__typeClass
                + '-text"></div><div class="ec-control ' + __gzip_direct__typeClass
                + '-button" style="position:absolute"></div><input name="' + name + '">';

            UI_EDIT.call(this, el, params);

            // 初始化下拉区域，下拉区域需要强制置顶
            this.$setBody(
                (this._uOptions = $fastCreate(
                    UI_SELECT_OPTIONS,
                    optionsEl,
                    this,
                    {hScroll: false, browser: params.browser}
                )).getBody()
            );

            el = children(el);

            this._uText = $fastCreate(UI_ITEM, el[0], this, __gzip_direct__params);
            this._uButton = $fastCreate(UI_CONTROL, el[1], this, __gzip_direct__params);
            el[2].value = value;

            // 初始化下拉区域最多显示的选项数量
            this._nOptionSize = params.optionSize || 5;

            this.$initItems();
        },

        UI_SELECT_CLASS = inherits(UI_SELECT, UI_EDIT),
        UI_SELECT_OPTIONS = UI_SELECT.Options = function (el, params) {
            UI_PANEL.call(this, el, params);
        },
        UI_SELECT_OPTIONS_CLASS = inherits(UI_SELECT_OPTIONS, UI_PANEL),
        UI_SELECT_ITEM = UI_SELECT.Item = function (el, params) {
            UI_ITEM.call(this, el, params);
            this._sValue = params.value === undefined ? getText(el) : '' + params.value;
        },
        UI_SELECT_ITEM_CLASS = inherits(UI_SELECT_ITEM, UI_ITEM);


﻿/*
Combox - 定义可输入下拉框行为的基本操作。
可输入下拉框控件，继承自下拉框控件，在下拉框控件的基础上允许选项框可输入内容。

下拉框控件直接HTML初始化的例子:
<select ecui="type:combox" name="test">
    <!-- 这里放选项内容 -->
    <option value="值">文本</option>
    ...
    <option value="值" selected>文本</option>
    ...
</select>

如果需要自定义特殊的选项效果，请按下列方法初始化:
<div ecui="type:combox">
    <!-- 如果ec中不指定name，也可以在input中指定 -->
    <input name="test" />
    <!-- 这里放选项内容 -->
    <li value="值">文本</li>
    ...
</div>
*/


    /**
     * 初始化可输入下拉框控件。
     * params 参数支持的属性如下：
     * @public
     *
     * @param {Element} el 关联的 Element 对象
     * @param {Object} params 初始化参数
     */
    var UI_COMBOX =
        ui.Combox = function (el, params) {
            UI_SELECT.call(this, el, params);
            this.getInput().style.display = '';
            this.$getSection('Text').getOuter().style.display = 'none';
        },

        UI_COMBOX_CLASS = inherits(UI_COMBOX, UI_SELECT);


/*
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


/*
Table - 定义由行列构成的表格的基本操作。
表格控件，继承自截面控件，内部包含一个部件——标题区(基础控件)。表格控件对基本的 TableElement 功能进行了扩展，表头固定，
不会随表格的垂直滚动条滚动而滚动，在行列滚动时，支持整行整列移动，允许直接对表格的数据进行增加/删除/修改操作。

表格控件直接HTML初始化的例子:
<div ecui="type:table">
    <table>
        <!-- 当前节点的列定义，如果有特殊格式，需要使用width样式 -->
        <thead>
            <tr>
                <th>标题</th>
                ...
            </tr>
        </thead>
        <tbody>
            <!-- 这里放单元格序列 -->
            <tr>
                <td>单元格一</td>
                ...
            </tr>
            ...
        </tbody>
    </table>
</div>

属性
_aCol        - 表头的列控件对象
_aRow        - 表格数据行对象
_uHead       - 表头区域

表头列属性
$cache$pos   - 列的坐标

行属性
$cache$pos   - 行的坐标
_aCol        - 行的列Element对象，如果当前列需要向左合并为null，需要向上合并为false
*/


    /**
     * 初始化表格控件。
     * params 参数支持的属性如下：
     * @public
     *
     * @param {HTMLElement} el 关联的 Element 对象
     * @param {Object} params 初始化参数
     */
    var UI_TABLE =
        ui.Table = function (el, params) {
            var i = 0,
                __gzip_direct__baseClass = params.base,
                __gzip_direct__typeClass = params.type,
                rows = this._aRow = [],
                cols = this._aCol = [],
                tableEl = first(el),
                elements = children(tableEl),
                head = elements[0],
                j,
                o;

            removeDom(tableEl);
            params.wheelDelta = 1;
            UI_PANEL.call(this, el, params);

            // 以下使用 el 表示 head 的 body 元素
            if (head.tagName != 'THEAD') {
                el = insertBefore(createDom('', '', 'thead'), head).appendChild((elements = children(head)).shift());
                head = getParent(el);
            }
            else {
                elements = children(elements[1]);
                el = last(head);
            }

            tableEl.setAttribute('cellSpacing', '0');

            // 设置滚动条操作
            if (o = this.$getSection('VScroll')) {
                o.setValue = UI_TABLE_SCROLL_SETVALUE;
            }
            if (o = this.$getSection('HScroll')) {
                o.setValue = UI_TABLE_SCROLL_SETVALUE;
            }

            // 初始化表头区域
            o = createDom(
                __gzip_direct__typeClass + '-area ' + __gzip_direct__baseClass + '-area',
                'position:absolute;top:0px;overflow:hidden'
            );
            o.innerHTML = '<div style="white-space:nowrap;position:absolute"><table cellspacing="0"><tbody></tbody></table></div>';
            (this._uHead = $fastCreate(UI_CONTROL, this.getBase().appendChild(o), this)).$setBody(el);

            for (j = findConstructor(this, 'Row'); o = elements[i]; i++) {
                o.className = __gzip_direct__typeClass + '-row ' + __gzip_direct__baseClass + '-row ' + o.className;
                elements[i] = first(o);
                (rows[i] = $fastCreate(j, o, this))._aCol = [];
            }

            // 以下使用 head 表示所有的列标签集合
            for (i = 0, head = children(el); head[i]; i++) {
                for (j = 0; rows[j]; j++) {
                    o = elements[j];
                    if (rows[j]._aCol[i] === undefined) {
                        rows[j]._aCol[i] = o;
                        elements[j] = next(o);

                        var rowspan = toNumber(o.getAttribute('rowSpan')) || 1,
                            colspan = toNumber(o.getAttribute('colSpan')) || 1;

                        while (rowspan--) {
                            rowspan || colspan--;
                            for (o = colspan; o--; ) {
                                rows[j + rowspan]._aCol.push(rowspan ? false : null);
                            }
                        }
                    }
                }
            }

            for (i = 0; el = head[i]; i++) {
                o = el.className.split(/\s+/);
                o = o[0] || o[1] || __gzip_direct__baseClass;
                el.className = __gzip_direct__typeClass + '-head ' + o + '-head ' + el.className;
                o = __gzip_direct__typeClass + '-item ' + o + '-item ';

                cols[i] = $fastCreate(UI_TABLE_COL, el, this);
                // 以下使用 elements 代替行控件对象
                for (j = 0; elements = rows[j]; j++) {
                    if (el = elements._aCol[i]) {
                        el.className = o + el.className;
                        el.getControl = ieVersion == 8 ? UI_TABLE_INIT_GETCONTROL() : UI_TABLE_INIT_GETCONTROL;
                    }
                }
            }

            this.getBody().appendChild(tableEl);
        },

        UI_TABLE_CLASS = inherits(UI_TABLE, UI_PANEL),
        UI_TABLE_ROW = UI_TABLE.Row = function (el, params) {
            UI_CONTROL.call(this, el, params);
        },
        UI_TABLE_ROW_CLASS = inherits(UI_TABLE_ROW, UI_CONTROL),
        UI_TABLE_COL = UI_TABLE.Col = function (el, params) {
            UI_CONTROL.call(this, el, params);
        },
        UI_TABLE_COL_CLASS = inherits(UI_TABLE_COL, UI_CONTROL),
        UI_TABLE_CELL = UI_TABLE.Cell = function (el, params) {
            UI_CONTROL.call(this, el, params);
        },
        UI_TABLE_CELL_CLASS = inherits(UI_TABLE_CELL, UI_CONTROL),

        /**
         * 在需要时初始化单元格控件。
         * 表格控件的单元格控件不是在初始阶段生成，而是在单元格控件第一次被调用时生成，参见核心的 getControl 方法。
         * @private
         *
         * @return {ecui.ui.Control} 单元格控件
         */
        UI_TABLE_INIT_GETCONTROL = ieVersion == 8 ? function () {
            var control;
            return function () {
                if (!control) {
                    control = $fastCreate(UI_TABLE_CELL, this, getParent(this).getControl());
                }
                return control;
            };
        } : function () {
            this.getControl = null;
            return $fastCreate(UI_TABLE_CELL, this, getParent(this).getControl());
        };


/*
LockedTable - 定义允许左右锁定若干列显示的高级表格的基本操作。
允许锁定左右两列的高级表格控件，继承自表格控件，内部包含两个部件——锁定的表头区(基础控件)与锁定的行内容区(基础控件)。

锁定列高级表格控件直接HTML初始化的例子:
<div ecui="type:locked-table;left-lock:2;right-lock:1">
    <table>
        <!-- 当前节点的列定义，如果有特殊格式，需要使用width样式 -->
        <thead>
            <tr>
                <th>标题</th>
                ...
            </tr>
        </thead>
        <tbody>
            <!-- 这里放单元格序列 -->
            <tr>
                <td>单元格一</td>
                ...
            </tr>
            ...
        </tbody>
    </table>
</div>

属性
_nLeft       - 最左部未锁定列的序号
_nRight      - 最右部未锁定列的后续序号，即未锁定的列序号+1
_aLockedRow  - 用于显示锁定区域的行控件数组
_uLockedHead - 锁定的表头区
_uLockedMain - 锁定的行内容区

表格行与锁定行属性
_cJoint      - 行(锁定行)对应的锁定行(行)控件
*/


    /**
     * 初始化高级表格控件。
     * params 参数支持的属性如下：
     * left-lock  左边需要锁定的列数
     * right-lock 右边需要锁定的列数
     * @public
     *
     * @param {HTMLElement} el 关联的 Element 对象
     * @param {Object} params 初始化参数
     */
    var UI_LOCKED_TABLE =
        ui.LockedTable = function (el, params) {
            UI_TABLE.call(this, el, params);

            var i = 0,
                rows = this.getRows(),
                lockedEl = createDom('', 'position:absolute;top:0px;left:0px;overflow:hidden'),
                list = [],
                lockedRows = this._aLockedRow = [],
                o;

            this._nLeft = params.leftLock || 0;
            this._nRight = this.getColCount() - (params.rightLock || 0);

            // 以下使用 params 代替 rows
            for (; el = rows[i]; ) {
                el = el.getBase();
                list[i++] = '<tr class="' + el.className + '" style="' + el.style.cssText
                    + '"><td style="padding:0px;border:0px"></td></tr>';
            }

            lockedEl.innerHTML =
                '<div class="' + params.type + '-area ' + params.base
                    + '-area"><div style="white-space:nowrap;position:absolute"><table cellspacing="0"><thead><tr><td style="padding:0px;border:0px"></td></tr></thead></table></div></div><div class="' + params.type + '-layout ' + params.base
                    + '-layout" style="position:relative;overflow:hidden"><div style="white-space:nowrap;position:absolute;top:0px;left:0px"><table cellspacing="0"><tbody>' + list.join('') + '</tbody></table></div></div>';
            // 初始化锁定的表头区域，以下使用 list 表示临时变量
            o = this._uLockedHead = $fastCreate(UI_CONTROL, lockedEl.firstChild, this);
            o.$setBody(o.getBase().lastChild.lastChild.firstChild.lastChild);
            o._cJoint = this.$getSection('Head');
            o._eFill = o.getBody().lastChild;

            o = this._uLockedMain = $fastCreate(UI_CONTROL, el = lockedEl.lastChild, this);
            o.$setBody(el = el.lastChild);

            for (i = 0, list = children(el.lastChild.lastChild); o = list[i]; ) {
                lockedRows[i] = UI_LOCKED_TABLE_CREATE_LOCKEDROW(this, o, rows[i++]);
            }
            insertBefore(lockedEl, getParent(this.getBody()));
        },

        UI_LOCKED_TABLE_CLASS = inherits(UI_LOCKED_TABLE, UI_TABLE),
        UI_LOCKED_TABLE_ROW = UI_LOCKED_TABLE.Row = function (el, params) {
            UI_TABLE_ROW.call(this, el, params);
        },
        UI_LOCKED_TABLE_ROW_CLASS = inherits(UI_LOCKED_TABLE_ROW, UI_TABLE_ROW);


/*
Decorator - 装饰器基类，使用inline-block附着在控件外围，在控件改变状态时，装饰器同步改变状态。控件最外层装饰器的引用
              通过访问Decorator的属性来得到，属性名为控件对象

属性
_sClass  - 装饰器样式
_eOuter  - 装饰器外框Element
_oInner  - 内层装饰器或者控件对象
*/


    /**
     * 初始化装饰器，将其附着在控件外围。
     * @public
     *
     * @param {ecui.ui.Control|ecui.ext.Decorator} control 需要装饰的控件
     * @param {string} baseClass 装饰器的基本样式
     */
    var EXT_DECORATOR =
        ext.Decorator = function (control, baseClass) {
            var id = control.getUID(),
                oldEl = (this._oInner = EXT_DECORATOR[id] || control).getOuter();

            insertBefore(this._eOuter = createDom(this._sClass = baseClass), oldEl).appendChild(oldEl);
            $bind(this._eOuter, control);

            EXT_DECORATOR[id] = this;

            // 给控件的方法设置代理访问
            copy(control, EXT_DECORATOR_PROXY);
        },

        EXT_DECORATOR_CLASS = EXT_DECORATOR.prototype,
        EXT_DECORATOR_PROXY = {};

/*
LRDecorator - 左右扩展装饰器，将区域分为"左-控件-右"三部分，使用paddingLeft与paddingRight作为左右区域的宽度
*/

    /**
     * 初始化左右扩展装饰器，将其附着在控件外围。
     * @public
     *
     * @param {Control} control 需要装饰的控件
     * @param {string} baseClass 装饰器的基本样式
     */
    var EXT_LR_DECORATOR = ext.LRDecorator = function (control, baseClass) {
            EXT_DECORATOR.call(this, control, baseClass);
            insertHTML(
                this.getOuter(),
                'beforeEnd',
                '<div class="' + baseClass + '-left" style="position:absolute;top:0px;left:0px"></div><div class="'
                    + baseClass + '-right" style="position:absolute;top:0px;left:0px"></div>'
            );
        };

/*
TBDecorator - 上下扩展装饰器，将区域分为"上-控件-下"三部分，使用paddingTop与paddingBottom作为上下区域的高度
*/

        /**
         * 初始化上下扩展装饰器，将其附着在控件外围。
         * @public
         *
         * @param {Control} control 需要装饰的控件
         * @param {string} baseClass 装饰器的基本样式
         */
    var EXT_TB_DECORATOR = ext.TBDecorator = function (control, baseClass) {
            EXT_DECORATOR.call(this, control, baseClass);
            insertHTML(
                this.getOuter(),
                'beforeEnd',
                '<div class="' + baseClass + '-top" style="position:absolute;top:0px;left:0px"></div><div class="'
                    + baseClass + '-bottom" style="position:absolute;top:0px;left:0px"></div>'
            );
        };

/*
MagicDecorator - 九宫格扩展装饰器，将区域分为"左上-上-右上-左-控件-右-左下-下-右下"九部分，使用padding定义宽度与高度
*/

    /**
     * 初始化九宫格扩展装饰器，将其附着在控件外围。
     * @public
     *
     * @param {Control} control 需要装饰的控件
     * @param {string} baseClass 装饰器的基本样式
     */
    var EXT_MAGIC_DECORATOR = ext.MagicDecorator = function (control, baseClass) {
            EXT_DECORATOR.call(this, control, baseClass);
            insertHTML(
                this.getOuter(),
                'beforeEnd',
                '<div class="' + baseClass + '-widget0" style="position:absolute;top:0px;left:0px"></div><div class="'
                    + baseClass + '-widget1" style="position:absolute;top:0px;left:0px"></div><div class="'
                    + baseClass + '-widget2" style="position:absolute;top:0px;left:0px"></div><div class="'
                    + baseClass + '-widget3" style="position:absolute;top:0px;left:0px"></div><div class="'
                    + baseClass + '-widget5" style="position:absolute;top:0px;left:0px"></div><div class="'
                    + baseClass + '-widget6" style="position:absolute;top:0px;left:0px"></div><div class="'
                    + baseClass + '-widget7" style="position:absolute;top:0px;left:0px"></div><div class="'
                    + baseClass + '-widget8" style="position:absolute;top:0px;left:0px"></div>'
            );
        };



/*
Decorator - 装饰器基类，使用inline-block附着在控件外围，在控件改变状态时，装饰器同步改变状态。控件最外层装饰器的引用
              通过访问Decorator的属性来得到，属性名为控件对象

属性
_sClass  - 装饰器样式
_eOuter  - 装饰器外框Element
_oInner  - 内层装饰器或者控件对象
*/


    /**
     * 初始化点击时动画效果。
     * @public
     *
     * @param {ecui.ui.Control|ecui.ext.Decorator} control 需要装饰的控件
     * @param {string} baseClass 装饰器的基本样式
     */
    var EXT_TWEEN =
        ext.Tween = function (object, params) {
            function decelerate() {
                var params = EXT_TWEEN[this.getUID()],
                    x = MIN((params.currTime += 20) / totalTime, 1),
                    name;

                if (x == 1) {
                    params.timer.stop();
                    EXT_TWEEN[this.getUID()] = null;
                }

                params.currValue = {};
                for (name in params.startValue) {
                    params.currValue[name] = params.startValue[name] + (params.endValue[name] - params.startValue[name]) * (1 - POW(1 - x, 3));
                }
                setValue(this, params.currValue);
            }

            function steady() {
                var params = EXT_TWEEN[this.getUID()],
                    flag = true,
                    sign,
                    name;

                for (name in params.startValue) {
                    if (params.startValue[name] != params.endValue[name]) {
                        sign = params.startValue[name] < params.endValue[name];
                        params.currValue[name] += ('number' == typeof pressStep ? pressStep : pressStep[name]) * (sign ? 1 : -1);
                        if (params.currValue[name] < params.endValue[name] && sign || params.currValue[name] > params.endValue[name] && !sign) {
                            flag = false;
                        }
                    }
                }
                if (flag) {
                    setValue(this, params.endValue);
                    click.call(this);
                    sign = getValue(this);
                    for (name in sign) {
                        if (params.endValue[name] == sign[name]) {
                            params.currValue[name] = sign[name];
                        }
                        else {
                            flag = false;
                        }
                    }
                    if (flag) {
                        params.timer.stop();
                    }
                    else {
                        params.endValue = sign;
                    }
                }
                setValue(this, params.currValue);
            }

            var click = object.$click,
                pressstart = object.$pressstart,
                pressend = object.$pressend,
                totalTime = (params.second * 1000) || 500,
                pressStep = params.pressStep;

            if (params.monitor) {
                var getValue = new Function(
                        'o',
                        'return [ecui.util.toNumber(o.' + params.monitor.replace(/\|/g, '),ecui.util.toNumber(o.') +
                            ')]'
                    ),
                    setValue = new Function(
                        'o',
                        'v',
                        'o.' + params.monitor.replace(/\|/g, '=v[0]+"px";v.splice(0,1);o.') + '=v[0]+"px"'
                    );
            }
            else {
                getValue = params.getValue;
                setValue = params.setValue;
            }

            if (pressStep) {
                object.$click = function (event) {
                    var currValue = getValue(this);
                    click.call(this, event);
                    setValue(this, currValue);
                };

                object.$pressstart = function (event) {
                    var params = EXT_TWEEN[this.getUID()];
                    if (params) {
                        params.timer.stop();
                        setValue(this, params.endValue);
                    }
                    else {
                        params = EXT_TWEEN[this.getUID()] = {};
                        params.startValue = getValue(this);
                        params.currValue = getValue(this);
                    }
                    click.call(this, event);
                    params.endValue = getValue(this);
                    if (params.startValue != params.endValue) {
                        params.currTime = 0;
                        steady.call(this);
                        params.timer = new Timer(steady, -40, this);
                    }
                    pressstart.call(this, event);
                };

                object.$pressend = function (event) {
                    var params = EXT_TWEEN[this.getUID()];
                    params.timer.stop();
                    params.startValue = params.currValue;
                    params.timer = new Timer(decelerate, -20, this);
                    pressend.call(this, event);
                };
            }
            else {
                object.$click = function (event) {
                    var params = EXT_TWEEN[this.getUID()];
                    if (params) {
                        params.timer.stop();
                        setValue(this, params.endValue);
                        params.startValue = params.currValue;
                    }
                    else {
                        params = EXT_TWEEN[this.getUID()] = {};
                        params.startValue = getValue(this);
                    }
                    click.call(this, event);
                    params.endValue = getValue(this);
                    if (params.startValue != params.endValue) {
                        params.currTime = 0;
                        decelerate.call(this);
                        params.timer = new Timer(decelerate, -20, this);
                    }
                };
            }
        };













    core.NORMAL = 0;
    core.INIT   = 1;
    core.PAINT  = 2;

    (function () {
        var ecuiName = 'ecui',        // Element 中用于自动渲染的 ecui 属性名称
            isGlobalId,               // 是否自动将 ecui 的标识符全局化

            flgFixedSize,             // 在计算宽度与高度时，是否需要修正内填充与边框样式的影响
            flgFixedOffset,           // 在计算相对位置时，是否需要修正边框样式的影响
            scrollNarrow,             // 浏览器滚动条相对窄的一边的长度

            initRecursion,            // init 操作的递归次数
            lastClientWidth,          // 浏览器之前的宽度

            plugins = {},             // 扩展组件列表
            maskElements = [],        // 遮罩层组

            mouseX,                   // 当前鼠标光标的X轴坐标
            mouseY,                   // 当前鼠标光标的Y轴坐标
            keyCode,                  // 当前键盘按下的键值，解决keypress与keyup中得不到特殊按键的keyCode的问题

            status = core.INIT,       // 框架当前状态
            allControls = [],         // 全部生成的控件，供释放控件占用的内存使用
            independentControls = [], // 独立的控件，即使用create($create)方法创建的控件
            namedControls,            // 所有被命名的控件的集合
            uniqueIndex = 0,          // 控件的唯一序号
            connectedControls = {},   // 等待关联的控件集合

            selectorControl,          // 在select操作时使用此控件展现选择的部分

            pressedControl,           // 当前环境下被按压的控件
            overedControl,            // 当前鼠标移入的控件
            focusedControl,           // 当前环境下拥有焦点的控件

            envStack = [],            // 高优先级事件调用时，保存上一个事件环境的栈
            currEnv = {               // 当前操作的环境数据对象

                mousedown: function (event) {
                    event = standardEvent(event);

                    // 改变框架中被激活的控件
                    //__transform__control_o
                    var control = event.getTarget();
                    pressedControl = null;
                    if (control) {
                        if (!isScrollClick(event)) {
                            bubble(pressedControl = control, 'mousedown', event);
                            pressedControl.pressstart(event);
                        }
                        else if (ieVersion < 8) {
                            return;
                        }

                        for (; control; control = control.getParent()) {
                            if (control.isFocusable()) {
                                if (!(control != pressedControl && control.contain(focusedControl))) {
                                    setFocused(control);
                                }
                                break;
                            }
                        }
                    }
                    else {
                        if (findControl(event.target)) {
                            event.preventDefault();
                        }
                        setFocused();
                    }
                },

                mouseover: function (event) {
                    // 鼠标移入的处理，首先需要计算是不是位于之前移出的控件之外，如果是需要触发之前的移出事件
                    event = standardEvent(event);

                    //__transform__control_o
                    var control = event.getTarget(),
                        parent = getCommonParent(control, overedControl),
                        allowPress = currEnv.type;

                    // 在拖曳与缩放状态时，不进行按压移入移出的处理
                    allowPress = allowPress != 'drag' && allowPress != 'zoom' && pressedControl &&
                        (!parent || parent.contain(pressedControl));

                    // 对控件及其父控件序列进行移出或移入操作，针对公共的父控件不进行处理
                    bubble(overedControl, 'mouseout', event, parent);
                    if (allowPress && pressedControl.contain(overedControl)) {
                        pressedControl.pressout(event);
                    }
                    bubble(control, 'mouseover', event, parent);
                    if (allowPress && pressedControl.contain(control)) {
                        pressedControl.pressover(event);
                    }

                    overedControl = control;
                },

                mousemove: function (event) {
                    event = standardEvent(event);

                    //__transform__control_o
                    var control = event.getTarget();

                    // 对控件及其父控件序列进行移动操作
                    bubble(control, 'mousemove', event);
                    if (pressedControl && pressedControl.contain(control)) {
                        pressedControl.pressmove(event);
                    }
                },

                mouseup: function (event) {
                    event = standardEvent(event);

                    //__transform__control_o
                    var control = event.getTarget();

                    bubble(control, 'mouseup', event);
                    if (pressedControl) {
                        pressedControl.pressend(event);
                        // 点击事件只在鼠标按下与弹起发生在同一个控件上时触发
                        if (control == pressedControl) {
                            pressedControl.click(event);
                        }
                        pressedControl = null;
                    }
                }
            },

            dragEnv = { // 拖曳操作的环境数据对象
                type: 'drag',

                mousemove: function (event) {
                    event = standardEvent(event);

                    // 计算限制拖拽的范围
                    //__transform__target_o
                    var target = currEnv.target,
                        // 计算期待移到的位置
                        expectX = target.getX() + mouseX - currEnv.x,
                        expectY = target.getY() + mouseY - currEnv.y,
                        // 计算实际允许移到的位置
                        x = MIN(MAX(expectX, currEnv.left), currEnv.right),
                        y = MIN(MAX(expectY, currEnv.top), currEnv.bottom);

                    if (!(target.ondragmove && target.ondragmove(event, x, y) === false ||
                            target.$dragmove(event, x, y) === false)) {
                        target.setPosition(x, y);
                    }

                    currEnv.x = mouseX + target.getX() - expectX;
                    currEnv.y = mouseY + target.getY() - expectY;
                },

                mouseup: function (event) {
                    event = standardEvent(event);

                    //__transform__target_o
                    var target = currEnv.target;
                    if (!(target.ondragend && target.ondragend(event) === false)) {
                        target.$dragend(event);
                    }
                    restore();
                    // 恢复IE浏览器外事件捕获的规则
                    if (ieVersion) {
                        DOCUMENT.body.releaseCapture(false);
                    }
                    currEnv.mouseup(event);
                }
            },

            interceptEnv = { // 强制点击拦截操作的环境数据对象
                type: 'intercept',

                mousedown: function (event) {
                    event = standardEvent(event);

                    //__transform__target_o
                    var target = currEnv.target,
                        env = currEnv,
                        control = event.getTarget();

                    if (!isScrollClick(event)) {
                        if (control && !control.isFocusable()) {
                            // 需要捕获但不激活的控件是高优先级处理的控件
                            bubble(pressedControl = control, 'mousedown', event);
                            pressedControl.pressstart(event);
                        }
                        else if (target.onintercept && target.onintercept(event) === false ||
                                    target.$intercept(event) === false) {
                            if (env == currEnv) {
                                if (control) {
                                    bubble(pressedControl = control, 'mousedown', event);
                                    pressedControl.pressstart(event);
                                }
                            }
                            else {
                                currEnv.mousedown(event);
                            }
                        }
                        else {
                            restore();
                        }
                    }
                }
            },

            zoomEnv = { // 缩放操作的环境数据对象
                type: 'zoom',

                mousemove: function (event) {
                    event = standardEvent(event);

                    //__gzip_original__minWidth
                    //__gzip_original__maxWidth
                    //__gzip_original__minHeight
                    //__gzip_original__maxHeight
                    //__transform__target_o
                    var target = currEnv.target,
                        width = currEnv.width = mouseX - currEnv.x + currEnv.width,
                        height = currEnv.height = mouseY - currEnv.y + currEnv.height,
                        minWidth = currEnv.minWidth,
                        maxWidth = currEnv.maxWidth,
                        minHeight = currEnv.minHeight,
                        maxHeight = currEnv.maxHeight;

                    currEnv.x = mouseX;
                    currEnv.y = mouseY;

                    width = minWidth > width ? minWidth : maxWidth < width ? maxWidth : width;
                    height = minHeight > height ? minHeight : maxHeight < height ? maxHeight : height;

                    // 如果宽度或高度是负数，需要重新计算定位
                    target.setPosition(currEnv.left + MIN(width, 0), currEnv.top + MIN(height, 0));
                    if (!(target.onzoom && target.onzoom(event) === false || target.$zoom(event) === false)) {
                        target.setSize(ABS(width), ABS(height));
                    }
                },

                mouseup: function (event) {
                    event = standardEvent(event);

                    //__transform__target_o
                    var target = currEnv.target;
                    if (!(target.onzoomend && target.onzoomend(event) === false)) {
                        target.$zoomend(event);
                    }
                    restore();
                    if (ieVersion) {
                        DOCUMENT.body.releaseCapture(false);
                    }

                    // 如果是选择框需要关闭
                    if (target == selectorControl) {
                        target.hide();
                    }
                    else {
                        paint();
                    }
                    currEnv.mouseup(event);
                }
            },

            /**
             * 窗体改变大小时的事件处理。
             * 一些特殊情况下，例如包含框架的页面，页面变化时不会触发 onresize 事件，需要手工调用 paint 函数刷新所有的控件大小。
             * @public
             */
            paint = core.paint = function () {
                var i = 0,
                    list = [],
                    o;

                if (ieVersion) {
                    o = (isStrict ? DOCUMENT.documentElement : DOCUMENT.body).clientWidth;
                    if (lastClientWidth != o) {
                        lastClientWidth = o;
                    }
                    else {
                        // 阻止 ie6/7 下的重入
                        return;
                    }
                }

                status = core.PAINT;
                o = currEnv.type;
                mask(false);
                if (o != 'zoom') {
                    // 改变窗体大小需要清空拖拽状态
                    if (o == 'drag') {
                        currEnv.mouseup();
                    }
                    for (o = null; o !== undefined; o = list[i++]) {
                        for (var j = 0, controls = query({parent: o}); o = controls[j++]; ) {
                            if (o.isShow()) {
                                list.push(o);
                            }
                        }
                    }

                    for (i = 0; o = list[i++]; ) {
                        o.paint = blank;
                        o.resize();
                        delete o.paint;
                        if (ieVersion < 8) {
                            // 修复ie6/7下宽度自适应错误的问题
                            o = getStyle(j = o.getBase());
                            if (o.width == 'auto' && o.display == 'block') {
                                j.style.width = '100%';
                            }
                        }
                    }

                    if (ieVersion < 8) {
                        for (; o = list[--i]; ) {
                            j = o.getBase();
                            j.style.width = j.offsetWidth - (flgFixedSize ? o.getInvalidWidth(true) * 2 : 0) + 'px';
                        }
                    }

                    for (i = 0; o = list[i++]; ) {
                        o.cache(true, true);
                    }
                    for (i = 0; o = list[i++]; ) {
                        o.$setSize(o.getWidth(), o.getHeight());
                    }
                }
                if (ieVersion < 8) {
                    new Timer(mask, 0, null, true);
                }
                else {
                    mask(true);
                }
                status = core.NORMAL;
            };

        /**
         * 使一个 DOM 节点与一个 ECUI 控件 在逻辑上绑定。
         * 一个 DOM 节点只能绑定一个 ECUI 控件，多次绑定仅第一次有效，绑定后的 DOM 节点可以通过 getControl 方法得到绑定的 ECUI 控件。使用页面静态初始化(参见 ECUI 使用方式)控件后，如果需要修改 DOM 节点绑定的 ECUI 控件，通过改变 DOM 节点的 ecui 属性值，并调用核心提供的 init 方法初始化，是无效的，请通过 create 方法创建控件后，执行此方法进行绑定。
         * @protected
         *
         * @param {HTMLElement} el Element 对象
         * @param {ecui.ui.Control} control ECUI 控件
         */
        $bind = core.$bind = function (el, control) {
            if (!el.getControl) {
                el._cControl = control;
                el.getControl = getControlByElement;
            }
        };

        /**
         * 为两个 ECUI 控件 建立连接。
         * 使用页面静态初始化或页面动态初始化(参见 ECUI 使用方式)方式，控件创建后，需要的关联控件也许还未创建。$connect 方法提供将指定的函数滞后到对应的控件创建后才调用的模式。如果 targetId 对应的控件还未创建，则调用会被搁置，直到需要的控件创建成功后，再自动执行，参见 create 方法。
         * @protected
         *
         * @param {ecui.ui.Control} caller 发起建立连接请求的 ECUI 控件
         * @param {Function} func 用于建立连接的方法，即通过调用 func.call(caller, ecui.get(targetId)) 建立连接
         * @param {string} targetId 被连接的 ECUI 控件 标识符，即在标签的 ecui 属性中定义的 id 值
         */
        $connect = core.$connect = function (caller, func, targetId) {
            if (targetId) {
                var target = namedControls[targetId];
                if (target) {
                    func.call(caller, target);
                }
                else {
                    (connectedControls[targetId] = connectedControls[targetId] || [])
                        .push({func: func, caller: caller});
                }
            }
        };

        /**
         * 创建 ECUI 控件。
         * $create 方法创建 ECUI 控件，不会自动渲染控件，为了加快渲染速度，应该首先使用 $create 方法创建完所有的控件后，再调用控件的 cache 与 paint 方法渲染控件。params 参数对象支持的属性如下：
         * id        {string} 当前控件的 id，提供给 $connect 与 get 方法使用
         * base      {string} 控件的基本样式，参见 getBaseClass 方法，如果忽略此参数将使用基本 Element 对象的 className 属性
         * element   {HTMLElement} 与控件绑捆的 Element 对象，参见 getBase 方法，如果忽略此参数将创建 Element 对象与控件绑捆
         * parent    {ecui.ui.Control} 父控件对象或者父 Element 对象
         * type      {string} 控件的默认样式，通常情况下省略此参数，使用 "ec-控件名称" 作为控件的默认样式
         * @protected
         *
         * @param {string} type 控件的名称
         * @param {Object} params 初始化参数，参见 ECUI 控件
         * @return {ecui.ui.Control} ECUI 控件
         */
        $create = core.$create = function (type, params) {
            params = params || {};

            //__gzip_original__parent
            //__gzip_original__id
            //__gzip_original__typeClass
            var i = 0,
                parent = params.parent,
                id = params.id,
                // 如果没有指定初始化控件，需要自己生成一个
                el = params.element || createDom(),
                typeClass = params.type,
                o = params.base || '';

            // 如果指定的节点已经初始化，直接返回
            if (el.getControl) {
                return el.getControl();
            }

            params.uid = 'ec-' + ++uniqueIndex;

            el.className +=
                ' ' + (typeClass && typeClass != type ? typeClass : params.type = 'ec-' + type.toLowerCase()) +
                ' ' + o;
            // 如果没有指定基本样式，使用控件的样式作为基本样式
            if (!o) {
                o = el.className.split(/\s+/);
                params.base = o[0] || o[1];
            }

            // 生成并注册控件，调用创建控件的处理函数
            type = new ui[toCamelCase(type.charAt(0).toUpperCase() + type.slice(1))](el, params);

            // 指定了父控件的元素都是不需要自动刷新的
            if (parent) {
                type.setParent(parent);
            }
            else if (o = findControl(getParent(type.getOuter()))) {
                if (!(o.onappend && o.onappend(type) === false || o.$append(type) === false)) {
                    type.$setParent(o);
                }
            }
            else {
                type.$setParent();
            }

            allControls.push(type);
            independentControls.push(type);
            type.create(params);

            if (id) {
                namedControls[id] = type;
                if (isGlobalId) {
                    WINDOW[id] = type;
                }
            }

            // 处理所有的关联操作
            if (el = connectedControls[id]) {
                for (connectedControls[id] = null; o = el[i++]; ) {
                    o.func.call(o.caller, type);
                }
            }

            return type;
        };

        /**
         * 快速创建 ECUI 控件。
         * $fastCreate 方法分解 Element 对象的 className 属性得到样式信息，其中第一个样式为类型样式，第二个样式为基本样式。
         * @protected
         *
         * @param {Function} type 控件的构造函数
         * @param {HTMLElement} el 控件对应的 Element 对象
         * @param {ecui.ui.Control} parent 控件的父控件
         * @param {Object} params 初始化参数，参见 ECUI 控件
         * @return {ecui.ui.Control} ECUI 控件
         */
        $fastCreate = core.$fastCreate = function (type, el, parent, params) {
            var o = el.className.split(' ');

            params = params || {};

            params.uid = 'ec-' + ++uniqueIndex;
            params.type = o[0];
            params.base = o[1];

            // 生成并注册控件，调用创建控件的处理函数
            type = new type(el, params);
            type.$setParent(parent);
            type.create(params);

            allControls.push(type);
            return type;
        };

        /**
         * 注册一个扩展组件。
         * @protected
         *
         * @param {string} name 扩展组件的参数名称
         * @param {Function} func 扩展组件的初始化函数
         */
        $register = core.$register = function (name, func) {
            plugins[name] = func;
        };

        /**
         * 获取高度修正值(即计算 padding, border 样式对 height 样式的影响)。
         * IE 在盒子模型上不完全遵守 W3C 标准，因此，需要使用 calcHeightRevise 方法计算 offsetHeight 与实际的 height 样式之间的修正值。
         * @public
         *
         * @param {CssStyle} style CssStyle 对象
         * @return {number} 高度修正值
         */
        calcHeightRevise = core.calcHeightRevise = function (style) {
            return flgFixedSize ? toNumber(style.borderTopWidth) + toNumber(style.borderBottomWidth) +
                    toNumber(style.paddingTop) + toNumber(style.paddingBottom)
                : 0;
        };

        /**
         * 获取左定位修正值(即计算 border 样式对 left 样式的影响)。
         * opera 等浏览器，offsetLeft 与 left 样式的取值受到了 border 样式的影响，因此，需要使用 calcLeftRevise 方法计算 offsetLeft 与实际的 left 样式之间的修正值。
         * @public
         *
         * @param {HTMLElement} el Element 对象
         * @return {number} 左定位修正值
         */
        calcLeftRevise = core.calcLeftRevise = function (el) {
            //__transform__style_o
            var style = getStyle(el.offsetParent);
            return !firefoxVersion || style.overflow != 'visible' && getStyle(el, 'position') == 'absolute' ?
                toNumber(style.borderLeftWidth) * flgFixedOffset : 0;
        };

        /**
         * 获取上定位修正值(即计算 border 样式对 top 样式的影响)。
         * opera 等浏览器，offsetTop 与 top 样式的取值受到了 border 样式的影响，因此，需要使用 calcTopRevise 方法计算 offsetTop 与实际的 top 样式之间的修正值。
         * @public
         *
         * @param {HTMLElement} el Element 对象
         * @return {number} 上定位修正值
         */
        calcTopRevise = core.calcTopRevise = function (el) {
            //__transform__style_o
            var style = getStyle(el.offsetParent);
            return !firefoxVersion || style.overflow != 'visible' && getStyle(el, 'position') == 'absolute' ?
                toNumber(style.borderTopWidth) * flgFixedOffset : 0;
        };

        /**
         * 获取宽度修正值(即计算 padding,border 样式对 width 样式的影响)。
         * IE 在盒子模型上不完全遵守 W3C 标准，因此，需要使用 calcWidthRevise 方法计算 offsetWidth 与实际的 width 样式之间的修正值。
         * @public
         *
         * @param {CssStyle} style CssStyle 对象
         * @return {number} 宽度修正值
         */
        calcWidthRevise = core.calcWidthRevise = function (style) {
            return flgFixedSize ? toNumber(style.borderLeftWidth) + toNumber(style.borderRightWidth) +
                    toNumber(style.paddingLeft) + toNumber(style.paddingRight)
                : 0;
        };

        /**
         * 释放 ECUI 控件及其子控件占用的内存。
         * @public
         *
         * @param {ecui.ui.Control|HTMLElement} control 需要释放的控件对象或 DOM 节点
         */
        disposeControl = core.dispose = function (control) {
            var i = 0,
                type = control instanceof UI_CONTROL,

                namedMap = {},
                o;

            // 释放激活的控件
            if (type) {
                loseFocus(control);
            }
            else if (focusedControl && contain(control, focusedControl.getOuter())) {
                setFocused(findControl(getParent(control)));
            }

            for (o in namedControls) {
                namedMap[namedControls[o].getUID()] = o;
            }

            for (; o = allControls[i++]; ) {
                if (type ? control.contain(o) : contain(control, o.getOuter())) {
                    o.dispose();
                    remove(independentControls, o);
                    if (o = namedMap[o.getUID()]) {
                        delete namedControls[o];
                    }
                    allControls.splice(--i, 1);
                }
            }
        };

        /**
         * 将指定的 ECUI 控件 设置为拖拽状态。
         * 只有在鼠标左键按下时，才允许调用 drag 方法设置待拖拽的 {'controls'|menu}，在拖拽操作过程中，将依次触发 ondragstart、ondragmove 与 ondragend 事件。range 参数支持的属性如下：
         * top    {number} 控件允许拖拽到的最小Y轴坐标
         * right  {number} 控件允许拖拽到的最大X轴坐标
         * bottom {number} 控件允许拖拽到的最大Y轴坐标
         * left   {number} 控件允许拖拽到的最小X轴坐标
         * @public
         *
         * @param {ecui.ui.Control} control 需要进行拖拽的 ECUI 控件对象
         * @param {Event} event 事件对象
         * @param {Object} range 控件允许拖拽的范围，省略参数时，控件默认只允许在 offsetParent 定义的区域内拖拽，如果 
         *                       offsetParent 是 body，则只允许在当前浏览器可视范围内拖拽
         */
        drag = core.drag = function (control, event, range) {
            if (event.type == 'mousedown') {
                //__gzip_original__currStyle
                var el = control.getOuter(),
                    parent = el.offsetParent,
                    style = getStyle(parent),
                    currStyle = el.style;

                copy(dragEnv, parent.tagName == 'BODY' || parent.tagName == 'HTML' ? getView() : {
                    top: 0,
                    right: parent.offsetWidth - toNumber(style.borderLeftWidth) - toNumber(style.borderRightWidth),
                    bottom: parent.offsetHeight - toNumber(style.borderTopWidth) - toNumber(style.borderBottomWidth),
                    left: 0
                });
                copy(dragEnv, range);
                dragEnv.right = MAX(dragEnv.right - control.getWidth(), dragEnv.left);
                dragEnv.bottom = MAX(dragEnv.bottom - control.getHeight(), dragEnv.top);
                dragEnv.target = control;
                setEnv(dragEnv);

                // 设置样式为absolute，才能拖拽
                currStyle.top = control.getY() + 'px';
                currStyle.left = control.getX() + 'px';
                currStyle.position = 'absolute';

                if (ieVersion) {
                    DOCUMENT.body.setCapture();
                }
                if (!(control.ondragstart && control.ondragstart(event) === false)) {
                    control.$dragstart(event);
                }
            }
        };

        /**
         * 事件对象标准化。
         * event 方法将浏览器产生的鼠标与键盘事件标准化并添加 ECUI 框架需要的信息到事件对象中。标准化的属性如下：
         * pageX           {number} 鼠标的X轴坐标
         * pageY           {number} 鼠标的Y轴坐标
         * which           {number} 触发事件的键盘代码
         * target          {HTMLElement} 触发事件的 Element 对象
         * stopPropagation {Function} 事件停止冒泡
         * preventDefault  {Function} 阻止事件默认的处理
         * getTarget       {Function} 获取事件相关的 ECUI 控件对象
         * @public
         *
         * @param {Event} event 事件对象
         * @return {Event} 标准化后的事件对象
         */
        standardEvent = core.event = function (event) {
            var body = DOCUMENT.body,
                html = getParent(body);

            if (ieVersion) {
                event = WINDOW.event;
                event.pageX = html.scrollLeft + body.scrollLeft - html.clientLeft + event.clientX - body.clientLeft;
                event.pageY = html.scrollTop + body.scrollTop - html.clientTop + event.clientY - body.clientTop;
                event.target = event.srcElement;
                event.which = event.keyCode;
                event.stopPropagation = stopPropagation;
                event.preventDefault = preventDefault;
            }

            event.getTarget = getTarget;

            mouseX = event.pageX;
            mouseY = event.pageY;
            keyCode = event.which || keyCode;

            return event;
        };

        /**
         * 获取指定名称的 ECUI 控件。
         * 使用页面静态初始化或页面动态初始化(参见 ECUI 使用方法)创建的控件，如果在 ecui 属性中指定了 id，就可以通过 get 方法得到控件，也可以在 DOM 对象上使用 getControl 方法。
         * @public
         *
         * @param {string} id ECUI 控件的名称，通过 DOM 节点的 ecui 属性的 id 值定义
         * @return {ecui.ui.Control} 指定名称的 ECUI 控件对象，如果不存在返回 null
         */
        core.get = function (id) {
            if (!namedControls) {
                // 接管事件处理
                for (o in currEnv) {
                    attachEvent(DOCUMENT, o, currEnv[o]);
                }

                namedControls = {};

                // 检测Element宽度与高度的计算方式
                //__gzip_original__body
                var body = DOCUMENT.body,
                    o = getParameters(body, 'data-ecui');

                ecuiName = o.name || ecuiName;
                isGlobalId = o.globalId;

                insertHTML(
                    body,
                    'beforeEnd', 
                    '<div style="position:absolute;overflow:scroll;top:-90px;left:-90px;width:80px;height:80px;' +
                        'border:1px solid"><div style="position:absolute;top:0px;height:90px"></div></div>'
                );
                o = body.lastChild;
                flgFixedSize = o.offsetWidth > 80;
                flgFixedOffset = o.lastChild.offsetTop;
                scrollNarrow = o.offsetWidth - o.clientWidth - 2;
                removeDom(o);
                attachEvent(WINDOW, 'resize', paint);
                attachEvent(WINDOW, 'unload', onunload);
                attachEvent(WINDOW, 'scroll', onscroll);

                // 自动初始化所有节点
                core.init(body);
                status = core.NORMAL;
            }
            return namedControls[id] || null;
        };

        /**
         * 获取当前使用的初始化属性名。
         * getAttributeName 方法返回绑定在 DOM 节点上的自定义属性名称。
         * @public
         *
         * @return {string} 当前使用的初始化属性名
         */
        getAttributeName = core.getAttributeName = function () {
            return ecuiName;
        };

        /**
         * 获取当前拥有焦点的控件。
         * @public
         *
         * @return {ecui.ui.Control} 当前拥有焦点的 ECUI 控件，如果不存在返回 null
         */
        getFocused = core.getFocused = function () {
            return focusedControl || null;
        };

        /**
         * 获取最后一次键盘事件的按键值。
         * getKey 方法返回的是最后一次键盘事件的 keyCode/which 值，用于解决浏览器的 keypress 事件中没有特殊按钮(例如方向键等)取值的问题。
         * @public
         *
         * @return {number} 按键的编码
         */
        getKey = core.getKey = function () {
            return keyCode;
        };

        /**
         * 获取当前鼠标光标的页面/相对于控件内部区域的X轴坐标。
         * getMouseX 方法计算相对于控件内部区域的X轴坐标时，按照 Element 盒子模型的标准，需要减去内层 Element 对象的 borderLeftWidth 样式的值。
         * @public
         *
         * @param {ecui.ui.Control} control ECUI 控件，如果省略参数，将获取鼠标在页面的X轴坐标，否则获取鼠标相对于控件内部区域的X轴坐标
         * @return {number} X轴坐标值
         */
        getMouseX = core.getMouseX = function (control) {
            if (control) {
                control = control.getOuter();
                return mouseX - getPosition(control).left - toNumber(getStyle(control, 'borderLeftWidth'));
            }
            return mouseX;
        };

        /**
         * 获取当前鼠标光标的页面/相对于控件内部区域的Y轴坐标。
         * getMouseY 方法计算相对于控件内部区域的Y轴坐标时，按照 Element 盒子模型的标准，需要减去 内层 Element 对象的 borderTopWidth 样式的值。
         * @public
         *
         * @param {ecui.ui.Control} control ECUI 控件，如果省略参数，将获取鼠标在页面的Y轴坐标，否则获取鼠标相对于控件内部区域的Y轴坐标
         * @return {number} Y轴坐标值
         */
        getMouseY = core.getMouseY = function (control) {
            if (control) {
                control = control.getOuter();
                return mouseY - getPosition(control).top - toNumber(getStyle(control, 'borderTopWidth'));
            }
            return mouseY;
        };

        /**
         * 从 Element 对象中获取 ecui 参数对象。
         * @public
         *
         * @param {HTMLElement} el Element 对象
         * @param {string} attributeName 参数的属性名称，如果省略使用 ecuiName
         * @return {Object} 参数对象
         */
        getParameters = core.getParameters = function (el, attributeName) {
            attributeName = attributeName || ecuiName;

            var text = el.getAttribute(attributeName),
                params = {};

            if (text) {
                for (el.removeAttribute(attributeName); /\s*([\w-]+)\s*(:\s*|:\s*([^;]+)\s*)?($|;)/.test(text); ) {
                    text = REGEXP["$'"];

                    el = REGEXP.$3;
                    params[toCamelCase(REGEXP.$1)] =
                        !el || el == 'true' ? true : el == 'false' ? false : ISNAN(el - 0) ? el : el - 0;
                }
            }

            return params;
        };

        /**
         * 获取当前处于按压状态的 ECUI 控件。
         * 控件的按压状态，指的是鼠标在控件上按下，到松开的全过程，之间无论鼠标移动到哪个位置，被按压的控件对象都不会发生改变。
         * @public
         *
         * @return {ecui.ui.Control} 处于按压状态的 ECUI 控件，如果不存在返回 null
         */
        getPressed = core.getPressed = function () {
            return pressedControl || null;
        };

        /**
         * 获取浏览器滚动条相对窄的一边的长度。
         * getScrollNarrow 方法对于垂直滚动条，返回的是滚动条的宽度，对于水平滚动条，返回的是滚动条的高度。
         * @public
         *
         * @return {number} 浏览器滚动条相对窄的一边的长度
         */
        getScrollNarrow = core.getScrollNarrow = function () {
            return scrollNarrow;
        };

        /**
         * 获取框架当前的状态。
         * getStatus 方法返回框架当前的工作状态，目前支持三类工作状态：NORMAL(正常状态)、INIT(加载状态)与PAINT(刷新状态)
         * @public
         *
         * @return {boolean} 框架当前的状态
         */
        getStatus = core.getStatus = function () {
            return status;
        };

        /**
         * 初始化指定的 DOM 节点及它的子节点。
         * init 方法将初始化指定的 DOM 节点及它的子节点，如果这些节点拥有初始化属性(ecui)，将按照规则为它们绑定 ECUI 控件，每一个节点只会被绑定一次，重复的绑定无效。页面加载完成时，将会自动针对 document.body 执行这个方法，相当于自动执行以下的语句：ecui.init(document.body)
         * @public
         *
         * @param {Element} el Element 对象
         */
        core.init = function (el) {
            var i = 0,
                list = [],
                params = el.all || el.getElementsByTagName('*'),
                elements = [el],
                o;

            if (!initRecursion++) {
                detachEvent(WINDOW, 'resize', paint);
            }

            // 自动初始化控件
            for (; o = params[i++]; ) {
                elements[i] = o;
            }

            for (i = 0; el = elements[i]; i++) {
                if (getParent(el)) {
                    params = getParameters(el);
                    params.element = el;
                    // 以下使用 el 替代 control
                    if (el = params.type) {
                        list.push(el = $create(el, params));
                    }
                    for (o in plugins) {
                        if (params[o]) {
                            plugins[o](el, params[o]);
                        }
                        el instanceof UI_CONTROL && el['$init' + o] && el['$init' + o](params);

                    }
                }
            }

            for (i = 0; o = list[i++]; ) {
                o.cache();
            }
            for (i = 0; o = list[i++]; ) {
                o.init();
            }

            if (!(--initRecursion)) {
                attachEvent(WINDOW, 'resize', paint);
            }
        };

        /**
         * 设置框架拦截之后的一次点击，并将点击事件发送给指定的 ECUI 控件。
         * intercept 方法将下一次的鼠标点击事件转给指定控件的 $intercept 方法处理，相当于拦截了一次框架的鼠标事件点击操作，框架其它的状态不会自动改变，例如拥有焦点的控件不会改变。如果 $intercept 方法不返回 false，将自动调用 restore 方法。
         * @public
         *
         * @param {ecui.ui.Control} control ECUI 控件
         */
        intercept = core.intercept = function (control) {
            interceptEnv.target = control;
            setEnv(interceptEnv);
        };

        /**
         * 判断容器大小是否需要修正(即计算 padding, border 样式对 width, height 样式的影响)。
         * @public
         *
         * @return {boolean} 容器大小是否需要修正
         */
        isFixedSize = core.isFixedSize = function () {
            return flgFixedSize;
        };

        /**
         * 使控件失去焦点。
         * 如果控件及它的子控件没有焦点，执行 loseFocus 方法系统的状态将不会产生变化。如果控件或它的子控件拥有焦点，执行 loseFocus 方法后先失去焦点，然后设置控件的父控件获得焦点，父控件不存在时，设置焦点操作无效。如果控件从拥有焦点状态变为了未拥有焦点状态，则触发 onblur 事件，它不完全是 setFocused 方法的逆向行为。
         * @public
         *
         * @param {ecui.ui.Control} control ECUI 控件
         */
        loseFocus = core.loseFocus = function (control) {
            if (control.contain(focusedControl)) {
                setFocused(control.getParent());
            }
        };

        /**
         * 使用一个层遮罩整个浏览器可视化区域。
         * 遮罩层的 z-index 样式默认取值为 32767，请不要将 Element 对象的 z-index 样式设置大于 32767。
         * @public
         *
         * @param {number} opacity 透明度，如 0.5，如果省略参数将关闭遮罩层
         * @param {number} zIndex 遮罩层的 zIndex 样式值，如果省略使用 32767
         */
        mask = core.mask = function (opacity, zIndex) {
            //__gzip_original__body
            var i = 0,
                body = DOCUMENT.body,
                o = getView(),
                top = MAX(o.top - o.height * 2, 0),
                left = MAX(o.left - o.width * 2, 0),
                text = ';top:' + top + 'px;left:' + left +
                    'px;width:' + MIN(o.width * 5, o.maxWidth - left) +
                    'px;height:' + MIN(o.height * 5, o.maxHeight - top) + 'px;display:';

            if ('boolean' == typeof opacity) {
                text += opacity ? 'block' : 'none'; 
                for (; o = maskElements[i++]; ) {
                    o.style.cssText += text;
                }
            }
            else if (opacity === undefined) {
                removeDom(maskElements.pop());
                if (!maskElements.length) {
                    removeClass(body, 'mask');
                }
            }
            else {
                if (!maskElements.length) {
                    addClass(body, 'mask');
                }
                maskElements.push(o = body.appendChild(createDom(
                    '',
                    'position:absolute;background-color:#000;z-index:' + (zIndex || 32767)
                )));
                setStyle(o, 'opacity', opacity);
                o.style.cssText += text + 'block';
            }
        };

        /**
         * 查询满足条件的控件列表。
         * query 方法允许按多种条件组合查询满足需要的控件，如果省略条件表示不进行限制。condition参数对象支持的属性如下：
         * type   {Function} 控件的类型构造函数
         * parent {ecui.ui.Control} 控件的父控件对象
         * custom {Function} 自定义查询函数，传入的参数是控件对象
         * @public
         *
         * @param {Object} condition 查询条件，如果省略将返回全部的控件
         * @param {Array} 控件列表
         */
        query = core.query = function (condition) {
            condition = condition || {};

            //__gzip_original__parent
            for (
                var i = 0,
                    result = [],
                    parent = condition.parent,
                    custom = condition.custom,
                    o;
                o = independentControls[i++];
            ) {
                if ((!condition.type || (o instanceof condition.type)) &&
                        (parent === undefined || (o.getParent() == parent)) && (!custom || custom(o))) {
                    result.push(o);
                }
            }

            return result;
        };

        /**
         * 恢复当前框架的状态到上一个状态。
         * restore 用于恢复调用特殊操作如 drag、intercept 与 zoom 后改变的框架环境，包括各框架事件处理函数的恢复、控件的焦点设置等。
         * @public
         */
        restore = core.restore = function () {
            setHandler(currEnv, true);
            setHandler(currEnv = envStack.pop());
        };

        /**
         * 将指定的控件设置为选择状态。
         * select 方法将控件设置为选择，显示选择框并对选择框调用 zoom 方法。调用它会触发控件对象的 onselectstart 事
         * 件，在整个 select 的周期中，还将触发 onselect 与 onselectend 事件，在释放鼠标按键时选择操作周期结束。
         * @public
         *
         * @param {ecui.ui.Control} control ECUI 控件
         * @param {Event} event 事件对象
         * @param {string} className 选择框的样式名称，如果省略将使用 ec-selector
         */
        core.select = function (control, event, className) {
            function build(name) {
                selectorControl['$zoom' + name] = function (event) {
                    if (!(control['onselect' + name] && control['onselect' + name](event) === false)) {
                        control['$select' + name](event);
                    }
                };
            }

            if (event.type == 'mousedown') {

                if (!selectorControl) {
                    insertHTML(
                        DOCUMENT.body,
                        'beforeEnd',
                        '<div class="ec-control ec-selector" style="overflow:hidden"><div class="ec-selector-box">' +
                            '</div></div>'
                    );
                    selectorControl = $fastCreate(UI_CONTROL, DOCUMENT.body.lastChild);

                    selectorControl.$setSize = function (width, height) {
                        //__gzip_original__style
                        var el = this.getOuter().firstChild,
                            style = el.style;
                        UI_CONTROL_CLASS.$setSize.call(this, width, height);

                        style.width = MAX(1, width - calcWidthRevise(el)) + 'px';
                        style.height = MAX(1, height - calcHeightRevise(el)) + 'px';
                    };
                }

                build('start');
                build('');
                build('end');

                // 设置选择框的初始信息
                selectorControl.setPosition(mouseX, mouseY);
                selectorControl.setSize(1, 1);
                selectorControl.setClass(className || 'ec-selector');
                selectorControl.show();

                core.zoom(selectorControl, event);
            }

            event = null;
        };

        /**
         * 使 ECUI 控件 得到焦点。
         * setFocused 方法会将焦点状态设置到指定的控件，允许不指定需要获得焦点的控件，则当前拥有焦点的控件将失去焦点，需要当前获得焦点的控件失去焦点还可以调用 loseFocus 方法。获得焦点的控件触发 onfocus 事件，失去焦点的控件触发 onblur 事件。需要注意的是，如果控件拥有焦点，当通过 setFocused 方法设置它的子控件获得焦点时，虽然焦点对应的控件对象发生了变化，但是控件并不会触发 onblur 方法，此时控件逻辑上仍然处于拥有焦点状态。
         * @public
         *
         * @param {ecui.ui.Control} control ECUI 控件
         */
        setFocused = core.setFocused = function (control) {
            var parent = getCommonParent(focusedControl, control);

            // 对不重复的部分进行获得或失去焦点操作
            bubble(focusedControl, 'blur', null, parent);
            bubble(focusedControl = control, 'focus', null, parent);
        };

        /**
         * 将指定的 ECUI 控件 设置为缩放状态。
         * zoom 方法将控件设置为缩放，缩放的值允许负数，用于表示反向的缩放，调用它会触发控件对象的 onzoomstart 事件，在整个 zoom 的周期中，还将触发 onzoom 与 onzoomend 事件，在释放鼠标按键时缩放操作周期结束。range 参数支持的属性如下：
         * minWidth  {number} 控件允许缩放的最小宽度 
         * maxWidth  {number} 控件允许缩放的最大宽度 
         * minHeight {number} 控件允许缩放的最小高度 
         * maxHeight {number} 控件允许缩放的最大高度 
         * @public
         *
         * @param {ecui.ui.Control} control ECUI 控件
         * @param {Event} event 事件对象
         * @param {Object} range 控件允许的缩放范围参数
         */
        core.zoom = function (control, event, range) {
            if (event.type == 'mousedown') {

                control.getOuter().style.position = 'absolute';

                // 保存现场环境
                if (range) {
                    copy(zoomEnv, range);
                }
                zoomEnv.top = control.getY();
                zoomEnv.left = control.getX();
                zoomEnv.width = control.getWidth();
                zoomEnv.height = control.getHeight();
                zoomEnv.target = control;
                setEnv(zoomEnv);

                if (ieVersion) {
                    DOCUMENT.body.setCapture();
                }
                if (!(control.onzoomstart && control.onzoomstart(event) === false)) {
                    control.$zoomstart(event);
                }
            }
        };

        /**
         * 键盘事件处理。
         * @private
         *
         * @param {Event} event 事件对象
         */
        currEnv.keydown = currEnv.keypress = currEnv.keyup = function (event) {
            event = standardEvent(event);
            for (var o = focusedControl; o; o = o.getParent()) {
                if (o[event.type](event) === false) {
                    event.preventDefault();
                    break;
                }
            }
        };

        /**
         * 双击事件处理。
         * @private
         *
         * @param {Event} event 事件对象
         */
        if (ieVersion) {
            currEnv.dblclick = function (event) {
                currEnv.mousedown(event);
                currEnv.mouseup(event);
            };
        }

        /**
         * 滚轮事件处理。
         * @private
         *
         * @param {Event} event 事件对象
         */
        currEnv[firefoxVersion ? 'DOMMouseScroll' : 'mousewheel'] = function (event) {
            event = standardEvent(event);
            if (event.detail === undefined) {
                event.detail = event.wheelDelta / -40;
            }

            // 拖拽状态下，不允许滚动
            if (currEnv.type == 'drag' || bubble(overedControl, 'mousewheel', event) === false ||
                    bubble(focusedControl, 'mousewheel', event) === false) {
                event.preventDefault();
            }
        };

        /**
         * 冒泡处理控件事件。
         * @private
         *
         * @param {ecui.ui.Control} start 开始冒泡的控件
         * @param {string} name 控件调用的函数名称
         * @param {ecui.ui.Control} end 终止冒泡的控件，如果不设置将一直冒泡至顶层
         * @param {Event} 事件对象
         * @return {boolean} 如果返回 false 表示在中途被停止冒泡
         */
        function bubble(start, name, event, end) {
            for (; start != end; start = start.getParent()) {
                if (start[name](event) === false) {
                    return false;
                }
            }
        }

        /**
         * 获取两个控件的公共父控件。
         * @private
         *
         * @param {ecui.ui.Control} control1 控件1
         * @param {ecui.ui.Control} control2 控件2
         * @return {ecui.ui.Control} 公共的父控件，如果没有，返回 null
         */
        function getCommonParent(control1, control2) {
            if (control1 != control2) {
                var i = 0,
                    list1 = [],
                    list2 = [];

                // 向序列中填充父控件
                for (; control1; control1 = control1.getParent()) {
                    list1.push(control1);
                }
                for (; control2; control2 = control2.getParent()) {
                    list2.push(control2);
                }

                list1.reverse();
                list2.reverse();

                // 过滤父控件序列中重复的部分
                for (; list1[i] == list2[i]; i++) {};
                control1 = list1[i - 1];
            }

            return control1 || null;
        }

        /**
         * 从一个 DOM 节点上获取绑定的 ECUI 控件，参见 $bind 方法。
         * @private
         *
         * @return {ecui.ui.Control} ECUI 控件
         */
        function getControlByElement() {
            return this._cControl;
        }

        /**
         * 获取触发事件的控件对象
         * @private
         *
         * @return {ecui.ui.Control} 控件对象
         */
        function getTarget() {
            var o = findControl(this.target);
            if (o && o.isEnabled()) {
                for (; o; o = o.getParent()) {
                    if (o.isCapture()) {
                        return o;
                    }
                }
            }
            return null;
        }

        /**
         * 判断点击是否发生在滚动条区域。
         * @private
         *
         * @param {Event} event 事件对象
         * @return {boolean} 点击是否发生在滚动条区域
         */
        function isScrollClick(event) {
            var target = event.target,
                pos = getPosition(target),
                style = getStyle(target);
            return event.pageX - pos.left - toNumber(style.borderLeftWidth) >= target.clientWidth !=
                event.pageY - pos.top - toNumber(style.borderTopWidth) >= target.clientHeight;
        }

        /**
         * 窗体滚动时的事件处理。
         * @private
         */
        function onscroll() {
            mask(true);
        }

        /**
         * 页面关闭时释放占用的空间，防止内存泄漏。
         * @private
         */
        function onunload() {
            for (var i = 0, o; o = allControls[i++]; ) {
                try {
                    o.dispose();
                }
                catch (e) {
                }
            }

            // 清除闭包中引用的 Element 对象
            DOCUMENT = maskElements = null;
        }

        /**
         * 阻止事件的默认处理。
         * @private
         */
        function preventDefault() {
            this.returnValue = false;
        }

        /**
         * 设置 ecui 环境。
         * @private
         *
         * @param {Object} env 环境描述对象
         */
        function setEnv(env) {
            var o = {};
            setHandler(currEnv, true);

            copy(o, currEnv);
            copy(o, env);
            o.x = mouseX;
            o.y = mouseY;
            setHandler(o);

            envStack.push(currEnv);
            currEnv = o;
        }

        /**
         * 设置document节点上的鼠标事件。
         * @private
         *
         * @param {Object} env 环境描述对象，保存当前的鼠标光标位置与document上的鼠标事件等
         * @param {boolean} remove 如果为true表示需要移除data上的鼠标事件，否则是添加鼠标事件
         */
        function setHandler(env, remove) {
            for (var i = 0, func = remove ? detachEvent : attachEvent, o; i < 5; ) {
                if (env[o = eventNames[i++]]) {
                    func(DOCUMENT, o, env[o]);
                }
            }
        }

        /**
         * 事件停止冒泡。
         * @private
         */
        function stopPropagation() {
            this.cancelBubble = true;
        }

        ready(core.get);
    })();


/*
Control - ECUI 的核心组成部分，定义了基本的控件行为。
基础控件是 ECUI 的核心组成部分，对 DOM 树上的节点区域进行封装。基础控件扩展了 Element 节点的标准事件(例如得到与失去焦
点、鼠标按压事件等)，提供了方法对控件的基本属性(例如控件大小、位置与显示状态等)进行改变，是一切控件实现的基础。基本控
件支持四种状态：得到焦点(focus)、鼠标移入(over)、按压时鼠标移入(press)与失效(disabled)

基本控件直接HTML初始化的例子，id指定名称，可以通过ecui.get(id)的方式访问控件:
<div ecui="type:control;id:test">
    <!-- 这里控件包含的内容 -->
    ...
</div>

属性
_bCapture                - 控件是否响应浏览器事件状态
_bFocusable              - 控件是否允许获取焦点状态
_bEnabled                - 控件的状态，为false时控件不处理任何事件
_bCache                  - 是否处于缓存状态
_nWidth                  - 控件的宽度缓存
_nHeight                 - 控件的高度缓存
_sUID                    - 控件的ID
_sBaseClass              - 控件定义时的基本样式
_sClass                  - 控件当前使用的样式
_sType                   - 控件的类型样式，通常是ec-控件类型
_sWidth                  - 控件的基本宽度值，可能是百分比或者空字符串
_sHeight                 - 控件的基本高度值，可能是百分比或者空字符串
_sDisplay                - 控件的布局方式，在hide时保存，在show时恢复
_eBase                   - 控件的基本标签对象
_eBody                   - 控件用于承载子控件的载体标签，通过setBodyElement函数设置这个值，绑定当前控件
_cParent                 - 父控件对象
$cache$borderTopWidth    - 上部边框线宽度缓存
$cache$borderLeftWidth   - 左部边框线宽度缓存
$cache$borderRightWidth  - 右部边框线宽度缓存
$cache$borderBottomWidth - 下部边框线宽度缓存
$cache$paddingTop        - 上部内填充宽度缓存
$cache$paddingLeft       - 左部内填充宽度缓存
$cache$paddingRight      - 右部内填充宽度缓存
$cache$paddingBottom     - 下部内填充宽度缓存
$cache$position          - 控件布局方式缓存
*/


    /**
     * 控件失去焦点事件的默认处理。
     * 控件失去焦点时默认调用 $blur 方法，删除控件在 $focus 方法中添加的扩展样式 -focus。如果控件处于可操作状态(参见 isEnabled)，blur 方法触发 onblur 事件，如果事件返回值不为 false，则调用 $blur 方法。
     * @protected
     */
    UI_CONTROL_CLASS.$blur = function () {
        this.alterClass('focus', true);
    };

    /**
     * 计算控件的缓存。
     * 控件缓存部分核心属性的值，提高控件属性的访问速度，在子控件或者应用程序开发过程中，如果需要避开控件提供的方法(setSize、alterClass 等)直接操作 Element 对象，操作完成后必须调用 clearCache 方法清除控件的属性缓存，否则将引发错误。
     * @protected
     *
     * @param {CssStyle} style 基本 Element 对象的 Css 样式对象
     * @param {boolean} cacheSize 是否需要缓存控件大小，如果控件是另一个控件的部件时，不缓存大小能加快渲染速度，默认缓存
     */
    UI_CONTROL_CLASS.$cache = function (style, cacheSize) {
        //__gzip_original__el
        for (
            var i = 0,
                list = [
                    'borderTopWidth', 'borderLeftWidth', 'borderRightWidth', 'borderBottomWidth',
                    'paddingTop', 'paddingLeft', 'paddingRight', 'paddingBottom'
                ],
                el = this._eBase,
                fixedSize = isFixedSize(),
                o;
            o = list[i++];
        ) {
            this['$cache$' + o] = toNumber(style[o]);
        }

        this.$cache$position = style.position;

        if (cacheSize !== false) {
            this._nWidth =
                el.offsetWidth ||
                    toNumber(style.width || el.style.width) + (fixedSize ? this.getInvalidWidth(true) : 0);
            this._nHeight =
                el.offsetHeight ||
                    toNumber(style.height || el.style.height) + (fixedSize ? this.getInvalidHeight(true) : 0);
        }
    };

    /**
     * 销毁控件的默认处理。
     * 页面卸载时将销毁所有的控件，释放循环引用，防止在 IE 下发生内存泄漏，$dispose 方法的调用不会受到 ondispose 事件返回值的影响。
     * @protected
     */
    UI_CONTROL_CLASS.$dispose = function () {
        this._eBase.getControl = undefined;
        this._eBase = this._eBody = null;
    };

    /**
     * 控件获得焦点事件的默认处理。
     * 控件获得焦点时默认调用 $focus 方法，调用 alterClass 方法为控件添加扩展样式 -focus。如果控件处于可操作状态(参见 isEnabled)，focus 方法触发 onfocus 事件，如果事件返回值不为 false，则调用 $focus 方法。
     * @protected
     */
    UI_CONTROL_CLASS.$focus = function () {
        this.alterClass('focus');
    };

    /**
     * 获取指定的部件。
     * $getSection 方法返回控件的一个部件对象，部件对象也是 ECUI 控件，是当前控件的组成成份，不可缺少，请不要轻易的对部件对象进行操作。
     * @protected
     *
     * @param {string} name 部件名称
     * @return {ecui.ui.Control} 部件对象
     */
    UI_CONTROL_CLASS.$getSection = function (name) {
        return this['_u' + name];
    };

    /**
     * 隐藏控件。
     * @protected
     */
    UI_CONTROL_CLASS.$hide = function () {
        if (this._sDisplay === undefined) {
            var style = this.getOuter().style;
            // 保存控件原来的 display 值，在显示时使用
            this._sDisplay = style.display;
            style.display = 'none';
            // 如果控件拥有焦点，设置成隐藏状态时需要失去焦点
            loseFocus(this);
        }
    };

    /**
     * 控件渲染完成后初始化的默认处理。
     * $init 方法在控件渲染完成后调用，参见 create 与 init 方法。
     * @protected
     */
    UI_CONTROL_CLASS.$init = function () {
        this.setEnabled(this._bEnabled);
        this.$setSize(this.getWidth(), this.getHeight());

        if (this.$ready) {
            if (getStatus() != core.INIT) {
                this.$ready();
            }
            else {
                if (!UI_CONTROL_READY_LIST) {
                    UI_CONTROL_READY_LIST = [];
                    new Timer(function () {
                        for (var i = 0, o; o = UI_CONTROL_READY_LIST[i++]; ) {
                            o.$ready();
                        }
                        UI_CONTROL_READY_LIST = null;
                    });
                }
                UI_CONTROL_READY_LIST.push(this);
            }
        }
    };

    /**
     * 设置控件容器内部定位化。
     * $locate 方法执行后，容器内部 DOM 节点的 position 属性设置成 absolute 时将相对基本 Element 对象定位。
     * @protected
     */
    UI_CONTROL_CLASS.$locate = function () {
        if (this.$cache$position != 'absolute') {
            this._eBase.style.position = this.$cache$position = 'relative';
        }
    };

    /**
     * 鼠标移出控件区域事件的默认处理。
     * 鼠标移出控件区域时默认调用 $mouseout 方法，删除控件在 $mouseover 方法中添加的扩展样式 -over。如果控件处于可操作状态(参见 isEnabled)，mouseout 方法触发 onmouseout 事件，如果事件返回值不为 false，则调用 $mouseout 方法。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_CONTROL_CLASS.$mouseout = function () {
        this.alterClass('over', true);
    };

    /**
     * 鼠标移入控件区域事件的默认处理。
     * 鼠标移入控件区域时默认调用 $mouseover 方法，调用 alterClass 方法为控件添加扩展样式 -over。如果控件处于可操作状态(参见 isEnabled)，mouseover 方法触发 onmouseover 事件，如果事件返回值不为 false，则调用 $mouseover 方法。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_CONTROL_CLASS.$mouseover = function () {
        this.alterClass('over');
    };

    /**
     * 控件按压状态结束或控件按压状态中鼠标移出控件区域事件的默认处理。
     * 鼠标左键按压控件结束或控件按压状态中鼠标移出控件区域时默认调用 $pressend/$pressout 方法，删除控件在 $pressstart/$pressover 方法中添加的扩展样式 -press。如果控件处于可操作状态(参见 isEnabled)，pressend/pressout 方法触发 onpressend/onpressout 事件，如果事件返回值不为 false，则调用 $pressend/$pressout 方法。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_CONTROL_CLASS.$pressend = UI_CONTROL_CLASS.$pressout = function () {
        this.alterClass('press', true);
    };

    /**
     * 控件按压状态开始或控件按压状态中鼠标移入控件区域事件的默认处理。
     * 鼠标左键按压控件开始或控件按压状态中鼠标移入控件区域时默认调用 $pressstart/$pressover 方法，调用 alterClass 方法为控件添加扩展样式 -press。如果控件处于可操作状态(参见 isEnabled)，pressstart/pressover 方法触发 onpressstart/onpressover 事件，如果事件返回值不为 false，则调用 $pressstart/$pressover 方法。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_CONTROL_CLASS.$pressover = UI_CONTROL_CLASS.$pressstart = function () {
        this.alterClass('press');
    };

    /**
     * 控件大小发生变化的默认处理。
     * @protected
     */
    UI_CONTROL_CLASS.$resize = function () {
        //__gzip_original__el
        //__gzip_original__currStyle
        var el = this._eBase,
            currStyle = el.style;

        currStyle.width = this._sWidth;
        if (ieVersion < 8 && getStatus() != core.PAINT) {
            // 如果此时浏览器在进行整体的刷新重绘，则不进入此分支
            var style = getStyle(el);
            if (style.width == 'auto' && style.display == 'block') {
                currStyle.width = '100%';
                currStyle.width = el.offsetWidth - (isFixedSize() ? this.getInvalidWidth(true) * 2 : 0) + 'px';
            }
        }
        currStyle.height = this._sHeight;
        this.paint();
    };

    /**
     * 设置控件内层的 Element 对象。
     * ECUI 的控件逻辑上分为外层 Element 对象、基本 Element 对象与内层 Element 对象，外层对象用于控制控件自身布局，基本对象是控件生成时捆绑的 Element 对象，而内层对象用于控制控件对象的子控件与文本布局，通常情形下三者是同一个 Element 对象。
     * @protected
     *
     * @param {HTMLElement} el Element 对象
     */
    UI_CONTROL_CLASS.$setBody = function (el) {
        this._eBody = el;
    };

    /**
     * 设置控件内层 Element 对象的 innerHTML 属性。
     * @protected
     *
     * @param {string} innerHTML HTML 片断
     */
    UI_CONTROL_CLASS.$setBodyHTML = function (innerHTML) {
        this._eBody.innerHTML = innerHTML;
    };

    /**
     * 直接设置父控件。
     * 与 setParent 方法最大的不同，$setParent 方法仅设置控件对象逻辑上的父对象，不进行任何逻辑上的检查，用于某些特殊情况下的设定，如下拉框控件中的选项框子控件需要使用 $setParent 方法设置它的逻辑父控件为下拉框控件。
     * @protected
     *
     * @param {ecui.ui.Control} parent ECUI 控件对象
     */
    UI_CONTROL_CLASS.$setParent = function (parent) {
        this._cParent = parent;
    };

    /**
     * 设置控件的大小。
     * $setSize 方法设置控件实际的大小，不改变其它的如缓存等信息。
     * @protected
     *
     * @param {number} width 宽度，如果不需要设置则将参数设置为等价于逻辑非的值
     * @param {number} height 高度，如果不需要设置则省略此参数
     */
    UI_CONTROL_CLASS.$setSize = function (width, height) {
        //__gzip_original__style
        var style = this._eBase.style,
            flgFixedSize = isFixedSize();

        if (width) {
            style.width = width - (flgFixedSize ? this.getInvalidWidth(true) : 0) + 'px';
            this._nWidth = width;
        }

        if (height) {
            style.height = height - (flgFixedSize ? this.getInvalidHeight(true) : 0) + 'px';
            this._nHeight = height;
        }
    };

    /**
     * 显示控件。
     * @protected
     */
    UI_CONTROL_CLASS.$show = function () {
        this.getOuter().style.display = this._sDisplay || '';
        this._sDisplay = undefined;
    };

    /**
     * 为控件增加/删除一个扩展样式。
     * @public
     *
     * @param {string} className 扩展样式的尾缀
     * @param {boolean} isRemoved 为 true 时删除样式，否则新增样式
     */
    UI_CONTROL_CLASS.alterClass = function (className, isRemoved) {
        (isRemoved ? removeClass : addClass)(
            this._eBase,
            this._sType + '-' + className + ' ' + this._sClass + '-' + className
        );
    };

    /**
     * 计算控件的缓存。
     * 控件缓存部分核心属性的值，提高控件属性的访问速度，在子控件或者应用程序开发过程中，如果需要避开控件提供的方法(setSize、alterClass 等)直接操作 Element 对象，操作完成后必须调用 clearCache 方法清除控件的属性缓存，否则将引发错误。
     * @public
     *
     * @param {boolean} cacheSize 是否需要缓存控件大小，如果控件是另一个控件的部件时，不缓存大小能加快渲染速度，默认缓存
     * @param {boolean} force 是否需要强制刷新缓存，相当于执行了 clearCache 方法，默认不强制刷新
     */
    UI_CONTROL_CLASS.cache = function (cacheSize, force) {
        if (force || !this._bCache) {
            this._bCache = true;
            this.$cache(getStyle(this._eBase), cacheSize);
        }
    };

    /**
     * 清除控件的缓存。
     * 控件缓存部分核心属性的值，提高控件属性的访问速度，在子控件或者应用程序开发过程中，如果需要避开控件提供的方法(setSize、alterClass 等)直接操作 Element 对象，操作完成后必须调用 clearCache 方法清除控件的属性缓存，否则将引发错误。
     * @public
     */
    UI_CONTROL_CLASS.clearCache = function () {
        this._bCache = false;
    };

    /**
     * 判断当前控件是否包含指定的控件。
     * contain 方法判断指定的控件是否逻辑上属于当前控件的内部区域，即通过反复调用控件的 getParent 方法是否能得到当前控件。
     * @public
     *
     * @param {ecui.ui.Control} control ECUI 控件
     * @return {boolean} 是否包含指定的控件
     */
    UI_CONTROL_CLASS.contain = function (control) {
        for (; control; control = control._cParent) {
            if (control == this) {
                return true;
            }
        }
        return false;
    };

    /**
     * 销毁控件。
     * dispose 方法触发 ondispose 事件，然后调用 $dispose 方法，dispose 方法在页面卸载时会被自动调用，通常不需要直接调用。
     * @public
     */
    UI_CONTROL_CLASS.dispose = function () {
        try {
            if (this.ondispose) {
                this.ondispose();
            }
        }
        catch (e) {
        }
        this.$dispose();
    };

    /**
     * 获取控件的基本 Element 对象。
     * getBase 方法返回控件生成时捆绑的 Element 对象，参见 create 方法。
     * @public
     *
     * @return {HTMLElement} Element 对象
     */
    UI_CONTROL_CLASS.getBase = function () {
        return this._eBase;
    };

    /**
     * 获取控件的基本样式。
     * getBaseClass 方法返回控件生成时捆绑的样式，参见 create 方法。与调用 getClass 方法返回当前样式的区别在于，基本样式不会改变，而当前样式允许通过 setClass 方法来设置。
     * @public
     *
     * @return {string} 控件的基本样式
     */
    UI_CONTROL_CLASS.getBaseClass = function () {
        return this._sBaseClass;
    };

    /**
     * 获取控件内层的 Element 对象。
     * getBody 方法返回用于控制子控件与文本布局的内层 Element 对象。
     * @public
     *
     * @return {HTMLElement} Element 对象
     */
    UI_CONTROL_CLASS.getBody = function () {
        return this._eBody;
    };

    /**
     * 获取控件内层可使用区域的高度。
     * getBodyHeight 方法返回能被子控件与文本填充的控件区域高度，相当于盒子模型的 content 区域的高度。
     * @public
     *
     * @return {number} 控件内层可使用区域的宽度
     */
    UI_CONTROL_CLASS.getBodyHeight = function () {
        return this.getHeight(true) - this.getInvalidHeight(true);
    };

    /**
     * 获取控件内层可使用区域的宽度。
     * getBodyWidth 方法返回能被子控件与文本填充的控件区域宽度，相当于盒子模型的 content 区域的宽度。
     * @public
     *
     * @return {number} 控件内层可使用区域的宽度
     */
    UI_CONTROL_CLASS.getBodyWidth = function () {
        return this.getWidth(true) - this.getInvalidWidth(true);
    };

    /**
     * 获取控件的当前样式。
     * getClass 方法返回控件当前使用的样式，在调用 alterClass 方法时，当前样式与默认样式会被添加样式后缀，从而实现控件状态的样式变更。与调用 getBaseClass 方法返回基本样式的区别在于，基本样式不会改变，而当前样式允许通过 setClass 方法来设置。
     * @public
     *
     * @return {string} 控件的当前样式
     */
    UI_CONTROL_CLASS.getClass = function () {
        return this._sClass;
    };

    /**
     * 获取控件区域的高度。
     * @public
     *
     * @return {number} 控件的高度
     */
    UI_CONTROL_CLASS.getHeight = function () {
        this.cache();
        return this._nHeight;
    };

    /**
     * 获取控件的无效高度，即控件与控件内部区域高度的差值。
     * @public
     *
     * @return {number} 控件的无效高度
     */
    UI_CONTROL_CLASS.getInvalidHeight = function () {
        this.cache();
        return this.$cache$borderTopWidth + this.$cache$borderBottomWidth +
            this.$cache$paddingTop + this.$cache$paddingBottom;
    };

    /**
     * 获取控件的无效宽度，即控件与控件内部区域宽度的差值。
     * @public
     *
     * @return {number} 控件的无效宽度
     */
    UI_CONTROL_CLASS.getInvalidWidth = function () {
        this.cache();
        return this.$cache$borderLeftWidth + this.$cache$borderRightWidth +
            this.$cache$paddingLeft + this.$cache$paddingRight;
    };

    /**
     * 获取控件外层的 Element 对象。
     * getOuter 方法返回用于控制控件自身布局的外层 Element 对象。
     * @public
     *
     * @return {HTMLElement} Element 对象
     */
    UI_CONTROL_CLASS.getOuter = function () {
        return this._eBase;
    };

    /**
     * 获取父控件。
     * @public
     *
     * @return {ecui.ui.Control} 父控件对象
     */
    UI_CONTROL_CLASS.getParent = function () {
        return this._cParent || null;
    };

    /**
     * 获取控件的默认样式。
     * 控件的默认样式也称为控件的类型样式，在调用 alterClass 方法时，默认样式与当前样式会被添加样式后缀，从而实现控件状态的样式变更。在调用 create 方法时指定，参见 getClass 与 getBaseClass 方法。
     * @public
     *
     * @return {string} 控件的默认样式
     */
    UI_CONTROL_CLASS.getType = function () {
        return this._sType;
    };

    /**
     * 获取控件的内部唯一标识符。
     * getUID 方法返回的 ID 不是标签 eui 属性中指定的 id，而是框架为每个控件生成的内部唯一标识符。
     * @public
     *
     * @return {string} 控件 ID
     */
    UI_CONTROL_CLASS.getUID = function () {
        return this._sUID;
    };

    /**
     * 获取控件区域的宽度。
     * @public
     *
     * @return {number} 控件的宽度
     */
    UI_CONTROL_CLASS.getWidth = function () {
        this.cache();
        return this._nWidth;
    };

    /**
     * 获取控件的相对X轴坐标。
     * getX 方法返回控件的外层 Element 对象的 offsetLeft 属性值。如果需要得到控件相对于整个文档的X轴坐标，请调用 getOuter 方法获得外层 Element 对象，然后调用 DOM 的相关函数计算(例如 ecui.dom.getPosition)。
     * @public
     *
     * @return {number} X轴坐标
     */
    UI_CONTROL_CLASS.getX = function () {
        var el = this.getOuter();

        return this.isShow() ? el.offsetLeft - calcLeftRevise(el) : 0;
    };

    /**
     * 获取控件的相对Y轴坐标。
     * getY 方法返回控件的外层 Element 对象的 offsetTop 属性值。如果需要得到控件相对于整个文档的X轴坐标，请调用 getOuter 方法获得外层 Element 对象，然后调用 DOM 的相关函数计算(例如 ecui.dom.getPosition)。
     * @public
     *
     * @return {number} Y轴坐标
     */
    UI_CONTROL_CLASS.getY = function () {
        var el = this.getOuter();

        return this.isShow() ? el.offsetTop - calcTopRevise(el) : 0;
    };

    /**
     * 隐藏控件。
     * 如果控件处于显示状态，调用 hide 方法会触发 onhide 事件，控件转为隐藏状态，并且控件会自动失去焦点。如果控件已经处于隐藏状态，则不执行任何操作。
     * @public
     *
     * @return {boolean} 显示状态是否改变
     */
    UI_CONTROL_CLASS.hide = function () {
        if (this.isShow()) {
            if (!(this.onhide && this.onhide() === false)) {
                this.$hide();
            }
        }
    };

    /**
     * 判断控件是否响应浏览器事件。
     * 控件不响应浏览器事件时，相应的事件由父控件进行处理。
     * @public
     *
     * @return {boolean} 控件是否响应浏览器事件
     */
    UI_CONTROL_CLASS.isCapture = function () {
        return this._bCapture;
    };

    /**
     * 判断控件是否处于可操作状态。
     * 控件是否处于可操作状态，影响控件是否处理事件，控件的可操作状态，受父控件的可操作状态影响。可以通过 setEnabled 方法改变控件的可操作状态，如果控件设置为不可操作，它所有的子控件也都不可操作。
     * @public
     *
     * @return {boolean} 控件是否可操作
     */
    UI_CONTROL_CLASS.isEnabled = function () {
        // 当控件处于可操作状态时，查询父控件是否可用
        return this._bEnabled && (!this._cParent || this._cParent.isEnabled());
    };

    /**
     * 判断控件是否允许获取焦点。
     * 控件不允许获取焦点时，被点击时不会改变当前的焦点控件，但此时控件拥有框架处理的最高优先级。
     * @public
     *
     * @return {boolean} 控件是否允许获取焦点
     */
    UI_CONTROL_CLASS.isFocusable = function () {
        return this._bFocusable;
    };

    /**
     * 判断控件是否处于显示状态。
     * @public
     *
     * @return {boolean} 控件是否显示
     */
    UI_CONTROL_CLASS.isShow = function () {
        return !!this.getOuter().offsetWidth;
    };

    /**
     * 控件刷新。
     * paint 方法将导致控件整体重绘，在通常情况下，建议控件改变的状态进行重绘，而不是调用 paint 方法。
     * @public
     */
    UI_CONTROL_CLASS.paint = function () {
        this.cache(true, true);
        this.$setSize(this.getWidth(), this.getHeight());
    };

    /**
     * 设置控件内层可使用区域的大小。
     * 可使用区域的大小，与 getWidth、getHeight、getInvalidWidth、getInvalidHeight 四个方法有关。
     * @public
     *
     * @param {number} width 宽度
     * @param {number} height 高度
     */
    UI_CONTROL_CLASS.setBodySize = function (width, height) {
        this.setSize(width && width + this.getInvalidWidth(), height && height + this.getInvalidHeight());
    };

    /**
     * 设置控件是否响应浏览器事件。
     * 控件不响应浏览器事件时，相应的事件由父控件进行处理。
     * @public
     *
     * @param {boolean} 控件是否响应浏览器事件，默认响应事件
     */
    UI_CONTROL_CLASS.setCapture = function (status) {
        this._bCapture = status !== false;
    };

    /**
     * 设置控件的当前样式。
     * setClass 方法设置控件当前使用的样式，在调用 alterClass 方法时，当前样式与默认样式会被添加样式后缀，从而实现控件状态的样式变更。控件的当前样式通过 getClass 方法获取。请注意，使用 setClass 方法不会改变控件部件的基本样式。
     * @public
     *
     * @param {string} currClass 控件的当前样式
     */
    UI_CONTROL_CLASS.setClass = function (currClass) {
        //__gzip_original__typeClass
        var status = [' '],
            styleNames = [''],
            typeClass = this._sType;

        currClass = currClass || typeClass;

        // 如果基本样式没有改变不需要执行
        if (currClass != this._sClass) {
            this._eBase.className =
                this._eBase.className.replace(
                    new REGEXP('(^|\\s+)(' + this._sClass + '|' + typeClass + ')(-[^\\s]+)?', 'g'),
                    function ($0, $1, $2, $3) {
                        if (indexOf(status, $3) < 0) {
                            status.push($3);
                            styleNames.push(currClass + $3);
                        }
                        return '';
                    }
                ) + status.join(' ' + typeClass) + styleNames.join(' ');

            this._sClass = currClass;
        }
    };

    /**
     * 设置控件的可操作状态。
     * 如果控件设置为不可操作，调用 alterClass 方法为控件添加扩展样式 -disabled，同时自动失去焦点；如果设置为可操作，移除控件的扩展样式 -disabled。setEnabled 方法只是设置控件自身的可操作状态，然后控件设置为可操作，并不代表调用 isEnabled 方法返回的值一定是 true，控件的可操作状态还受到父控件的可操作状态的影响。
     * @public
     *
     * @param {boolean} status 控件是否可操作，默认为 true
     */
    UI_CONTROL_CLASS.setEnabled = function (status) {
        status = status !== false;

        // 检查与控件当前状态是否一致
        if (this._bEnabled != status) {
            this.alterClass('disabled', status);
            // 如果控件拥有焦点，设置成不可用状态时需要失去焦点
            if (!status) {
                loseFocus(this);
            }
            this._bEnabled = status;
        }
    };

    /**
     * 设置控件是否允许获取焦点。
     * 控件不允许获取焦点时，被点击时不会改变当前的焦点控件，但此时控件拥有框架处理的最高优先级。
     * @public
     *
     * @param {boolean} 控件是否允许获取焦点，默认允许
     */
    UI_CONTROL_CLASS.setFocusable = function (status) {
        this._bFocusable = status !== false;
    };

    /**
     * 设置当前控件的父控件。
     * setParent 方法设置父控件，参数是父控件对象时，将当前控件挂接到父控件对象的内层 Element 对象下，如果参数是父 Element 对象，将当前控件挂接到这个 Element 对象上并使用 findControl 查找父控件对象。调用 setParent 方法设置父控件，如果在设置父控件之前已经存在父控件，会触发原父控件的 onremove 事件并解除控件与原父控件的关联，新的父控件如果存在，会触发父控件的 onappend 事件，如果事件返回 false，表示父控件不允许当前控件作为它的子控件，设置失败，相当于忽略 parent 参数。
     * @public
     *
     * @param {ecui.ui.Control|HTMLElement} parent 父控件对象/父 Element 对象，忽略参数则将控件移出 DOM 树
     */
    UI_CONTROL_CLASS.setParent = function (parent) {
        var oldParent = this._cParent,
            el = this.getOuter(),
            parentEl;

        // 识别父对象类型
        if (parent) {
            if (parent instanceof UI_CONTROL) {
                parentEl = parent._eBody;
            }
            else {
                parentEl = parent;
                parent = findControl(parent);
            }
        }

        // 触发原来父控件的移除子控件事件
        if (parent != oldParent || parentEl != getParent(el)) {
            if (oldParent) {
                if (oldParent.onremove) {
                    oldParent.onremove(this);
                }
                oldParent.$remove(this);
            }
            if (parent) {
                if (parent.onappend && parent.onappend(this) === false || parent.$append(this) === false) {
                    parent = parentEl = null;
                }
            }

            if (parentEl) {
                parentEl.appendChild(el);
            }
            else {
                removeDom(el);
            }
            this.$setParent(parent);
            this.clearCache();
        }
    };

    /**
     * 设置控件的坐标。
     * setPosition 方法设置的是控件的 left 与 top 样式，受到 position 样式的影响。
     * @public
     *
     * @param {number} x 控件的X轴坐标
     * @param {number} y 控件的Y轴坐标
     */
    UI_CONTROL_CLASS.setPosition = function (x, y) {
        var style = this.getOuter().style;
        style.left = x + 'px';
        style.top = y + 'px';
    };

    /**
     * 设置控件的大小。
     * @public
     *
     * @param {number} width 控件的宽度
     * @param {number} height 控件的高度
     */
    UI_CONTROL_CLASS.setSize = function (width, height) {
        //__gzip_original__style
        var style = this._eBase.style;

        this.$setSize(width, height);
        if (width) {
            this._sWidth = style.width;
        }
        if (height) {
            this._sHeight = style.height;
        }
    };

    /**
     * 显示控件。
     * 如果控件处于隐藏状态，调用 show 方法会触发 onshow 事件，控件转为显示状态。如果控件已经处于显示状态，则不执行任何操作。
     * @public
     */
    UI_CONTROL_CLASS.show = function () {
        if (!this.isShow()) {
            if (!(this.onshow && this.onshow() === false)) {
                this.$show();
            }
        }
    };

    (function () {
        function build(name, enabled) {
            UI_CONTROL_CLASS[name] = function (event) {
                if (enabled || this.isEnabled()) {
                    if (this['on' + name] && this['on' + name](event) === false || 
                            this['$' + name](event) === false) {
                        return false;
                    }
                }
            };

            UI_CONTROL_CLASS['$' + name] = UI_CONTROL_CLASS['$' + name] || blank;
        }

        // 初始化事件处理函数，以事件名命名，这些函数行为均是判断控件是否可操作/是否需要调用事件/是否需要执行缺省的事件处理，对应的缺省事件处理函数名以$开头后接事件名，处理函数以及缺省事件处理函数参数均为事件对象，仅执行一次。
        for (var i = 0, o; o = eventNames[i++]; ) {
            build(o, i > 17 || i == 10);
        }

        // 初始化空操作的一些缺省处理
        UI_CONTROL_CLASS.$intercept = UI_CONTROL_CLASS.$append = UI_CONTROL_CLASS.$remove =
            UI_CONTROL_CLASS.$selectstart = UI_CONTROL_CLASS.$select = UI_CONTROL_CLASS.$selectend =
            UI_CONTROL_CLASS.$zoomstart = UI_CONTROL_CLASS.$zoom = UI_CONTROL_CLASS.$zoomend =
            UI_CONTROL_CLASS.$dragstart = UI_CONTROL_CLASS.$dragmove = UI_CONTROL_CLASS.$dragend = blank;
    })();


/*
Label - 定义事件转发的基本操作。
标签控件，继承自基础控件，将事件转发到指定的控件上，通常与 Radio、Checkbox 等控件联合使用，扩大点击响应区域。

标签控件直接HTML初始化的例子:
<div ecui="type:label;for:checkbox"></div>

属性
_cFor - 被转发的控件对象
*/


    /**
     * 鼠标单击控件事件的默认处理。
     * 将点击事件转发到 setFor 方法指定的控件。如果控件处于可操作状态(参见 isEnabled)，click 方法触发 onclick 事件，如果事件返回值不为 false，则调用 $click 方法。
     * @protected
     */
    UI_LABEL_CLASS.$click = function (event) {
        UI_CONTROL_CLASS.$click.call(this, event);

        //__gzip_original__control
        var control = this._cFor;
        if (control) {
            control.click(event);
        }
    };

    /**
     * 设置控件的事件转发接收控件。
     * setFor 方法设置事件转发的被动接收者，如果没有设置，则事件不会被转发。
     * @public
     *
     * @param {ecui.ui.Control} control 事件转发接收控件
     */
    UI_LABEL_CLASS.setFor = function (control) {
        this._cFor = control;
    };


/*
Progress - 定义进度显示的基本操作。
进度条控件，继承自基础控件，面向用户显示一个任务执行的程度。

进度条控件直接HTML初始化的例子:
<div ecui="type:progress;rate:0.5"></div>

属性
_eText - 内容区域
_eMask - 完成的进度比例内容区域
*/


    /**
     * 销毁控件的默认处理。
     * @protected
     */
    UI_PROGRESS_CLASS.$dispose = function () {
        this._eText = this._eMask = null;
        UI_CONTROL_CLASS.$dispose.call(this);
    };

    /**
     * 设置控件的大小。
     * @protected
     *
     * @param {number} width 宽度，如果不需要设置则将参数设置为等价于逻辑非的值
     * @param {number} height 高度，如果不需要设置则省略此参数
     */
    UI_PROGRESS_CLASS.$setSize = function (width, height) {
        UI_CONTROL_CLASS.$setSize.call(this, width, height);
        this.$locate();

        //__gzip_original__style1
        //__gzip_original__style2
        var style1 = this._eText.style,
            style2 = this._eMask.style;
        style1.width = style2.width = this.getBodyWidth() + 'px';
        style1.height = style2.height = this.getBodyHeight() + 'px';
    };

    /**
     * 设置进度的比例以及需要显示的文本。
     * @protected
     *
     * @param {number} rate 进度比例，在0-1之间
     * @param {number} text 显示的文本，如果省略将显示成 xx%
     */
    UI_PROGRESS_CLASS.setText = function (rate, text) {
        rate = MIN(MAX(0, rate), 1);
        if (text !== undefined) {
            this._eText.innerHTML = this._eMask.innerHTML = text || ROUND(rate * 100) + '%';
        }
        this._eMask.style.clip =
            'rect(0px,' + FLOOR(rate * this.getBodyWidth()) + 'px,' + this.getBodyHeight() + 'px,0px)';
    };


/*
Form - 定义独立于文档布局的内容区域的基本操作。
窗体控件，继承自基础控件，内部包含了三个部件，分别是标题栏(基础控件)、关闭按钮(基础控件)与内容区域(截面控件)。窗体控件
仿真浏览器的多窗体效果，如果在其中包含 iframe 标签，可以在当前页面打开一个新的页面，避免了使用 window.open 在不同浏览
器下的兼容性问题。多个窗体控件同时工作时，当前激活的窗体在最上层。窗体控件的标题栏默认可以拖拽，窗体可以设置置顶方式显
示，在置顶模式下，只有当前窗体可以响应操作。窗体控件的 z-index 从4096开始，页面开发请不要使用大于或等于4096的 z-index 
值。

窗体控件直接HTML初始化的例子:
<div ecui="type:form;hide:true">
    <!-- 标题可以没有 -->
    <label>窗体的标题</label>
    <!-- 这里放窗体的内容 -->
    ...
</div>

属性
_bHide      - 初始是否自动隐藏
_bAuto      - 标题栏是否自适应宽度
_uTitle     - 标题栏
_uClose     - 关闭按钮
*/


    /**
     * 标题栏鼠标按压开始事件处理，需要触发拖动，如果当前窗体未得到焦点则得到焦点
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_FORM_TITLE_CLASS.$pressstart = function (event) {
        UI_CONTROL_CLASS.$pressstart.call(this, event);
        drag(this.getParent(), event);

        // 屏蔽普通W3C兼容的浏览器的选择操作
        event.preventDefault();
    };

    /**
     * 窗体关闭按钮点击事件，关闭窗体
     * @protected
     *
     * @params {Event} event 事件对象
     */
    UI_FORM_CLOSE_CLASS.$click = function (event) {
        UI_CONTROL_CLASS.$click.call(this, event);
        this.getParent().hide();
    };

    /**
     * 计算控件的缓存。
     * 控件缓存部分核心属性的值，提高控件属性的访问速度，在子控件或者应用程序开发过程中，如果需要避开控件提供的方法(setSize、alterClass 等)直接操作 Element 对象，操作完成后必须调用 clearCache 方法清除控件的属性缓存，否则将引发错误。
     * @protected
     *
     * @param {CssStyle} style 基本 Element 对象的 Css 样式对象
     * @param {boolean} cacheSize 是否需要缓存控件大小，如果控件是另一个控件的部件时，不缓存大小能加快渲染速度，默认缓存
     */
    UI_FORM_CLASS.$cache = function (style, cacheSize) {
        UI_CONTROL_CLASS.$cache.call(this, style, cacheSize);

        style = getStyle(this.getBase().lastChild);
        this.$cache$mainWidthRevise = calcWidthRevise(style);
        this.$cache$mainHeightRevise = calcHeightRevise(style);
        this._uTitle.cache(true, true);
        this._uClose.cache(true, true);
    };

    /**
     * 控件获得焦点事件的默认处理。
     * 窗体控件获得焦点时需要将自己置于所有窗体控件的顶部。如果控件处于可操作状态(参见 isEnabled)，focus 方法触发 onfocus 事件，如果事件返回值不为 false，则调用 $focus 方法。
     * @protected
     */
    UI_FORM_CLASS.$focus = function () {
        UI_CONTROL_CLASS.$focus.call(this);

        var i = indexOf(UI_FORM_ALL, this),
            o;

        if (this.getOuter().style.zIndex < 32768) {
            // 如果不是showModal模式，将当前窗体置顶
            UI_FORM_ALL.push(UI_FORM_ALL.splice(i, 1)[0]);
            for (; o = UI_FORM_ALL[i++]; ) {
                o.getOuter().style.zIndex = 4095 + i;
            }
        }
    };

    /**
     * 隐藏控件。
     * 如果窗体是以 showModal 方式打开的，隐藏窗体时，需要恢复页面的状态。
     * @protected
     */
    UI_FORM_CLASS.$hide = function () {
        UI_CONTROL_CLASS.$hide.call(this);
        if (this.getOuter().style.zIndex == 32768) {
            mask();
        }
    };

    /**
     * 控件渲染完成后初始化的默认处理。
     * $init 方法在控件渲染完成后调用，参见 create 与 init 方法。
     * @protected
     */
    UI_FORM_CLASS.$init = function () {
        UI_CONTROL_CLASS.$init.call(this);
        this._uTitle.$init();
        this._uClose.$init();
        if (this._bHide) {
            this.$hide();
        }
    };

    /**
     * 设置控件的大小。
     * @protected
     *
     * @param {number} width 宽度，如果不需要设置则将参数设置为等价于逻辑非的值
     * @param {number} height 高度，如果不需要设置则省略此参数
     */
    UI_FORM_CLASS.$setSize = function (width, height) {
        UI_CONTROL_CLASS.$setSize.call(this, width, height);
        this.$locate();

        var style = this.getBase().lastChild.style;

        style.width = this.getBodyWidth() - this.$cache$mainWidthRevise + 'px';
        style.height = this.getBodyHeight() - this.$cache$mainHeightRevise + 'px';
        if (this._bAuto) {
            this._uTitle.$setSize(this.getBodyWidth());
        }
    };

    /**
     * 窗体居中显示。
     * @public
     */
    UI_FORM_CLASS.center = function () {
        o = this.getOuter().offsetParent;

        if (o.tagName == 'BODY' || o.tagName == 'HTML') {
            var o = getView(),
                x = o.right + o.left,
                y = o.bottom + o.top;
        }
        else {
            x = o.offsetWidth;
            y = o.offsetHeight;
        }

        this.setPosition((x - this.getWidth()) / 2, (y - this.getHeight()) / 2);
    };

    /**
     * 设置窗体控件标题。
     * @public
     *
     * @param {string} text 窗体标题
     */
    UI_FORM_CLASS.setTitle = function (text) {
        this._uTitle.$setBodyHTML(text || '');
    };

    /**
     * 显示控件。
     * 显示窗体控件时，需要将窗体控件设置为获得焦点状态，即窗体控件或者子控件拥有焦点。
     * @public
     *
     * @return {boolean} 显示状态是否改变
     */
    UI_FORM_CLASS.show = function () {
        if (!this.contain(getFocused())) {
            setFocused(this);
        }
        return UI_CONTROL_CLASS.show.call(this);
    };

    /**
     * 窗体以独占方式显示
     * showModal 方法将窗体控件以独占方式显示，此时鼠标点击窗体以外的内容无效，关闭窗体后自动恢复。
     * @public
     *
     * @param {number} opacity 遮罩层透明度，默认为0.05
     */
    UI_FORM_CLASS.showModal = function (opacity) {
        this.show();
        this.getOuter().style.zIndex = 32768;
        mask(opacity !== undefined ? opacity : 0.05);
    };


/*
Collection - 定义批量控件集的事件与基本操作。
集合控件，继承自基础控件，将大量子控件组合而成的控件。集合控件统一管理，所有子控件的事件允许调用统一的事件方法，可用于日
历、调色板等。

网格控件直接HTML初始化的例子:
<div ecui="type:collection"></div>

属性
_aItem  - 子控件集合
*/


    /**
     * 获取网格子控件在网格控件中的序号。
     * 在网格控件的事件中，事件对应的 this 是真正产生事件的网格子控件，通过 getIndex 方法能知道当前的网格子控件在网格控件中的序号，参见 getItem 方法。
     * @public
     *
     * @return {number} 子控件的序号
     */
    UI_COLLECTION_ITEM_CLASS.getIndex = function () {
        return indexOf(this.getParent()._aItem, this);
    };

    /**
     * 计算控件的缓存。
     * 控件缓存部分核心属性的值，提高控件属性的访问速度，在子控件或者应用程序开发过程中，如果需要避开控件提供的方法(setSize、alterClass 等)直接操作 Element 对象，操作完成后必须调用 clearCache 方法清除控件的属性缓存，否则将引发错误。
     * @protected
     *
     * @param {CssStyle} style 基本 Element 对象的 Css 样式对象
     * @param {boolean} cacheSize 是否需要缓存控件大小，如果控件是另一个控件的部件时，不缓存大小能加快渲染速度，默认缓存
     */
    UI_COLLECTION_CLASS.$cache = function (style, cacheSize) {
        UI_CONTROL_CLASS.$cache.call(this, style, cacheSize);

        // 以下使用cacheSize表示o，使用style表示i
        for (style = 0; cacheSize = this._aItem[style++]; ) {
            cacheSize.cache(false, true);
        }
    };

    /**
     * 获取指定的网格子控件。
     * 子控件的序号从行到列，逐一累加，例如，一个 3*3 的网格控件，第一行第一列序号为 0，第一行第二列序号为 1，第一行第三列序号为 2，第二行第一列序号为3，行二行第二列序号为 4，依此类推。
     * @public
     *
     * @param {number} index 子控件的序号
     * @return {ecui.ui.Control} 子控件对象
     */
    UI_COLLECTION_CLASS.getItem = function (index) {
        return this._aItem[index];
    };

    /**
     * 初始化事件处理函数，以事件名命名，这些函数行为均是判断控件是否可操作/是否需要调用事件/是否需要执行缺省的事件处
     * 理，对应的缺省事件处理函数名以$开头后接事件名，处理函数以及缺省事件处理函数参数均为事件对象，仅执行一次。这些函
     * 数都需要提供给内部的子控件使用，因此需要关联Collection控件。
     */
    (function () {
        function build(name) {
            UI_COLLECTION_CLASS[name] = blank;
            UI_COLLECTION_ITEM_CLASS[name] = function (event) {
                var o = this.getParent();
                if (this.isEnabled()) {
                    if (!(o['on' + name] && o['on' + name].call(this, event) === false)) {
                        o['$' + name].call(this, event);
                    }
                }
            };
        }
        for (var i = 0; i < 13; ) {
            build(eventNames[i++]);
        }
    })();


/*
Calendar - 定义日历显示的基本操作。
日历控件，继承自基础控件，内部包含了两个部件，分别是星期名称(网格控件)与日期(网格控件)。在日期网格控件里，第一行包含上
个月最后几天的信息，最后一行包含下个月最前几天的信息。日历控件不包含年/月/日的快速选择与切换，如果需要实现这些功能，请
将下拉框(选择月份)、输入框(输入年份)等组合使用建立新的控件或直接在页面上布局并调用接口。

日历控件直接HTML初始化的例子:
<div ecui="type:calendar;year:2009;month:11"></div>

属性
_nYear      - 年份
_nMonth     - 月份(0-11)
_uName      - 星期名称网格
_uDate      - 日期网格

子控件属性
_nDay       - 从本月1号开始计算的天数，如果是上个月，是负数，如果是下个月，会大于当月最大的天数
*/


    /**
     * 日期网格控件点击处理，将事件转发到日历控件的ondateclick事件上
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_CALENDAR_DATE_COLLECTION_CLASS.$click = function (event) {
        UI_COLLECTION_CLASS.$click.call(this, event);
        var calendar = this.getParent().getParent();
        if (calendar.ondateclick) {
            calendar.ondateclick(event, new DATE(calendar._nYear, calendar._nMonth, this._nDay));
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
    UI_CALENDAR_CLASS.$cache = function (style, cacheSize) {
        UI_CONTROL_CLASS.$cache.call(this, style, cacheSize);
        this._uName.cache(true, true);
        this._uDate.cache(true, true);
    };

    /**
     * 控件渲染完成后初始化的默认处理。
     * $init 方法在控件渲染完成后调用，参见 create 与 init 方法。
     * @protected
     */
    UI_CALENDAR_CLASS.$init = function () {
        UI_CONTROL_CLASS.$init.call(this);
        this._uName.$init();
    };

    /**
     * 设置控件的大小。
     * 日历控件与 网格控件 类似，$setSize 方法设置的大小不一定是实际控件的大小，受到了内部部件的影响。
     * @protected
     *
     * @param {number} width 宽度，如果不需要设置则将参数设置为等价于逻辑非的值
     * @param {number} height 高度，如果不需要设置则省略此参数
     */
    UI_CALENDAR_CLASS.$setSize = function (width, height) {
        UI_CONTROL_CLASS.$setSize.call(this, width);

        //__gzip_original__name
        //__gzip_original__date
        for (
            var i = 0,
                name = this._uName,
                date = this._uDate,
                itemWidth = FLOOR((width - this.getInvalidWidth(true)) / 7),
                itemHeight = FLOOR((height - this.getInvalidHeight(true) - name.getHeight()) / 6);
            i < 7;
        ) {
            name.getItem(i++).$setSize(itemWidth);
        }
        for (i = 0; i < 42; ) {
            date.getItem(i++).$setSize(itemWidth, itemHeight);
        }

        name.$setSize(itemWidth * 7);
        date.$setSize(itemWidth * 7);
    };

    /**
     * 获取日历控件当前显示的月份。
     * @public
     *
     * @return {number} 月份(1-12)
     */
    UI_CALENDAR_CLASS.getMonth = function () {
        return this._nMonth + 1;
    };

    /**
     * 获取日历控件当前显示的年份。
     * @public
     *
     * @return {number} 年份(19xx-20xx)
     */
    UI_CALENDAR_CLASS.getYear = function () {
        return this._nYear;
    };

    /**
     * 日历显示移动指定的月份数。
     * 参数为正整数则表示向当前月份之后的月份移动，负数则表示向当前月份之前的月份移动，设置后日历控件会刷新以显示新的日期。
     * @public
     *
     * @param {number} offsetMonth 日历移动的月份数
     */
    UI_CALENDAR_CLASS.move = function (offsetMonth) {
        var time = new DATE(this._nYear, this._nMonth + offsetMonth, 1);
        this.setDate(time.getFullYear(), time.getMonth() + 1);
    };

    /**
     * 设置日历控件当前显示的日期。
     * @public
     *
     * @param {number} year 年份(19xx-20xx)，如果省略使用浏览器的当前年份
     * @param {number} month 月份(1-12)，如果省略使用浏览器的当前月份
     */
    UI_CALENDAR_CLASS.setDate = function (year, month) {
        //__gzip_original__date
        var i = 0,
            date = this._uDate,
            today = new DATE(),
            year = year || today.getFullYear(),
            month = month ? month - 1 : today.getMonth(),
            // 得到上个月的最后几天的信息，用于补齐当前月日历的上月信息位置
            o = new DATE(year, month, 0),
            day = 1 - (o.getDay() + 1) % 7,
            lastDayOfLastMonth = o.getDate(),
            // 得到当前月的天数
            lastDayOfCurrMonth = new DATE(year, month + 1, 0).getDate();

        if (this._nYear != year || this._nMonth != month) {
            this._nYear = year;
            this._nMonth = month;

            for (; month = date.getItem(i++); ) {
                // 以下year变量表示日期是否为当月的flag，month变量表示日期单元格控件o
                month.setEnabled(year = day > 0 && day <= lastDayOfCurrMonth);
                setText(
                    month.getBody(),
                    year ? day : day > lastDayOfCurrMonth ? day - lastDayOfCurrMonth : lastDayOfLastMonth + day
                );
                month._nDay = day++;
            }

            year = date.getItem(35).isEnabled();
            for (i = 35; i < 42; ) {
                date.getItem(i++).alterClass('extra', year);
            }

            this.change();
        }
    };


/*
Item/Items - 定义选项操作相关的基本操作。
选项控件，继承自基础控件，用于弹出菜单、下拉框、交换框等控件的单个选项，通常不直接初始化。选项控件必须用在使用选项组接
口(Items)的控件中，选项控件支持移入操作的缓存，不会因为鼠标移出而改变状态，因此可以通过函数调用来改变移入移出状态，选
控件默认屏蔽了 DOM 的文本选中操作。选项组不是控件，是一组对选项进行操作的方法的集合，提供了基本的增/删操作，以及对选项
控件的状态控制的接口，通过将 ecui.ui.Items 对象下的方法复制到类的 prototype 属性下继承接口，最终对象要正常使用还需要在
类构造器中调用 $initItems 方法。
*/


    /**
     * 调用指定对象超类的指定方法。
     * callSuper 用于不确定超类类型时的访问，例如接口内定义的方法，需要注意的是，接口不能被一个类实现两次，否则将会引发死循环。
     * @public
     *
     * @param {Object} object 需要操作的对象
     * @param {string} name 方法名称
     * @param {Array} args 调用者的参数
     * @return {Object} 方法的返回值
     */
    function callSuper(object, name) {

        /**
         * 查找指定的方法对应的超类方法。
         * @private
         *
         * @param {Object} clazz 查找的起始类对象
         * @param {Function} caller 基准方法，即查找 caller 对应的超类方法
         * @return {Function} 基准方法对应的超类方法，没有找到基准方法返回 undefined，基准方法没有超类方法返回 null
         */
        function findPrototype(clazz, caller) {
            for (; clazz; clazz = clazz.constructor.superClass) {
                if (clazz[name] == caller) {
                    for (; clazz = clazz.constructor.superClass; ) {
                        if (clazz[name] != caller) {
                            return clazz[name];
                        }
                    }
                    return null;
                }
            }
        }

        //__gzip_original__clazz
        var clazz = object.constructor.prototype,
            caller = callSuper.caller,
            func = findPrototype(clazz, caller);

        if (func === undefined) {
            // 如果Items的方法直接位于prototype链上，是caller，如果是间接被别的方法调用Items.xxx.call，是caller.caller
            func = findPrototype(clazz, caller.caller);
        }

        if (func) {
            return func.apply(object, caller.arguments);
        }
    }

    /**
     * 鼠标单击控件事件的默认处理。
     * 如果控件处于可操作状态(参见 isEnabled)，click 方法触发 onclick 事件，如果事件返回值不为 false，则调用 $click 方法。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_ITEM_CLASS.$click = function (event) {
        UI_CONTROL_CLASS.$click.call(this, event);

        var parent = this.getParent();
        if (parent && parent.onitemclick) {
            parent.onitemclick(event, indexOf(UI_ITEMS[parent.getUID()], this));
        }
    };

    /**
     * 鼠标在控件区域内按下事件的默认处理。
     * 鼠标在控件区域内按下时默认调用 $mousedown 方法。如果控件处于可操作状态(参见 isEnabled)，mousedown 方法触发 onmousedown 事件，如果事件返回值不为 false，则调用 $mousedown 方法。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_ITEM_CLASS.$mousedown = function (event) {
        UI_CONTROL_CLASS.$mousedown.call(this, event);

        // 屏蔽普通W3C兼容的浏览器的选择操作
        event.preventDefault();
    };

    /**
     * 鼠标移入控件区域事件的默认处理。
     * 鼠标移入控件区域时默认调用 $mouseover 方法。如果控件处于可操作状态(参见 isEnabled)，mouseover 方法触发 onmouseover 事件，如果事件返回值不为 false，则调用 $mouseover 方法。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_ITEM_CLASS.$mouseover = function (event) {
        UI_CONTROL_CLASS.$mouseover.call(this, event);
        this.getParent().$setActived(this);
    };

    /**
     * 控件增加子控件事件的默认处理。
     * 选项组增加子选项时需要判断子控件的类型，并额外添加引用。
     * @protected
     *
     * @param {ecui.ui.Item} child 选项控件
     * @return {boolean} 是否允许增加子控件，默认允许
     */
    UI_ITEMS.$append = function (child) {
        // 检查待新增的控件是否为选项控件
        if (!(child instanceof (findConstructor(this, 'Item') || UI_ITEM)) || callSuper(this, '$append') === false) {
            return false;
        }
        UI_ITEMS[this.getUID()].push(child);
        this.$alterItems();
    };

    /**
     * 计算控件的缓存。
     * 控件缓存部分核心属性的值，提高控件属性的访问速度，在子控件或者应用程序开发过程中，如果需要避开控件提供的方法(setSize、alterClass 等)直接操作 Element 对象，操作完成后必须调用 clearCache 方法清除控件的属性缓存，否则将引发错误。
     * @protected
     *
     * @param {CssStyle} style 基本 Element 对象的 Css 样式对象
     * @param {boolean} cacheSize 是否需要缓存控件大小，如果控件是另一个控件的部件时，不缓存大小能加快渲染速度，默认缓存
     */
    UI_ITEMS.$cache = function (style, cacheSize) {
        callSuper(this, '$cache');

        for (var i = 0, list = UI_ITEMS[this.getUID()], o; o = list[i++]; ) {
            o.cache(true, true);
        }
    };

    /**
     * 控件渲染完成后初始化的默认处理。
     * $init 方法在控件渲染完成后调用，参见 create 与 init 方法。
     * @protected
     */
    UI_ITEMS.$init = function () {
        callSuper(this, '$init');
        this.$alterItems();
    };

    /**
     * 初始化选项组对应的 Element 对象。
     * 实现了 Items 接口的类在初始化时需要调用 $initItems 方法自动生成选项控件，$initItems 方法保证一个控件对象只允许被调用一次，多次的调用无效。
     * @protected
     */
    UI_ITEMS.$initItems = function () {
        this.$alterItems = blank;

        // 防止对一个控件进行两次包装操作
        UI_ITEMS[this.getUID()] = [];

        // 初始化选项控件
        for (var i = 0, list = children(this.getBody()), o; o = list[i++]; ) {
            this.add(o);
        }

        delete this.$alterItems;
    };

    /**
     * 控件移除子控件事件的默认处理。
     * 选项组移除子选项时需要额外移除引用。
     * @protected
     *
     * @param {ecui.ui.Item} child 选项控件
     */
    UI_ITEMS.$remove = function (child) {
        callSuper(this, '$remove');
        remove(UI_ITEMS[this.getUID()], child);
        this.$alterItems();
    };

    /**
     * 设置激活的选项。
     * $setActived 方法改变选项组控件中当前激活项的效果。
     * @protected
     *
     * @param {ecui.ui.Item} item 选项控件
     */
    UI_ITEMS.$setActived = function (item) {
        var list = UI_ITEMS[this.getUID()],
            actived = list._cActive;

        if (actived != item) {
            if (actived) {
                actived.alterClass('active', true);
            }
            if (item) {
                item.alterClass('active');
            }
            list._cActive = item;
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
    UI_ITEMS.add = function (item, index, params) {
        var list = UI_ITEMS[this.getUID()],
            o = 'ec-item ' + this.getClass() + '-item ';

        if (item instanceof UI_ITEM) {
            // 选项控件，直接添加
            item.setParent(this);
        }
        else {
            // 根据是字符串还是Element对象选择不同的初始化方式
            if ('string' == typeof item) {
                this.getBody().appendChild(o = createDom(o));
                o.innerHTML = item;
                item = o;
            }
            else {
                item.className = o + item.className;
            }

            params = params || getParameters(item);
            params.parent = this;
            list.push(item = $fastCreate(findConstructor(this, 'Item') || UI_ITEM, item, this, params));
            this.$alterItems();
        }

        // 改变选项控件的位置
        if (item.getParent() && (o = list[index]) && o != item) {
            insertBefore(item.getOuter(), o.getOuter());
            list.splice(index, 0, list.pop());
        }

        return item;
    };

    /**
     * 向选项组最后添加子选项控件。
     * append 方法是 add 方法去掉第二个 index 参数的版本。
     * @public
     *
     * @param {string|Element|ecui.ui.Item} item 控件的 html 内容/控件对应的 Element 对象/选项控件
     * @param {Object} 子控件初始化参数
     * @return {ecui.ui.Item} 子选项控件
     */
    UI_ITEMS.append = function (item, params) {
        this.add(item, undefined, params);
    };

    /**
     * 销毁控件。
     * dispose 方法触发 ondispose 事件，然后调用 $dispose 方法，dispose 方法在页面卸载时会被自动调用，通常不需要直接调用。
     * @public
     */
    UI_ITEMS.dispose = function () {
        delete UI_ITEMS[this.getUID()];
        callSuper(this, 'dispose');
    };

    /**
     * 获取当前处于激活状态的选项。
     * @public
     *
     * @return {ecui.ui.Item} 子选项控件
     */
    UI_ITEMS.getActived = function () {
        return UI_ITEMS[this.getUID()]._cActive || null;
    };

    /**
     * 获取全部的子选项控件。
     * @public
     *
     * @return {Array} 子选项控件数组
     */
    UI_ITEMS.getItems = function () {
        return UI_ITEMS[this.getUID()].slice();
    };

    /**
     * 移除子选项控件。
     * @public
     *
     * @param {number|ecui.ui.Item} item 选项控件的位置序号/选项控件
     * @return {ecui.ui.Item} 被移除的子选项控件
     */
    UI_ITEMS.remove = function (item) {
        if ('number' == typeof item) {
            item = UI_ITEMS[this.getUID()][item];
        }
        if (item) {
            item.setParent();
        }
        return item || null;
    };

    /**
     * 设置控件内所有子选项控件的大小。
     * @public
     *
     * @param {number} itemWidth 子选项控件的宽度
     * @param {number} itemHeight 子选项控件的高度
     */
    UI_ITEMS.setItemSize = function (itemWidth, itemHeight) {
        for (var i = 0, list = UI_ITEMS[this.getUID()], o; o = list[i++]; ) {
            o.$setSize(itemWidth, itemHeight);
        }
    };



/*
Popup - 定义弹出菜单项的基本操作。
弹出菜单控件，继承自基础控件，实现了选项组接口。弹出式菜单操作时不会改变当前已经激活的对象，任何点击都将导致弹出菜单消
失，弹出菜单默认向右展开子菜单，如果右部已经到达浏览器最边缘，将改为向左显示。

弹出菜单控件直接HTML初始化的例子:
<div ecui="type:popup;name:test">
    <!-- 这里放选项内容 -->
    <li>菜单项</li>
    ...
    <!-- 包含子菜单项的菜单项 -->
    <li>
        <label>菜单项</label>
        <!-- 这里放子菜单项 -->
        <li>子菜单项</li>
        ...
    </li>
    ...
</div>

属性
_nOptionSize - 弹出菜单选项的显示数量，不设置将全部显示
_cSuperior   - 上一级被激活的弹出菜单控件
_cInferior   - 下一级被激活的弹出菜单控件
_uPrev       - 向上滚动按钮
_uNext       - 向下滚动按钮

子菜单项属性
_cPopup      - 是否包含下级弹出菜单
*/


    /**
     * 弹出菜单选项样式刷新。
     * @private
     *
     * @param {ecui.ui.Popup.Item} item 选项控件
     */
    function UI_POPUP_ITEM_FLUSH(item) {
        if (item) {
            item.setClass(item.getBaseClass() + (item.getItems().length ? '-complex' : ''));
        }
    }

    copy(UI_POPUP_CLASS, UI_ITEMS);

    /**
     * 鼠标单击控件事件的默认处理。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_POPUP_BUTTON_CLASS.$click = function (event) {
        UI_CONTROL_CLASS.$click.call(this, event);

        //__gzip_original__prev
        var parent = this.getParent(),
            style = parent.getBody().style,
            list = parent.getItems(),
            height = list[0].getHeight(),
            prev = parent._uPrev,
            prevHeight = prev.getHeight(),
            top = (toNumber(style.top) - prevHeight) / height;

        parent.$setActived();
        style.top =
            MIN(MAX(prev == this ? ++top : --top, parent._nOptionSize - list.length), 0) * height + prevHeight + 'px';
    };

    /**
     * 鼠标在控件区域内按下事件的默认处理。
     * 鼠标在控件区域内按下时默认调用 $mousedown 方法。如果控件处于可操作状态(参见 isEnabled)，mousedown 方法触发 onmousedown 事件，如果事件返回值不为 false，则调用 $mousedown 方法。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_POPUP_BUTTON_CLASS.$mousedown = function (event) {
        UI_CONTROL_CLASS.$mousedown.call(this, event);

        // 屏蔽普通W3C兼容的浏览器的选择操作
        event.preventDefault();
    };

    /**
     * 菜单项点击的默认处理
     * @protected
     *
     * @params {Event} event 事件对象
     */
    UI_POPUP_ITEM_CLASS.$click = function (event) {
        UI_ITEM_CLASS.$click.call(this, event);
        if (!this.getItems().length) {
            UI_POPUP_CHAIN_FIRST.hide();
        }
    };

    /**
     * 菜单项移出的默认处理
     * @protected
     *
     * @params {Event} event 事件对象
     */
    UI_POPUP_ITEM_CLASS.$mouseout = function (event) {
        UI_ITEM_CLASS.$mouseout.call(this, event);
        if (!this.getItems().length) {
            this.getParent().$setActived();
        }
    };

    /**
     * 菜单项移入的默认处理
     * @protected
     *
     * @params {Event} event 事件对象
     */
    UI_POPUP_ITEM_CLASS.$mouseover = function (event) {
        // 改变菜单项控件的显示状态
        UI_ITEM_CLASS.$mouseover.call(this, event);

        var o = getView(),
            childPopup = this._cPopup,
            popup = this.getParent(),
            superior = popup._cSuperior,
            inferior = popup._cInferior,
            pos = getPosition(this.getOuter()),
            x = pos.left,
            width;

        if (inferior != childPopup) {
            // 隐藏之前显示的下级弹出菜单控件
            if (inferior) {
                inferior.hide();
            }

            if (this.getItems().length) {
                childPopup.show();

                // 计算子菜单应该显示的位置，以下使用o表示left
                width = childPopup.getWidth();
                inferior = x + this.getWidth() - 4;
                x -= width - 4;

                // 优先计算延用之前的弹出顺序的应该的位置，显示新的子弹出菜单
                childPopup.setPosition(
                    inferior + width > o.right || superior && superior.getX() > popup.getX() && x > o.left ?
                        x : inferior,
                    pos.top - 4
                );
            }
        }
    };

    /**
     * 菜单项按压结束的默认处理
     * @protected
     *
     * @params {Event} event 事件对象
     */
    UI_POPUP_ITEM_CLASS.$pressend = function (event) {
        UI_ITEM_CLASS.$pressend.call(this, event);
        if (!this.contain(event.getTarget())) {
            UI_POPUP_CHAIN_FIRST.hide();
        }
    };

    /**
     * 添加子选项控件。
     * 弹出菜单控件与弹出菜单子选项控件都包含 add 方法，用于添加子选项控件。如果位置序号不合法，子选项控件将添加在末尾的位置。
     * @public
     *
     * @param {string|Element|ecui.ui.Item} item 选项控件的 html 内容/控件对应的 Element 对象/选项控件
     * @param {number} index 子选项控件需要添加的位置序号
     * @return {ecui.ui.Item} 子选项控件
     */
    UI_POPUP_ITEM_CLASS.add = function (item, index) {
        return (this._cPopup =
            this._cPopup || createControl('Popup', createDom('ec-popup ' + this.getParent().getBaseClass())))
                .add(item, index);
    };

    /**
     * 获取当前菜单选项控件的所有子选项控件。
     * @public
     *
     * @return {Array} 子选项控件列表，如果不存在返回空列表
     */
    UI_POPUP_ITEM_CLASS.getItems = function () {
        return this._cPopup && this._cPopup.getItems() || [];
    };

    /**
     * 移除子选项控件。
     * @public
     *
     * @param {number|ecui.ui.Item} item 选项控件的位置序号/选项控件
     * @return {ecui.ui.Item} 被移除的子选项控件
     */
    UI_POPUP_ITEM_CLASS.remove = function (item) {
        return this._cPopup && this._cPopup.remove(item);
    };

    /**
     * 选项控件发生变化的处理。
     * 在 选项组接口 中，选项控件发生增加/减少操作时调用此方法。
     * @protected
     */
    UI_POPUP_CLASS.$alterItems = function () {
        if (getParent(this.getOuter())) {
            UI_POPUP_ITEM_FLUSH(this.getParent());

            //__gzip_original__optionSize
            var list = this.getItems(),
                len = list.length,
                height = len && list[0].getHeight(),
                optionSize = this._nOptionSize,
                prev = this._uPrev,
                next = this._uNext,
                prevHeight = 0,
                bodyWidth = this.getBodyWidth();

            this.setItemSize(bodyWidth, height);

            height *= MIN(optionSize, len);
            if (optionSize) {
                if (len > optionSize) {
                    prev.show();
                    next.show();
                    prev.$setSize(bodyWidth);
                    next.$setSize(bodyWidth);

                    // 以下使用 prev 代替向上滚动按钮的高度，使用 next 代替向下滚动按钮的高度
                    prevHeight = prev.getHeight();
                    next.setPosition(0, prevHeight + height);
                    height += prevHeight + next.getHeight();
                }
                else {
                    prev.hide();
                    next.hide();
                }
            }

            this.getBody().style.top = prevHeight + 'px';
            this.setBodySize(0, height);
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
    UI_POPUP_CLASS.$cache = function (style, cacheSize) {
        UI_ITEMS.$cache.call(this, style, cacheSize);

        if (this._uPrev) {
            this._uPrev.cache(true, true);
        }
        if (this._uNext) {
            this._uNext.cache(true, true);
        }
    };

    /**
     * 隐藏控件。
     * 隐藏弹出菜单，同时隐藏所有的子弹出菜单。
     * @protected
     */
    UI_POPUP_CLASS.$hide = function () {
        UI_CONTROL_CLASS.$hide.call(this);

        // 已经移入的菜单选项需要移出
        this.$setActived();

        if (UI_POPUP_CHAIN_LAST = this._cSuperior) {
            UI_POPUP_CHAIN_LAST._cInferior = null;
        }
        else {
            restore();
        }
    };

    /**
     * 界面点击强制拦截事件的默认处理。
     * 弹出菜单需要强制拦截浏览器的点击事件，关闭弹出菜单。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_POPUP_CLASS.$intercept = function (event) {
        if (!(findControl(event.target) instanceof UI_POPUP_ITEM)) {
            UI_POPUP_CHAIN_FIRST.hide();
        }
        return false;
    };

    /**
     * 设置激活的选项。
     * $setActived 方法改变选项组控件中当前选中项的效果，不会触发相应的移入移出事件。
     * @protected
     *
     * @param {ecui.ui.Item} item 选项控件
     */
    UI_POPUP_CLASS.$setActived = function (item) {
        UI_ITEMS.$setActived.call(this, item);
        if (!item) {
            if (this._cInferior) {
                this._cInferior.hide();
            }
        }
    };

    /**
     * 显示控件。
     * 显示弹出菜单时，必须保证弹出菜单显示在屏幕内，并且子弹出菜单展开的方向尽可能一致。
     * @protected
     */
    UI_POPUP_CLASS.$show = function () {
        UI_CONTROL_CLASS.$show.call(this);

        var o = getView(),
            el = this.getOuter(),
            pos;
        
        if (!getParent(el)) {
            DOCUMENT.body.appendChild(el);
            this.$alterItems();
        }

        pos = getPosition(el);

        // 限制弹出菜单不能超出屏幕
        this.setPosition(
            MIN(MAX(pos.left, o.left), o.right - this.getWidth()),
            MIN(MAX(pos.top, o.top), o.bottom - this.getHeight())
        );

        if (UI_POPUP_CHAIN_LAST) {
            // 如果之前存在已弹出的菜单
            el.style.zIndex = toNumber(getStyle(UI_POPUP_CHAIN_LAST.getOuter(), 'zIndex')) + 1;
            this._cSuperior = UI_POPUP_CHAIN_LAST;
            UI_POPUP_CHAIN_LAST._cInferior = this;
        }
        else {
            // 第一个弹出菜单，需要屏蔽鼠标点击
            el.style.zIndex = 32768;
            intercept(UI_POPUP_CHAIN_FIRST = this);
        }

        UI_POPUP_CHAIN_LAST = this;
    };

    /**
     * 计算控件的缓存。
     * 控件缓存部分核心属性的值，提高控件属性的访问速度，在子控件或者应用程序开发过程中，如果需要避开控件提供的方法(setSize、alterClass 等)直接操作 Element 对象，操作完成后必须调用 clearCache 方法清除控件的属性缓存，否则将引发错误。
     * @public
     *
     * @param {boolean} cacheSize 是否需要缓存控件大小，如果控件是另一个控件的部件时，不缓存大小能加快渲染速度，默认缓存
     * @param {boolean} force 是否需要强制刷新缓存，相当于执行了 clearCache 方法，默认不强制刷新
     */
    UI_POPUP_CLASS.cache = function (cacheSize, force) {
        if (getParent(this.getOuter())) {
            UI_CONTROL_CLASS.cache.call(this, cacheSize, force);
        }
    };

    /**
     * 控件刷新。
     * paint 方法将导致控件整体重绘，在通常情况下，建议控件改变的状态进行重绘，而不是调用 paint 方法。
     * @public
     */
    UI_POPUP_CLASS.paint = function () {
        if (getParent(this.getOuter())) {
            UI_CONTROL_CLASS.paint.call(this);
        }
    };

    /**
     * 设置当前控件的父控件。
     * 弹出菜单控件只能挂在 document.body 上，因此 setParent 方法无效。
     * @public
     *
     * @param {boolean} parent 设置/取消父控件对象，默认值为 false
     */
    UI_POPUP_CLASS.setParent = blank;



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
_oSelected       - 初始化时临时保存当前被选中的选项卡
_aPosition       - 选项卡位置缓存
_cSelected       - 当前选中的选项卡
_uPrev           - 向前滚动按钮
_uNext           - 向后滚动按钮

Item属性
_sContentDisplay - 内容 DOM 元素的布局属性
_eContent        - 内容 DOM 元素
*/


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
     * 鼠标单击控件事件的默认处理。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_TAB_BUTTON_CLASS.$click = function (event) {
        UI_CONTROL_CLASS.$click.call(this, event);

        //__gzip_original__pos
        var parent = this.getParent(),
            style = parent.getBody().style,
            pos = parent._aPosition,
            index = parent.$getLeftMostIndex();

        index = MIN(
            MAX(0, index + (parent._uPrev == this ? toNumber(style.left) != pos[index] ? 0 : -1 : 1)),
            pos.length - 1
        );
        style.left =
            MAX(pos[index], parent.getBodyWidth() - parent.$cache$bodyWidth - parent._uNext.getWidth()) + 'px';
        UI_TAB_FLUSH_BUTTON(parent);
    };

    /**
     * 鼠标在控件区域内按下事件的默认处理。
     * 鼠标在控件区域内按下时默认调用 $mousedown 方法。如果控件处于可操作状态(参见 isEnabled)，mousedown 方法触发 onmousedown 事件，如果事件返回值不为 false，则调用 $mousedown 方法。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_TAB_BUTTON_CLASS.$mousedown = function (event) {
        UI_CONTROL_CLASS.$mousedown.call(this, event);

        // 屏蔽普通W3C兼容的浏览器的选择操作
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
     * 直接设置父控件。
     * @protected
     *
     * @param {ecui.ui.Control} parent ECUI 控件对象
     */
    UI_TAB_ITEM_CLASS.$setParent = function (parent) {
        //__gzip_original__el
        var el = this._eContent;

        UI_ITEM_CLASS.$setParent.call(this, parent);
        if (el) {
            if (parent) {
                parent.getBase().appendChild(el);
            }
            else {
                removeDom(el);
            }
        }
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
        // 第一次进入时不需要调用$setSize函数，否则将初始化两次
        if (this._aPosition) {
            this.$setSize(this.getWidth());
        }

        for (
            var i = 0,
                list = this.getItems(),
                pos = this._aPosition = [this._uPrev.getWidth()],
                lastItem = {$cache$marginRight: 0},
                o;
            o = list[i++];
            lastItem = o
        ) {
            pos[i] = pos[i - 1] - MAX(lastItem.$cache$marginRight, o.$cache$marginLeft) - o.getWidth();
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
        for (var i = 0, list = this.getItems(), o; o = list[i++];) {
            o.$setSize(o.getWidth(), o.getHeight());
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
        if (this._cSelected == child) {
            var list = this.getItems(),
                index = indexOf(list, child);

            // 跳到被删除项的后一项
            this.setSelected(index == list.length - 1 ? index - 1 : index + 1);
        }

        UI_ITEMS.$remove.call(this, child);
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

        //__gzip_original__prev
        ///__gzip_original__next
        var prev = this._uPrev,
            next = this._uNext,
            style = this.getBody().style;

        width = this.getBodyWidth();
        if (this.$cache$bodyWidth > width) {
            width -= next.getWidth();
            next.getOuter().style.left = width + 'px';

            if (this._bButton) {
                // 缩小后变大，右边的空白自动填补
                width -= this.$cache$bodyWidth;
                if (toNumber(style.left) < width) {
                    style.left = width + 'px';
                }
            }
            else {
                prev.$show();
                next.$show();
                style.left = prev.getWidth() + 'px';
                this._bButton = true;
            }

            UI_TAB_FLUSH_BUTTON(this);
        }
        else if (this._bButton) {
            prev.$hide();
            next.$hide();
            style.left = '0px';
            this._bButton = false;
        }
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
     * 设置被选中的选项卡。
     * @public
     *
     * @param {number|ecui.ui.Tab.Item} 选项卡子选项的索引/选项卡子选项控件
     */
    UI_TAB_CLASS.setSelected = function (item) {
        //__gzip_original__prev
        var i = 0,
            list = this.getItems(),
            prev = this._uPrev,
            style = this.getBody().style,
            left = toNumber(style.left),
            o;

        if ('number' == typeof item) {
            item = list[item];
        }
        if (this._cSelected != item) {
            for (; o = list[i++]; ) {
                if (o._eContent) {
                    o._eContent.style.display = o == item ? o._sContentDisplay : 'none';
                }
            }

            if (this._cSelected) {
                this._cSelected.alterClass('selected', true);
            }

            if (item) {
                item.alterClass('selected');
                o = this._aPosition[indexOf(list, item)] - (prev.isShow() ? 0 : prev.getWidth());
                if (left < o) {
                    style.left = o + 'px';
                }
                else {
                    o -= item.getWidth() + prev.getWidth() + this._uNext.getWidth() - this.getBodyWidth();
                    if (left > o) {
                        style.left = o + 'px';
                    }
                }
                UI_TAB_FLUSH_BUTTON(this);
            }

            this._cSelected = item;
            this.change();
        }
    };


/*
Edit - 定义输入数据的基本操作。
输入框控件，继承自基础控件，实现了对原生 InputElement 的功能扩展，包括光标的控制、输入事件的实时响应(每次改变均触发事
件)，以及 IE 下不能动态改变输入框的表单项名称的模拟处理。输入框控件默认使用文本输入框，对于需要使用加密框的场景，可以
使用 &lt;input type="password" ecui="type:edit"&gt; 的方式初始化。

输入框控件直接HTML初始化的例子:
<input ecui="type:edit" name="test" value="test" />
或:
<div ecui="type:edit;name:test;value:test">
    <!-- 如果ec中不指定name,value，也可以在input中指定 -->
    <input name="test" value="test" />
</div>

属性
_bHidden - 输入框是否为hidden类型
_nLock   - 锁定的次数
_eInput  - INPUT对象
*/


    /**
     * 表单提交事件处理。
     * @private
     *
     * @param {Event} event 事件对象
     */
    function UI_EDIT_FORM_SUBMIT(event) {
        event = standardEvent(event);

        for (var i = 0, elements = event.target.elements, el; el = elements[i++]; ) {
            if (el.getControl) {
                el = el.getControl();
                el instanceof UI_EDIT && (el.onsubmit && el.onsubmit(event) === false || el.$submit(event));
            }
        }
    }

    /**
     * 为控件的 INPUT 节点绑定事件。
     * @private
     *
     * @param {ecui.ui.Edit} control 输入框控件对象
     */
    function UI_EDIT_BIND_EVENT(control) {
        $bind(control._eInput, control);
        if (!control._bHidden) {
            for (var name in UI_EDIT_INPUT) {
                attachEvent(control._eInput, name, UI_EDIT_INPUT[name]);
            }
        }
    }

    /**
     * 拖拽内容到输入框时处理函数。
     * 为了增加可控性，阻止该行为。[todo] firefox下无法阻止，后续升级
     * @private
     *
     * @param {Event} event 事件对象
     */
    UI_EDIT_INPUT.dragover = UI_EDIT_INPUT.drop = function (event) {
        event = standardEvent(event);
        event.stopPropagation();
        event.preventDefault();
    };

    /**
     * 输入框键盘事件处理函数。
     * @private
     *
     * @param {Event} event 事件对象
     */
    UI_EDIT_INPUT.keydown = UI_EDIT_INPUT.keypress = UI_EDIT_INPUT.keyup = function (event) {
        event = standardEvent(event);
        event.stopPropagation();
        return findControl(event.target)[event.type](event);
    };

    /**
     * 控件拥有焦点时，粘贴事件的处理。
     * 三种方式能改变输入框内容：1) 按键；2) 鼠标粘贴；3) 拖拽内容，用于记录用户选择的内容。
     * @private
     *
     * @param {Event} event 事件对象
     */
    UI_EDIT_INPUT.paste = function (event) {
        event = standardEvent(event);
        findControl(event.target).$keydown(event);
    };

    /**
     * 输入框输入内容事件处理函数。
     * @private
     *
     * @param {Event} event 事件对象
     */
    if (ieVersion) {
        UI_EDIT_INPUT.propertychange = function (event) {
            if (event.propertyName == 'value') {
                event = findControl(event.srcElement);
                if (!event._nLock) {
                    event._nLock++;
                    event.change();
                    event._nLock--;
                }
            }
        }
    }
    else {
        UI_EDIT_INPUT.input = function () {
            findControl(this).change();
        }
    }

    /**
     * 控件失去焦点事件的默认处理。
     * 控件失去焦点时默认调用 $blur 方法，删除控件在 $focus 方法中添加的扩展样式 -focus。如果控件处于可操作状态(参见 isEnabled)，blur 方法触发 onblur 事件，如果事件返回值不为 false，则调用 $blur 方法。
     * @protected
     */
    UI_EDIT_CLASS.$blur = function () {
        UI_CONTROL_CLASS.$blur.call(this);

        var input = this._eInput;
        detachEvent(input, 'blur', UI_EDIT_INPUT_BLUR);
        try {
            input.blur();
        }
        catch (e) {
        }
        attachEvent(input, 'blur', UI_EDIT_INPUT_BLUR);
    };

    /**
     * 销毁控件的默认处理。
     * 页面卸载时将销毁所有的控件，释放循环引用，防止在 IE 下发生内存泄漏，$dispose 方法的调用不会受到 ondispose 事件返回值的影响。
     * @protected
     */
    UI_EDIT_CLASS.$dispose = function () {
        this._eInput.getControl = undefined;
        this._eInput = null;
        UI_CONTROL_CLASS.$dispose.call(this);
    };

    /**
     * 控件获得焦点事件的默认处理。
     * 控件获得焦点时默认调用 $focus 方法，调用 alterClass 方法为控件添加扩展样式 -focus。如果控件处于可操作状态(参见 isEnabled)，focus 方法触发 onfocus 事件，如果事件返回值不为 false，则调用 $focus 方法。
     * @protected
     */
    UI_EDIT_CLASS.$focus = function () {
        UI_CONTROL_CLASS.$focus.call(this);

        var input = this._eInput;
        detachEvent(input, 'focus', UI_EDIT_INPUT_FOCUS);
        try {
            input.focus();
        }
        catch (e) {
        }
        attachEvent(input, 'focus', UI_EDIT_INPUT_FOCUS);
    };

    /**
     * 直接设置父控件。
     * @protected
     *
     * @param {ecui.ui.Control} parent ECUI 控件对象
     */
    UI_EDIT_CLASS.$setParent = function (parent) {
        UI_CONTROL_CLASS.$setParent.call(this, parent);
        if (parent = this._eInput.form) {
            detachEvent(parent, 'submit', UI_EDIT_FORM_SUBMIT);
            attachEvent(parent, 'submit', UI_EDIT_FORM_SUBMIT);
        }
    };

    /**
     * 设置控件的大小。
     * @protected
     *
     * @param {number} width 宽度，如果不需要设置则将参数设置为等价于逻辑非的值
     * @param {number} height 高度，如果不需要设置则省略此参数
     */
    UI_EDIT_CLASS.$setSize = function (width, height) {
        UI_CONTROL_CLASS.$setSize.call(this, width, height);
        var style = this._eInput.style;
        style.width = this.getBodyWidth() + 'px';
        style.height = this.getBodyHeight() + 'px';
    };

    /**
     * 输入框控件提交前的默认处理。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_EDIT_CLASS.$submit = blank;

    /**
     * 获取控件外层的 InputElement 对象。
     * @public
     *
     * @return {HTMLElement} InputElement 对象
     */
    UI_EDIT_CLASS.getInput = function () {
        return this._eInput;
    };

    /**
     * 获取控件的表单项名称。
     * 输入框控件可以在表单中被提交，getName 方法返回提交时用的表单项名称，表单项名称可以使用 setName 方法改变。
     * @public
     *
     * @return {string} INPUT 对象名称
     */
    UI_EDIT_CLASS.getName = function () {
        return this._eInput.name;
    };

    /**
     * 获得当前当前选区的结束位置。
     * @public
     *
     * @return {number} 输入框当前选区的结束位置
     */
    UI_EDIT_CLASS.getSelectionEnd = ieVersion ? function () {
        var range = DOCUMENT.selection.createRange().duplicate(),
            length = this._eInput.value.length;

        range.moveStart('character', -length);
        return range.text.length;
    } : function () {
        return this._eInput.selectionEnd;
    };

    /**
     * 获得当前选区的起始位置，即当前光标的位置。
     * @public
     *
     * @return {number} 输入框当前选区的起始位置，即输入框当前光标的位置
     */
    UI_EDIT_CLASS.getSelectionStart = ieVersion ? function () {
        var range = DOCUMENT.selection.createRange().duplicate(),
            length = this._eInput.value.length;

        range.moveEnd('character', length);
        return length - range.text.length;
    } : function () {
        return this._eInput.selectionStart;
    };

    /**
     * 获取控件的值。
     * getValue 方法返回提交时用的表单项的值，使用 setValue 方法设置。
     * @public
     *
     * @return {string} 控件的值
     */
    UI_EDIT_CLASS.getValue = function () {
        return this._eInput.value;
    };

    /**
     * 设置输入框光标的位置。
     * @public
     *
     * @param {number} pos 位置索引
     */
    UI_EDIT_CLASS.setCaret = ieVersion ? function (pos) {
        var range = this._eInput.createTextRange();
        range.collapse();
        range.select();
        range.moveStart('character', pos);
        range.collapse();
        range.select();
    } : function (pos) {
        this._eInput.setSelectionRange(pos, pos);
    };

    /**
     * 设置控件的可操作状态。
     * @public
     *
     * @param {boolean} status 控件是否可操作，默认为 true
     */
    UI_EDIT_CLASS.setEnabled = function (status) {
        UI_CONTROL_CLASS.setEnabled.call(this, status);
        // TODO 这里还是有问题，如果不可用时，IE下点击不会触发事件
        this._eInput.readOnly = !status;
    };

    /**
     * 设置控件的表单项名称。
     * 输入框控件可以在表单中被提交，setName 方法设置提交时用的表单项名称，表单项名称可以使用 getName 方法获取。
     * @public
     *
     * @param {string} name 表单项名称
     */
    UI_EDIT_CLASS.setName = function (name) {
        this._eInput = setInput(this._eInput, name || '');
        UI_EDIT_BIND_EVENT(this);
    };

    /**
     * 设置控件的值。
     * setValue 方法设置提交时用的表单项的值，使用 getValue 方法获取设置的值。
     * @public
     *
     * @param {string} value 控件的值
     */
    UI_EDIT_CLASS.setValue = function (value) {
        this._nLock++;
        this._eInput.value = value;
        this._nLock--;
    };


/*
FormatEdit - 定义格式化输入数据的基本操作。
格式化输入框控件，继承自输入框控件，对输入的数据内容格式进行限制。

输入框控件直接HTML初始化的例子:
<input ecui="type:format-edit" name="test" />
或:
<div ecui="type:format-edit;name:test;value:test">
    <!-- 如果ec中不指定name,value，也可以在input中指定 -->
    <input name="test" value="test" />
</div>

属性
_bSymbol    - 是否自动进行全半角转换
_bTrim      - 字符串是否需要过滤两端空白
_nMinLength - 允许提交的最小长度
_nMaxLength - 允许提交的最大长度
_nMinValue  - 允许提交的最小值
_nMaxValue  - 允许提交的最大值
_sEncoding  - 字节码编码集
_sLeft      - 每次操作左边的字符串
_sSelection - 每次操作被替换的字符串
_sRight     - 每次操作右边的字符串
_sInput     - 每次操作输入的字符串
_oKeyMask   - 允许提交的字符限制正则表达式
_oFormat    - 允许提交的格式正则表达式
*/


    /**
     * 按指定编码计算字符串的字节长度。
     * 为了简化处理，将 utf8 的非 ascii 字符均按三字节计算，gb2312 均按两字节计算。
     * @private
     *
     * @param {string} source 源字符串
     * @param {string} encoding 编码名称
     * @return {number} 字符串的字节长度
     */
    function UI_FORMAT_EDIT_BYTELENGTH(source, encoding) {
        return (encoding ? source.replace(/[^\x00-\xff]/g, encoding == 'utf8' ? 'aaa' : 'aa') : source).length;
    }

    /**
     * 控件失去焦点事件的默认处理。
     * 控件失去焦点时默认调用 $blur 方法，删除控件在 $focus 方法中添加的扩展样式 -focus。如果控件处于可操作状态(参见 isEnabled)，blur 方法触发 onblur 事件，如果事件返回值不为 false，则调用 $blur 方法。
     * @protected
     */
    UI_FORMAT_EDIT_CLASS.$blur = function () {
        UI_EDIT_CLASS.$blur.call(this);
        this.validate();
    };

    /**
     * 获取当前输入的内容，如果是粘贴操作是一个长度超过1的字符串。
     * @protected
     *
     * @return {string} 当前输入的内容
     */
    UI_FORMAT_EDIT_CLASS.$getInputText = function () {
        return this._sInput;
    };

    /**
     * 控件拥有焦点时，键盘按下事件(鼠标在控件区域内移动事件)的默认处理。
     * 三种方式能改变输入框内容：1) 按键；2) 鼠标粘贴；3) 拖拽内容，keydown 在 change 事件前，因此按键改变内容方式时最适合记录 change 前光标信息，用于记录用户选择的内容。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_FORMAT_EDIT_CLASS.$keydown = UI_FORMAT_EDIT_CLASS.$mousemove = function (event) {
        var value = this.getInput().value,
            start = this.getSelectionStart(),
            end = this.getSelectionEnd();

        this._sLeft = value.slice(0, start);
        this._sRight = value.slice(end);
        this._sSelection = value.slice(start, end);

        UI_EDIT_CLASS['$' + event.type].call(this, event);
    };

    /**
     * 输入框控件提交前的默认处理。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_FORMAT_EDIT_CLASS.$submit = function (event) {
        UI_EDIT_CLASS.$submit.call(this, event);
        this.validate() || event.preventDefault();
    };

    /**
     * 控件内容改变时事件的处理。
     * @public
     */
    UI_FORMAT_EDIT_CLASS.change = function () {
        // 获取本次输入的内容
        var value = this.getValue(),
            keyMask = this._oKeyMask,
            length = this._nMaxLength,
            max = this._nMaxValue,
            encoding = this._sEncoding,
            left = this._sLeft || '',
            right = this._sRight || '',
            selection = this._sSelection || '',
            start = left.length,
            end = value.length - right.length,
            inputValue = end < 0 ? undefined : value.slice(start, end);

        // 如果是删除操作直接结束
        if (inputValue) {
            // 进行全角转半角操作
            if (this._bSymbol) {
                inputValue = toHalfWidth(inputValue);
            }

            // 过滤不合法的字符集
            if (keyMask) {
                inputValue = (inputValue.match(keyMask) || []).join('');
            }

            // 过滤前后空格
            if (this._bTrim) {
                inputValue = trim(inputValue);
            }

            // 当maxLength有值时，计算当前还能插入内容的长度
            if (length > 0) {
                length -= UI_FORMAT_EDIT_BYTELENGTH(left, encoding) + UI_FORMAT_EDIT_BYTELENGTH(right, encoding);
                inputValue = encoding ? sliceByte(inputValue, length) : inputValue.slice(0, length);
            }

            if (!inputValue) {
                this.restore();
                return;
            }

            // 如果存在_nMaxVal，则判断是否符合最大值
            if (max !== undefined && !(max >= left + inputValue + right - 0)) {
                inputValue = selection;
            }

            this.setValue(left + inputValue + right);
            this.setCaret(start + inputValue.length);
        }
        this._sInput = inputValue;

        UI_EDIT_CLASS.change.call(this);
    };

    /**
     * 恢复输入框的值。
     * @public
     */
    UI_FORMAT_EDIT_CLASS.restore = function () {
        var left = this._sLeft || '';

        this.setValue(left + (this._sSelection || '') + (this._sRight || ''));
        this.setCaret(left.length);
    };

    /**
     * 检测输入框当前的值是否合法。
     * @public
     *
     * @return {boolean} 当前值是否合法
     */
    UI_FORMAT_EDIT_CLASS.validate = function () {
        var err = [],
            minLength = this._nMinLength,
            maxLength = this._nMaxLength,
            minValue = this._nMinValue,
            maxValue = this._nMaxValue,
            pattern = this._oPattern,
            value = this.getValue(),
            length = UI_FORMAT_EDIT_BYTELENGTH(value, this._sEncoding);

        minLength > length && err.push(['minLength', minLength]);
        maxLength < length && err.push(['maxLength', maxLength]);
        minValue > value - 0 && err.push(['minValue', minValue]);
        maxValue < value - 0 && err.push(['maxValue', maxValue]);
        (pattern && !pattern.test(value)) && err.push(['pattern']);

        value = !err[0];
        value || (this.onerror && this.onerror(err));
        return value;
    };


/*
Checkbox - 定义单个设置项选择状态的基本操作。
复选框控件，继承自输入框控件，实现了对原生 InputElement 复选框的功能扩展，支持复选框之间的主从关系定义。当一个复选框的
“从复选框”选中一部分时，“主复选框”将处于半选状态，这种状态逻辑意义上等同于未选择状态，但显示效果不同，复选框的主从关系
可以有多级。

复选框控件直接HTML初始化的例子:
<input ecui="type:checkbox;checked:true" type="checkbox" name="test" value="test" checked="checked" />
也可以使用其它标签初始化:
<div ecui="type:checkbox;checked:true;name:test">
    <!-- 如果ec中不指定name，也可以在input中指定 -->
    <input name="test" />
</div>

属性
_nStatus   - 复选框当前的状态，0--全选，1--未选，2--半选
_cSuperior - 复选框的上级管理者
_aInferior - 所有的下级复选框
*/


    /**
     * 改变复选框状态。
     * @private
     *
     * @param {ecui.ui.Checkbox} control 复选框对象
     * @param {number} status 新的状态，0--全选，1--未选，2--半选
     * @return {boolean} 状态是否发生了改变
     */
    function UI_CHECKBOX_CHANGE(control, status) {
        var superior = control._cSuperior;

        if (status !== control._nStatus) {
            // 状态发生改变时进行处理
            control.setClass(control.getBaseClass() + ['-checked', '', '-part'][status]);

            control._nStatus = status;
            control.getInput().checked = !status;

            // 如果有上级复选框，刷新上级复选框的状态
            superior && UI_CHECKBOX_FLUSH(superior);

            control.change();
            return true;
        }
        return false;
    }

    /**
     * 复选框控件刷新，计算所有从复选框，根据它们的选中状态计算自身的选中状态。
     * @private
     *
     * @param {ecui.ui.Checkbox} control 复选框控件
     */
    function UI_CHECKBOX_FLUSH(control) {
        for (var i = 0, o, status; o = control._aInferior[i]; ) {
            if (i++ && status != o._nStatus) {
                status = 2;
                break;
            }
            status = o._nStatus;
        }

        i && UI_CHECKBOX_CHANGE(control, status);
    }

    /**
     * 鼠标单击控件事件的默认处理。
     * 控件点击时将改变当前的选中状态。如果控件处于可操作状态(参见 isEnabled)，click 方法触发 onclick 事件，如果事件返回值不为 false，则调用 $click 方法。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_CHECKBOX_CLASS.$click = function (event) {
        UI_EDIT_CLASS.$click.call(this, event);

        this.setChecked(!!this._nStatus);
    };

    /**
     * 控件拥有焦点时，键盘事件的默认处理。
     * 屏蔽空格键按下事件。Opera 下仅用 keydown 不能屏蔽空格键事件，还需要在 keypress 中屏蔽。如果控件处于可操作状态(参见 isEnabled)，keydown/keypress/keyup 方法触发 onkeydown/onkeypress/onkeyup 事件，如果事件返回值不为 false，则调用 $keydown/$keypress/$keyup 方法。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_CHECKBOX_CLASS.$keydown = UI_CHECKBOX_CLASS.$keypress = UI_CHECKBOX_CLASS.$keyup = function (event) {
        if (UI_EDIT_CLASS['$' + event.type](event) === false) {
            return false;
        }
        if (event.which == 32) {
            event.type == 'keyup' && this.$click(event);
            return false;
        }
    };

    /**
     * 控件自动渲染全部完成后的处理。
     * 页面刷新时，部分浏览器会回填输入框的值，需要在回填结束后触发设置控件的状态。
     * @protected
     */
    UI_CHECKBOX_CLASS.$ready = function () {
        this._aInferior.length || UI_CHECKBOX_CHANGE(this, this.getInput().checked ? 0 : 1);
    };

    /**
     * 获取全部的从属复选框。
     * 复选框控件调用 setSuperior 方法指定了上级复选框控件后，它就是上级复选框控件的从属复选框控件之一。
     * @public
     *
     * @return {Array} 复选框控件数组
     */
    UI_CHECKBOX_CLASS.getInferiors = function () {
        return this._aInferior.slice();
    };

    /**
     * 获取上级复选框。
     * getSuperior 方法返回调用 setSuperior 方法指定的上级复选框控件。
     * @public
     *
     * @return {ecui.ui.Checkbox} 复选框控件
     */
    UI_CHECKBOX_CLASS.getSuperior = function () {
        return this._cSuperior || null;
    };

    /**
     * 判断控件是否选中。
     * @public
     *
     * @return {boolean} 是否选中
     */
    UI_CHECKBOX_CLASS.isChecked = function () {
        return !this._nStatus;
    };

    /**
     * 设置复选框控件选中状态。
     * @public
     *
     * @param {boolean} status 是否选中，默认选中
     */
    UI_CHECKBOX_CLASS.setChecked = function (status) {
        if (UI_CHECKBOX_CHANGE(this, status !== false ? 0 : 1)) {
            // 如果有下级复选框，全部改为与当前复选框相同的状态
            for (var i = 0, o; o = this._aInferior[i++]; ) {
                o.setChecked(status);
            }
        }
    };

    /**
     * 设置当前控件的父控件。
     * 复选框控件改变父控件时，还需要同步清除主从附属关系。
     * @public
     *
     * @param {ecui.ui.Control|HTMLElement} parent 父控件对象/父 Element 对象，忽略参数则将控件移出 DOM 树
     */
    UI_CHECKBOX_CLASS.setParent = function (parent) {
        UI_EDIT_CLASS.setParent.call(this, parent);
        this.getParent() || this.setSuperior();
    };

    /**
     * 设置上级复选框。
     * setSuperior 方法指定上级复选框控件后，可以通过访问上级复选框控件的 getInferiors 方法获取列表，列表中即包含了当前的控件。
     * @public
     *
     * @param {ecui.ui.Checkbox} superior 上级复选框控件
     */
    UI_CHECKBOX_CLASS.setSuperior = function (superior) {
        var oldSuperior = this._cSuperior;
        this._cSuperior = superior;

        // 已经设置过上级复选框，需要先释放
        if (oldSuperior) {
            remove(oldSuperior._aInferior, this);
            UI_CHECKBOX_FLUSH(oldSuperior);
        }

        if (superior) {
            superior._aInferior.push(this);
            UI_CHECKBOX_FLUSH(superior);
        }
    };


/*
Radio - 定义一组选项中选择唯一选项的基本操作。
单选框控件，继承自输入框控件，实现了对原生 InputElement 单选框的功能扩展，支持对选中的图案的选择。单选框控件需要分组后
使用，在表单项提交中，一组单选框控件中的第一个单选框保存提交用的表单内容。

单选框控件直接HTML初始化的例子:
<input ecui="type:radio" type="radio" name="test" checked="checked" />
也可以使用其它标签初始化:
<div ecui="type:radio;name:test;checked:true"></div>
*/


    /**
     * 单选框控件刷新
     * @private
     *
     * @param {ecui.ui.Radio} control 单选框控件
     * @param {boolean|undefined} status 新的状态，如果忽略表示不改变当前状态
     */
    function UI_RADIO_FLUSH(control, status) {
        if (status !== undefined) {
            control.getInput().checked = status;
        }
        control.setClass(control.getBaseClass() + (control.isChecked() ? '-checked' : ''));
    }

    /**
     * 鼠标单击控件事件的默认处理。
     * 控件点击时将控件设置成为选中状态，同时取消同一个单选框控件组的其它控件的选中状态。如果控件处于可操作状态(参见 isEnabled)，click 方法触发 onclick 事件，如果事件返回值不为 false，则调用 $click 方法。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_RADIO_CLASS.$click = function (event) {
        UI_EDIT_CLASS.$click.call(this, event);
        this.checked();
    };

    /**
     * 控件拥有焦点时，键盘事件的默认处理。
     * 屏蔽空格键按下事件。Opera 下仅用 keydown 不能屏蔽空格键事件，还需要在 keypress 中屏蔽。如果控件处于可操作状态(参见 isEnabled)，keydown/keypress/keyup 方法触发 onkeydown/onkeypress/onkeyup 事件，如果事件返回值不为 false，则调用 $keydown/$keypress/$keyup 方法。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_RADIO_CLASS.$keydown = UI_RADIO_CLASS.$keypress = UI_RADIO_CLASS.$keyup = function (event) {
        if (UI_EDIT_CLASS['$' + event.type](event) === false) {
            return false;
        }
        if (event.which == 32) {
            event.type == 'keyup' && this.$click(event);
            return false;
        }
    };

    /**
     * 控件自动渲染全部完成后的处理。
     * 页面刷新时，部分浏览器会回填输入框的值，需要在回填结束后触发设置控件的状态。
     * @protected
     */
    UI_RADIO_CLASS.$ready = function () {
        UI_RADIO_FLUSH(this);
    };

    /**
     * 设置单选框控件为选中状态。
     * 将控件设置成为选中状态，同时取消同一个单选框控件组的其它控件的选中状态。
     * @public
     */
    UI_RADIO_CLASS.checked = function () {
        if (!this.isChecked()) {
            for (var i = 0, list = this.getItems(), o; o = list[i++]; ) {
                UI_RADIO_FLUSH(o, false);
            }
            UI_RADIO_FLUSH(this, true);
        }
    };

    /**
     * 获取与当前单选框同组的全部单选框。
     * getItems 方法返回包括当前单选框在内的与当前单选框同组的全部单选框，同组的单选框选中状态存在唯一性。
     * @public
     *
     * @return {Array} 单选框控件数组
     */
    UI_RADIO_CLASS.getItems = function () {
        var i = 0,
            elements = this.getInput(),
            o = elements.form,
            result = [];

        if (o) {
            elements = o[elements.name];
            for (; o = elements[i++]; ) {
                if (o.getControl) {
                    result.push(o.getControl());
                }
            }
        }
        else if (elements.name) {
            return query({type: UI_RADIO, custom: function (control) {
                return control.getName() == elements.name;
            }});
        }
        else {
            return [this];
        }
    };

    /**
     * 判断控件是否选中。
     * @public
     *
     * @return {boolean} 是否选中
     */
    UI_RADIO_CLASS.isChecked = function () {
        return this.getInput().checked;
    };


/*
Tree - 定义树形结构的基本操作。
树控件，继承自基础控件，不可以被改变大小。树控件可以包含普通子控件或者子树控件，普通子控件显示在它的文本区域，如果是子
树控件，将在专门的子树控件区域显示。子树控件区域可以被收缩隐藏或是展开显示，默认情况下点击树控件就改变子树控件区域的状
态。

树控件直接HTML初始化的例子:
<div ecui="type:tree;fold:true">
    <!-- 当前节点的文本，如果没有整个内容就是节点的文本 -->
    <label>节点的文本</label>
    <!-- 这里放子控件，如果需要fold某个子控件，将子控件的style="display:none"即可 -->
    <li>子控件文本</li>
    ...
</div>

属性
_sItemsDisplay - 隐藏时_eItems的状态，在显示时恢复
_eItems        - 子控件区域Element对象
_aTree         - 子控件集合
*/


    /**
     * 设置树控件的选项组 Element 对象。
     * @private
     *
     * @param {ecui.ui.Tree} tree 树控件
     * @param {HTMLElement} childItems 子树选项组的 Element 对象，如果省略将创建一个 Element 对象
     * @return {HTMLElement} 子树选项组的 Element 对象
     */
    function UI_TREE_SETITEMS(tree, childItems) {
        childItems = tree._eItems = childItems || createDom();
        childItems.className = tree.getType() + '-items ' + tree.getBaseClass() + '-items';
        childItems.style.cssText = '';
        return childItems;
    }

    /**
     * 树控件刷新，根据子树控件的数量及显示的状态设置样式，分为 -empty(没有子树控件)、-fold(子树收缩)与普通样式三种。
     * @private
     *
     * @param {ecui.ui.Tree} control 树控件
     */
    function UI_TREE_FLUSH(control) {
        control.setClass(
            control.getBaseClass() + (control._aTree.length ? control._eItems.style.display ? '-fold' : '' : '-empty')
        );
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
        return $fastCreate(parent.constructor, el, parent, params);
    }

    /**
     * 设置树控件的显示/隐藏子树状态。
     * @private
     *
     * @param {ecui.ui.Tree} tree 树控件
     * @param {boolean} status 显示/隐藏子树状态
     */
    function UI_TREE_SET_FOLD(tree, status) {
        for (var i = 0, child; child = tree._aTree[i++]; ) {
            child.setFold(status);
            UI_TREE_SET_FOLD(child, status);
        }
    }

    /**
     * 鼠标单击控件事件的默认处理。
     * 控件点击时改变子树控件的显示/隐藏状态。如果控件处于可操作状态(参见 isEnabled)，click 方法触发 onclick 事件，如果事件返回值不为 false，则调用 $click 方法。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_TREE_CLASS.$click = function (event) {
        UI_CONTROL_CLASS.$click.call(this, event);
        this.setFold(!this.isFold());
    };

    /**
     * 无效，树控件禁止设置大小。
     * @protected
     */
    UI_TREE_CLASS.$cache = UI_TREE_CLASS.$resize = UI_TREE_CLASS.$setSize = blank;

    /**
     * 销毁控件的默认处理。
     * @protected
     */
    UI_TREE_CLASS.$dispose = function () {
        this._eItems = null;
        UI_CONTROL_CLASS.$dispose.call(this);
    };

    /**
     * 隐藏控件。
     * 隐藏树控件的同时需要将子树区域也隐藏。
     * @protected
     */
    UI_TREE_CLASS.$hide = function () {
        UI_CONTROL_CLASS.$hide.call(this);

        var o = this._eItems;
        if (o) {
            o = o.style;
            this._sItemsDisplay = o.display;
            o.display = 'none';
        }
    };

    /**
     * 显示控件。
     * 显示树控件的同时需要将子树区域也显示。
     * @protected
     */
    UI_TREE_CLASS.$show = function () {
        UI_CONTROL_CLASS.$show.call(this);

        if (this._sItemsDisplay !== undefined) {
            this._eItems.style.display = this._sItemsDisplay;
            this._sItemsDisplay = undefined;
        }

        for (var parent = this; parent = parent.getParent(); ) {
            parent.setFold(false);
        }
    };

    /**
     * 添加子树控件。
     * @public
     *
     * @param {string|ecui.ui.Tree} item 子树控件的 html 内容/树控件
     * @param {number} index 子树控件需要添加的位置序号，不指定将添加在最后
     * @return {ecui.ui.Tree} 树控件
     */
    UI_TREE_CLASS.add = function (item, index) {
        var o = item,
            items = this._aTree;

        if ('string' == typeof item) {
            items.push(item = UI_TREE_CREATE_CHILD(createDom(), this, {}));
            item.$setParent();
            item.$setBodyHTML(o);
        }
        item.setParent(this);

        if (item.getParent() && (o = items[index]) && o != item) {
            items.splice(index, 0, items.pop());
            item._eItems && insertAfter(item._eItems, insertBefore(item.getOuter(), o.getOuter()));
        }
        return item;
    };

    /**
     * 收缩当前树控件的所有子树控件。
     * collapse 方法将递归的调用子树控件的 collapse 方法。
     * @public
     */
    UI_TREE_CLASS.collapse = function () {
        UI_TREE_SET_FOLD(this);
    };

    /**
     * 展开当前树控件的所有子树控件。
     * expand 方法将递归的调用子树控件的 expand 方法。
     * @public
     */
    UI_TREE_CLASS.expand = function () {
        UI_TREE_SET_FOLD(this, false);
    };

    /**
     * 获取当前树控件的所有子树控件。
     * getTrees 方法返回使用 add 方法或 setParent 方法调用声明父子关系的树控件。
     * @public
     *
     * @return {Array} 树控件列表
     */
    UI_TREE_CLASS.getChildTrees = function () {
        return this._aTree.slice();
    };

    /**
     * 获取当前树控件的第一个子树控件。
     * @public
     *
     * @return {ecui.ui.Tree} 树控件，如果没有，返回 null
     */
    UI_TREE_CLASS.getFirst = function () {
        return this._aTree[0] || null;
    };

    /**
     * 获取当前树控件的最后一个子树控件。
     * @public
     *
     * @return {ecui.ui.Tree} 树控件，如果没有，返回 null
     */
    UI_TREE_CLASS.getLast = function () {
        return this._aTree[this._aTree.length - 1] || null;
    };

    /**
     * 获取当前树控件的后一个同级树控件。
     * @public
     *
     * @return {ecui.ui.Tree} 树控件，如果没有，返回 null
     */
    UI_TREE_CLASS.getNext = function () {
        var items = this.getParent();
        return items instanceof UI_TREE && items._aTree[indexOf(items._aTree, this) + 1] || null;
    };

    /**
     * 获取当前树控件的前一个同级树控件。
     * @public
     *
     * @return {ecui.ui.Tree} 树控件，如果没有，返回 null
     */
    UI_TREE_CLASS.getPrev = function () {
        var items = this.getParent();
        return items instanceof UI_TREE && items._aTree[indexOf(items._aTree, this) - 1] || null;
    };

    /**
     * 获取当前树控件的根。
     * @public
     *
     * @return {ecui.ui.Tree} 树控件的根
     */
    UI_TREE_CLASS.getRoot = function () {
        for (var root = this, parent; (parent = root.getParent()) instanceof UI_TREE; root = parent) {};
        return root;
    };

    /**
     * 当前子控件区域是否显示/隐藏。
     * @public
     *
     * @return {boolean} true 表示子控件区域隐藏，false 表示子控件区域显示
     */
    UI_TREE_CLASS.isFold = function () {
        return !this._eItems || !!this._eItems.style.display;
    };

    /**
     * 显示/隐藏子控件区域。
     * setFold 方法将触发各级父树控件的 onchange 事件。
     * @public
     *
     * @param {boolean} status 如果为 false 表示显示子树控件，否则为隐藏子树控件
     */
    UI_TREE_CLASS.setFold = function (status) {
        if (this._eItems) {
            this._eItems.style.display = status !== false ? 'none' : '';
        }

        UI_TREE_FLUSH(this);
    };

    /**
     * 设置当前控件的父控件。
     * @public
     *
     * @param {HTMLElement|ecui.ui.Control|ecui.ui.Tree} parent 父控件对象/父 Element 对象，忽略参数则将控件移出 DOM 树
     */
    UI_TREE_CLASS.setParent = function (parent) {
        var el = this.getOuter(),
            o = this.getParent();

        if (parent != getParent(el) && (!parent || parent != o)) {
            if (o instanceof UI_TREE) {
                // 先将树结点从上级树控件中移除
                remove(o._aTree, this);
                UI_TREE_FLUSH(o);
            }

            if (o = parent instanceof UI_TREE && parent.getBody()) {
                // 根节点变化，移除可能的选中项
                parent.$setBody(parent._eItems || UI_TREE_SETITEMS(parent));
            }

            UI_CONTROL_CLASS.setParent.call(this, parent);

            if (o) {
                parent.$setBody(o);
                parent._aTree.push(this);
                UI_TREE_FLUSH(parent);
            }

            // 如果包含子结点容器，需要将子结点容器显示在树控件之后
            if (this._eItems) {
                // 以下使用 parent 表示外层 DOM 对象
                getParent(el) ? insertAfter(this._eItems, el) : removeDom(this._eItems);
            }
        }
    };



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
_sName     - 节点项的名称
_sValue    - 节点项的值
_eInput    - 树的根节点拥有，保存树对应的提交 INPUT
_cSelected - 树的根节点拥有，保存当前选中的项
*/


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
        if (getMouseX(this) <= toNumber(getStyle(this.getBase(), 'paddingLeft'))) {
            var root = this.getRoot();

            root._cSelected && root._cSelected.alterClass('selected', true);
            this.alterClass('selected');
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
            this.alterClass('selected', true);
            root._cSelected = null;
            UI_RADIO_TREE_SETVALUE(root, '');
        }
        if (this._cSelected) {
            this._cSelected.alterClass('selected', true);
            this._cSelected = null;
            this._eInput && removeDom(this._eInput);
        }
    };



/*
CheckTree - 定义包含复选框的树形结构的基本操作。
包含复选框的树控件，继承自树控件。每一个选项包含一个复选框进行选择，除非特别的指定，否则子节点的复选框与父节点的复选框
自动联动。

树控件直接HTML初始化的例子:
<div ecui="type:check-tree;fold:true;id:parent;name:part">
    <!-- 当前节点的文本，如果没有整个内容就是节点的文本 -->
    <label>节点的文本</label>
    <!-- 这里放子控件，如果需要fold某个子控件，将子控件的style="display:none"即可 -->
    <li ecui="superior:other">子控件文本</li>
    <li>子控件文本(复选框默认与父控件复选框联动)</li>
    ...
</div>

属性
_oSuperior - 关联的父复选框控件ID，默认与父控件复选框关联
_uCheckbox - 复选框控件
*/


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
        for (var i = 0, list = this.getChildTrees(), o; o = list[i++]; ) {
            o.$init();
        }
        this._uCheckbox.$init();
        UI_TREE_CLASS.$init.call(this);
    };

    /**
     * 获取包括当前树控件在内的全部选中的子树控件。
     * @public
     *
     * @return {Array} 全部选中的树控件列表
     */
    UI_CHECK_TREE_CLASS.getChecked = function () {
        for (var i = 0, list = this.getChildTrees(), result = this.isChecked() ? [this] : [], o; o = list[i++]; ) {
            result = result.concat(o.getChecked());    
        }
        return result;
    };

    /**
     * 获取当前树控件复选框的表单项的值。
     * @public
     *
     * @return {string} 表单项的值
     */
    UI_CHECK_TREE_CLASS.getValue = function () {
        return this._uCheckbox.getValue();
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

    /**
     * 设置当前树控件复选框选中状态。
     * @public
     *
     * @param {boolean} 是否选中当前树控件复选框
     */
    UI_CHECK_TREE_CLASS.setChecked = function (status) {
        this._uCheckbox.setChecked(status);    
    };


/*
Color - 色彩类，定义从 RGB 到 HSL 之间的互相转化

属性
_nRed        - 红色值(0-255)
_nGreen      - 绿色值(0-255)
_nBlue       - 蓝色值(0-255)
_nHue        - 色调(0-1)
_nSaturation - 饱和度(0-1)
_nLight      - 亮度(0-1)
*/


    /**
     * 根据色调计算 RGB 模式下的单系色彩值
     * @private
     *
     * @param {number} minValue HSL 色彩中的最小值
     * @param {number} maxValue HSL 色彩中的最大值
     * @param {number} hue 色调
     * @return {number} 色彩值(0-255)
     */
    function COLOR_HUE2RGB(minValue, maxValue, hue) {
        hue = hue < 0 ? hue + 1 : (hue > 1 ? hue - 1 : hue);
        hue = hue < 0.5 ? MIN(6 * hue, 1) : MAX(4 - 6 * hue, 0);
        return ROUND(255 * (minValue + (maxValue - minValue) * hue));
    }

    /**
     * 获取 RGB 模式下的蓝色值
     * @public
     *
     * @return {number} 蓝色值(0-255)
     */
    COLOR_CLASS.getBlue = function () {
        return this._nBlue;
    }

    /**
     * 获取 RGB 模式下的绿色值
     * @public
     *
     * @return {number} 绿色值(0-255)
     */
    COLOR_CLASS.getGreen = function () {
        return this._nGreen;
    }

    /**
     * 获取 HSL 模式下的色调
     * @public
     *
     * @return {number} 色调(0-1)
     */
    COLOR_CLASS.getHue = function () {
        return this._nHue;
    }

    /**
     * 获取 HSL 模式下的亮度
     * @public
     *
     * @return {number} 亮度(0-1)
     */
    COLOR_CLASS.getLight = function () {
        return this._nLight;
    }

    /**
     * 获取 RGB 模式下 6 字符表示的 16 进制色彩值
     * @public
     *
     * @return {string} 6 字符色彩值(如FFFFFF)
     */
    COLOR_CLASS.getRGB = function () {
        var red = this._nRed,
            green = this._nGreen,
            blue = this._nBlue;

        return ((red < 16 ? '0' : '') + red.toString(16)
            + (green < 16 ? '0' : '') + green.toString(16)
            + (blue < 16 ? '0' : '') + blue.toString(16)).toUpperCase();
    }

    /**
     * 获取 RGB 模式下的红色值
     * @public
     *
     * @return {number} 红色值(0-255)
     */
    COLOR_CLASS.getRed = function () {
        return this._nRed;
    }

    /**
     * 获取 HSL 模式下的饱和度
     * @public
     *
     * @return {number} 饱和度(0-1)
     */
    COLOR_CLASS.getSaturation = function () {
        return this._nSaturation;
    }

    /**
     * 设置 RGB 模式的色彩
     * @public
     *
     * @param {number} red 红色值(0-255)
     * @param {number} green 绿色值(0-255)
     * @param {number} blue 蓝色值(0-255)
     */
    COLOR_CLASS.setRGB = function (red, green, blue) {
        this._nRed = red;
        this._nGreen = green;
        this._nBlue = blue;

        red /= 255;
        green /= 255;
        blue /= 255;

        var minValue = MIN(red, green, blue),
            maxValue = MAX(red, green, blue),
            value = maxValue - minValue,
            h;

        this._nLight = (maxValue + minValue) / 2;
        if (value) {
            h = red == maxValue
                ? (green - blue) / 6 / value
                : (green == maxValue ? 1 / 3 + (blue - red) / 6 / value : 2 / 3 + (red - green) / 6 / value);
            this._nHue = h < 0 ? h += 1 : (h > 1 ? h -= 1 : h);
            this._nSaturation = this._nLight < 0.5
                ? value / (maxValue + minValue)
                : value / (2 - maxValue - minValue);
        }
        else {
            this._nHue = 0;
            this._nSaturation = 0;
        }
    }

    /**
     * 设置 HSL 模式的色彩
     * @public
     *
     * @param {number} hue 色调(0-1)
     * @param {number} saturation 饱和度(0-1)
     * @param {number} light 亮度(0-1)
     */
    COLOR_CLASS.setHSL = function (hue, saturation, light) {
        var maxValue = light + MIN(light, 1 - light) * saturation,
            minValue = 2 * light - maxValue;

        this._nHue = hue;
        this._nSaturation = saturation;
        this._nLight = light;

        this._nRed = COLOR_HUE2RGB(minValue, maxValue, hue + 1 / 3);
        this._nGreen = COLOR_HUE2RGB(minValue, maxValue, hue);
        this._nBlue = COLOR_HUE2RGB(minValue, maxValue, hue - 1 / 3);
    }


/*
HTMLPalette - 定义拾色器的基本操作
拾色器控件，继承自基础控件，内部包含了多个部件，分别是色彩选择区(基础控件)、色彩选择区箭头(基础控件)、亮度条选择区(基
础控件)、亮度条选择区箭头(基础控件)、基本色彩选择区(基础控件组)、色彩显示区(基础控件)、输入区域(输入框控件组)与确认按
钮(基础控件)。

拾色器控件直接HTML初始化的例子:
<div ecui="type:palette">
</div>

属性
_uMain            - 左部色彩选择区
_uMain._uIcon     - 左部色彩选择区箭头
_uLightbar        - 中部亮度条选择区
_uLightbar._uIcon - 中部亮度条选择区箭头
_uColor           - 右部色彩显示区
_uConfirm         - 确认按钮
_aValue           - 右部输入区域
*/


    /**
     * 刷新色彩值输入框
     * @private
     *
     * @param {ecui.ui.Palette} palette 拾色器控件对象
     * @param {Array} colors 色彩值数组，依次为 RGB, H, R, S, G, L, B，省略的值将不填充
     */
    function UI_PALETTE_VALUES_FLUSH(palette, colors) {
        for (var i = 0; i < 7; i++) {
            if (colors[i] !== undefined) {
                i || (palette._uColor.getBase().style.backgroundColor = '#' + colors[i]);
                palette._aValue[i].setValue(colors[i]);
            }
        }
    }

    /**
     * 刷新亮度条选择区
     * @private
     *
     * @param {ecui.ui.Palette} palette 拾色器控件对象
     * @param {number} hue 色调值(0-1)
     * @param {number} saturation 饱和度值(0-1)
     */
    function UI_PALETTE_LIGHTBAR_FLUSH(palette, hue, saturation) {
        for (var i = 0, list = children(palette._uLightbar.getBody()), color = new Color(); i < 256; ) {
            color.setHSL(hue, saturation, 1 - i / 255);
            list[i++].style.backgroundColor = '#' + color.getRGB();
        }
    }

    /**
     * 刷新箭头位置
     * @private
     *
     * @param {ecui.ui.Palette} palette 拾色器控件对象
     */
    function UI_PALETTE_POSITION_FLUSH(palette) {
        var x = palette._aValue[1].getValue(),
            y = palette._aValue[3].getValue();

        palette._uMain._uIcon.setPosition(x, 255 - y);
        palette._uLightbar._uIcon.getOuter().style.top = 255 - palette._aValue[5].getValue() + 'px';
        UI_PALETTE_LIGHTBAR_FLUSH(palette, x / 255, y / 255);
    }

    /**
     * 刷新 RGB 色彩空间相关区域
     * @private
     *
     * @param {ecui.ui.Palette} palette 拾色器控件对象
     */
    function UI_PALETTE_RGB_FLUSH(palette) {
        var color = new Color();

        color.setHSL(
            palette._aValue[1].getValue() / 255,
            palette._aValue[3].getValue() / 255,
            palette._aValue[5].getValue() / 255
        );

        UI_PALETTE_VALUES_FLUSH(palette, [
            color.getRGB(),
            undefined,
            color.getRed(),
            undefined,
            color.getGreen(),
            undefined,
            color.getBlue()
        ]);
    }

    /**
     * 刷新 HSL 色彩空间相关区域
     * @private
     *
     * @param {ecui.ui.Palette} palette 拾色器控件对象
     */
    function UI_PALETTE_HSL_FLUSH(palette) {
        var color = new Color();

        color.setRGB(
            palette._aValue[2].getValue() - 0,
            palette._aValue[4].getValue() - 0,
            palette._aValue[6].getValue() - 0
        );

        UI_PALETTE_VALUES_FLUSH(palette, [
            color.getRGB(),
            ROUND(color.getHue() * 256) % 256,
            undefined,
            ROUND(color.getSaturation() * 255),
            undefined,
            ROUND(color.getLight() * 255)
        ]);

        UI_PALETTE_POSITION_FLUSH(palette);
    }

    /**
     * 色彩选择区箭头或亮度条选择区箭头拖曳移动事件的默认处理
     * @protected
     *
     * @param {Event} event 事件对象
     * @param {number} x 移动到的 x 轴座标
     * @param {number} y 移动到的 y 轴座标
     */
    UI_PALETTE_AREA_CLASS.$dragmove = function (event, x, y) {
        UI_CONTROL_CLASS.$dragmove.call(this, event, x, y);

        var parent = this.getParent(),
            palette = parent.getParent();

        y = 255 - y;
        if (parent == palette._uMain) {
            palette._aValue[1].setValue(x);
            palette._aValue[3].setValue(y);
            UI_PALETTE_LIGHTBAR_FLUSH(palette, x / 255, y / 255);
        }
        else {
            palette._aValue[5].setValue(y);
        }

        UI_PALETTE_RGB_FLUSH(palette);
    };

    /**
     * 色彩选择区或亮度条选择区左键按压开始事件的默认处理
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_PALETTE_AREA_CLASS.$pressstart = function (event) {
        UI_CONTROL_CLASS.$pressstart.call(this, event);

        var isMain = this == this.getParent()._uMain,
            control = this._uIcon,
            x = isMain ? getMouseX(this) : control.getX(),
            y = getMouseY(this),
            range = {top: 0, bottom: 255 + control.getHeight()};

        if (isMain) {
            range.left = 0;
            range.right = 255 + control.getWidth();
        }
        else {
            if (y < 0 || y > 255) {
                return;
            }
            range.left = range.right = x;
        }

        control.setPosition(x, y);
        drag(control, event, range);
        control.$dragmove.call(control, event, x, y);
    };

    /**
     * 基本色彩区、确认或取消按钮鼠标点击事件的默认处理
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_PALETTE_BUTTON_CLASS.$click = function (event) {
        UI_CONTROL_CLASS.$click.call(this, event);

        var palette = this.getParent();

        if (this == palette._uConfirm) {
            palette.onconfirm && palette.onconfirm();
        }
        else if (this == palette._uCancel) {
            palette.hide();
        }
        else {
            // 以下使用 event 表示 text
            event = UI_PALETTE_BASIC_COLOR[this.getIndex()];
            UI_PALETTE_VALUES_FLUSH(palette = palette.getParent(), [
                undefined,
                undefined,
                PARSEINT(event.slice(0, 2), 16),
                undefined,
                PARSEINT(event.slice(2, 4), 16),
                undefined,
                PARSEINT(event.slice(4), 16)
            ]);
            UI_PALETTE_HSL_FLUSH(palette);
        }
    };

    /**
     * 色彩输入框内容改变事件的默认处理
     * @protected
     */
    UI_PALETTE_EDIT_CLASS.$change = function () {
        UI_FORMAT_EDIT_CLASS.$change.call(this);

        var parent = this.getParent(),
            text = this.getValue();

        if (this == parent._aValue[0]) {
            text = this.$getInputText();
            if (text && text.length == 6 && !text.replace(/[0-9a-f]/ig, '')) {
                parent.setColor(new Color(text));
            }
            else {
                this.restore();
            }
        }
        else {
            if (!text) {
                this.setValue(0);
                new Timer(function () {
                    this.setCaret(1);
                }, 0, this);
            }
            else if (text.charAt(0) == '0') {
                this.setValue(text - 0);
            }

            if (indexOf(parent._aValue, this) % 2) {
                UI_PALETTE_RGB_FLUSH(parent);
                UI_PALETTE_POSITION_FLUSH(parent);
            }
            else {
                UI_PALETTE_HSL_FLUSH(parent)
            }
        }
    };

    /**
     * RGB 色彩输入框键盘按压事件的默认处理
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_PALETTE_EDIT_CLASS.$keydown = function (event) {
        UI_FORMAT_EDIT_CLASS.$keydown.call(this, event);

        var parent = this.getParent(),
            text = this.getValue(),
            start = this.getSelectionStart(),
            end = this.getSelectionEnd(),
            which = getKey();

        if (!event.ctrlKey && this == parent._aValue[0]) {
            if (which == 46 || which == 8) {
                event.preventDefault();
            }
            else if (which != 37 && which != 39) {
                if (start == end) {
                    end++;
                }

                which = String.fromCharCode(which).toUpperCase();
                if (which >= '0' && which <= '9' || which >= 'A' && which <= 'F') {
                    text = text.slice(0, start) + which + text.slice(end);
                    if (text.length == 6) {
                        which = end + end % 2;
                        parent._aValue[which].setValue(PARSEINT(text.slice(which - 2, which), 16));
                        UI_PALETTE_HSL_FLUSH(parent);
                        this.setCaret(end);
                    }
                    event.preventDefault();
                }
            }
        }
    }

    /**
     * 计算控件的缓存。
     * 控件缓存部分核心属性的值，提高控件属性的访问速度，在子控件或者应用程序开发过程中，如果需要避开控件提供的方法(setSize、alterClass 等)直接操作 Element 对象，操作完成后必须调用 clearCache 方法清除控件的属性缓存，否则将引发错误。
     * @protected
     *
     * @param {CssStyle} style 基本 Element 对象的 Css 样式对象
     * @param {boolean} cacheSize 是否需要缓存控件大小，如果控件是另一个控件的部件时，不缓存大小能加快渲染速度，默认缓存
     */
    UI_PALETTE_CLASS.$cache = function (style, cacheSize) {
        UI_CONTROL_CLASS.$cache.call(this, style, cacheSize);

        this._uMain.cache(false, true);
        this._uLightbar.cache(true, true);
    };

    /**
     * 控件渲染完成后初始化的默认处理。
     * @protected
     */
    UI_PALETTE_CLASS.$init = function () {
        UI_CONTROL_CLASS.$init.call(this);
        this.setColor(new Color('808080'));
    };

    /**
     * 设置控件的大小。
     * $setSize 方法设置控件实际的大小，不改变其它的如缓存等信息。
     * @protected
     *
     * @param {number} width 宽度，如果不需要设置则将参数设置为等价于逻辑非的值
     * @param {number} height 高度，如果不需要设置则省略此参数
     */
    UI_PALETTE_CLASS.$setSize = function (width, height) {
        UI_CONTROL_CLASS.$setSize.call(this, width, height);

        var i = 1;

        this._uMain.setBodySize(256, 256);
        this._uLightbar.setBodySize(0, 256);

        for (; i < 7; ) {
            this._aValue[i++].paint();
        }
    };

    /**
     * 获取拾色器当前选中的颜色对象。
     * @public
     *
     * @return {ecui.Color} 拾色器当前选中的颜色对象
     */
    UI_PALETTE_CLASS.getColor = function () {
        return new Color(this._aValue[0].getValue());
    };

    /**
     * 设置拾色器当前选中的颜色对象。
     * @public
     *
     * @param {ecui.Color} color 颜色对象
     */
    UI_PALETTE_CLASS.setColor = function (color) {
        UI_PALETTE_VALUES_FLUSH(this, [
            undefined,
            undefined,
            color.getRed(),
            undefined,
            color.getGreen(),
            undefined,
            color.getBlue()
        ]);
        UI_PALETTE_HSL_FLUSH(this);
    };


/*
Scroll - 定义在一个区间轴内移动的基本操作。
滚动条控件，继承自基础控件，滚动条控件，内部包含三个部件，分别是向前(滚动条的当前值变小)滚动按钮(基础控件)、向后(滚动
条的当前值变大)滚动按钮(基础控件)与滑动块(基础控件)。滚动条控件是滚动行为的虚拟实现，不允许直接初始化，它的子类通常情
况下也不会被直接初始化，而是作为控件的一部分用于控制父控件的行为。

属性
_nTotal         - 滚动条区域允许设置的最大值
_nStep          - 滚动条移动一次时的基本步长
_nValue         - 滚动条当前设置的值
_oTimer         - 定时器的句柄，用于连续滚动处理
_cButton        - 当前正在执行动作的按钮，用于连续滚动的控制
_uPrev          - 向前滚动按钮
_uNext          - 向后滚动按钮
_uBlock         - 滑动块

滑动块属性
_oRange         - 滑动块的合法滑动区间
*/


    /**
     * 停止自动滚动
     * @private
     *
     * @param {ecui.ui.Scroll} control 滚动条对象
     */
    function UI_SCROLL_STOP(control) {
        var timer = control._oTimer;
        timer && timer.stop();
    }

    /**
     * 控扭控件自动滚动。
     * @private
     *
     * @param {ecui.ui.Scroll.Button} button 触发滚动的按钮
     * @param {number} step 单次滚动步长
     */
    function UI_SCROLL_MOVE(button, step) {
        var scroll = button.getParent(),
            __gzip_direct__value = scroll._nValue,
            isPrev = scroll._uPrev == button;
        UI_SCROLL_STOP(scroll);

        if (isPrev && __gzip_direct__value || !isPrev && __gzip_direct__value < scroll._nTotal) {
            isPrev
                ? scroll.$allowPrev() && scroll.setValue(__gzip_direct__value - step)
                : scroll.$allowNext() && scroll.setValue(__gzip_direct__value + step);
            scroll._oTimer = new Timer(UI_SCROLL_MOVE, 200, null, button, step);
        }
    }

    /**
     * 滑动块拖拽移动事件的默认处理。
     * @protected
     *
     * @param {Event} event 事件对象
     * @param {number} x 滑动块实际到达的X轴坐标
     * @param {number} y 滑动块实际到达的Y轴坐标
     */
    UI_SCROLL_BLOCK_CLASS.$dragmove = function (event, x, y) {
        UI_CONTROL_CLASS.$dragmove.call(this, event, x, y);

        var parent = this.getParent(),
            value = parent.$calcDragValue(x, y);

        // 应该滚动step的整倍数
        parent.$setValue(value == parent._nTotal ? value : value - value % parent._nStep);
        parent.scroll();
    };

    /**
     * 鼠标在滑动块区域内按压开始事件的默认处理，触发滑动块拖动功能。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_SCROLL_BLOCK_CLASS.$pressstart = function (event) {
        UI_CONTROL_CLASS.$pressstart.call(this, event);

        drag(this, event, this._oRange);

        // 屏蔽普通W3C兼容的浏览器的选择操作
        event.preventDefault();
    };

    /**
     * 设置滑动块的合法拖拽区间。
     * @public
     *
     * @param {number} top 允许拖拽的最上部区域
     * @param {number} right 允许拖拽的最右部区域
     * @param {number} bottom 允许拖拽的最下部区域
     * @param {number} left 允许拖拽的最左部区域
     */
    UI_SCROLL_BLOCK_CLASS.setRange = function (top, right, bottom, left) {
        this._oRange = {
            top: top,
            right: right,
            bottom: bottom,
            left: left
        };
    };

    /**
     * 控扭控件按压状态结束事件的默认处理。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_SCROLL_BUTTON_CLASS.$pressend = function (event) {
        UI_CONTROL_CLASS.$pressend.call(this, event);
        UI_SCROLL_STOP(this.getParent());
    };

    /**
     * 控扭控件按压状态中鼠标移出控件区域事件的默认处理。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_SCROLL_BUTTON_CLASS.$pressout = function (event) {
        UI_CONTROL_CLASS.$pressout.call(this, event);
        UI_SCROLL_STOP(this.getParent());
    };

    /**
     * 控扭控件按压状态中鼠标移入控件区域事件的默认处理。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_SCROLL_BUTTON_CLASS.$pressover = function (event) {
        UI_CONTROL_CLASS.$pressover.call(this, event);
        UI_SCROLL_MOVE(this, MAX(this.getParent()._nStep, 5));
    };

    /**
     * 控扭控件按压状态开始事件的默认处理。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_SCROLL_BUTTON_CLASS.$pressstart = function (event) {
        UI_CONTROL_CLASS.$pressstart.call(this, event);
        UI_SCROLL_MOVE(this, MAX(this.getParent()._nStep, 5));

        // 屏蔽普通W3C兼容的浏览器的选择操作
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
    UI_SCROLL_CLASS.$cache = function (style, cacheSize) {
        UI_CONTROL_CLASS.$cache.call(this, style, cacheSize);

        this._uPrev.cache(true, true);
        this._uNext.cache(true, true);
        this._uBlock.cache(true, true);
    };

    /**
     * 隐藏控件。
     * 隐藏滚动条控件时，滚动条控件的当前值需要复位为0，参见 setValue 与 setTotal 方法。
     * @protected
     */
    UI_SCROLL_CLASS.$hide = function () {
        UI_SCROLL_CLASS.setValue.call(this, 0);
        UI_CONTROL_CLASS.$hide.call(this);
    };

    /**
     * 控件渲染完成后初始化的默认处理。
     * $init 方法在控件渲染完成后调用，参见 create 与 init 方法。
     * @protected
     */
    UI_SCROLL_CLASS.$init = function () {
        this._uPrev.$init();
        this._uNext.$init();
        this._uBlock.$init();
        UI_CONTROL_CLASS.$init.call(this);
    };

    /**
     * 控件按压状态结束事件的默认处理。
     * 鼠标左键按压控件结束时停止自动滚动，恢复控件状态。如果控件处于可操作状态(参见 isEnabled)，pressend 方法触发 onpressend 事件，如果事件返回值不为 false，则调用 $pressend 方法。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_SCROLL_CLASS.$pressend = function (event) {
        UI_CONTROL_CLASS.$pressend.call(this, event);
        UI_SCROLL_STOP(this);
    };

    /**
     * 控件按压状态中鼠标移出控件区域事件的默认处理。
     * 控件按压状态中鼠标移出控件区域时停止自动滚动，恢复控件状态。如果控件处于可操作状态(参见 isEnabled)，pressout 方法触发 onpressout 事件，如果事件返回值不为 false，则调用 $pressout 方法。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_SCROLL_CLASS.$pressout = function (event) {
        UI_CONTROL_CLASS.$pressout.call(this, event);
        UI_SCROLL_STOP(this);
    };

    /**
     * 控件按压状态中鼠标移入控件区域事件的默认处理。
     * 控件按压状态中鼠标移入控件区域开始自动滚动。如果控件处于可操作状态(参见 isEnabled)，pressover 方法触发 onpressover 事件，如果事件返回值不为 false，则调用 $pressover 方法。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_SCROLL_CLASS.$pressover = function (event) {
        UI_CONTROL_CLASS.$pressover.call(this, event);
        UI_SCROLL_MOVE(this._cButton, this.$getPageStep());
    };

    /**
     * 控件按压状态开始事件的默认处理。
     * 鼠标左键按压控件开始时计算自动滚动的方向，并开始自动滚动。如果控件处于可操作状态(参见 isEnabled)，pressstart 方法触发 onpressstart 事件，如果事件返回值不为 false，则调用 $pressstart 方法。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_SCROLL_CLASS.$pressstart = function (event) {
        UI_CONTROL_CLASS.$pressstart.call(this, event);

        UI_SCROLL_MOVE(this._cButton = this.$allowPrev() ? this._uPrev : this._uNext, this.$getPageStep());

        // 屏蔽普通W3C兼容的浏览器的选择操作
        event.preventDefault();
    };

    /**
     * 设置滚动条控件的单页滚动距离。
     * @protected
     *
     * @param {number} value 单页滚动距离
     */
    UI_SCROLL_CLASS.$setPageStep = function (value) {
        this._nPageStep = value;
    };

    /**
     * 设置滚动条控件的大小。
     * @protected
     *
     * @param {number} width 控件区域的宽度
     * @param {number} height 控件区域的高度
     */
    UI_SCROLL_CLASS.$setSize = function (width, height) {
        UI_CONTROL_CLASS.$setSize.call(this, width, height);
        this.$locate();
    };

    /**
     * 直接设置控件的当前值。
     * $setValue 仅仅设置控件的参数值，不进行合法性验证，也不改变滑动块的位置信息，用于滑动块滚动时同步设置当前值。
     * @protected
     *
     * @param {number} value 控件的当前值
     */
    UI_SCROLL_CLASS.$setValue = function (value) {
        this._nValue = value;
    };

    /**
     * 获取滚动条控件的单次滚动距离。
     * getStep 方法返回滚动条控件发生滚动时，移动的最小步长值，通过 setStep 设置。
     * @public
     *
     * @return {number} 单次滚动距离
     */
    UI_SCROLL_CLASS.getStep = function () {
        return this._nStep;
    };

    /**
     * 获取滚动条控件的最大值。
     * getTotal 方法返回滚动条控件允许滚动的最大值，最大值、当前值与滑动块控件的实际位置互相影响，通过 setTotal 设置。
     * @public
     *
     * @return {number} 控件的最大值
     */
    UI_SCROLL_CLASS.getTotal = function () {
        return this._nTotal;
    };

    /**
     * 获取滚动条控件的当前值。
     * getValue 方法返回滚动条控件的当前值，最大值、当前值与滑动块控件的实际位置互相影响，但是当前值不允许超过最大值，通过 setValue 方法设置。
     * @public
     *
     * @return {number} 滚动条控件的当前值
     */
    UI_SCROLL_CLASS.getValue = function () {
        return this._nValue;
    };

    /**
     * 滚动条滚动。
     * scroll 方法首先调用 change 方法，之后触发父控件的 onscroll 事件，如果事件返回值不为 false，则调用父控件的 $scroll 方法。
     * @public
     */
    UI_SCROLL_CLASS.scroll = function () {
        var parent = this.getParent();
        this.change();
        parent && (parent.onscroll && parent.onscroll() === false || parent.$scroll());
    };

    /**
     * 设置滚动条控件的单次滚动距离。
     * setStep 方法设置的值必须大于0，否则不会进行操作。
     * @public
     *
     * @param {number} value 单次滚动距离
     */
    UI_SCROLL_CLASS.setStep = function (value) {
        if (value > 0) {
            this._nStep = value;
        }
    };

    /**
     * 设置滚动条控件的最大值。
     * setTotal 方法设置的值不能为负数，并且当前值如果大于最大值，将改变当前值，并调用 scroll 方法，最大值发生改变将导致滚动条控件刷新。
     * @public
     *
     * @param {number} value 控件的最大值
     */
    UI_SCROLL_CLASS.setTotal = function (value) {
        if (value >= 0 && this._nTotal != value) {
            this._nTotal = value;
            // 检查滚动条控件的当前值是否已经越界
            if (this._nValue > value) {
                // 值发生改变时触发相应的事件
                this._nValue = value;
                this.scroll();
            }
            this.$flush();
        }
    };

    /**
     * 设置滚动条控件的当前值。
     * setValue 方法设置的值不能为负数，也不允许超过使用 setTotal 方法设置的控件的最大值，如果当前值不合法，将自动设置为最接近合法值的数值，如果当前值发生改变将导致滚动条控件刷新，并调用 scroll 方法。
     * @public
     *
     * @param {number} value 控件的当前值
     */
    UI_SCROLL_CLASS.setValue = function (value) {
        value = MIN(MAX(0, value), this._nTotal);
        if (this._nValue != value) {
            // 值发生改变时触发相应的事件
            this._nValue = value;
            this.scroll();
            this.$flush();
        }
    };

    /**
     * 滚动条控件当前值移动指定的步长次数。
     * 参数 value 必须是整数, 正数则向最大值方向移动，负数则向0方向移动，允许移动的区间在0-最大值之间，参见 setStep、setTotal 与 setValue 方法。
     * @public
     *
     * @param {number} n 移动的步长次数
     */
    UI_SCROLL_CLASS.skip = function (n) {
        this.setValue(this._nValue + n * this._nStep);
    };


    /**
     * 判断是否允许当前值向最大值方向移动。
     * 受当前鼠标位置的影响，在当前值向最大值方向移动的过程中需要先判断移动是否得到许可。
     * @protected
     *
     * @return {boolean} 是否允许向最大值方向移动
     */
    UI_VSCROLL_CLASS.$allowNext = function () {
        var block = this._uBlock;
        return getMouseY(this) > block.getY() + block.getHeight();
    };

    /**
     * 判断是否允许当前值向0方向移动。
     * 受当前鼠标位置的影响，在当前值向0方向移动的过程中需要先判断移动是否得到许可。
     * @protected
     *
     * @return {boolean} 是否允许向0方向移动
     */
    UI_VSCROLL_CLASS.$allowPrev = function () {
        return getMouseY(this) < this._uBlock.getY();
    };

    /**
     * 计算滑动块拖拽时滚动条的当前值。
     * 虚方法，继承自滚动条控件的控件必须实现。
     * @protected
     *
     * @param {number} x 滑动块实际到达的X轴坐标
     * @param {number} y 滑动块实际到达的Y轴坐标
     */
    UI_VSCROLL_CLASS.$calcDragValue = function (x, y) {
        var block = this._uBlock,
            range = block._oRange;
        return (y - range.top) / (range.bottom - this._uPrev.getHeight() - block.getHeight()) * this._nTotal;
    };

    /**
     * 垂直滚动条控件刷新。
     * 滚动条控件的大小，最大值/当前值发生变化时，调用 $flash 方法刷新滑动块的大小与位置。
     * @protected
     */
    UI_VSCROLL_CLASS.$flush = function () {
        // 计算滑动块高度与位置
        var block = this._uBlock,
            total = this._nTotal,
            height = this.getHeight(),
            prevHeight = this._uPrev.getHeight(),
            bodyHeight = this.getBodyHeight(),
            blockHeight = MAX(FLOOR(bodyHeight * height / (height + total)), block.getInvalidHeight() + 5);

        if (total) {
            block.$setSize(0, blockHeight);
            block.setPosition(0, prevHeight + FLOOR((this._nValue / total) * (bodyHeight - blockHeight)));
            block.setRange(prevHeight, 0, bodyHeight + prevHeight, 0);
        }
    };

    /**
     * 获取一页的步长。
     * $getPageStep 方法根据 getStep 方法获取的步长，计算父控件一页的步长的大小，一页的步长一定是滚动条控件步长的整数倍。
     * @protected
     *
     * @return {number} 一页的步长
     */
    UI_VSCROLL_CLASS.$getPageStep = function () {
        var height = this.getHeight();
        return this._nPageStep || height - height % this._nStep;
    };

    /**
     * 设置垂直滚动条控件的大小。
     * @protected
     *
     * @param {number} width 控件区域的宽度
     * @param {number} height 控件区域的高度
     */
    UI_VSCROLL_CLASS.$setSize = function (width, height) {
        UI_SCROLL_CLASS.$setSize.call(this, width, height);

        var bodyWidth = this.getBodyWidth(),
            prevHeight = this.$cache$paddingTop,
            __gzip_direct__next = this._uNext;

        // 设置滚动按钮与滑动块的信息
        this._uPrev.$setSize(bodyWidth, prevHeight);
        __gzip_direct__next.$setSize(bodyWidth, this.$cache$paddingBottom);
        this._uBlock.$setSize(bodyWidth);
        __gzip_direct__next.setPosition(0, this.getBodyHeight() + prevHeight);

        this.$flush();
    };


    /**
     * 判断是否允许当前值向最大值方向移动。
     * 受当前鼠标位置的影响，在当前值向最大值方向移动的过程中需要先判断移动是否得到许可。
     * @protected
     *
     * @return {boolean} 是否允许向最大值方向移动
     */
    UI_HSCROLL_CLASS.$allowNext = function () {
        var block = this._uBlock;
        return getMouseX(this) > block.getX() + block.getWidth();
    };

    /**
     * 判断是否允许当前值向0方向移动。
     * 受当前鼠标位置的影响，在当前值向0方向移动的过程中需要先判断移动是否得到许可。
     * @protected
     *
     * @return {boolean} 是否允许向0方向移动
     */
    UI_HSCROLL_CLASS.$allowPrev = function () {
        return getMouseX(this) < this._uBlock.getX();
    };

    /**
     * 计算滑动块拖拽时滚动条的当前值。
     * 虚方法，继承自滚动条控件的控件必须实现。
     * @protected
     *
     * @param {number} x 滑动块实际到达的X轴坐标
     * @param {number} y 滑动块实际到达的Y轴坐标
     */
    UI_HSCROLL_CLASS.$calcDragValue = function (x, y) {
        var block = this._uBlock,
            range = block._oRange;
        return (x - range.left) / (range.right - this._uPrev.getWidth() - block.getWidth()) * this._nTotal;
    };

    /**
     * 水平滚动条控件刷新。
     * 滚动条控件的大小，最大值/当前值发生变化时，调用 $flash 方法刷新滑动块的大小与位置。
     * @protected
     */
    UI_HSCROLL_CLASS.$flush = function () {
        // 计算滑动块高度与位置
        var block = this._uBlock,
            total = this._nTotal,
            width = this.getWidth(),
            prevWidth = this._uPrev.getWidth(),
            bodyWidth = this.getBodyWidth(),
            blockWidth = MAX(FLOOR(bodyWidth * width / (width + total)), block.getInvalidWidth() + 5);

        if (total) {
            block.$setSize(blockWidth);
            block.setPosition(prevWidth + FLOOR((this._nValue / total) * (bodyWidth - blockWidth)), 0);
            block.setRange(0, bodyWidth + prevWidth, 0, prevWidth);
        }
    };

    /**
     * 获取一页的步长。
     * $getPageStep 方法根据 getStep 方法获取的步长，计算父控件一页的步长的大小，一页的步长一定是滚动条控件步长的整数倍。
     * @protected
     *
     * @return {number} 一页的步长
     */
    UI_HSCROLL_CLASS.$getPageStep = function () {
        var width = this.getWidth();
        return width - width % this._nStep;
    };

    /**
     * 设置水平滚动条控件的大小。
     * @protected
     *
     * @param {number} width 控件区域的宽度
     * @param {number} height 控件区域的高度
     */
    UI_HSCROLL_CLASS.$setSize = function (width, height) {
        UI_SCROLL_CLASS.$setSize.call(this, width, height);

        var bodyHeight = this.getBodyHeight(),
            prevWidth = this.$cache$paddingLeft,
            __gzip_direct__next = this._uNext;

        // 设置滚动按钮与滑动块的信息
        this._uPrev.$setSize(prevWidth, bodyHeight);
        __gzip_direct__next.$setSize(this.$cache$paddingRight, bodyHeight);
        this._uBlock.$setSize(0, bodyHeight);
        __gzip_direct__next.setPosition(this.getBodyWidth() + prevWidth, 0);

        this.$flush();
    };


﻿/*
Panel - 定义在一个小区域内截取显示大区域内容的基本操作。
截面控件，继承自基础控件，内部包含三个部件，分别是垂直滚动条、水平滚动条与两个滚动条之间的夹角(基础控件)。截面控件的内
容区域可以超过控件实际大小，通过拖拽滚动条显示完整的内容，截面控件可以设置参数决定是否自动显示水平/垂直滚动条，如果设
置不显示水平/垂直滚动条，水平/垂直内容超出的部分将直接被截断，当设置两个滚动条都不显示时，层控件从显示效果上等同于基础
控件。在层控件上滚动鼠标滑轮，将控制层控件往垂直方向(如果没有垂直滚动条则在水平方向)前移或者后移滚动条，在获得焦点后，
通过键盘的方向键也可以操作层控件的滚动条。

层控件直接HTML初始化的例子:
<div ecui="type:panel;vertical-scroll:true;horizontal-scroll:true;wheel-delta:20;absolute:true">
    <!-- 这里放内容 -->
    ...
</div>

属性
_bAbsolute                - 是否包含绝对定位的Element
_nWheelDelta              - 鼠标滚轮滚动一次的差值
_eBrowser                 - 用于浏览器原生的滚动条实现的Element
_uVScroll                 - 垂直滚动条控件
_uHScroll                 - 水平滚动条控件
_uCorner                  - 夹角控件
$cache$layoutWidthRevise  - layout区域的宽度修正值
$cache$layoutHeightRevise - layout区域的高度修正值
$cache$mainWidth          - layout区域的实际宽度
$cache$mainHeight         - layout区域的实际高度
*/


    /**
     * 获取一页的步长。
     * $getPageStep 方法根据 getStep 方法获取的步长，计算父控件一页的步长的大小，一页的步长一定是滚动条控件步长的整数倍。
     * @protected
     *
     * @return {number} 一页的步长
     */
    UI_BROWSER_SCROLL_CLASS.$getPageStep = blank;

    /**
     * 隐藏控件。
     * @protected
     */
    UI_BROWSER_SCROLL_CLASS.$hide = UI_BROWSER_SCROLL_CLASS.hide = function () {
        this.getBase().style[this._sOverflow] = 'hidden';
        UI_BROWSER_SCROLL_CLASS.setValue.call(this, 0);
    };

    /**
     * 设置滚动条控件的单页滚动距离。
     * @protected
     *
     * @param {number} value 单页滚动距离
     */
    UI_BROWSER_SCROLL_CLASS.$setPageStep = blank;

    /**
     * 直接设置控件的当前值。
     * @protected
     *
     * @param {number} value 控件的当前值
     */
    UI_BROWSER_SCROLL_CLASS.$setValue = UI_BROWSER_SCROLL_CLASS.setValue = function (value) {
        if (value >= 0 && value < this.getTotal()) {
            this.getBase()[this._sScrollValue] = value;
        }
    };

    /**
     * 显示控件。
     * @protected
     */
    UI_BROWSER_SCROLL_CLASS.$show = UI_BROWSER_SCROLL_CLASS.show = function () {
        this.getBase().style[this._sOverflow] = 'scroll';
    };

    /**
     * 获取滚动条控件的单次滚动距离。
     * getStep 方法返回滚动条控件发生滚动时，移动的最小步长值，通过 setStep 设置。
     * @public
     *
     * @return {number} 单次滚动距离
     */
    UI_BROWSER_SCROLL_CLASS.getStep = blank;

    /**
     * 获取滚动条控件的最大值。
     * getTotal 方法返回滚动条控件允许滚动的最大值，最大值、当前值与滑动块控件的实际位置互相影响，通过 setTotal 设置。
     * @public
     *
     * @return {number} 控件的最大值
     */
    UI_BROWSER_SCROLL_CLASS.getTotal = function () {
        return this.getBase()[this._sScrollTotal];
    };

    /**
     * 获取滚动条控件的当前值。
     * getValue 方法返回滚动条控件的当前值，最大值、当前值与滑动块控件的实际位置互相影响，但是当前值不允许超过最大值，通过 setValue 方法设置。
     * @public
     *
     * @return {number} 滚动条控件的当前值
     */
    UI_BROWSER_SCROLL_CLASS.getValue = function () {
        return this.getBase()[this._sScrollValue];
    };

    /**
     * 判断控件是否处于显示状态。
     * @public
     *
     * @return {boolean} 控件是否显示
     */
    UI_BROWSER_SCROLL_CLASS.isShow = function () {
        return getStyle(this.getBase(), this._sOverflow) != 'hidden';
    };

    /**
     * 滚动条滚动。
     * scroll 方法首先调用 change 方法，之后触发父控件的 onscroll 事件，如果事件返回值不为 false，则调用父控件的 $scroll 方法。
     * @public
     */
    UI_BROWSER_SCROLL_CLASS.scroll = function (event) {
        event = findControl(standardEvent(event).target);
        event && (event.onscroll && event.onscroll() === false || event.$scroll());
    };

    /**
     * 设置滚动条控件的单次滚动距离。
     * setStep 方法设置的值必须大于0，否则不会进行操作。
     * @public
     *
     * @param {number} value 单次滚动距离
     */
    UI_BROWSER_SCROLL_CLASS.setStep = blank;

    /**
     * 设置滚动条控件的最大值。
     * setTotal 方法设置的值不能为负数，并且当前值如果大于最大值，将改变当前值，并调用 scroll 方法，最大值发生改变将导致滚动条控件刷新。
     * @public
     *
     * @param {number} value 控件的最大值
     */
    UI_BROWSER_SCROLL_CLASS.setTotal = function (value) {
        this.getBase().lastChild.style[this._sTotal] = value + 'px';
    };

    /**
     * 滚动条控件当前值移动指定的步长次数。
     * 参数 value 必须是整数, 正数则向最大值方向移动，负数则向0方向移动，允许移动的区间在0-最大值之间，参见 setStep、setTotal 与 setValue 方法。
     * @public
     *
     * @param {number} n 移动的步长次数
     */
    UI_BROWSER_SCROLL_CLASS.skip = blank;

    UI_BROWSER_SCROLL_CLASS.$cache = UI_BROWSER_SCROLL_CLASS.$init = UI_BROWSER_SCROLL_CLASS.$setSize
        = UI_BROWSER_SCROLL_CLASS.cache = UI_BROWSER_SCROLL_CLASS.setPosition = blank;


    /**
     * 获取控件区域的高度。
     * @public
     *
     * @return {number} 控件的高度
     */
    UI_BROWSER_VSCROLL_CLASS.getHeight = function () {
        return this.getBase().offsetHeight;
    };

    /**
     * 获取控件区域的宽度。
     * @public
     *
     * @return {number} 控件的宽度
     */
    UI_BROWSER_VSCROLL_CLASS.getWidth = function () {
        return getScrollNarrow();
    };


    /**
     * 获取控件区域的高度。
     * @public
     *
     * @return {number} 控件的高度
     */
    UI_BROWSER_HSCROLL_CLASS.getHeight = function () {
        return getScrollNarrow();
    };

    /**
     * 获取控件区域的宽度。
     * @public
     *
     * @return {number} 控件的宽度
     */
    UI_BROWSER_HSCROLL_CLASS.getWidth = function () {
        return this.getBase().offsetWidth;
    };


    UI_BROWSER_CORNER_CLASS.$cache = UI_BROWSER_CORNER_CLASS.$hide = UI_BROWSER_CORNER_CLASS.$init
        = UI_BROWSER_CORNER_CLASS.$setSize = UI_BROWSER_CORNER_CLASS.$show
        = UI_BROWSER_CORNER_CLASS.cache = UI_BROWSER_CORNER_CLASS.hide
        = UI_BROWSER_CORNER_CLASS.setPosition = UI_BROWSER_CORNER_CLASS.show = blank;


    /**
     * 计算控件的缓存。
     * 控件缓存部分核心属性的值，提高控件属性的访问速度，在子控件或者应用程序开发过程中，如果需要避开控件提供的方法(setSize、alterClass 等)直接操作 Element 对象，操作完成后必须调用 clearCache 方法清除控件的属性缓存，否则将引发错误。
     * @protected
     *
     * @param {CssStyle} style 基本 Element 对象的 Css 样式对象
     * @param {boolean} cacheSize 是否需要缓存控件大小，如果控件是另一个控件的部件时，不缓存大小能加快渲染速度，默认缓存
     */
    UI_PANEL_CLASS.$cache = function (style, cacheSize) {
        UI_CONTROL_CLASS.$cache.call(this, style, cacheSize);

        var body = this.getBody(),
            mainWidth = body.offsetWidth,
            mainHeight = body.offsetHeight;

        // 考虑到内部Element绝对定位的问题，中心区域的宽度与高度修正
        if (this._bAbsolute) {
            for (
                var i = 0,
                    pos = getPosition(body),
                    x = pos.left,
                    y = pos.top,
                    elements = body.getElementsByTagName('*');
                // 以下使用 style 代替临时的 DOM 节点对象
                style = elements[i++];
            ) {
                if (style.offsetWidth && getStyle(style, 'position') == 'absolute') {
                    pos = getPosition(style);
                    mainWidth = MAX(mainWidth, pos.left - x + style.offsetWidth);
                    mainHeight = MAX(mainHeight, pos.top - y + style.offsetHeight);
                }
            }
        }

        this.$cache$mainWidth = mainWidth;
        this.$cache$mainHeight = mainHeight;

        style = getStyle(getParent(body));
        this.$cache$layoutWidthRevise = calcWidthRevise(style);
        this.$cache$layoutHeightRevise = calcHeightRevise(style);

        this._uVScroll && this._uVScroll.cache(true, true);
        this._uHScroll && this._uHScroll.cache(true, true);
        this._uCorner && this._uCorner.cache(true, true);
    };

    /**
     * 销毁控件的默认处理。
     * 页面卸载时将销毁所有的控件，释放循环引用，防止在 IE 下发生内存泄漏，$dispose 方法的调用不会受到 ondispose 事件返回值的影响。
     * @protected
     */
    UI_PANEL_CLASS.$dispose = function () {
        this._eBrowser = null;
        UI_CONTROL_CLASS.$dispose.call(this);
    };

    /**
     * 控件渲染完成后初始化的默认处理。
     * $init 方法在控件渲染完成后调用，参见 create 与 init 方法。
     * @protected
     */
    UI_PANEL_CLASS.$init = function () {
        this._uVScroll && this._uVScroll.$init();
        this._uHScroll && this._uHScroll.$init();
        this._uCorner && this._uCorner.$init();
        UI_CONTROL_CLASS.$init.call(this);
    };

    /**
     * 控件拥有焦点时，键盘按压事件的默认处理。Opera 下仅用 keydown 不能屏蔽方向键事件，还需要在 keypress 中屏蔽。
     * 如果控件处于可操作状态(参见 isEnabled)，keydown/keypress 方法触发 onkeydown/onkeypress 事件，如果事件返回值不为 false，则调用 $keydown/$keypress 方法。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_PANEL_CLASS.$keydown = UI_PANEL_CLASS.$keypress = function (event) {
        var which = getKey(),
            mod = which % 2,
            scroll = mod ? this._uHScroll : this._uVScroll;

        if (which >= 37 && which <= 40 && !event.target.value) {
            scroll && scroll.skip(which + mod - 39);
            return false;
        }
    };

    /**
     * 鼠标在控件区域滚动滚轮事件的默认处理。
     * 如果有垂直滚动条，则垂直滚动条随滚轮滚动。如果控件处于可操作状态(参见 isEnabled)，mousewheel 方法触发 onmousewheel 事件，如果事件返回值不为 false，则调用 $mousewheel 方法。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_PANEL_CLASS.$mousewheel = function (event) {
        scroll = this._uVScroll;

        if (scroll && scroll.isShow()) {
            // 计算滚动的次数，至少要滚动一次
            var value = scroll.getValue(),
                delta = this._nWheelDelta || FLOOR(20 / scroll.getStep()) || 1,
                scroll;
            scroll.skip(event.detail > 0 ? delta : -delta);
            return value == scroll.getValue();
        }
    };

    /**
     * 控件的滚动条发生滚动的默认处理。
     * 如果控件包含滚动条，滚动条滚动时触发 onscroll 事件，如果事件返回值不为 false，则调用 $scroll 方法。
     * @protected
     */
    UI_PANEL_CLASS.$scroll = function () {
        var style = this.getBody().style;
        style.left = -MAX(this.getScrollLeft(), 0) + 'px';
        style.top = -MAX(this.getScrollTop(), 0) + 'px';
    };

    /**
     * 设置控件的大小。
     * $setSize 方法设置控件实际的大小，不改变其它的如缓存等信息。
     * @protected
     *
     * @param {number} width 宽度，如果不需要设置则将参数设置为等价于逻辑非的值
     * @param {number} height 高度，如果不需要设置则省略此参数
     */
    UI_PANEL_CLASS.$setSize = function (width, height) {
        UI_CONTROL_CLASS.$setSize.call(this, width, height);
        this.$locate();

        var paddingWidth = this.$cache$paddingLeft + this.$cache$paddingRight,
            paddingHeight = this.$cache$paddingTop + this.$cache$paddingBottom,
            bodyWidth = this.getBodyWidth(),
            bodyHeight = this.getBodyHeight(),
            mainWidth = this.$cache$mainWidth,
            mainHeight = this.$cache$mainHeight,
            vscroll = this._uVScroll,
            hscroll = this._uHScroll,
            corner = this._uCorner,
            vsWidth = vscroll && vscroll.getWidth(),
            hsHeight = hscroll && hscroll.getHeight(),
            innerWidth = bodyWidth - vsWidth,
            innerHeight = bodyHeight - hsHeight,
            hsWidth = innerWidth + paddingWidth,
            vsHeight = innerHeight + paddingHeight;

        // 设置垂直与水平滚动条与夹角控件的位置
        vscroll && vscroll.setPosition(hsWidth, 0);
        hscroll && hscroll.setPosition(0, vsHeight);
        corner && corner.setPosition(hsWidth, vsHeight);

        if (mainWidth <= bodyWidth && mainHeight <= bodyHeight) {
            // 宽度与高度都没有超过层控件的宽度与高度，不需要显示滚动条
            vscroll && vscroll.$hide();
            hscroll && hscroll.$hide();
            corner && corner.$hide();
            innerWidth = bodyWidth;
            innerHeight = bodyHeight;
        }
        else {
            while (true) {
                if (corner) {
                    // 宽度与高度都超出了显示滚动条后余下的宽度与高度，垂直与水平滚动条同时显示
                    if (mainWidth > innerWidth && mainHeight > innerHeight) {
                        hscroll.$setSize(hsWidth);
                        hscroll.setTotal(mainWidth - (this._eBrowser ? 0 : innerWidth));
                        hscroll.$show();
                        vscroll.$setSize(0, vsHeight);
                        vscroll.setTotal(mainHeight - (this._eBrowser ? 0 : innerHeight));
                        vscroll.$show();
                        corner.$setSize(vsWidth, hsHeight);
                        corner.$show();
                        break;
                    }
                    corner.$hide();
                }
                if (hscroll) {
                    if (mainWidth > bodyWidth) {
                        // 宽度超出控件的宽度，高度没有超出显示水平滚动条后余下的高度，只显示水平滚动条
                        hscroll.$setSize(bodyWidth + paddingWidth);
                        hscroll.setTotal(mainWidth - (this._eBrowser ? 0 : bodyWidth));
                        hscroll.$show();
                        vscroll && vscroll.$hide();
                        innerWidth = bodyWidth;
                    }
                    else {
                        hscroll.$hide();
                    }
                }
                if (vscroll) {
                    if (mainHeight > bodyHeight) {
                        // 高度超出控件的高度，宽度没有超出显示水平滚动条后余下的宽度，只显示水平滚动条
                        vscroll.$setSize(0, bodyHeight + paddingHeight);
                        vscroll.setTotal(mainHeight - (this._eBrowser ? 0 : bodyHeight));
                        vscroll.$show();
                        hscroll && hscroll.$hide();
                        innerHeight = bodyHeight;
                    }
                    else {
                        vscroll.$hide();
                    }
                }
                break;
            }
        }

        innerWidth -= this.$cache$layoutWidthRevise;
        innerHeight -= this.$cache$layoutHeightRevise;

        vscroll && vscroll.$setPageStep(innerHeight);
        hscroll && hscroll.$setPageStep(innerWidth);
    
        // 设置内部定位器的大小，以下使用 corner 表示 style
        if (this._eBrowser) {
            corner = this._eBrowser.style;
            corner.width = bodyWidth + this.$cache$paddingLeft + this.$cache$paddingRight + 'px';
            corner.height = bodyHeight + this.$cache$paddingTop + this.$cache$paddingBottom + 'px';
        }

        corner = getParent(this.getBody()).style;
        corner.width = innerWidth + 'px';
        corner.height = innerHeight + 'px';
    };

    /**
     * 获取水平滚动条的当前值。
     * getScrollLeft 方法提供了对水平滚动条当前值的快捷访问方式，参见 getValue。
     * @public
     *
     * @return {number} 水平滚动条的当前值，如果没有水平滚动条返回-1
     */
    UI_PANEL_CLASS.getScrollLeft = function () {
        var scroll = this._uHScroll;
        return scroll ? scroll.getValue() : -1;
    };

    /**
     * 获取垂直滚动条的当前值。
     * getScrollTop 方法提供了对水平滚动条当前值的快捷访问方式，参见 getValue。
     * @public
     *
     * @return {number} 垂直滚动条的当前值，如果没有垂直滚动条返回-1
     */
    UI_PANEL_CLASS.getScrollTop = function () {
        var scroll = this._uVScroll;
        return scroll ? scroll.getValue() : -1;
    };


﻿/*
Listbox - 定义了多项选择的基本操作。
多选框控件，继承自截面控件，实现了选项组接口，扩展了多选的 SelectElement 的功能，允许使用鼠标拖拽进行多项选择，多个交
换框，可以将选中的选项在互相之间移动。多选框控件也可以单独的使用，选中的选项在表单提交时将被提交。

多选框控件直接HTML初始化的例子:
<div ecui="type:listbox;name:test">
    <!-- 这里放选项内容 -->
    <li>选项</li>
    ...
</div>

属性
_sName  - 多选框内所有input的名称

选项属性
_eInput - 选项对应的input，form提交时使用
*/


    /**
     * 计算当前鼠标移入的选项编号
     * @private
     *
     * @param {ecui.ui.Item} control 选项控件
     */
    function UI_LISTBOX_OVERED(control) {
        var parent = control.getParent(),
            vscroll = parent._cScroll,
            step = vscroll.getStep(),
            o = getMouseY(parent),
            oldTop = control._nTop;

        control._nTop = o;

        if (o > parent.getHeight()) {
            if (o < oldTop) {
                // 鼠标回退不需要滚动
                o = 0;
            }
            else {
                // 超出控件范围，3像素点对应一个选项
                o = FLOOR((o - MAX(0, oldTop)) / 3);
                // 如果不滚动，需要恢复原始的移动距离
                o ? vscroll.skip(o) : (control._nTop = oldTop);
            }
            o += control._nLastIndex;
        }
        else if (o < 0) {
            if (o > oldTop) {
                // 鼠标回退不需要滚动
                o = 0;
            }
            else {
                // 超出控件范围，3像素点对应一个选项
                o = CEIL((o - MIN(0, oldTop)) / 3);
                // 如果不滚动，需要恢复原始的移动距离
                o ? vscroll.skip(o) : (control._nTop = oldTop);
            }
            o += control._nLastIndex;
        }
        else {
            o = FLOOR((parent.getScrollTop() + o) / step);
        }

        return MIN(MAX(0, o), parent.getItems().length - 1);
    }

    copy(UI_LISTBOX_CLASS, UI_ITEMS);

    /**
     * 销毁控件的默认处理。
     * 页面卸载时将销毁所有的控件，释放循环引用，防止在 IE 下发生内存泄漏，$dispose 方法的调用不会受到 ondispose 事件返回值的影响。
     * @protected
     */
    UI_LISTBOX_ITEM_CLASS.$dispose = function () {
        this._eInput = null;
        UI_ITEM_CLASS.$dispose.call(this);
    };

    /**
     * 鼠标在滑动块区域内按压开始事件的默认处理。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_LISTBOX_ITEM_CLASS.$pressstart = function (event) {
        UI_ITEM_CLASS.$pressstart.call(this, event);
        core.select(this, event, 'listbox');
    };

    /**
     * 选择框选中处理
     * @protected
     */
    UI_LISTBOX_ITEM_CLASS.$select = function () {
        var startIndex = this._nStartIndex,
            lastIndex = this._nLastIndex,
            index = UI_LISTBOX_OVERED(this),
            items = this.getParent().getItems(),
            fromCancel = 0,
            toCancel = -1,
            fromSelect = 0,
            toSelect = -1;

        if (index > lastIndex) {
            if (index < startIndex) {
                // index与lastIndex都在负方向
                fromCancel = lastIndex;
                toCancel = index - 1;
            }
            else if (lastIndex < startIndex) {
                // index与lastIndex位于起始选项两边
                fromCancel = lastIndex;
                toCancel = startIndex - 1;
                fromSelect = startIndex + 1;
                toSelect = index;
            }
            else {
                // index与lastIndex都在正方向
                fromSelect = lastIndex + 1;
                toSelect = index;
            }
        }
        else if (index < lastIndex) {
            if (index > startIndex) {
                // index与lastIndex都在正方向
                fromCancel = index + 1;
                toCancel = lastIndex;
            }
            else if (lastIndex > startIndex) {
                // index与lastIndex位于起始选项两边
                fromCancel = startIndex + 1;
                toCancel = lastIndex;
                fromSelect = index;
                toSelect = startIndex - 1;
            }
            else {
                // index与lastIndex都在负方向
                fromSelect = index;
                toSelect = lastIndex - 1;
            }
        }

        this._nLastIndex = index;

        // 恢复之前的选择状态
        for (; fromCancel <= toCancel; ) {
            index = items[fromCancel++];
            index.alterClass('selected', !index.isSelected());
        }

        // 选择框内的全部假选中
        for (; fromSelect <= toSelect; ) {
            items[fromSelect++].alterClass('selected');
        }
    };

    /**
     * 选择框选中结束
     * @protected
     */
    UI_LISTBOX_ITEM_CLASS.$selectend = function () {
        var startIndex = this._nStartIndex,
            index = UI_LISTBOX_OVERED(this),
            items = this.getParent().getItems(),
            fromIndex = MIN(startIndex, index),
            toIndex = MAX(startIndex, index);

        if (startIndex == index) {
            // 点击的当前条目，进行反选
            this.setSelected(!this.isSelected());
        }
        else {
            // 否则选择框内的全部选中
            for (; fromIndex <= toIndex; ) {
                items[fromIndex++].setSelected();
            }
        }
    };

    /**
     * 选择框选中开始
     * @protected
     */
    UI_LISTBOX_ITEM_CLASS.$selectstart = function () {
        this._nStartIndex = this._nLastIndex = UI_LISTBOX_OVERED(this);
        this.alterClass('selected');
    };

    /**
     * 判断多选框的选项控件是否被选中。
     * @public
     *
     * @return {boolean} 选项是否被选中
     */
    UI_LISTBOX_ITEM_CLASS.isSelected = function () {
        return !this._eInput.disabled;
    };

    /**
     * 设置当前控件的父控件。
     * @public
     *
     * @param {ecui.ui.Control|HTMLElement} parent 父控件对象/父 Element 对象，忽略参数则将控件移出 DOM 树
     */
    UI_LISTBOX_ITEM_CLASS.setParent = function (parent) {
        UI_ITEM_CLASS.setParent.call(this, parent);

        if (parent instanceof UI_LISTBOX) {
            this._eInput = setInput(this._eInput, parent._sName);
        }
    };

    /**
     * 设置选中状态。
     * @public
     *
     * @param {boolean} status 是否选中，默认为选中
     */
    UI_LISTBOX_ITEM_CLASS.setSelected = function (status) {
        this.alterClass('selected', this._eInput.disabled = status === false);
    };

    /**
     * 选项控件发生变化的处理。
     * 在 ecui.ui.Items 接口中，选项控件发生增加/减少操作时调用此方法。
     * @protected
     */
    UI_LISTBOX_CLASS.$alterItems = function () {
        var items = this.getItems(),
            length = items.length,
            vscroll = this._cScroll,
            step = length && items[0].getHeight();

        if (step) {
            vscroll.setStep(step);
            this.setItemSize(
                this.getBodyWidth() - (length * step > this.getBodyHeight() ? vscroll.getWidth() : 0),
                step
            );
            this.paint();
        }
    };

    /**
     * 获取控件的表单项名称。
     * 多选框控件可以在表单中被提交，getName 方法返回提交时用的表单项名称，表单项名称可以使用 setName 方法改变。
     * @public
     *
     * @return {string} 表单项名称
     */
    UI_LISTBOX_CLASS.getName = function () {
        return this._sName;
    };

    /**
     * 获取所有选中的选项。
     * @public
     *
     * @return {Array} 选项数组
     */
    UI_LISTBOX_CLASS.getSelected = function () {
        for (var i = 0, list = this.getItems(), o, result = []; o = list[i++]; ) {
            o.isSelected() && result.push(o);
        }
        return result;
    };

    /**
     * 选中所有的选项。
     * 某些场景下，需要多选框控件的内容都可以被提交，可以在表单的 onsubmit 事件中调用 selectAll 方法全部选择。
     * @public
     */
    UI_LISTBOX_CLASS.selectAll = function () {
        for (var i = 0, list = this.getItems(), o; o = list[i++]; ) {
            o.setSelected();
        }
    };

    /**
     * 设置控件的表单项名称。
     * 多选框控件可以在表单中被提交，setName 方法设置提交时用的表单项名称，表单项名称可以使用 getName 方法获取。
     * @public
     *
     * @param {string} name 提交用的名称
     */
    UI_LISTBOX_CLASS.setName = function (name) {
        for (var i = 0, list = this.getItems(), o; o = list[i++]; ) {
            // 需要将下属所有的输入框名称全部改变
            o._eInput = setInput(o._eInput, name);
        }
        this._sName = name;
    };


﻿/*
Select - 定义模拟下拉框行为的基本操作。
下拉框控件，继承自输入框控件，实现了选项组接口，内部包含了三个部件，分别是下拉框显示的文本(选项控件)、下拉框的按钮(基础控件)与下拉选项框
(截面控件，只使用垂直滚动条)。下拉框控件扩展了原生 SelectElement 的功能，允许指定下拉选项框的最大选项数量，在屏幕显示
不下的时候，会自动显示在下拉框的上方。在没有选项时，下拉选项框有一个选项的高度。下拉框控件允许使用键盘与滚轮操作，在下
拉选项框打开时，可以通过回车键或鼠标点击选择，上下键选择选项的当前条目，在关闭下拉选项框后，只要拥有焦点，就可以通过滚
轮上下选择选项。

下拉框控件直接HTML初始化的例子:
<select ecui="type:select;option-size:3" name="test">
    <!-- 这里放选项内容 -->
    <option value="值">文本</option>
    ...
    <option value="值" selected>文本</option>
    ...
</select>

如果需要自定义特殊的选项效果，请按下列方法初始化:
<div ecui="type:select;name:test;option-size:3">
    <!-- 这里放选项内容 -->
    <li ecui="value:值">文本</li>
    ...
</div>

属性
_nOptionSize  - 下接选择框可以用于选择的条目数量
_cSelected    - 当前选中的选项
_uText        - 下拉框的文本框
_uButton      - 下拉框的按钮
_uOptions     - 下拉选择框
*/


    /**
     * 下拉框刷新。
     * @private
     *
     * @param {ecui.ui.Select} control 下拉框控件
     */
    function UI_SELECT_FLUSH(control) {
        var options = control._uOptions,
            scroll = options.$getSection('VScroll'),
            el = options.getOuter(),
            pos = getPosition(control.getOuter()),
            selected = control._cSelected,
            optionTop = pos.top + control.getHeight();

        // 第一次显示时需要进行下拉选项部分的初始化
        if (!getParent(el)) {
            DOCUMENT.body.appendChild(el);
            control.$alterItems();
        }

        if (options.isShow()) {
            control.$setActived(selected);
            scroll.setValue(scroll.getStep() * indexOf(control.getItems(), selected));

            // 以下使用control代替optionHeight
            control = options.getHeight();

            // 如果浏览器下部高度不够，将显示在控件的上部
            options.setPosition(
                pos.left,
                optionTop + control <= getView().bottom ? optionTop : pos.top - control
            );
        }
    }

    copy(UI_SELECT_CLASS, UI_ITEMS);

    /**
     * 销毁控件的默认处理。
     * 页面卸载时将销毁所有的控件，释放循环引用，防止在 IE 下发生内存泄漏，$dispose 方法的调用不会受到 ondispose 事件返回值的影响。
     * @protected
     */
    UI_SELECT_OPTIONS_CLASS.$dispose = function () {
        // 下拉选项框处于显示状态，需要先恢复状态
        if (this.isShow()) {
            mask();
            restore();
        }
        removeDom(this.getOuter());
        UI_PANEL_CLASS.$dispose.call(this);
    };

    /**
     * 获取选项的值。
     * getValue 方法返回选项控件的值，即选项选中时整个下拉框控件的值。
     * @public
     *
     * @return {string} 选项的值
     */
    UI_SELECT_ITEM_CLASS.getValue = function () {
        return this._sValue;
    };

    /**
     * 设置选项的值。
     * setValue 方法设置选项控件的值，即选项选中时整个下拉框控件的值。
     * @public
     *
     * @param {string} value 选项的值
     */
    UI_SELECT_ITEM_CLASS.setValue = function (value) {
        var parent = this.getParent();
        this._sValue = value;
        parent && parent._cSelected == this && UI_EDIT_CLASS.setValue.call(parent, value);
    };

    /**
     * 选项控件发生变化的处理。
     * 在 选项组接口 中，选项控件发生增加/减少操作时调用此方法。
     * @protected
     */
    UI_SELECT_CLASS.$alterItems = function () {
        var options = this._uOptions,
            scroll = options.$getSection('VScroll'),
            optionSize = this._nOptionSize,
            step = this.getBodyHeight(),
            width = this.getWidth(),
            itemLength = this.getItems().length;

        if (getParent(options.getOuter())) {
            // 设置选项框
            scroll.setStep(step);

            // 为了设置激活状态样式, 因此必须控制下拉框中的选项必须在滚动条以内
            this.setItemSize(
                width - options.getInvalidWidth() - (itemLength > optionSize ? scroll.getWidth() : 0),
                step
            );

            // 设置options框的大小，如果没有元素，至少有一个单位的高度
            options.cache(false, true);
            options.$setSize(width, (MIN(itemLength, optionSize) || 1) * step + options.getInvalidHeight());
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
    UI_SELECT_CLASS.$cache = function (style, cacheSize) {
        (getParent(this._uOptions.getOuter()) ? UI_ITEMS : UI_EDIT_CLASS).$cache.call(this, style, cacheSize);
        this._uText.cache(false, true);
        this._uButton.cache(false, true);
    };

    /**
     * 界面点击强制拦截事件的默认处理。
     * 控件在下拉框展开时，需要拦截浏览器的点击事件，如果点击在下拉选项区域，则选中当前项，否则直接隐藏下拉选项框，但不会改变控件激活状态。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_SELECT_CLASS.$intercept = function (event) {
        //__transform__control_o
        var control = findControl(event.target);
        this._uOptions.hide();
        mask();

        // 检查点击是否在当前下拉框的选项上
        if (control instanceof UI_SELECT_ITEM && control != this._cSelected) {
            this.setSelected(control);
            this.change();
        }
    };

    /**
     * 控件拥有焦点时，键盘事件的默认处理。
     * 屏蔽空格键按下事件。Opera 下仅用 keydown 不能屏蔽空格键事件，还需要在 keypress 中屏蔽。如果控件处于可操作状态(参见 isEnabled)，keydown/keypress 方法触发 onkeydown/onkeypress 事件，如果事件返回值不为 false，则调用 $keydown/$keypress 方法。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_SELECT_CLASS.$keydown = UI_SELECT_CLASS.$keypress = function (event) {
        if (UI_EDIT_CLASS['$' + event.type](event) === false) {
            return false;
        }

        var options = this._uOptions,
            scroll = options.$getSection('VScroll'),
            optionSize = this._nOptionSize,
            which = event.which,
            items = this.getItems(),
            length = items.length,
            active = this.getActived(),
            show = options.isShow();

        if (getPressed() != this) {
            // 当前不能存在鼠标操作，否则屏蔽按键
            if (which == 40 || which == 38) {
                if (length) {
                    if (show) {
                        this.$setActived(items[which = MIN(MAX(0, indexOf(items, active) + which - 39), length - 1)]);
                        which -= scroll.getValue() / scroll.getStep();
                        scroll.skip(which < 0 ? which : which >= optionSize ? which - optionSize + 1 : 0);
                    }
                    else {
                        this.setSelected(MIN(MAX(0, indexOf(items, this._cSelected) + which - 39), length - 1));
                    }
                }
                return false;
            }
            else if (which == 27 || which == 13 && show) {
                // 回车键选中，ESC键取消
                which == 13 && this.setSelected(active);
                options.hide();
                mask();
                restore();
                return false;
            }
        }
    };

    /**
     * 鼠标在控件区域滚动滚轮事件的默认处理。
     * 如果控件拥有焦点，则当前选中项随滚轮滚动而自动指向前一项或者后一项。如果控件处于可操作状态(参见 isEnabled)，mousewheel 方法触发 onmousewheel 事件，如果事件返回值不为 false，则调用 $mousewheel 方法。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_SELECT_CLASS.$mousewheel = function (event) {
        var options = this._uOptions,
            items = this.getItems(),
            length = items.length;

        options.isShow()
            ? options.$mousewheel(event)
            : this.setSelected(
                length ? MIN(MAX(0, indexOf(items, this._cSelected) + (event.detail > 0 ? 1 : -1)), length - 1) : null
            );
        return false;
    };

    /**
     * 控件按压状态开始事件的默认处理。
     * 鼠标左键按压控件开始时显示下拉框。如果控件处于可操作状态(参见 isEnabled)，pressstart 方法触发 onpressstart 事件，如果事件返回值不为 false，则调用 $pressstart 方法。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_SELECT_CLASS.$pressstart = function (event) {
        UI_EDIT_CLASS.$pressstart.call(this, event);
        debug = true;
        this._uOptions.show();
        // 拦截之后的点击，同时屏蔽所有的控件点击事件
        intercept(this);
        mask(0, 65534);
        UI_SELECT_FLUSH(this);
    };

    /**
     * 控件自动渲染全部完成后的处理。
     * 页面刷新时，部分浏览器会回填输入框的值，需要在回填结束后触发设置控件的状态。
     * @protected
     */
    UI_SELECT_CLASS.$ready = function () {
        this.setValue(this.getValue());
    };

    /**
     * 控件移除子控件事件的默认处理。
     * 下拉框移除子选项时需要检查选项是否被选中，如果被选中需要清除状态。
     * @protected
     *
     * @param {Item} item 选项控件
     */
    UI_SELECT_CLASS.$remove = function (item) {
        this._cSelected == item && this.setSelected();
        UI_ITEMS.$remove.call(this, item);
    };

    /**
     * 设置控件的大小。
     * @protected
     *
     * @param {number} width 宽度，如果不需要设置则将参数设置为等价于逻辑非的值
     * @param {number} height 高度，如果不需要设置则省略此参数
     */
    UI_SELECT_CLASS.$setSize = function (width, height) {
        var __gzip_direct__button = this._uButton;

        UI_EDIT_CLASS.$setSize.call(this, width, height);
        this.$locate();
        height = this.getBodyHeight();

        // 设置文本区域
        this._uText.$setSize(width = this.getBodyWidth() - height, height);

        // 设置下拉按钮
        __gzip_direct__button.$setSize(height, height);
        __gzip_direct__button.setPosition(width, 0);
    };

    /**
     * 获取被选中的选项控件。
     * @public
     *
     * @return {ecui.ui.Item} 选项控件
     */
    UI_SELECT_CLASS.getSelected = function () {
        return this._cSelected || null;
    };

    /**
     * 设置下拉框允许显示的选项数量。
     * 如果实际选项数量小于这个数量，没有影响，否则将出现垂直滚动条，通过滚动条控制其它选项的显示。
     * @public
     *
     * @param {number} value 显示的选项数量，必须大于 1
     */
    UI_SELECT_CLASS.setOptionSize = function (value) {
        this._nOptionSize = value;
        this.$alterItems();
        UI_SELECT_FLUSH(this);
    };

    /**
     * 选中选项。
     * @public
     *
     * @param {number|ecui.ui.Item} item 选项的序号/选项控件
     */
    UI_SELECT_CLASS.setSelected = function (item) {
        // 将选项序号转换成选项
        item = 'number' == typeof item ? this.getItems()[item] : item || null;

        if (this._cSelected !== item) {
            this._uText.$setBodyHTML(item ? item.getBody().innerHTML : '');
            UI_EDIT_CLASS.setValue.call(this, item ? item._sValue : '');
            this._cSelected = item;
            this._uOptions.isShow() && this.$setActived(item);
        }
    };

    /**
     * 设置控件的值。
     * setValue 方法设置控件的值，设置的值必须与一个子选项的值相等，否则将被设置为空，使用 getValue 方法获取设置的值。
     * @public
     *
     * @param {string} value 需要选中的值
     */
    UI_SELECT_CLASS.setValue = function (value) {
        for (var i = 0, items = this.getItems(), o; o = items[i++]; ) {
            if (o._sValue == value) {
                this.setSelected(o);
                return;
            }
        }

        // 找不到满足条件的项，将选中的值清除
        this.setSelected();
    };


﻿/*
Combox - 定义可输入下拉框行为的基本操作。
可输入下拉框控件，继承自下拉框控件，在下拉框控件的基础上允许选项框可输入内容。

下拉框控件直接HTML初始化的例子:
<select ecui="type:combox" name="test">
    <!-- 这里放选项内容 -->
    <option value="值">文本</option>
    ...
    <option value="值" selected>文本</option>
    ...
</select>

如果需要自定义特殊的选项效果，请按下列方法初始化:
<div ecui="type:combox">
    <!-- 如果ec中不指定name，也可以在input中指定 -->
    <input name="test" />
    <!-- 这里放选项内容 -->
    <li value="值">文本</li>
    ...
</div>
*/


    /**
     * 设置控件的大小。
     * @protected
     *
     * @param {number} width 宽度，如果不需要设置则将参数设置为等价于逻辑非的值
     * @param {number} height 高度，如果不需要设置则省略此参数
     */
    UI_COMBOX_CLASS.$setSize = function (width, height) {
        UI_SELECT_CLASS.$setSize.call(this, width, height);
        this.getInput().style.width = this.$getSection('Text').getWidth() + 'px';
    };


/*
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


    /**
     * 刷新显示区域的选中值列表。
     * @private
     *
     * @param {ecui.ui.MultiSelect} control 多选下拉框控件
     */
    function UI_MULTI_SELECT_FLUSH_TEXT(control) {
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
     * 控件在多选下拉框展开时，需要拦截浏览器的点击事件，如果点击在下拉选项区域，则选中当前项，否则直接隐藏下拉选项框，但不会改变控件激活状态。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_MULTI_SELECT_CLASS.$intercept = function (event) {
        if (findControl(event.target) instanceof UI_MULTI_SELECT_ITEM) {
            return false;
        }
        this.$getSection('Options').hide();
        mask();
    };

    /**
     * 控件拥有焦点时，键盘弹起事件的默认处理。
     * 如果控件处于可操作状态(参见 isEnabled)，keyup 方法触发 on，keyup 事件，如果事件返回值不为 false，则调用 $keyup 方法。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_MULTI_SELECT_CLASS.$keyup = function (event) {
        if (!this.$getSection('Options').isShow() || UI_EDIT_CLASS.$keyup.call(this, event) === false) {
            return false;
        }

        if (event.which == 13 || event.which == 32) {
            this.getActived().$click();
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
    UI_MULTI_SELECT_CLASS.$ready = function () {
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


/*
Table - 定义由行列构成的表格的基本操作。
表格控件，继承自截面控件，内部包含一个部件——标题区(基础控件)。表格控件对基本的 TableElement 功能进行了扩展，表头固定，
不会随表格的垂直滚动条滚动而滚动，在行列滚动时，支持整行整列移动，允许直接对表格的数据进行增加/删除/修改操作。

表格控件直接HTML初始化的例子:
<div ecui="type:table">
    <table>
        <!-- 当前节点的列定义，如果有特殊格式，需要使用width样式 -->
        <thead>
            <tr>
                <th>标题</th>
                ...
            </tr>
        </thead>
        <tbody>
            <!-- 这里放单元格序列 -->
            <tr>
                <td>单元格一</td>
                ...
            </tr>
            ...
        </tbody>
    </table>
</div>

属性
_aCol        - 表头的列控件对象
_aRow        - 表格数据行对象
_uHead       - 表头区域

表头列属性
$cache$pos   - 列的坐标

行属性
$cache$pos   - 行的坐标
_aCol        - 行的列Element对象，如果当前列需要向左合并为null，需要向上合并为false
*/


    /**
     * 表格控件初始化一行的宽度。
     * @private
     *
     * @param {ecui.ui.Table.Row} row 行控件
     */
    function UI_TABLE_ROW_INIT(row) {
        for (var i = 0, cols = row.getParent()._aCol, el, o; o = cols[i]; ) {
            if (el = row._aCol[i++]) {
                o = o.getWidth() - o.getInvalidWidth();
                while (row._aCol[i] === null) {
                    o += cols[i++].getWidth();
                }
                el.style.width = o + 'px';
            }
        }
    }

    /**
     * 表格控件改变显示区域值。
     * 表格控件改变显示区域时，每次尽量移动一个完整的行或列的距离。
     * @private
     *
     * @param {number} value 控件的当前值
     */
    function UI_TABLE_SCROLL_SETVALUE(value) {
        var i = 1,
            list = this.getParent()[this instanceof UI_VSCROLL ? '_aRow' : '_aCol'],
            oldValue = this.getValue();

        value = MIN(MAX(0, value), this.getTotal());

        if (value == oldValue) {
            return;
        }

        if (value > oldValue) {
            if (list.length == 1) {
                UI_SCROLL_CLASS.setValue.call(this, this.getTotal());
                return;
            }
            for (; ; i++) {
                // 计算后移的新位置
                if (value <= list[i].$cache$pos) {
                    oldValue < list[i - 1].$cache$pos && i--;
                    break;
                }
            }
        }
        else {
            for (i = list.length; i--; ) {
                // 计算前移的新位置
                if (value >= list[i].$cache$pos) {
                    i < list.length - 1 && oldValue > list[i + 1].$cache$pos && i++;
                    break;
                }
            }
        }

        UI_SCROLL_CLASS.setValue.call(this, list[i].$cache$pos);
    }

    /**
     * 鼠标单击控件事件的默认处理。
     * 如果控件处于可操作状态(参见 isEnabled)，click 方法触发 onclick 事件，如果事件返回值不为 false，则调用 $click 方法。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_TABLE_ROW_CLASS.$click = function (event) {
        var table = this.getParent();
        table.onrowclick && table.onrowclick(event) !== false || UI_CONTROL_CLASS.$click.call(this, event);
    };

    /**
     * 销毁控件的默认处理。
     * 页面卸载时将销毁所有的控件，释放循环引用，防止在 IE 下发生内存泄漏，$dispose 方法的调用不会受到 ondispose 事件返回值的影响。
     * @protected
     */
    UI_TABLE_ROW_CLASS.$dispose = function () {
        this._aCol = null;
        UI_CONTROL_CLASS.$dispose.call(this);
    };

    /**
     * 获取一行中单元格的 Element 对象数组。
     * @protected
     *
     * @return {Array} 单元格的 Element 对象数组
     */
    UI_TABLE_ROW_CLASS.$getCols = function () {
        return this._aCol.slice();
    };

    /**
     * 获取一行中的单元格控件。
     * @public
     *
     * @return {ecui.ui.Control} 单元格控件
     */
    UI_TABLE_ROW_CLASS.getCol = function (index) {
        return this._aCol[index] ? this._aCol[index].getControl() : null;
    };

    /**
     * 获取一行中的全部单元格控件。
     * @public
     *
     * @return {Array} 单元格控件数组
     */
    UI_TABLE_ROW_CLASS.getCols = function () {
        for (var i = this._aCol.length, result = []; i--; ) {
            result[i] = this.getCol(i);
        }

        return result;
    };

    /**
     * 隐藏整列。
     * @protected
     */
    UI_TABLE_COL_CLASS.$hide = function () {
        this.$setStyles('display', 'none', -this.getWidth());
    };

    /**
     * 设置整列的样式。
     * $setStyles 方法批量设置一列所有单元格的样式。
     * @protected
     *
     * @param {string} name 样式的名称
     * @param {string} value 样式的值
     * @param {number} widthRevise 改变样式后表格宽度的变化，如果省略表示没有变化
     */
    UI_TABLE_COL_CLASS.$setStyles = function (name, value, widthRevise) {
        var i = 0,
            table = this.getParent(),
            body = this.getBody(),
            cols = table._aCol,
            index = indexOf(cols, this),
            o = getParent(getParent(getParent(body))).style,
            j;

        body.style[name] = value;
        if (widthRevise) {
            o.width = first(table.getBody()).style.width = toNumber(o.width) + widthRevise + 'px';
        }

        for (; o = table._aRow[i++]; ) {
            // 以下使用 body 表示列元素列表
            body = o._aCol;
            o = body[index];
            if (o) {
                o.style[name] = value;
            }
            if (widthRevise && o !== false) {
                for (j = index; !(o = body[j]); j--) {}

                var width = -cols[j].getInvalidWidth(),
                    colspan = 0;

                do {
                    if (!cols[j].getOuter().style.display) {
                        width += cols[j].getWidth();
                        colspan++;
                    }
                }
                while (body[++j] === null);

                if (width > 0) {
                    o.style.display = '';
                    o.style.width = width + 'px';
                    o.setAttribute('colSpan', colspan);
                }
                else {
                    o.style.display = 'none';
                }
            }
        }
        widthRevise > 0 ? table.resize() : table.paint();
    };

    /**
     * 显示整列。
     * @protected
     */
    UI_TABLE_COL_CLASS.$show = function () {
        this.$setStyles('display', '', this.getWidth());
    };

    /**
     * 设置整列的宽度。
     * @public
     *
     * @param {number} width 列的宽度
     */
    UI_TABLE_COL_CLASS.setSize = function (width) {
        var oldWidth = this.getWidth();

        this.$setSize(width);
        this.$setStyles('width', width - this.getInvalidWidth(true) + 'px', width - oldWidth);
    };

    /**
     * 鼠标单击控件事件的默认处理。
     * 如果控件处于可操作状态(参见 isEnabled)，click 方法触发 onclick 事件，如果事件返回值不为 false，则调用 $click 方法。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_TABLE_CELL_CLASS.$click = function (event) {
        var table = this.getParent().getParent();
        table.oncellclick && table.oncellclick(event) !== false || UI_CONTROL_CLASS.$click.call(this, event);
    };

    /**
     * 获取控件区域的高度。
     * @public
     *
     * @return {number} 控件的高度
     */
    UI_TABLE_CELL_CLASS.getHeight = function () {
        return this.getOuter().offsetHeight;
    };

    /**
     * 获取控件区域的宽度。
     * @public
     *
     * @return {number} 控件的宽度
     */
    UI_TABLE_CELL_CLASS.getWidth = function () {
        return this.getOuter().offsetWidth;
    };

    /**
     * 计算控件的缓存。
     * 控件缓存部分核心属性的值，提高控件属性的访问速度，在子控件或者应用程序开发过程中，如果需要避开控件提供的方法(setSize、alterClass 等)直接操作 Element 对象，操作完成后必须调用 clearCache 方法清除控件的属性缓存，否则将引发错误。
     * @protected
     *
     * @param {CssStyle} style 基本 Element 对象的 Css 样式对象
     * @param {boolean} cacheSize 是否需要缓存控件大小，如果控件是另一个控件的部件时，不缓存大小能加快渲染速度，默认缓存
     */
    UI_TABLE_CLASS.$cache = function (style, cacheSize) {
        UI_PANEL_CLASS.$cache.call(this, style, cacheSize);

        this._uHead.cache(false, true);

        // 以下使用 style 表示临时对象 o
        this.$cache$mainHeight -= this.$cache$paddingTop = getParent(this._uHead.getBody()).offsetHeight;
        for (var i = 0, pos = 0; style = this._aRow[i++]; ) {
            style.$cache$pos = pos;
            style.cache(true, true);
            if (!style.getOuter().style.display) {
                pos += style.getHeight();
            }
        }
        for (i = 0, pos = 0; style = this._aCol[i++]; ) {
            style.$cache$pos = pos;
            style.cache(true, true);
            if (!style.getOuter().style.display) {
                pos += style.getWidth();
            }
        }
        this.$cache$mainWidth = pos;
    };

    /**
     * 获取单元格元素。
     * $getCell 方法在合法的行列序号内一定会返回一个 DOM 元素，如果当前单元格被合并，将返回合并后的 DOM 元素。
     * @protected
     *
     * @param {number} rowIndex 单元格的行数，从0开始
     * @param {number} colIndex 单元格的列数，从0开始
     * @return {HTMLElement} 单元格 DOM 元素
     */
    UI_TABLE_CLASS.$getCell = function (rowIndex, colIndex) {
        var rows = this._aRow,
            cols = rows[rowIndex] && rows[rowIndex]._aCol,
            col = cols && cols[colIndex];

        if (col === undefined) {
            col = null;
        }
        else if (!col) {
            for (; col === false; col = (cols = rows[--rowIndex]._aCol)[colIndex]) {};
            for (; !col; col = cols[--colIndex]) {};
        }
        return col;
    };

    /**
     * 控件渲染完成后初始化的默认处理。
     * $init 方法在控件渲染完成后调用，参见 create 与 init 方法。
     * @protected
     */
    UI_TABLE_CLASS.$init = function () {
        UI_PANEL_CLASS.$init.call(this);

        for (var i = 0, o; o = this._aCol[i++]; ) {
            o.$setSize(o.getWidth());
        }
        for (i = 0; o = this._aRow[i++]; ) {
            UI_TABLE_ROW_INIT(o);
        }
        insertBefore(getParent(this._uHead.getBody()), this._uHead.getBase().lastChild.lastChild.firstChild);
    };

    /**
     * 表格控件对显示记录滚动。
     * @protected
     */
    UI_TABLE_CLASS.$scroll = function () {
        UI_PANEL_CLASS.$scroll.call(this);
        this._uHead.getBase().lastChild.style.left = this.getBody().style.left;
    };

    /**
     * 设置控件的大小。
     * @protected
     *
     * @param {number} width 宽度，如果不需要设置则将参数设置为等价于逻辑非的值
     * @param {number} height 高度，如果不需要设置则省略此参数
     */
    UI_TABLE_CLASS.$setSize = function (width, height) {
        var body = this.getBody(),
            vscroll = this.$getSection('VScroll'),
            hscroll = this.$getSection('HScroll'),
            __gzip_direct__mainWidth = this.$cache$mainWidth,
            __gzip_direct__mainHeight = this.$cache$mainHeight,
            vsWidth = vscroll && vscroll.getWidth(),
            hsHeight = hscroll && hscroll.getHeight(),
            invalidWidth = this.getInvalidWidth(true),
            invalidHeight = this.getInvalidHeight(true),
            mainWidthRevise = __gzip_direct__mainWidth + invalidWidth,
            mainHeightRevise = __gzip_direct__mainHeight + invalidHeight,
            bodyWidth = width - invalidWidth,
            bodyHeight = height - invalidHeight,
            o;

        this.getBase().style.paddingTop = this.$cache$paddingTop + 'px';
        first(body).style.width = this._uHead.getBase().lastChild.lastChild.style.width
            = __gzip_direct__mainWidth + 'px';

        // 计算控件的宽度与高度自动扩展
        if (__gzip_direct__mainWidth <= bodyWidth && __gzip_direct__mainHeight <= bodyHeight) {
            width = mainWidthRevise;
            height = mainHeightRevise;
        }
        else if (!(vscroll && hscroll
            && __gzip_direct__mainWidth > bodyWidth - vsWidth
            && __gzip_direct__mainHeight > bodyHeight - hsHeight)
        ) {
            o = mainWidthRevise + (!vscroll || bodyHeight >= __gzip_direct__mainHeight ? 0 : vsWidth);
            width = hscroll ? MIN(width, o) : o;
            o = mainHeightRevise + (!hscroll || bodyWidth >= __gzip_direct__mainWidth ? 0 : hsHeight);
            height = vscroll ? MIN(height, o) : o;
        }

        UI_PANEL_CLASS.$setSize.call(this, width, height);

        this._uHead.$setSize(toNumber(getParent(body).style.width), this.$cache$paddingTop);
    };

    /**
     * 增加一列。
     * params 参数对象支持的属性如下：
     * width   {number} 列的宽度
     * base    {string} 列的基本样式
     * title   {string} 列的标题
     * @public
     *
     * @param {Object} params 列的初始化参数
     * @param {number} index 被添加的列的位置序号，如果不合法将添加在末尾
     * @return {ecui.ui.Table.Col} 列控件
     */
    UI_TABLE_CLASS.addCol = function (params, index) {
        var i = 0,
            typeClass = this.getType(),
            baseClass = params.base || this.getBaseClass(),
            el = createDom(typeClass + '-head ' + baseClass + '-head', '', 'th'),
            col = $fastCreate(UI_TABLE_COL, el, this),
            o = this._aCol[index],
            width = params.width,
            row;

        if (o) {
            o = o.getOuter();
        }
        else {
            index = this._aCol.length;
        }

        this._aCol.splice(index, 0, col);
        el.innerHTML = params.title || '';
        this._uHead.getBody().insertBefore(el, o);

        typeClass = typeClass + '-item ' + baseClass + '-item';
        for (; row = this._aRow[i]; i++) {
            o = row._aCol[index];
            if (o !== null) {
                // 没有出现跨列的插入列操作
                for (j = index; !o; ) {
                    o = row._aCol[++j];
                    if (o === undefined) {
                        break;
                    }
                }
                row._aCol.splice(index, 0, o = row.getBody().insertBefore(createDom(typeClass, '', 'td'), o));
                o.getControl = UI_TABLE_INIT_GETCONTROL;
            }
            else {
                // 出现跨列的插入列操作，需要修正colspan的属性值
                var cell = this.$getCell(i, index),
                    j = toNumber(cell.getAttribute('rowspan')) || 1;

                cell.setAttribute('colSpan', toNumber(cell.getAttribute('colSpan')) + 1);
                row._aCol.splice(index, 0, o);
                for (; --j; ) {
                    this._aRow[++i]._aCol.splice(index, 0, false);
                }
            }
        }

        col.$setSize(width);
        col.$setStyles('width', el.style.width, width);

        return col;
    };

    /**
     * 增加一行。
     * @public
     *
     * @param {Array} data 数据源(一维数组)
     * @param {number} index 被添加的行的位置序号，如果不合法将添加在最后
     * @return {ecui.ui.Table.Row} 行控件
     */
    UI_TABLE_CLASS.addRow = function (data, index) {
        var i = 0,
            j = 1,
            body = this.getBody().lastChild.lastChild,
            typeClass = this.getType(),
            el = createDom(),
            html = ['<table><tbody><tr class="' + typeClass + '-row ' + this.getBaseClass() + '-row">'],
            rowCols = [],
            row = this._aRow[index],
            col;

        row || (index = this._aRow.length);

        for (; col = this._aCol[i]; ) {
            if (row && row._aCol[i] === false || data[i] === false) {
                rowCols[i++] = false;
            }
            else {
                // 如果部分列被隐藏，colspan/width 需要动态计算
                rowCols[i] = true;
                html[j++] = '<td class="' + typeClass + '-item ' + col.getBaseClass().slice(0, -5) + '-item" style="';
                for (
                    var o = i,
                        colspan = col.isShow() ? 1 : 0,
                        width = -col.getInvalidWidth();
                    (col = this._aCol[++i]) && data[i] === null;
                ) {
                    rowCols[i] = null;
                    if (col.isShow()) {
                        colspan++;
                        width += col.getWidth();
                    }
                }
                rowCols[o] = true;
                html[j++] = (colspan ? 'width:' + width + 'px" colSpan="' + colspan : 'display:none') + '">'
                    + data[o] + '</td>';
            }
        }

        html[j] = '</tr></tbody></table>';
        el.innerHTML = html.join('');
        el = el.lastChild.lastChild.lastChild;

        body.insertBefore(el, row && row.getOuter());
        row = $fastCreate(findConstructor(this, 'Row'), el, this);
        this._aRow.splice(index--, 0, row);

        // 以下使用 col 表示上一次执行了rowspan++操作的单元格，同一个单元格只需要增加一次
        for (i = 0, el = el.firstChild, col = null; this._aCol[i]; i++) {
            if (o = rowCols[i]) {
                rowCols[i] = el;
                el.getControl = UI_TABLE_INIT_GETCONTROL;
                el = el.nextSibling;
            }
            else if (o === false) {
                o = this.$getCell(index, i);
                if (o != col) {
                    o.setAttribute('rowSpan', (toNumber(o.getAttribute('rowSpan')) || 1) + 1);
                    col = o;
                }
            }
        }

        row._aCol = rowCols;
        this.paint();

        return row;
    };

    /**
     * 获取单元格控件。
     * @public
     *
     * @param {number} rowIndex 单元格的行数，从0开始
     * @param {number} colIndex 单元格的列数，从0开始
     * @return {ecui.ui.Control} 单元格控件
     */
    UI_TABLE_CLASS.getCell = function (rowIndex, colIndex) {
        rowIndex = this._aRow[rowIndex];
        return rowIndex && rowIndex.getCol(colIndex) || null;
    };

    /**
     * 获取列控件/列 Element 对象。
     * 列控件只是通常的称呼，实际上就是普通的基础控件，提供了一些针对整列进行操作的方法，包括 hide、setSize(仅能设置宽度) 与 show 方法等。
     * @public
     *
     * @param {number} index 列数，从0开始
     * @return {ecui.ui.Table.Col} 列控件
     */
    UI_TABLE_CLASS.getCol = function (index) {
        return this._aCol[index] || null;
    };

    /**
     * 获取列控件的数量。
     * @public
     *
     * @return {number} 列控件数量
     */
    UI_TABLE_CLASS.getColCount = function () {
        return this._aCol.length;
    };

    /**
     * 获取全部的列控件。
     * @public
     *
     * @return {Array} 列控件数组
     */
    UI_TABLE_CLASS.getCols = function () {
        return this._aCol.slice();
    };

    /**
     * 获取行控件。
     * @public
     *
     * @param {number} index 行数，从0开始
     * @return {ecui.ui.Table.Row} 行控件
     */
    UI_TABLE_CLASS.getRow = function (index) {
        return this._aRow[index] || null;
    };

    /**
     * 获取行控件的数量。
     * @public
     *
     * @return {number} 行控件数量
     */
    UI_TABLE_CLASS.getRowCount = function () {
        return this._aRow.length;
    };

    /**
     * 获取表格中所有的行控件。
     * @public
     *
     * @return {Array} 行控件列表
     */
    UI_TABLE_CLASS.getRows = function () {
        return this._aRow.slice();
    };

    /**
     * 移除一列并释放占用的空间。
     * @public
     *
     * @param {number} index 列的序号，从0开始计数
     */
    UI_TABLE_CLASS.removeCol = function (index) {
        var i = 0,
            cols = this._aCol,
            o = cols[index];

        if (o) {
            o.hide();

            removeDom(o.getOuter());
            disposeControl(o);
            cols.splice(index, 1);

            for (; o = this._aRow[i++]; ) {
                cols = o._aCol;
                if (o = cols[index]) {
                    if (cols[index + 1] === null) {
                        // 如果是被合并的列，需要保留
                        cols.splice(index + 1, 1);
                        continue;
                    }
                    removeDom(o);
                    o.getControl != UI_TABLE_INIT_GETCONTROL && disposeControl(o.getControl());
                }
                cols.splice(index, 1);
            }
        }
    };

    /**
     * 移除一行并释放占用的空间。
     * @public
     *
     * @param {number} index 行的序号，从0开始计数
     */
    UI_TABLE_CLASS.removeRow = function (index) {
        var i = 0,
            remove = this._aRow[index],
            cols = remove._aCol,
            row = this._aRow[index + 1],
            cell,
            j,
            o;

        if (remove) {
            for (; this._aCol[i]; i++) {
                o = cols[i];
                if (o === false) {
                    o = this.$getCell(index - 1, i);
                    if (cell != o) {
                        o.setAttribute('rowSpan', toNumber(o.getAttribute('rowSpan')) - 1);
                        cell = o;
                    }
                }
                else if (o && (j = toNumber(o.getAttribute('rowSpan'))) > 1) {
                    o.setAttribute('rowSpan', j - 1);
                    row._aCol[i++] = o;
                    for (; cols[i] === null; ) {
                        row._aCol[i++] = null;
                    }
                    for (j = i--; ; ) {
                        cell = row._aCol[j++];
                        if (cell || cell === undefined) {
                            break;
                        }
                    }

                    row.getBody().insertBefore(o, cell);
                    o.getControl != UI_TABLE_INIT_GETCONTROL && o.getControl().$setParent(row);
                }
            }

            removeDom(remove.getOuter());
            disposeControl(remove);
            this._aRow.splice(index, 1);

            this.paint();
        }
    };

    // 初始化事件转发信息
    (function () {
        for (var i = 0; i < 5; ) {
            var o = eventNames[i++],
                type = o.slice(5);
            UI_TABLE_ROW_CLASS[o] = new Function(
                'e',
                'var p=this.getParent();p.onrow' + type + '&&p.onrow' + type
                    + '(e)!==false||ecui.ui.Control.prototype.' + o + '.call(this,e)'
            );
            UI_TABLE_CELL_CLASS[o] = new Function(
                'e',
                'var p=this.getParent().getParent();p.oncell' + type + '&&p.oncell' + type
                    + '(e)!==false||ecui.ui.Control.prototype.' + o + '.call(this,e)'
            );
        }
    })();


/*
LockedTable - 定义允许左右锁定若干列显示的高级表格的基本操作。
允许锁定左右两列的高级表格控件，继承自表格控件，内部包含两个部件——锁定的表头区(基础控件)与锁定的行内容区(基础控件)。

锁定列高级表格控件直接HTML初始化的例子:
<div ecui="type:locked-table;left-lock:2;right-lock:1">
    <table>
        <!-- 当前节点的列定义，如果有特殊格式，需要使用width样式 -->
        <thead>
            <tr>
                <th>标题</th>
                ...
            </tr>
        </thead>
        <tbody>
            <!-- 这里放单元格序列 -->
            <tr>
                <td>单元格一</td>
                ...
            </tr>
            ...
        </tbody>
    </table>
</div>

属性
_nLeft       - 最左部未锁定列的序号
_nRight      - 最右部未锁定列的后续序号，即未锁定的列序号+1
_aLockedRow  - 用于显示锁定区域的行控件数组
_uLockedHead - 锁定的表头区
_uLockedMain - 锁定的行内容区

表格行与锁定行属性
_cJoint      - 行(锁定行)对应的锁定行(行)控件
*/


    /**
     * 建立锁定行控件。
     * @private
     *
     * @param {ecui.ui.LockedTable} table 锁定表控件
     * @param {HTMLElement} el 锁定行的 Element 元素
     * @param {ecui.ui.Table.Row} row 表格基本行控件
     */
    function UI_LOCKED_TABLE_CREATE_LOCKEDROW(table, el, row) {
        el = $fastCreate(findConstructor(table, 'Row'), el, table);
        el._eFill = el.getBase().lastChild;
        el._cJoint = row;
        row._cJoint = el;

        return el;
    }

    /**
     * 拆分行内的单元格到锁定列或基本列中。
     * @private
     *
     * @param {ecui.ui.LockedTable.LockedHead|ecui.ui.LockedTable.LockedRow} locked 锁定表头控件或者锁定行控件
     */
    function UI_LOCKED_TABLE_ROW_SPLIT(locked) {
        var i = 0,
            table = locked.getParent(),
            flag = locked._cJoint.$getCols,
            cols = table.getCols(),
            list = flag ? locked._cJoint.$getCols() : cols,
            baseBody = locked._cJoint.getBody(),
            lockedBody = locked.getBody(),
            el = lockedBody.firstChild,
            o;

        for (; cols[i]; ) {
            if (i == table._nLeft) {
                el = baseBody.firstChild;
            }
            if (o = list[i++]) {
                flag || (o = o.getOuter());
                if (el != o) {
                    (i <= table._nLeft || i > table._nRight ? lockedBody : baseBody).insertBefore(o, el);
                }
                else {
                    el = el.nextSibling;
                }
            }
            if (i == table._nRight) {
                el = locked._eFill.nextSibling;
            }
        }
    }

    /**
     * 拆分所有行内的单元格到锁定列或基本列中。
     * @private
     *
     * @param {ecui.ui.LockedTable} table 锁定式表格控件
     */
    function UI_LOCKED_TABLE_ALL_SPLIT(table) {
        UI_LOCKED_TABLE_ROW_SPLIT(table._uLockedHead);
        for (var i = 0, row; row = table._aLockedRow[i++]; ) {
            UI_LOCKED_TABLE_ROW_SPLIT(row);
        }
    }

    /**
     * 销毁控件的默认处理。
     * 页面卸载时将销毁所有的控件，释放循环引用，防止在 IE 下发生内存泄漏，$dispose 方法的调用不会受到 ondispose 事件返回值的影响。
     * @protected
     */
    UI_LOCKED_TABLE_ROW_CLASS.$dispose = function () {
        this._eFill = null;
        UI_TABLE_ROW_CLASS.$dispose.call(this);
    };

    /**
     * 计算控件的缓存。
     * 控件缓存部分核心属性的值，提高控件属性的访问速度，在子控件或者应用程序开发过程中，如果需要避开控件提供的方法(setSize、alterClass 等)直接操作 Element 对象，操作完成后必须调用 clearCache 方法清除控件的属性缓存，否则将引发错误。
     * @protected
     *
     * @param {CssStyle} style 基本 Element 对象的 Css 样式对象
     * @param {boolean} cacheSize 是否需要缓存控件大小，如果控件是另一个控件的部件时，不缓存大小能加快渲染速度，默认缓存
     */
    UI_LOCKED_TABLE_CLASS.$cache = function (style, cacheSize) {
        UI_TABLE_CLASS.$cache.call(this, style, cacheSize);

        var i = 0,
            rows = this.getRows(),
            cols = this.getCols(),
            pos = cols[this._nLeft].$cache$pos;

        this.$cache$paddingTop = MAX(this.$cache$paddingTop, this._uLockedHead.getBody().offsetHeight);
        this.$cache$mainWidth -= (this.$cache$paddingLeft = pos)
            + (this.$cache$paddingRight
                = this._nRight < cols.length ? this.$cache$mainWidth - cols[this._nRight].$cache$pos : 0);

        // 以下使用 style 代替临时变量 o
        for (; style = cols[i++]; ) {
            style.$cache$pos -= pos;
        }

        for (i = 0, pos = 0; style = rows[i++]; ) {
            style.getCol(this._nLeft).cache(false, true);
            style.$cache$pos = pos;
            style._cJoint.cache(true, true);
            pos += MAX(style.getHeight(), style._cJoint.getHeight());
        }

        this.$cache$mainHeight = pos;
    };

    /**
     * 销毁控件的默认处理。
     * 页面卸载时将销毁所有的控件，释放循环引用，防止在 IE 下发生内存泄漏，$dispose 方法的调用不会受到 ondispose 事件返回值的影响。
     * @protected
     */
    UI_LOCKED_TABLE_CLASS.$dispose = function () {
        this._uLockedHead._eFill = null;
        UI_TABLE_CLASS.$dispose.call(this);
    };

    /**
     * 控件渲染完成后初始化的默认处理。
     * $init 方法在控件渲染完成后调用，参见 create  与 init 方法。
     * @protected
     */
    UI_LOCKED_TABLE_CLASS.$init = function () {
        UI_TABLE_CLASS.$init.call(this);
        UI_LOCKED_TABLE_ALL_SPLIT(this);
    };

    /**
     * 控件大小发生变化的默认处理。
     * @protected
     */
    UI_LOCKED_TABLE_CLASS.$resize = function () {
        this.getBase().style.paddingLeft = this.getBase().style.paddingRight = '';
        this.$cache$paddingLeft = this.$cache$paddingRight = 0;
        UI_TABLE_CLASS.$resize.call(this);
    };

    /**
     * 表格控件滚动条滚动时的显示区域刷新。
     * @protected
     */
    UI_LOCKED_TABLE_CLASS.$scroll = function () {
        UI_TABLE_CLASS.$scroll.call(this);
        this._uLockedMain.getBody().style.top = this.getBody().style.top;
    };

    /**
     * 设置控件的大小。
     * @protected
     *
     * @param {number} width 宽度，如果不需要设置则将参数设置为等价于逻辑非的值
     * @param {number} height 高度，如果不需要设置则省略此参数
     */
    UI_LOCKED_TABLE_CLASS.$setSize = function (width, height) {
        var i = 0,
            o = this.getBase().style,
            layout = getParent(this.getBody()),
            lockedHead = this._uLockedHead,
            style = getParent(getParent(lockedHead.getBody())).style;

        o.paddingLeft = this.$cache$paddingLeft + 'px';
        o.paddingRight = this.$cache$paddingRight + 'px';

        UI_TABLE_CLASS.$setSize.call(this, width, height);

        o = lockedHead._cJoint.getWidth() + this.$cache$paddingLeft + this.$cache$paddingRight;
        lockedHead.$setSize(0, this.$cache$paddingTop);
        style.height = this.$cache$paddingTop + 'px';
        this._uLockedMain.$setSize(o, this.getBodyHeight());
        style.width = this._uLockedMain.getBody().lastChild.style.width = o + 'px';

        width = layout.style.width;
        lockedHead._eFill.style.width = width;

        style = layout.previousSibling.style;
        style.width = toNumber(width) + this.$cache$paddingLeft + this.$cache$paddingRight + 'px';
        style.height = toNumber(layout.style.height) + this.$cache$paddingTop + 'px';

        // 以下使用 lockedHead 代替 lockedRow
        for (; lockedHead = this._aLockedRow[i++]; ) {
            o = lockedHead._eFill.style;
            o.width = width;

            style = MAX(lockedHead.getHeight(), lockedHead._cJoint.getHeight());
            o.height = style + 'px';
            lockedHead._cJoint.getCol(this._nLeft).$setSize(0, style);
        }
    };

    /**
     * 增加一列。
     * params 参数对象支持的属性如下：
     * width   {number}  列的宽度
     * base    {string}  列的基本样式
     * title   {string}  列的标题
     * @public
     *
     * @param {Object} params 列的初始化参数
     * @param {number} index 被添加的列的位置序号，如果不合法将添加在末尾
     * @return {ecui.ui.Table.Col} 列控件
     */
    UI_LOCKED_TABLE_CLASS.addCol = function (params, index) {
        if (index >= 0) {
            index < this._nLeft && this._nLeft++;
            index < this._nRight && this._nRight++;
        }
        return UI_TABLE_CLASS.addCol.call(this, params, index);
    };

    /**
     * 增加一行。
     * @public
     *
     * @param {Array} data 数据源(一维数组)
     * @param {number} index 被添加的行的位置序号，如果不合法将添加在最后
     * @return {ecui.ui.Table.Row} 行控件
     */
    UI_LOCKED_TABLE_CLASS.addRow = function (data, index) {
        this.paint = blank;

        var row = UI_TABLE_CLASS.addRow.call(this, data, index),
            index = indexOf(this.getRows(), row),
            lockedRow = this._aLockedRow[index],
            el = row.getBase(),
            o = createDom();

        o.innerHTML = '<table cellspacing="0"><tbody><tr class="' + el.className + '" style="' + el.style.cssText
            + '"><td style="padding:0px;border:0px"></td></tr></tbody></table>';

        o = UI_LOCKED_TABLE_CREATE_LOCKEDROW(this, el = o.lastChild.lastChild.lastChild, row);
        this._uLockedMain.getBody().lastChild.lastChild.insertBefore(el, lockedRow && lockedRow.getOuter());
        this._aLockedRow.splice(index, 0, o);
        UI_LOCKED_TABLE_ROW_SPLIT(o);

        delete this.paint;
        this.paint();

        return row;
    };

    /**
     * 移除一列并释放占用的空间。
     * @public
     *
     * @param {number} index 列的序号，从0开始计数
     */
    UI_LOCKED_TABLE_CLASS.removeCol = function (index) {
        UI_TABLE_CLASS.removeCol.call(this, index);
	if (index >= 0) {
            index < this._nLeft && this._nLeft--;
            index < this._nRight && this._nRight--;
	}
    };

    /**
     * 初始化需要执行关联控制的行控件鼠标事件的默认处理。
     * 行控件鼠标事件发生时，需要通知关联的行控件也同步产生默认的处理。
     * @protected
     */
    (function () {
        for (var i = 0, o; i < 13; ) {
            o = eventNames[i++];
            UI_LOCKED_TABLE_ROW_CLASS['$' + o] = new Function(
                '',
                '(ecui.ui.Control.prototype.$' + o + ').apply(this,arguments);ecui.ui.Control.prototype.$'
                    + o + '.apply(this._cJoint,arguments)'
            );
        }
    })();


/*
Decorator - 装饰器基类，使用inline-block附着在控件外围，在控件改变状态时，装饰器同步改变状态。控件最外层装饰器的引用
              通过访问Decorator的属性来得到，属性名为控件对象

属性
_sClass  - 装饰器样式
_eOuter  - 装饰器外框Element
_oInner  - 内层装饰器或者控件对象
*/


    /**
     * 计算控件的缓存。
     * 控件缓存部分核心属性的值，提高控件属性的访问速度，在子控件或者应用程序开发过程中，如果需要避开控件提供的方法(setSize、alterClass 等)直接操作 Element 对象，操作完成后必须调用 clearCache 方法清除控件的属性缓存，否则将引发错误。
     * @protected
     *
     * @param {CssStyle} style 基本 Element 对象的 Css 样式对象
     * @param {boolean} cacheSize 是否需要缓存控件大小，如果控件是另一个控件的部件时，不缓存大小能加快渲染速度，默认缓存
     */
    EXT_DECORATOR_CLASS.$cache = function (style, cacheSize) {
        this._oInner.$cache(style, cacheSize, true);
        UI_CONTROL_CLASS.$cache.call(this, getStyle(this._eOuter), false);
        this._oInner.$cache$position = 'relative';
        this.$cache$position = style.position == 'absolute' ? 'absolute' : 'relative';
        this.$cache$layout = ';top:' + style.top + ';left:' + style.left + ';display:'
            + style.display + (ieVersion ? ';zoom:' + style.zoom : '');
    };

    /**
     * 销毁装饰器的默认处理。
     * @protected
     */
    EXT_DECORATOR_CLASS.$dispose = function () {
        this._eOuter = null;
    };

    /**
     * 控件渲染完成后初始化的默认处理。
     * @protected
     */
    EXT_DECORATOR_CLASS.$init = function () {
        this._eOuter.style.cssText = 'position:' + this.$cache$position + this.$cache$layout;
        this._oInner.getOuter(true).style.cssText += ';position:relative;top:auto;left:auto;display:block';
        this._oInner.$init(true);
    };

    /**
     * 控件大小发生变化的默认处理。
     * @protected
     */
    EXT_DECORATOR_CLASS.$resize = function () {
        this._eOuter.style.width = '';
        ieVersion || (this._eOuter.style.height = '');
        this._oInner.$resize(true);
    };

    /**
     * 设置装饰器区域的大小
     * @protected
     *
     * @param {number} width 装饰器区域的宽度
     * @param {number} height 装饰器区域的高度
     */
    EXT_DECORATOR_CLASS.$setSize = function (width, height) {
        var style = this._eOuter.style,
            invalidWidth = UI_CONTROL_CLASS.getInvalidWidth.call(this),
            invalidHeight = UI_CONTROL_CLASS.getInvalidHeight.call(this),
            fixedSize = isFixedSize();

        this._oInner.$setSize(width && width - invalidWidth, height && height - invalidHeight, true);

        style.width = this._oInner.getWidth(true) + (fixedSize ? 0 : invalidWidth) + 'px';
        style.height = this._oInner.getHeight(true) + (fixedSize ? 0 : invalidHeight) + 'px';
    };

    /**
     * 为装饰器增加/删除一个扩展样式。
     * @protected
     *
     * @param {string} className 扩展样式的尾缀
     * @param {boolean} isRemoved 为 true 时删除样式，否则新增样式
     */
    EXT_DECORATOR_CLASS.alterClass = function (className, remove) {
        (remove ? removeClass : addClass)(this._eOuter, this._sClass + '-' + className);
        this._oInner.alterClass(className, remove, true);
    };

    /**
     * 计算控件的缓存。
     * 控件缓存部分核心属性的值，提高控件属性的访问速度，在子控件或者应用程序开发过程中，如果需要避开控件提供的方法(setSize、alterClass 等)直接操作 Element 对象，操作完成后必须调用 clearCache 方法清除控件的属性缓存，否则将引发错误。
     * @public
     *
     * @param {boolean} cacheSize 是否需要缓存控件大小，如果控件是另一个控件的部件时，不缓存大小能加快渲染速度，默认缓存
     * @param {boolean} force 是否需要强制刷新缓存，相当于执行了 clearCache 方法，默认不强制刷新
     */
    EXT_DECORATOR_CLASS.cache = function (cacheSize, force) {
        this._oInner.cache(cacheSize, force, true);
    };

    /**
     * 获取装饰器的基本样式名称
     * @public
     *
     * @return {string} 装饰器的基本样式名称
     */
    EXT_DECORATOR_CLASS.getClass = function () {
        return this._sClass;
    };

    /**
     * 获取装饰器区域的高度
     * @public
     *
     * @return {number} 装饰器区域的高度
     */
    EXT_DECORATOR_CLASS.getHeight = function () {
        return this._oInner.getHeight(true) + UI_CONTROL_CLASS.getInvalidHeight.call(this);
    };

    /**
     * 获取内层装饰器或控件
     * @public
     *
     * @return {Decorator|Control} 内层装饰器或控件
     */
    EXT_DECORATOR_CLASS.getInner = function () {
        return this._oInner;
    };

    /**
     * 获取装饰器内外区域的高度差
     * @public
     *
     * @return {number} 装饰器内外区域的高度差
     */
    EXT_DECORATOR_CLASS.getInvalidHeight = function () {
        return this._oInner.getInvalidHeight(true) + UI_CONTROL_CLASS.getInvalidHeight.call(this);
    };

    /**
     * 获取装饰器内外区域的宽度差
     * @public
     *
     * @return {number} 装饰器内外区域的宽度差
     */
    EXT_DECORATOR_CLASS.getInvalidWidth = function () {
        return this._oInner.getInvalidWidth(true) + UI_CONTROL_CLASS.getInvalidWidth.call(this);
    };

    /**
     * 获取装饰器的外框Element
     * @public
     *
     * @return {Element} 外框Element
     */
    EXT_DECORATOR_CLASS.getOuter = function () {
        return this._eOuter;
    };

    /**
     * 获取装饰器区域的宽度
     * @public
     *
     * @return {number} 装饰器区域的宽度
     */
    EXT_DECORATOR_CLASS.getWidth = function () {
        return this._oInner.getWidth(true) + UI_CONTROL_CLASS.getInvalidWidth.call(this);
    };

    /**
     * 释放对象时需要先释放装饰器
     * @protected
     */
    EXT_DECORATOR_PROXY.$dispose = function () {
        this.clear();
        this.$dispose();
    };

    /**
     * 清除所有的装饰器效果，同时清除所有的代理函数
     * @public
     */
    EXT_DECORATOR_PROXY.clear = function () {
        // 清除所有的代理函数
        for (o in EXT_DECORATOR_PROXY) {
            delete this[o];
        }

        var id = this.getUID(),
            o = EXT_DECORATOR[id],
            el = o._eOuter;

        insertBefore(this.getOuter(), el);
        removeDom(el);
        for (; o != this; o = o._oInner) {
            o.$dispose();
        }
        delete EXT_DECORATOR[id];
    };

    (function () {

        // 这里批量生成函数代理
        for (var i = 0, list = [
                ['$cache', 2], ['$init', 0], ['$resize', 0], ['$setSize', 2],
                ['alterClass', 2], ['cache', 2], ['getHeight', 0], ['getInvalidHeight', 0],
                ['getInvalidWidth', 0], ['getOuter', 0], ['getWidth', 0]
            ], o, name;
            o = list[i++];
        ) {
            // 如果是代理进入的，会多出来一个参数作为标志位
            name = o[0];
            EXT_DECORATOR_PROXY[name] = new Function(
                'var o=this,d=ecui.ext.Decorator[o.getUID()],r=arguments;return r[' + o[1]
                    + ']?o.constructor.prototype.' + name + '.apply(o,r):d.' + name + '.apply(d,r)'
            );
        }
    })();

    $register('decorate', function (control, param) {
        param.replace(/([A-Za-z0-9\-]+) *\( *([^)]+)\)/g, function ($0, $1, $2) {
            // 获取装饰器函数
            $1 = ext[toCamelCase($1.charAt(0).toUpperCase() + $1.slice(1))];

            // 获取需要调用的装饰器列表
            $2 = $2.split(/\s+/);
            // 以下使用 el 计数
            for (var i = 0; $0 = $2[i++]; ) {
                new $1(control, $0);
            }
        });
    });

/*
LRDecorator - 左右扩展装饰器，将区域分为"左-控件-右"三部分，使用paddingLeft与paddingRight作为左右区域的宽度
*/

    /**
     * 设置装饰器区域的大小
     * @public
     *
     * @param {number} width 装饰器区域的宽度
     * @param {number} height 装饰器区域的高度
     */
    inherits(EXT_LR_DECORATOR, EXT_DECORATOR).$setSize = function (width, height) {
        EXT_DECORATOR_CLASS.$setSize.call(this, width, height);

        var inner = this.getInner(),
            tmpEl = this.getOuter().lastChild,
            rightStyle = tmpEl.style,
            leftStyle = tmpEl.previousSibling.style,
            padding = this.$cache$paddingLeft;

        leftStyle.top = rightStyle.top = this.$cache$paddingTop + 'px';
        rightStyle.left = padding + inner.getWidth(true) + 'px';
        leftStyle.width = padding + 'px';
        rightStyle.width = this.$cache$paddingRight + 'px';
        leftStyle.height = rightStyle.height = inner.getHeight(true) + 'px';
    };

/*
TBDecorator - 上下扩展装饰器，将区域分为"上-控件-下"三部分，使用paddingTop与paddingBottom作为上下区域的高度
*/

    /**
     * 设置装饰器区域的大小
     * @public
     *
     * @param {number} width 装饰器区域的宽度
     * @param {number} height 装饰器区域的高度
     */
    inherits(EXT_TB_DECORATOR, EXT_DECORATOR).$setSize = function (width, height) {
        EXT_DECORATOR_CLASS.$setSize.call(this, width, height);

        var inner = this.getInner(),
            tmpEl = this.getOuter().lastChild,
            bottomStyle = tmpEl.style,
            topStyle = tmpEl.previousSibling.style,
            padding = this.$cache$paddingTop;

        bottomStyle.top = padding + inner.getHeight(true) + 'px';
        topStyle.left = bottomStyle.left = this.$cache$paddingLeft + 'px';
        topStyle.width = bottomStyle.width = inner.getWidth(true) + 'px';
        topStyle.height = padding + 'px';
        bottomStyle.height = this.$cache$paddingBottom + 'px';
    };

/*
MagicDecorator - 九宫格扩展装饰器，将区域分为"左上-上-右上-左-控件-右-左下-下-右下"九部分，使用padding定义宽度与高度
*/

    /**
     * 设置装饰器区域的大小
     * @public
     *
     * @param {number} width 装饰器区域的宽度
     * @param {number} height 装饰器区域的高度
     */
    inherits(EXT_MAGIC_DECORATOR, EXT_DECORATOR).$setSize = function (width, height) {
        EXT_DECORATOR_CLASS.$setSize.call(this, width, height);

        var inner = this.getInner(),
            tmpEl = this.getOuter().lastChild,
            i = 9,
            paddingTop = this.$cache$paddingTop,
            paddingLeft = this.$cache$paddingLeft,
            widthList = inner.getWidth(true),
            heightList = inner.getHeight(true),
            topList = ['0px', paddingTop + 'px', paddingTop + heightList + 'px'],
            leftList = ['0px', paddingLeft + 'px', paddingLeft + widthList + 'px'];

        widthList = [paddingLeft + 'px', widthList + 'px', this.$cache$paddingRight + 'px'];
        heightList = [paddingTop + 'px', heightList + 'px', this.$cache$paddingBottom + 'px'];

        for (; i--; ) {
            if (i != 4) {
                // 以下使用 paddingLeft 表示 row，使用 paddingTop 表示 col，使用 inner 表示 style
                inner = tmpEl.style;
                inner.top = topList[FLOOR(i / 3)];
                inner.left = leftList[i % 3];
                inner.width = widthList[i % 3];
                inner.height = heightList[FLOOR(i / 3)];
                tmpEl = tmpEl.previousSibling;
            }
        }
    };



/*
Decorator - 装饰器基类，使用inline-block附着在控件外围，在控件改变状态时，装饰器同步改变状态。控件最外层装饰器的引用
              通过访问Decorator的属性来得到，属性名为控件对象

属性
_sClass  - 装饰器样式
_eOuter  - 装饰器外框Element
_oInner  - 内层装饰器或者控件对象
*/





})();
