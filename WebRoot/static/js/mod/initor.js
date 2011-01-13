(function() {


var INITOR_NAME_RE = /i_(\w+)([-a-zA-Z0-9]+)*/g,
    INITOR_PARAM_RE = /([a-zA-Z0-9]+)/g,

    /**
     * 启动器对象
     * @param   {String}    nameSpace   全局命名空间, 默认为Rigel
     * @param   {Object}    options  选项 
     *      {String}    identifier  className中的标识, 默认为j
     */
    INITOR = this.Initor = function(nameSpace, options) {
        var options = options || {};
        this._sNameSpace = nameSpace || "Rigel";
        this._sIdentifier = options.identifier || "j";
    },

    INITOR_CLASS = INITOR.prototype;

    /**
     * 启动
     * @public
     * @param {HTMLElement} context dom元素
     *
     * @demo
     *  new Initor().go(document.body);
     *  将初始化文档中所有class为j的元素, 查找并运行class中以i_开头类名相对应的init_启动函数,
     *  这些init_函数放在页面级别命名空间或者全局命名空间下,
     *  其中, 页面级别的命名空间需要在body标签的data-pageNS属性中定义,
     *  查找的顺序为页面级 -> 全局级
     *  如: <a class="j i_confirm-paramA-paramB" href="#">xx</a>, 假设页面命名空间为myPage
     *  将查找myPage.init_confirm, 如果没有就查全局变量中的Rigel.init_confirm, 
     *  找到后立即运行, 函数的this指针指向该元素, 函数的参数为-号后面的字符串, 这里为"paramA"和"paramB"
     */
    INITOR_CLASS.go = function(context) {

        var context = context || document,
            els = context.getElementsByTagName("*"),
            nameSpace = this._sNameSpace,
            match,
            funcName,
            paramArr,
            fn,
            fns = {};

        for (var i = 0, o, p; o = els[i++];) {
            if ("j".indexOf(o.className.split(" "))) {
                while ((p = INITOR_NAME_RE.exec(o.className)) != null) {
                    funcName = p[1];
                    paramArr = p[2] && p[2].match(INITOR_PARAM_RE);
                    fn = fns[funcName];

                    if (!fn) {
                        fn = window[nameSpace]["init_" + funcName]
                            || window[document.body.getAttribute("data-pageNS")]["init_" + funcName];
                        fns[funcName] = fn;
                    }
                    fn && (paramArr ? fn.apply(o, paramArr) : fn.call(o));
                }
            }
        }

    };

})();
