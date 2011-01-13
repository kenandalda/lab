/**
 * 屏蔽二次点击装饰器
 */
(function() {

var core = ecui,
    lib = baidu,
    ext = core.ext,
    util = core.util,
    inherits = util.inherits,
    event = lib.event,

    cancel = core.cancel,
    on = event.on,
    preventDefault = event.preventDefault,

    EXT_DECORATOR = ext.Decorator,
    EXT_DBC_DELAY = 5000,

    EXT_DBC_DECOTRATOR = ecui.ext.FooDecorator 
        = function(control, param) {

        var base = control.getBase();
        control._bClickable = true;
        control.click = EXT_DBC_CLICK;
        control.$click = EXT_DBC_$CLICK;

        // TODO 不改变样式

        // 链接
        if (base.tagName == "A") {
            on(base, "click", EXT_DBC_BASEEL_CLICK);
            control.setClickable = EXT_DBC_ANCHOR_SETCLICKABLE;
            control._bFlgSpec = true;
        }
        // 提交按钮
        else if (base.tagName == "INPUT" && base.type == "submit") {
            on(base, "click", EXT_DBC_BASEEL_CLICK);
            control._sDefVal = base.value + "";
            control.setClickable = EXT_DBC_SUBMIT_SETCLICKABLE;
            control._bFlgSpec = true;
        }
        // 默认
        else {
            control.setClickable = EXT_DBC_CONTROL_SETCLICKABLE;
        }
    };
    
    /**
     * 改写点击事件初始化
     */
    function EXT_DBC_CLICK(e) {
        var o = this;

        if (o.isEnabled() && o._bClickable && o.onclick && o.onclick(e) === false
                ||o._bClickable && o.$click(e)===false) {
            return false;
        }

        // 如果是链接/提交按钮, 则不在此时调用setClickable,
        // 而在其原生的点击回调中设置不可点击
        !o._bFlgSpec && o.setClickable(false);
    }
    
    /**
     * 默认点击
     */
    function EXT_DBC_$CLICK(e) {
       //console.log("$click"); 
    }
    
    /** 
     * 链接/提交按钮点击
     */
    function EXT_DBC_BASEEL_CLICK(e) {
        var o = this.getControl(),
            flag = true && o._bClickable;

        o.setClickable(false);
        flag || preventDefault(e);
        setTimeout(function() {
            o.setClickable(true);        
        }, EXT_DBC_DELAY);
    }

    /**
     * 设置控件是否可点击
     * @public
     *
     * @param {Boolean} flag 是否可点击
     * @demo ecui.get("ctr").setClickable(true)
     */
    function EXT_DBC_ANCHOR_SETCLICKABLE(flag) {
        this._bClickable = flag;    
    }

    function EXT_DBC_SUBMIT_SETCLICKABLE(flag) {
        var base = this.getBase();
        base.value = flag ? this._sDefVal : "处理中...";
       // base.disabled = !flag; 此操作导致ie下表单不能提交, 囧
        this._bClickable = flag;
    }

    function EXT_DBC_CONTROL_SETCLICKABLE(flag) {
        this._bClickable = flag;
    }

})();
