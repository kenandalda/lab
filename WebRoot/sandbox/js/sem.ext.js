/**
 * @file sem.ext.js
 * @description 
 *      通过ecui的扩展注册机制给dom元素绑定SEM销售模型的业务逻辑
 */
var SEM = {}; 

/**
 * 注册sem扩展
 */
ecui.$register('sem', function (el, params) {
    params.replace(/([A-Za-z0-9\-]+)*(?:\(*([^)]+)\))?/g, function ($0, $1, $2) {
        // 获取初始化函数
        if ($1) {
            $1 = SEM[baidu.string.toCamelCase($1)];
            $1 && $1.apply(el, $2 ? $2.split(/\s+/) : []);
        }
    });
});

/**
 * 表格编辑
 */
SEM.tableEdit = function () {
    // console.log(formId);
    baidu.event.on(this, 'click', function (event) {
        var target = baidu.event.getTarget(event);
        // 更新按钮
        if (target.className == 'edit-btn') {
            var formId = target.getAttribute("data-form");
            var form = baidu.dom.g(formId);
            var dataArea = baidu.dom.query(".data-area", form)[0];
            var tr = baidu.dom.getAncestorByTag(target, "tr");
            // console.log(tr.cells[1].innerHTML);
            var inputs = baidu.dom.query(":input, :checkbox, :radio", tr);
            var valid = true;
            var el;

            dataArea.innerHTML = "";

            baidu.array.each(inputs, function (n, i) {
               if (n.getAttribute("data-submit") == "true" && !n.disabled) {
                    // TODO 验证-test
                    if (Validate.validElement(n)) {
                        // 将元素拷贝到提交区域  
                        el = ecui.dom.setInput("", n.name, "text") 
                        if (n.type == "radio" || n.type == "checkbox") {
                            if (!n.checked) {
                                el = null;
                            }
                        }
                        if (el) {
                            dataArea.appendChild(el);
                            el.value = n.value;
                        }
                    }
                    else {
                        valid = false;
                        return false;
                    }
               }  
            });
            if (valid) {
                form.submit();
            }
        }
    });
};

/**
 * 多极依赖
 */
SEM.multiDep = function () {
     var self = this;
     baidu.event.on(this, 'click', function (event) {
        var target = baidu.event.getTarget(event),
            oldEl = self._eOldEl;
        if (target.tagName == 'INPUT' && target.type == "radio") {
            // target表示依赖的元素
            target = baidu.dom.g(target.getAttribute("data-dep"));
            if (target && oldEl != target) {
                baidu.dom.show(target);
                oldEl && baidu.dom.hide(oldEl);
                self._eOldEl = target;
            }
        }
    });
};

/**
 * 悬浮提示
 */
/* 悬浮提示控件 采用九宫格装饰器 */
ecui.ui.ToolTip = function (el, params) {
    ecui.ui.Control.call(this, el, params);
};
ecui.util.inherits(ecui.ui.ToolTip, ecui.ui.Control);
ecui.ui.ToolTip.prototype.oncreate = function (params) {
    if (!params.decorate) {
        new ecui.ext.MagicDecorator(this, 'tooltipdtr');
    } 
};
ecui.ui.ToolTip.prototype.$dispose = function () {
    this._eLink = null;
    ecui.ui.Control.prototype.$dispose.call(this);
};

/* 触发显示的DOM元素行为初始化 */
SEM.toolTip = function (params) {
    var tipControl = ecui.get("tooltip");
    if (!tipControl) {
        var el = ecui.dom.create("ec-tool-tip", "position:absolute;top:0;left:0;width:200px;height:100px;background-color:#FFF;border:1px solid red");
        document.body.appendChild(el);
        ecui.create("ToolTip", {
            id: "tooltip", 
            element: el
        });
        tipControl = ecui.get("tooltip");
        tipControl.hide();
    }

    baidu.event.on(this, "mouseover", function (event) {
        tipControl._eLink = this;
        tipControl.show();
        setCtrlPos(this, tipControl);
        setCtrlContent(this, tipControl);
    });

    baidu.event.on(this, "mouseout", function (event) {
        tipControl._eLink = null;
        setTimeout(function () {
            if (!tipControl._bOvered && !tipControl._eLink) {
                tipControl.$hide();
            }
        }, 100);
    });

    tipControl.onmouseover = function (event) {
        this._bOvered = true;
    };

    tipControl.onmouseout = function (event) {
        this._bOvered = false;
        this.$hide();
    };

    function setCtrlPos (link, control) {
        var linkPos = baidu.dom.getPosition(link);
        control.setPosition(linkPos.left + link.offsetWidth, linkPos.top);
    }

    function setCtrlContent (link, control) {
        var contentEl = baidu.dom.g(link.getAttribute('data-tooltip'));
        if (contentEl) {
            tipControl.getBody().innerHTML = contentEl.innerHTML;
        }
    }
};

