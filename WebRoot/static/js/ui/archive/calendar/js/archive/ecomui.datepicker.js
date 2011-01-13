var ecomui = ecomui || {};

(function() {
	var lib = baidu,
		core = ecui,
		dom = core.dom, 
		ui = core.ui,
		util = core.util,
		libDom = lib.dom,
		libDate = lib.date,

		blank = core.blank,
		inherits = util.inherits,
		copy = util.copy,
		setStyles = dom.setStyles,
		getPosition = dom.getPosition,

		each = lib.array.each,
		formatDate = libDate.format,
		parseDate = libDate.parse,

		UI_CONTROL = ui.Control,
		UI_EDIT = ui.Edit,
		DATEPICKER_CLASS;

	/* 调试用的log方法 */
	var log = function() {
		(window.console && window.console.log)
			&& window.console.log.apply('', arguments);
	}

	/**
	 * 初始化日历
	 */
	var ECOM_DATEPICKER =
		ecomui.DatePicker = ui.DatePicker = function(el, params) {
		
		UI_CONTROL.call(this, el, params);

		/* 默认参数 */
		this._oDefaults = {
			lang: "zh-CN",			//语言
			numOfMon: 1,			//显示的月份数
			yearRange: "5:5",		//显示的日期范围
			minDate: null,			//可选择的最早日期
			maxDate: null,			//可选择的最晚日期
			date: formatDate(new Date(), "yyyy-MM-dd"),
			showYMSelects: false,		//是否显示年月下拉框
			showFooter: false,
			inline: false,
			inputName: "date"
		};

		copy(this._oDefaults, params);

		var id = this.getUID();
		var html = ECOM_DP_DRAW_HTML(this, id);
		var body = this.getBody();
		var outer = this.getOuter();
		
		body.innerHTML = html;
		log(html);

		core.init(body);

		//部件
		this._uCal = core.get("cal-0-" + id);
		this._uPrev = core.get("nav-prev-" + id);
		this._uNext = core.get("nav-next-" + id);
		this._aCals = core.query({"type":ui.Calendar,"parent":this});
		this._aHeaders = dom.children("dp-header-" + id);

		//事件绑定
		this._uPrev.onclick = this._uNext.onclick = ECOM_DP_NAVCLICK;
		each(this._aCals, function(n, i) {
			n.ondateclick = n.getParent().ondateclick;
		});
		
		//有下拉框的情况
		if (this.getParam("showYMSelects")) {
			this._oYSelect = lib.g("dp-year-select-" + id);
			this._oMSelect = lib.g("dp-month-select-" + id);
			this._oYSelect.onchange = this._oMSelect.onchange = ECOM_DP_SELECTCHANGE(this);
		}

		//输入框
		if (!this.getParam("inline")) {
			var input = '<input readonly="readonly" name="' + this.getParam('inputName') + '">';
			lib.insertHTML(outer, "beforeBegin", input)
			setStyles(outer, {
				"position": "absolute",
				"z-index": 32769 
			})
			this.hide();
			input = lib.dom.prev(outer);

			input._cDP = this;
			this._oInput = input;
			
			input.onfocus = ECOM_DP_INPUTFOCUS;
			this.onblur = ECOM_DP_BLUR;
		}


	};

	DATEPICKER_CLASS = inherits(ui.DatePicker, UI_CONTROL);

	/**
	 * 生成日历html
	 * @private
	 */
	function ECOM_DP_DRAW_HTML(dp, id) {
		var html = '<table>';
		var numOfMon = parseInt(dp.getParam('numOfMon'));
		var calHeader = ECOM_DP_DRAW_HEADER(dp, id, numOfMon);
		var calFooter = ECOM_DP_DRAW_FOOTER(dp, id);
		var initDate = parseDate(dp.getParam("date"));
		var yy = initDate.getFullYear();
		var MM = initDate.getMonth() + 1;

		/* 加入日历头部 */
		html += '<tr id="dp-header-' + id + '">' + calHeader + '</tr>';
		html += '<tr>'

		/* 加入日历主体 */
		for (var i = 0; i < numOfMon; i++) {
			html += '<td><div ecui="type:calendar;year:' + yy + ';month:' + (MM + i) + ';id:cal-' + i + '-' + id + '"></div></td>'
		}
		
		html += '</tr>';

		/* 加入日历尾部 */
		html += '<tr><td colspan="' + numOfMon+ '">' + calFooter + '</td></tr>';

		html += '</table>';

		return html;
	}

	/**
	 * 获取日历参数
	 */
	DATEPICKER_CLASS.getParam = function(name) {
		return this._oDefaults[name];
	};

	/**
	 * 生成日历头部html
	 * @private
	 */
	function ECOM_DP_DRAW_HEADER(dp, id, numOfMon) {
		var showYMSelects = dp.getParam("showYMSelects");
		var cal = dp._uCal;
		var initDate = parseDate(dp.getParam("date"));
		var yy = initDate.getFullYear();
		var MM = initDate.getMonth() + 1;
		var header = "";

		for (var i = 0; i < numOfMon; i++) {
			header += '<td><div class=""><table><tr>';
			initDate = new Date(yy, MM - 1 + i);
			//向前按钮
			if (i == 0) {
				header += '<td><div ecui="type:control;id:nav-prev-' + id + '">&laquo;</div></td>'

				if (showYMSelects) {
					//TODO 此处年月下拉框为hard-wired
					header += '<td class="dp-header-select"><select id="dp-year-select-' + id + '">';
					for (var j = 2000; j <= 2020; j++) {
						header += '<option value="' + j + '" ' 
							+ ((j == initDate.getFullYear()) ? 'selected="selected"' : '') +'>' 
							+ j +'</option>';
					}
					header += '</select>年<select id="dp-month-select-' + id + '">';
					for (var k = 1; k <= 12; k++) {
						header += '<option value="' + k + '" '
						+ ((k == initDate.getMonth() + 1) ? 'selected="selected"' : '') +'>' 
						+ k +'</option>';
					}
					header += '</select>月';
				} 
				else {
					header += '<td class="dp-header-text">' + initDate.getFullYear() + "年" + (initDate.getMonth() + 1 ) + "月</td>";
				}
			}
			else {
				//显示当前年月		
				header += '<td class="dp-header-text">' + initDate.getFullYear() + "年" + (initDate.getMonth() + 1 ) + "月</td>";
			}
			
			//向后按钮
			if (i == numOfMon - 1) {
				header += '<td><div ecui="type:control;id:nav-next-' + id + '">&raquo;</div></td>';
			}

			header += '</tr></table></div></td>';
		}

		return header;
	}

	/**
	 * 生成日历尾部html
	 * @private
	 */
	function ECOM_DP_DRAW_FOOTER(dp, id) {
		var footer = "";
		
		return footer;
	}

	/**
	 * 整个控件的onchange事件
	 */
	DATEPICKER_CLASS.onchange = function() {
		var mainCal = this._uCal;
		var yy = mainCal.getYear();
		var MM = mainCal.getMonth();
		var cals = this._aCals;
		var ySelect = this._oYSelect;
		var mSelect = this._oMSelect;
		var headers = this._aHeaders;
		var showYMSelects = this.getParam('showYMSelects');

		//TODO 相关按钮置灰
		
		
		
		/*下拉框改变值*/
		if (showYMSelects) {
			ySelect.options[ySelect.selectedIndex].removeAttribute("selected");
			mSelect.options[mSelect.selectedIndex].removeAttribute("selected");

			each(ySelect.options, function(n, i) {
				(n.value == yy) && (n.selected = "selected");
			});
			
			each(mSelect.options, function(n, i) {
				(n.value == MM) && (n.selected = "selected");
			});
		}

		each(cals, function(n, i) {
			var tmpDate = new Date(yy, MM - 1 + i);

			/*日历本身的值联动改变*/
			if (i > 0) {
				n.setDate(yy, MM + i);
			}

			/*静态标题改变值*/
			if (!showYMSelects || i > 0)	{
				lib.dom.q("dp-header-text", headers[i], 'td')[0]
					.innerHTML = tmpDate.getFullYear() + "年" + (tmpDate.getMonth() + 1) +"月";
			}
		});

	}

	/**
	 * 选择日期事件处理
	 * @public
	 */
	DATEPICKER_CLASS.ondateclick = function(date) {
		alert(formatDate(date, "yyyy-MM-dd"));
	};

	/**
	 * 读取日期
	 * @public
	 */
	DATEPICKER_CLASS.readDate = function(dateStr) {
	
	};


	/**
	 * 年月下拉框改变
	 * @private
	 */
	function ECOM_DP_SELECTCHANGE(dp) {
		return function() {
			var cal = dp._uCal;
			var ySelect = dp._oYSelect;
			var mSelect = dp._oMSelect;
			var yy = cal.getYear();
			var MM = cal.getMonth();
		
			cal.setDate(
				this == ySelect ? this.value : yy,
				this == mSelect ? this.value : MM
			);

			dp.change();
		}
	};

	/**@ignore
	 *
	 * 移动日历
	 * @public
	 */
	DATEPICKER_CLASS.moveCal = function(offset) {
		var cal = this._uCal;
		cal.move(offset);	
	};

	/**
	 * 导航按钮点击
	 * @private
	 */
	function ECOM_DP_NAVCLICK() {
		var dp = this.getParent();
		var cal = dp._uCal;
		var prev = dp._uPrev;
		var next = dp._uNext;
	
		cal.move(this == prev ? -1 : 1);
		dp.change();
	}

	/**
	 * 输入框获得焦点
	 * @private
	 */
	function ECOM_DP_INPUTFOCUS() {
		var dp = this._cDP;
		var pos = getPosition(this);

		dp.setPosition(pos.left, pos.top + this.offsetHeight);
		dp.show();
		
		//core.mask(0.05);
		core.setFocused(dp);
	}


	/**
	 * DP失去焦点
	 * @private
	 */
	function ECOM_DP_BLUR() {
		this.hide();
		//core.mask();
		this._oInput.blur();
	}
})();
