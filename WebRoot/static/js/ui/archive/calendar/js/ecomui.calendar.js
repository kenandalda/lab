/**
 * version 0.3
 */

var ecomui = ecomui || {};

(function() {
 /**
  * TODO 日历的$setSize修正
  * TODO 日历输入框清空
  * TODO 双日历输入框初始有值时置灰
  */

        // 适配器 
// {{{
    var lib = baidu, 
        core = ecui,
        dom = core.dom, 
        libDom = lib.dom,
        ui = core.ui,
        util = core.util,

        ieVersion = core.browser.ie,
        $fastCreate = core.$fastCreate,
        createDom = dom.create,
        blank = util.blank || function(){},
        inherits = util.inherits,
        copy = util.copy,
        g = lib.dom.g,
        insertAfter = lib.dom.insertAfter,
        toCamelCase = core.string.toCamelCase,
        get = core.get,
        query = core.query,
        trim = lib.string.trim,
        setStyles = libDom.setStyles,
        children = dom.children,
        insertHTML = dom.insertHTML,
        setText = dom.setText,
        cloneObject = lib.object.clone,
        getStyle = dom.getStyle,

        libDate = lib.date,
        formatDate = libDate.format,
        parseDate = libDate.parse,

        reTmp = "((\\d{4})-(\\d{1,2})-(\\d{1,2})?)",
        reSingle = new RegExp("\^" + reTmp + "\$"),
        reRange = new RegExp("\^" + reTmp + "\\s+至\\s+" + reTmp + "\$"),
        reLoose = new RegExp("\^" + reTmp + "\\s+(之(?:前|后))\$"),

        MIN = Math.min,
        MAX = Math.max,
        getView = util.getView,

        UI_CONTROL = ui.Control,
        UI_CONTROL_CLASS = UI_CONTROL.prototype,
        UI_CALENDAR = ui.Calendar,
        UI_SELECT = ui.Select,
        UI_SELECT_CLASS = UI_SELECT.prototype,
        UI_EDIT = ui.Edit,
        UI_EDIT_CLASS = UI_EDIT.prototype,
        ECOM_CALENDAR_CLASS, // 单日历
        ECOM_MULTICAL_CLASS, // 多日历
        ECOM_CALEDIT_CLASS, // 输入框
// }}}
        // 默认日历属性
        ECOM_CALENDAR_DEFAULTS = (function() {
            var now = new Date();
            return {
                year: now.getFullYear(),
                month: now.getMonth(),
                range: "5y-5y",
                selectedDate: null
            };
        })(),

        ECOM_CALENDAR_DATEFORMAT = "yyyy-MM-dd",
        ECOM_CALENDAR_PROPNAMES = ["range", "month", "year", "selectedDate"],

    /**
     * 基础日历
     *  @param    {HTMLElement}    el        
     *  @param    {Object}    params    用于初始化控件的参数集合
     *            {String}    date    初始化日期, 格式yy-mm-dd    
     *            {String}    range    日历可选择的范围, 见setRange说明
     */
    ECOM_CALENDAR = ecomui.EcomCalendar 
        = ui.EcomCalendar = function(el, params) {

        UI_CONTROL.call(this, el, params);

        var body = this.getBody(),
            tds;

        body.innerHTML = '<div class="date-content-sel"><table><tr>\
                <td><div class="prev month-nav"></div></td>\
                <td><select class="ec-select year-select"></select></td><td><span class="text-label">年</span></td>\
                <td><select class="ec-select month-select">$monthOptions</select></td><td><span class="text-label">月</span></td>\
                <td><div class="next month-nav"></div></td>\
                </tr></table></div>\
            <div class="ec-calendar ec-calendar"></div>';
            
        tds = body.firstChild.getElementsByTagName("td");

        this.setClass("time-single");

        // 设置日历属性
        this._oInitProps = this.setProps(params);
        
        this._uCalGrid = $fastCreate(ECOM_CALENDAR_GRID, body.lastChild, this);
        this._uYearSelect = tds[1].firstChild;
        this._uMonthSelect = tds[3].firstChild;
        this._uPrev = $fastCreate(ECOM_CALENDAR_NAVBTN, tds[0].firstChild, this, {category: "prev"});
        this._uNext = $fastCreate(ECOM_CALENDAR_NAVBTN, tds[5].firstChild, this, {category: "next"});

        this._uYearSelect._cWrapper = this._uMonthSelect._cWrapper = this;

        this._uYearSelect.onchange = this._uMonthSelect.onchange = ECOM_CALENDAR_SELECTCHANGE;
        this._uCalGrid.ondateclick = ECOM_CALENDAR_DATECLICK;

    },

    ECOM_CALENDAR_CLASS = inherits(ECOM_CALENDAR, UI_CONTROL),
    
    // 日历网格
    ECOM_CALENDAR_GRID = function(el, params) {
        UI_CALENDAR.call(this, el, params);
    },
    ECOM_CALENDAR_GRID_CLASS = inherits(ECOM_CALENDAR_GRID, UI_CALENDAR),

    // 导航按钮
    ECOM_CALENDAR_NAVBTN = function(el, params) {
        UI_CONTROL.call(this, el, params);
    },
    ECOM_CALENDAR_NAVBTN_CLASS = inherits(ECOM_CALENDAR_NAVBTN, UI_CONTROL),
    
    // 下拉框
    ECOM_CALENDAR_SELECT = function(el, params) {
        var category = this._sCategory = params.category,
            html = [];

        UI_SELECT.call(this, el, params);

        if (category == "month") {
            for (var i = 1; i < 13; i++) {    
                this.append(i + "");
            }
        }

    },
    ECOM_CALENDAR_SELECT_CLASS = inherits(ECOM_CALENDAR_SELECT, UI_SELECT),

    SINGLE_CALENDAR_CLASS = (function() {}).prototype; // TODO 重构完成后去掉
    
    ECOM_CALENDAR_CLASS.$cache = function(style, cacheSize) {
        UI_CONTROL_CLASS.$cache.call(this, style, cacheSize);
        this._uCalGrid.cache();
    };

    ECOM_CALENDAR_CLASS.$setSize = blank;
    /*
    ECOM_CALENDAR_CLASS.$setSize = function(width, height) {
        UI_CONTROL_CLASS.$setSize.call(this, width, height);
        this._uCalGrid.setSize(width, height - this.getOuter().firstChild.offsetHeight);
        //this._uCalGrid.paint();
    };
    */

    ECOM_CALENDAR_CLASS.$init = function() {
        UI_CONTROL_CLASS.$init.call(this);

        this._uCalGrid.init();

        var yearSelect = this._uYearSelect,
            monthSelect = this._uMonthSelect,
            range = ECOM_CALENDAR_PARSERANGE(this.$cal$range);

        ECOM_CALENDAR_SETYEARSELECT(yearSelect, range);

        // 设置月下拉框的子项目
        for (var i = 1; i < 13; i++) {    
            try {
                monthSelect.add(new Option(i, i), null);
            }
            catch (e) {
                monthSelect.add(new Option(i, i));
            }
        }

        this.change();
    };

    function ECOM_CALENDAR_SETYEARSELECT(select, range) {
        select.innerHTML = "";
        for (var y = range.from.getFullYear(), 
                    maxyear = range.to.getFullYear(); 
                    y <= maxyear; 
                    y++) {
            try {
                select.add(new Option(y, y), null);
            } 
            catch (e) {
                select.add(new Option(y, y));
            }
        }
    }

    /**
     * 设置日历状态
     * 只设置参数, 显示和交互由change来做
     *
     * @param {Object} options
     * @return {Object} 新设置的选项对象
     */
    ECOM_CALENDAR_CLASS.setProps = function(options) {
       var props = ECOM_CALENDAR_PROPNAMES,
           ret = {},
           item,
           i = 0,
           o; 

       for (; o = props[i++];) {
            item = options[o] !== undefined ? options[o] :
                this["$cal$" + o] !== undefined ? this["$cal$" + o] : ECOM_CALENDAR_DEFAULTS[o];
            this["$cal$" + o] = item;
            ret[o] = item;
       }

       return ret;
    };
    

    /**
     * 重置日历, 将日历的数据清空   业务需求  fixed by tut
     */
    // {{{
    SINGLE_CALENDAR_CLASS.reset = function() {
        var calendar =this.$getSection("Calendar")
        thisYear =calendar.getYear();
        thisMonth = calendar.getMonth();
        dayCount = new Date(thisYear, thisMonth, 0).getDate();

        //清空
        this.foreachDate(function(n, i) {
            var thisDay = new Date(thisYear, thisMonth - 1, n._nDay);
            if (n._nDay > 0 && n._nDay < dayCount+1) {   
                n.setEnabled(true);
            }
        });
        this._oSelectedDate = null;
        //this._selectedDateGrid = null;

        //调用onreset事件回调函数, 如果函数返回false, 则不清空选择日期的样式
        if (!this.onreset || this.onreset(this._oSettings) != false) {
            if(this._selectedDateGrid){
                this._selectedDateGrid.alterClass("selected", true);
                this._selectedDateGrid = null;
            }
        }
    };
    // }}}
    
    /**
     * 遍历当前日历显示的所有日期网格
     * 并绑定回调函数
     *
     * @param {Function} callback
     */
    ECOM_CALENDAR_CLASS.foreachDate = function(callback) {
        var dateGrid = this._uCalGrid._uDate,
            i = 0, 
            o;
        for (; o = dateGrid.getItem(i++); ) {
            if (o) {
                callback.call(o, o, i);
            }
        }
    };

    /**
     * 设置可选择日期的范围
     * 解析用户输入的range规则
     * TODO 用formatDate
     * @private
     *
     * range规则示例:
     *    1. 静态日期: 
     *        20090102-20100206
     *        20090102- 
     *        -20090102
     *    2. now表示今天:
     *        now-20100606
     *        -now
     *    3. 相对日期, m表示月, y表示年, 两者前要加数字
     *        now-1y 表示今天到今天之后的一年
     *        2m-now 表示今天之前的两个月到今天
     *        20080101-1y
     *        1m-1y 表示今天前一个月到今天后一年
     *
     *    @param {String} range
     */ 
    // {{{
    function ECOM_CALENDAR_PARSERANGE(range) {
        var reTmp = "(\\d{4}\\d{2}\\d{2}|now|\\d+(?:y|m))?",
            re = new RegExp(reTmp + "-" + reTmp),
        
            rangeArr = range.match(re),
            fromDate = rangeArr[1],
            toDate = rangeArr[2],
            now = new Date();

            // 时间设为当天0点
            now = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            function convertToDate(str) {
                var re = /((\d{4})(\d{2})(\d{2}))|(now)/,
                    ret = str, 
                    match = str && str.match(re); 

                if (match) {
                    match[1] && (ret = new Date(match[2], match[3] - 1, match[4]));
                    match[5] && (ret = now);
                } 

                return ret;
            }

            function convertRelativeDate(baseDate, span, direction) {
                //direction 为 true 表示向前移动日期
                var re = /(\d+)(y|m)/,
                    match, num, m, y, tmpDate, spanStr;

                    spanStr = span || "5y";
                    match = spanStr.match(re);
                    if (match) {
                        num = parseInt(match[1]);
                        num = direction ? -num : num;
                        m = baseDate.getMonth();
                        y = baseDate.getFullYear();
                        tmpDate = new Date(baseDate);
                        
                        match[2] == "y" ? 
                            //tmpDate.setYear(y + num) :    
                            tmpDate = (num > 0) ? new Date(y + num, 11, 31) : new Date(y + num, 0, 1) : 
                            //TODO 相对月份取绝对日期
                            //tmpDate.setMonth(m + num);
                            tmpDate = (num > 0) ? new Date(y, m + num + 1, 0) : new Date(y, m + num, 1);  
                    } 
                return tmpDate;
            }
            
            fromDate = convertToDate(fromDate);
            toDate = convertToDate(toDate);
            
            if (!(fromDate instanceof Date) && toDate instanceof Date) { 
                fromDate = convertRelativeDate(toDate, fromDate, true);
            }
            if (!(toDate instanceof Date) && fromDate instanceof Date) {
                toDate = convertRelativeDate(fromDate, toDate);
            } 
            if (!(fromDate instanceof Date) && !(toDate instanceof Date)) {
                fromDate = convertRelativeDate(now, fromDate, true);
                toDate = convertRelativeDate(now, toDate);
            } 

        return {from:fromDate, to:toDate};    
    };
    // }}}
        
    /**
    * 显示日期范围
    * 在change里调用
    */
    ECOM_CALENDAR_CLASS.showRange = function() {
        var range = ECOM_CALENDAR_PARSERANGE(this.$cal$range), 
            fromDate = range.from,
            toDate = range.to,
            calendar = this._uCalGrid,
            year = this.$cal$year,
            month = this.$cal$month,
            dayCount = new Date(year, month, 0).getDate(),  //本月的天数，之前这里有点问题  fixed by tut
            selectedDate = this.$cal$selectedDate;
            
            /*
            // TODO 如果范围之外有被选择的网格, 则先清空整个日历
            if (selectedDate && (selectedDate < fromDate || selectedDate > toDate)) {
                this._selectedDateGrid.alterClass("selected", true)
            }
            */
            
        this.foreachDate(function(n, i) {
            var thisDay = new Date(year, month, n._nDay);
            if (thisDay < fromDate || thisDay > toDate) {
                //日期范围之外的网格设置禁用
                n.setEnabled(false);
            } 
            else {
                //日期范围之内的当月天设置enabled
                if (n._nDay > 0 && n._nDay < dayCount + 1) {   //最后一个天数之前有问题 fixed by tut
                     n.setEnabled(true);
                }
            }
        });
    };

    /**
     * 选择日期
     * 只改变数据, 使显示生效需要调用change
     */
    ECOM_CALENDAR_CLASS.selectDate = function(date) {
        if (date === null) {
            this.setProps({
                selectedDate: date        
            });
        }
        else if (date.getFullYear) {
            this.setProps({
                year: date.getFullYear(),
                month: date.getMonth(),
                selectedDate: date
            });
        }
    };

    /**
     * 处理点击日历选择日期
     * 将ecom日历的子日历的ondateclick挂在了其父控件的prototype上, this指向子日历控件
     */
    function ECOM_CALENDAR_DATECLICK(date) {
        var wrapper = this.getParent();
        wrapper.ondateclick.call(wrapper, date);
    }
    ECOM_CALENDAR_CLASS.ondateclick = function(date) {
        this.selectDate(date); 
        this.change();
    };

    /**
     * 处理前后箭头点击
     */
    ECOM_CALENDAR_NAVBTN_CLASS.$click = function() {
        var wrapper = this.getParent(),
            calGrid = wrapper._uCalGrid,
            prev = wrapper._uPrev,
            next = wrapper._uNext;
                    
        this == prev ? calGrid.move(-1) : calGrid.move(1);

        wrapper.$cal$year = calGrid._nYear;
        wrapper.$cal$month = calGrid._nMonth;

        wrapper.change();
    };

    /**
     * 下拉框改变
     */
    function ECOM_CALENDAR_SELECTCHANGE(e) {
        var wrapper = this._cWrapper;

        /year/.test(this.className) && (wrapper.$cal$year = parseInt(this.value, 10));
        /month/.test(this.className) && (wrapper.$cal$month = parseInt(this.value, 10) - 1);
        
        wrapper.change();
    }
    
    /**
     * 日历默认改变
     *
     * 开发时, 在每个可以对日历状态进行改变的操作(如选择年份)中仅改变日历
     * 的参数在操作末尾调用该对象的change(), 来处理展现和交互
     */
    ECOM_CALENDAR_CLASS.$change = function() {
         var yearSelect = this._uYearSelect,
             monthSelect = this._uMonthSelect,
             prev = this._uPrev,
             next = this._uNext,
             calGrid = this._uCalGrid,
             
             year = this.$cal$year,
             month = this.$cal$month + 1,
             range = ECOM_CALENDAR_PARSERANGE(this.$cal$range);

         yearSelect.onchange = monthSelect.onchange = blank;

         ECOM_CALENDAR_SETYEARSELECT(yearSelect, range);

         yearSelect.value = year;
         monthSelect.value = month;

         yearSelect.onchange = monthSelect.onchange = ECOM_CALENDAR_SELECTCHANGE;

         calGrid.setDate(year, month);

         // 显示range
         this.showRange();

         // 显示选择日期
         // 注意: $cal$selectedDate为null的时候也进行showselectdate操作
         this.$cal$selectedDate !== undefined && ECOM_CALENDAR_SHOWSELECTEDDATE(this);

    };

    function ECOM_CALENDAR_SHOWSELECTEDDATE(control) {
        var selectedDate = control.$cal$selectedDate,
            dateGrid = control._uCalGrid._uDate;

        // 清除先前选中的日期
        if (control._nSelectedIdx !== undefined) {
            dateGrid.getItem(control._nSelectedIdx).alterClass("selected", true);        
        }          

        if (selectedDate) {
            var year = selectedDate.getFullYear(),
                month = selectedDate.getMonth(),
                day = selectedDate.getDate(),
                offsetDays,
                index;
        
            if (year == control.$cal$year && month == control.$cal$month) {
                offsetDays = (new Date(year, month, 0).getDay() + 1) % 7;
                index = control._nSelectedIdx = offsetDays + day - 1;
                dateGrid.getItem(index).alterClass("selected");
            }
        }
    }

    /**
     * 基本日历输入框
     */
    var ECOM_CALENDAR_EDIT_CREATEDCALS = {},

        ECOM_CALENDAR_EDIT = ui.EcomCalendarEdit = function(el, params) {
        var o, 
            cal,
            edit,
            iframe,
            calType = params.calType ? toCamelCase("-" + params.calType) : "Single";

        params.capture = false;
        el.style.cssText = ieVersion && ieVersion < 8 ? "display:inline;zoom:1" : "display:inline-block";
        UI_CONTROL.call(this, el, params);        

        this.alterClass(calType.toLowerCase());
        
        // 输入框元素
        edit = this._uEdit = el.getElementsByTagName("input")[0];
        // el.appendChild(edit);

        // 日历控件 一种类型的日历只创建一个, 保存在ECOM_CALENDAR_EDIT.createdCals中
        if (ECOM_CALENDAR_EDIT_CREATEDCALS[calType]) {
            cal = this._uCalendar = ECOM_CALENDAR_EDIT_CREATEDCALS[calType];
        }
        else {
            cal = this._uCalendar = $fastCreate(
                ECOM_CALENDAR_EDIT[calType],
                o = createDom(
                    "ec-ecom-calendar " + "ec-ecom-calendar-" + calType.toLowerCase(), 
                    "position:absolute;visibility:hidden;z-index:32768")
            );
            document.body.appendChild(o);
            ECOM_CALENDAR_EDIT_CREATEDCALS[calType] = cal;
        }


        // iframe遮罩
        if (!ECOM_CALENDAR_EDIT._eIframe) {
            iframe = ECOM_CALENDAR_EDIT._eIframe = createDom(
                "",
                "position:absolute;z-index:32766;border:0 none;display:none",
                "iframe"
            );
            iframe.frameBorder = "0";
            document.body.appendChild(iframe);
        }

        edit.onfocus = ECOM_CALENDAR_EDIT_FOCUS;      
        cal.$show = ECOM_CALENDAR_EDIT_CALSHOW;
        cal.$hide = ECOM_CALENDAR_EDIT_CALHIDE;
        cal.$blur = ECOM_CALENDAR_EDIT_CALBLUR;

        edit._cWrapper = this;
        edit._cCalendar = cal;
        cal._cWrapper = this;
        cal._eEdit = edit;

        // 状态初始化
        this._oCalProps = cal.setProps(
            cal.convertParams(params)
        );

        cal.oneditcreate && cal.oneditcreate(params);
    },
    
    ECOM_CALENDAR_EDIT_CLASS = inherits(ECOM_CALENDAR_EDIT, UI_CONTROL);


    ECOM_CALENDAR_EDIT_CLASS.paint = function() {
        UI_EDIT_CLASS.paint.call(this);
        this._uCalendar.paint(); 
    };
    
    ECOM_CALENDAR_EDIT_CLASS.$init = function() {
        var cal = this._uCalendar;
        UI_CONTROL_CLASS.$init.call(this);

        // 日历只初始化一次
        if (!cal._bInited) {
            cal.$init();
            cal.hide();
            cal.getOuter().style.visibility = "";
            cal._bInited = true;
        }
    };


    ECOM_CALENDAR_EDIT_CLASS.$setSize = function(width, height) {
        UI_CONTROL_CLASS.$setSize.call(this, width, height);
        // this._uEdit.style.width = getStyle(this.getOuter(), "width");
    };

    ECOM_CALENDAR_EDIT_CLASS.reset = function() {
        this._uCalendar.oneditreset && this._uCalendar.oneditreset.call(this);
    };

    /**
     * 处理日历输入框获得焦点
     */
    function ECOM_CALENDAR_EDIT_FOCUS(e) {
        var cal = this._cCalendar;

        cal._cWrapper = this._cWrapper;
        cal._eEdit = this;
        
        cal.show();

//        core.mask(0.05);
        core.setFocused(cal);
        this.blur();
    }

    /**
     * 日历默认显示
     */
    function ECOM_CALENDAR_EDIT_CALSHOW(event) {
        var outer = this._cWrapper.getOuter(),
            pos = dom.getPosition(outer),
            view = getView(),
            calWidth = this.getWidth(),
            calHeight = this.getHeight(),

            left = view.right < pos.left + calWidth ? 
                pos.left + outer.offsetWidth - calWidth : pos.left,
            top = view.bottom < pos.top + outer.offsetHeight + calHeight ?
                pos.top - calHeight : pos.top + outer.offsetHeight;

        // 设置显示位置
        this.setPosition(left, top);

        this.constructor.prototype.$show.call(this);

        // 显示iframe层 
        setStyles(ECOM_CALENDAR_EDIT._eIframe, {
            display: "block",
            width: calWidth,
            height: calHeight,
            left: left,
            top: top
        });

        // 读取输入框状态, 触发改变事件
        // this.setProps(this._cWrapper._oCalProps);
        this.alterProps();
        this.change();
    }

    /**
     * 日历默认隐藏
     */
    function ECOM_CALENDAR_EDIT_CALHIDE(event) {
        this.constructor.prototype.$hide.call(this);
        ECOM_CALENDAR_EDIT._eIframe.style.display = "none";
    }

    /**
     * 日历默认失焦
     */
    function ECOM_CALENDAR_EDIT_CALBLUR(event) {
        this.constructor.prototype.$blur.call(this);
        this.$hide();
//        core.mask();
    }

    /**
     * 输入框外挂单日历
     */
    var ECOM_CALEDIT_SINGLECAL = ECOM_CALENDAR_EDIT.Single = function(el, params) {
         ECOM_CALENDAR.call(this, el, params);
         this.ondateclick = ECOM_CALEDIT_SINGLECAL_DATECLICK;
    },
    ECOM_CALEDIT_SINGLECAL_CLASS = inherits(ECOM_CALEDIT_SINGLECAL, ECOM_CALENDAR);

    /**
     * 初始化时转换输入框的参数
     */
    ECOM_CALEDIT_SINGLECAL_CLASS.convertParams = function(options) {
        var val = trim(this._cWrapper._uEdit.value);
        if (val && (val = parseDate(val))) {
            // val为Date对象
            options.selectedDate = val;
            options.year = val.getFullYear();
            options.month = val.getMonth();
        }
        else {
            options.selectedDate = null;
            options.year = ECOM_CALENDAR_DEFAULTS.year;
            options.month = ECOM_CALENDAR_DEFAULTS.month;
        }
        return options;
    };

    /**
     * 读取输入框数据后更新日历数据
     */
    ECOM_CALEDIT_SINGLECAL_CLASS.alterProps = function() {
        var wrapper = this._cWrapper,
            calProps = wrapper._oCalProps,
            val = trim(wrapper._uEdit.value),
            selectedDate = val ? parseDate(val) : null;

        this.setProps(calProps);
        this.selectDate(selectedDate);
    };
    
    /**
     * 日期点击 
     */
    function ECOM_CALEDIT_SINGLECAL_DATECLICK(date) {
        var calProps = this._cWrapper._oCalProps;

        this.constructor.prototype.ondateclick.call(this, date);
        this._eEdit.value = formatDate(date, ECOM_CALENDAR_DATEFORMAT);
        this.hide();

        calProps.selectedDate = date;
        calProps.year = date.getFullYear();
        calProps.month = date.getMonth();
//        core.mask();
    }

    /**
     * 输入框重置
     */
    ECOM_CALEDIT_SINGLECAL_CLASS.oneditreset = function() {
        this._oCalProps = copy({}, this._oInitCalProps);
    };

     /**
     * 输入框外挂双日历
     */
    var ECOM_CALEDIT_RANGECAL = ECOM_CALENDAR_EDIT.Range = function(el, params) {

        UI_CONTROL.call(this, el, params);

        var body = this.getBody(),
            tds,
            btns;

        body.innerHTML = '<div class="time-begin"><table><tr>\
                <td><span class="text-label">起始:</span></td><td><input readonly="readonly" type="text"  class="begin-cal-input ec-edit"/></td>\
                <td></td>\
                </tr></table><div class="single-cal"></div></div><div class="time-end"><table><tr>\
                <td><span class="text-label">结束:</span></td><td><input readonly="readonly" type="text" class="end-cal-input ec-edit"/></td>\
                <td></td>\
            </tr></table><div class="single-cal"></div></div>\
            <button>确定</button><button>取消</button><button>重选</button><span class="calendar-error"></span>';

        tds = body.getElementsByTagName("td");
        btns = body.getElementsByTagName("button");

        this._uBeginText = tds[1].firstChild;
        this._uEndText = tds[4].firstChild;
        //this._uBeginReset = tds[2].firstChild;
        //this._uEndReset = tds[5].firstChild;
        this._uBeginCal = $fastCreate(ECOM_CALENDAR, children(body)[0].lastChild, this);
        this._uEndCal = $fastCreate(ECOM_CALENDAR, children(body)[1].lastChild, this);
        this._uBeginCal._eText = this._uBeginText,
        this._uEndCal._eText = this._uEndText,
        this._uConfirmBtn = btns[0];
        this._uCancelBtn = btns[1];
        this._uResetBtn = btns[2];
        this._uErrorTip = btns[2].nextSibling;

        // 建立联系
        this._uBeginCal._cPeer = this._uEndCal;
        this._uEndCal._cPeer = this._uBeginCal;
        this._uConfirmBtn._cWrapper = this;
        this._uCancelBtn._cWrapper = this;
        this._uResetBtn._cWrapper = this;

        // 绑定事件
        //this._uBeginCal.ondateclick = this._uEndCal.ondateclick = ECOM_CALEDIT_RANGECAL_DATECLICK;
        this._uBeginCal.selectDate = this._uEndCal.selectDate = ECOM_CALEDIT_RANGECAL_DATESELECT;
        this._uConfirmBtn.onclick = ECOM_CALEDIT_RANGECAL_CONFIRMCLICK;
        this._uCancelBtn.onclick = ECOM_CALEDIT_RANGECAL_CANCELCLICK;
        this._uResetBtn.onclick = ECOM_CALEDIT_RANGECAL_RESETCLICK;
        this.onshow = ECOM_CALEDIT_RANGECAL_SHOW;

        // 设置状态
        // this.setProps()
    },
    ECOM_CALEDIT_RANGECAL_CLASS = inherits(ECOM_CALEDIT_RANGECAL, UI_CONTROL);

    /*
    ECOM_CALEDIT_RANGECAL_CLASS.paint = function() {
        UI_CONTROL_CLASS.paint.call(this);
        this._uBeginCal.paint();
        this._uEndCal.paint();
    };

    ECOM_CALEDIT_RANGECAL_CLASS.$cache = function(style, cacheSize) {
        UI_CONTROL_CLASS.$cache.call(this);
        this._uBeginCal.cache(true, true);
        this._uEndCal.cache(true, true);
    };
    */

    ECOM_CALEDIT_RANGECAL_CLASS.$setSize = function(width, height) {
        UI_CONTROL_CLASS.$setSize.call(this, width, height);
        this._uBeginCal.setSize();
        this._uEndCal.setSize();
    };

    ECOM_CALEDIT_RANGECAL_CLASS.$init = function() {
        UI_CONTROL_CLASS.$init.call(this);  
        this._uBeginCal.init();
        this._uEndCal.init();

    };

    ECOM_CALEDIT_RANGECAL_CLASS.oneditcreate = function(params) {
        // 隐藏输入框
        var wrapper = this._cWrapper,
            outer = wrapper.getOuter(),
            inputs = outer.getElementsByTagName("input"),
            types = ["Begin", "End"],
            o,
            beginInput,
            endInput;

        wrapper._sBeginName = params.beginName || "dateFrom";
        wrapper._sEndName = params.endName || "dateTo";
        wrapper._sBeginVal = params.beginVal || "";
        wrapper._sEndVal = params.endVal || "";

        if (inputs.length != 3) {
            // 标签里没有隐藏输入框则动态创建
            insertHTML(outer, "beforeEnd",
                '<input type="hidden" name="' +　wrapper._sBeginName　+　'" value="' + wrapper._sBeginVal + '"/>'
                + '<input type="hidden" name="' +　wrapper._sEndName　+　'" value="' + wrapper._sEndVal + '"/>'
            );
        }
        
        inputs = outer.getElementsByTagName("input"),

        beginInput = wrapper._uBeginInput = inputs[1];
        endInput = wrapper._uEndInput = inputs[2];

        // 更新状态数据
        // 页面上原生写好的隐藏输入框中值的优先级高于日历输入框ecui属性中定义的值
        wrapper._sBeginVal = trim(beginInput.value) || wrapper._sBeginVal;
        wrapper._sEndVal = trim(endInput.value) || wrapper._sEndVal;

        wrapper._sBeginVal && this._uBeginCal.selectDate(parseDate(wrapper._sBeginVal));
        wrapper._sEndVal && this._uEndCal.selectDate(parseDate(wrapper._sEndVal));
        
        for (var i = 0, o; o = types[i++];) {
            for (var j = 0, p; p = ECOM_CALENDAR_PROPNAMES[j++];) {
                wrapper._oCalProps["_o" + o + "Props"][p] = this["_u" + o + "Cal"]["$cal$" + p];    
            }
        }

        /*
        beginInput.defaultValue = "" + wrapper._sBeginVal;
        endInput.defaultValue = "" + wrapper._sEndVal;
        */

        // 保存初始化参数
        wrapper._oInitCalProps = cloneObject(wrapper._oCalProps);
        
        // 把日期写入到主输入框
        wrapper._uEdit.defaultValue 
            = ECOM_CALEDIT_RANGECAL_WRITEDATE(wrapper._uEdit, wrapper._sBeginVal, wrapper._sEndVal);

    };

    function ECOM_CALEDIT_RANGECAL_SHOW(event) {
        // 隐藏错误信息
        setText(this._uErrorTip, "");
    }

    function ECOM_CALEDIT_RANGECAL_WRITEDATE(input, beginVal, endVal) {
        var value = "";
        if (beginVal && endVal) {
            value = beginVal + "至" + endVal;
        }
        else if (beginVal && !endVal) {
            value = beginVal + "之后";
        }
        else if (!beginVal && endVal) {
            value = endVal + "之前";
        }
        input.value = value;
        return value;
    }

    function ECOM_CALEDIT_RANGECAL_DATESELECT(date) {
        this.constructor.prototype.selectDate.call(this, date);
        var wrapper = this.getParent(),
            type = this == wrapper._uBeginCal ? "Begin" : "End";
            

        // 给输入框设值
        this._eText.value 
            = date ? formatDate(date, ECOM_CALENDAR_DATEFORMAT) : "";

       ECOM_CALEDIT_RANGECAL_MODRANGE(this, date);
       this._cPeer.change();
    }

    /**
     * 给相对日历置灰
     */
    function ECOM_CALEDIT_RANGECAL_MODRANGE(cal, date) {
        var peer = cal._cPeer,
            type = cal == cal.getParent()._uBeginCal ? "Begin" : "End",
            thisRange = cal.$cal$range,
            peerRange = peer.$cal$range,
            o;

        // TODO 按规则设置置灰
        if (date) {
            o = peerRange.split("-");
            o[type == "Begin" ? 0 : 1] = formatDate(date, "yyyyMMdd");
            o = o.join("-");

            peer.$cal$range = o;
        }
        else {
            peer.$cal$range = "" 
                + cal.getParent()._cWrapper
                    ._oInitCalProps["_o" + (type == "Begin" ? "End" : "Begin") + "Props"].range;
        }
    }

    // 确定按钮点击
    function ECOM_CALEDIT_RANGECAL_CONFIRMCLICK(event) {
        var wrapper = this._cWrapper,
            calProps = wrapper._cWrapper._oCalProps,
            types = ["Begin", "End"],
            beginVal = "",
            endVal = "",
            valid = true;

        // TODO 验证
        if (!this._bLoose) {
            if (!(wrapper._uBeginCal.$cal$selectedDate &&
                        wrapper._uEndCal.$cal$selectedDate))
            {
                valid = false;
                setText(wrapper._uErrorTip, 
                    "请选择" + (!wrapper._uBeginCal.$cal$selectedDate ? "开始" : "结束") + "时间");
            }
        }

        if (valid) {
            // 把日历状态数据写入输入框
            for (var i = 0, o; o = types[i++];) {
                for (var j = 0, p; p = ECOM_CALENDAR_PROPNAMES[j++];) {
                    calProps["_o" + o + "Props"][p] = wrapper["_u" + o + "Cal"]["$cal$" + p];    
                }
            }
            
            // 更新输入框的值
            beginVal = wrapper._cWrapper._uBeginInput.value 
                = formatDate(wrapper._uBeginCal.$cal$selectedDate, ECOM_CALENDAR_DATEFORMAT);
            endVal = wrapper._cWrapper._uEndInput.value 
                = formatDate(wrapper._uEndCal.$cal$selectedDate, ECOM_CALENDAR_DATEFORMAT);
                
            ECOM_CALEDIT_RANGECAL_WRITEDATE(wrapper._cWrapper._uEdit, beginVal, endVal);

            wrapper.hide();
        }
    }

    // 取消按钮点击
    function ECOM_CALEDIT_RANGECAL_CANCELCLICK(event) {
        var wrapper = this._cWrapper;                
        wrapper.hide();
    }

    function ECOM_CALEDIT_RANGECAL_RESETCLICK(event) {
        var wrapper = this._cWrapper,
            edit = wrapper._cWrapper;

        wrapper.setProps(edit._oInitCalProps);
        wrapper.change();
    }

    ECOM_CALEDIT_RANGECAL_CLASS.$change = function() {
        var beginSelectedDate = this._uBeginCal.$cal$selectedDate,
            endSelectedDate = this._uEndCal.$cal$selectedDate;

        this._uBeginCal.change();  
        this._uEndCal.change();  


        if (beginSelectedDate !== undefined) {
            beginSelectedDate === null ? this._uBeginText.value = "" :
            (this._uBeginText.value = formatDate(beginSelectedDate, ECOM_CALENDAR_DATEFORMAT));
        }

        if (endSelectedDate !== undefined) {
            endSelectedDate === null ? this._uEndText.value = "" :
            (this._uEndText.value = formatDate(endSelectedDate, ECOM_CALENDAR_DATEFORMAT));
        }
    }


    /**
     * 设置属性
     */
    ECOM_CALEDIT_RANGECAL_CLASS.setProps = function(options) {
        return {
            _oBeginProps: this._uBeginCal.setProps(options._oBeginProps),
            _oEndProps: this._uEndCal.setProps(options._oEndProps)        
        };
    };

    ECOM_CALEDIT_RANGECAL_CLASS.alterProps = function() {
        var wrapper = this._cWrapper,
            calProps = wrapper._oCalProps,
            beginCal = this._uBeginCal,
            endCal = this._uEndCal,
            beginVal = trim(wrapper._uBeginInput.value),
            endVal = trim(wrapper._uEndInput.value),
            beginDate = beginVal ? parseDate(beginVal) : null,
            endDate = endVal ? parseDate(endVal) : null;

        this.setProps(calProps);
        beginCal.selectDate(beginDate);
        endCal.selectDate(endDate);
    };

    /**
     * 初始化时转换输入框的参数
     */
    ECOM_CALEDIT_RANGECAL_CLASS.convertParams = function(options) {
        var wrapper = this._cWrapper,
            ret = {},
            types = ["Begin", "End"];

        for (var i = 0, o; o = types[i++];) {
            ret["_o" + o + "Props"] = {};
            for (var j = 0, p; p = ECOM_CALENDAR_PROPNAMES[j++];) {
                if (p == "range") {
                    ret["_o" + o + "Props"][p] = options[toCamelCase([o.toLowerCase(), p].join("-"))] 
                        || options[p] || ECOM_CALENDAR_DEFAULTS[p];
                }
                /*
                else if (p == 'year' || p == "month") {
                    if ((d = options[toCamelCase([o.toLowerCase(), "selectedDate"].join("-"))])) {
                        ret["_o" + o + "Props"][p] = d[p == "year" ? "getFullYear" : "getMonth"]();
                    }
                }
                */
                else {
                    ret["_o" + o + "Props"][p] = options[toCamelCase([o.toLowerCase(), p].join("-"))] 
                        || ECOM_CALENDAR_DEFAULTS[p];
                }
            }
        }

        return ret;
    };

})();

/* vim:set fdm=marker: */
