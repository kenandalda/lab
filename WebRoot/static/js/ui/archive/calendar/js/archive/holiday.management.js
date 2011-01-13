var holidayTools = {};

(function() {
	var core = ecui,
		dom = core.dom,
		lib = baidu,
		array = lib.array,
		ui = core.ui,
		util = core.util,

		inherits = util.inherits,
		copy = util.copy,
		
		UI_CONTROL = ui.Control,
		UI_CALENDAR = ui.Calendar,
		
		//记录选择日期的私有变量,
		selectedDates = [];

		//节假日管理中的日历
		UI_CALENDAR.prototype.$create = function(params) {
			//params.forholiday为节假日管理中的特有属性
			if (params.forholiday) {
				var weekGrids = this.$getSection("Names");
				//绑定事件
				//weekGrids.onmouseover = weekEventHandler("mouseover");
				weekGrids.onclick = weekEventHandler("click");
				this.ondateclick = onholidayclick;

				//一些方法
				this.clearSelected = clearSelected;

				//特有属性
				this._bForHoliday = true;
			}
			UI_CONTROL.prototype.$create.call(this);
		};	

		/**
		 * 清空日历中所有被选择的日期
		 */
		function clearSelected() {
			var dateGrids = this.$getSection("Date");	
			array.each(dateGrids._aItem, function(item, i) {
				item._bSelected && toggleSelect(item);
			});
		}

		/**
		 * 处理ondateclick
		 * @private
		 */
		function onholidayclick(date) {
			//console.log(this.getYear(), this.getMonth());
			var dateGrid = core.getFocused();
			
			toggleSelect(dateGrid);
			//dateGrid.alterClass("selected");
		}

		/**
		 * 选择日期
		 * @private
		 *
		 * @param {ecui.ui.Grid}	dateGrid	日期格子 
		 * @param {Boolean}			force		是否强行取消选择
		 */
		function toggleSelect(dateGrid, force) {
			if (dateGrid.isEnabled()) {
				var selected = force !== undefined ? force : dateGrid._bSelected;

					dateGrid.alterClass("selected", selected);
					selected && core.loseFocus(dateGrid);
					selected ? array.remove(selectedDates, dateGrid) 
						:selectedDates.push(dateGrid);
					
					dateGrid._bSelected = !selected;

				//console.log("选择日期的个数:", selectedDates.length);
			}
		}

		/**
		 * 处理星期网格的事件, 包括mouseover和click
		 * @private
		 */
		function weekEventHandler(eventType) {
		
			return function() {
				if (this.getParent()) {
					var me = this;
					
					var	cal = me.getParent().getBase().parentNode.getControl();
					
					var dateGrid = cal.$getSection('Date'),
					index = me.getIndex();
					
					selected = me._bSelected;

					array.each(dateGrid._aItem, function(item, i) {
						if (eventType == "mouseover") {
							item.alterClass("week-over", i % 7 != index);
						} 
						else if (eventType == "click") {
							// 根据当前网格的_bSelected属性强制选中或取消选中该列日期
							(i % 7 == index) && toggleSelect(item, !!selected);
						}
					});

					if (eventType == "click") {
						me._bSelected = !selected;
					}
				}
			}
		}

		/**
		 * 获得当前所有日历
		 * @public
		 */
		holidayTools.getAllCals = function() {
			return  ecui.query({
					"type":ecui.ui.Calendar,
					"custom":function(o){
						return o._bForHoliday;
				}});
		};

		/**
		 *  得到选中日期的数据
		 *  @public
		 */
		holidayTools.getSelectedDates = function() {
			var ret = [], i = 12;

			while (i--) {
				ret[i] = [];
			}
			
			array.each(selectedDates, function(item) {
				var cal = item.getParent().getParent();
				//console.log(cal.getYear(), cal.getMonth(), item.getBase().innerHTML);
				ret[cal.getMonth() - 1].push(parseInt(item.getBase().innerHTML));
			});
			return ret;
		};
		/**
		 *  使今天之前的日历不可操作
		 *  @public
		 */	
		holidayTools.setDisable = function(crisis) {
				var holidayCals = holidayTools.getAllCals();
				year = parseInt(crisis.year,10);
				month = parseInt(crisis.month,10);
				day = parseInt(crisis.day,10);
				array.each(holidayCals,function(item, i){
				
				if(item.getYear() < year){
					item._uDate.setEnabled(false)  //如果年份小于，毫不留情地置灰
				}
				else if((item.getYear() == year)&&(item.getMonth() < month)){
					item._uDate.setEnabled(false)   		//如果小于当月，置灰，不和上面合并，便于维护
				}else if((item.getYear() == year)&&(item.getMonth() == month)){
					var dateGrids = item.$getSection("Date")._aItem;
						array.each(dateGrids, function(itemDay, j){
							if(itemDay._nDay < day+1)   itemDay.setEnabled(false)   //如果小于当日，则设置disable
						})
				}else{
					
				}
					
				})
		}

		/**
		 * 清空所有选中的日期
		 * @public
		 */
		holidayTools.clearAll = function() {
			var holidayCals = holidayTools.getAllCals();
			array.each(holidayCals, function(item, i) {
				item.clearSelected();
			});
		};

		/**
		 * 初始化选择
		 * @public
		 *
		 * @param {Array} selection 初始化数据二维数组
		 * @param {data}  now 日期  用于通知节假日控件当天的日期
		 
		 */
		holidayTools.initSelection = function(selection,now) {
			//获得当前月和日
			var now = now.split("-");
			var nowday={
				"year":now[0],
				"month":now[1],
				"day":now[2]
			}
			
		
			//先清空所有选择
			holidayTools.clearAll();
			
			//按selection参数选择日期
			array.each(holidayTools.getAllCals(), function(cal, i) {
				if (selection[i]) {
					array.each(cal.$getSection("Date")._aItem, function(grid, j) {
						array.each(selection[i], function(item, k) {
							var flag = parseInt(item) != parseInt(grid._nDay);
							//flag 为 true 时表示取消选择
							flag === false && toggleSelect(grid, flag);
						});
					});
				}
			});
			//设置当天之前不可操作,但任然显示之前的选择
			holidayTools.setDisable(nowday);
		};
})();
