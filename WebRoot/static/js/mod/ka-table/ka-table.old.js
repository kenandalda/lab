(function() {
	var lib = baidu,
		dom = lib.dom,
		q = dom.q,
		g = dom.g,
		setStyle = dom.setStyle,
		setStyles = dom.setStyles,
		insertHTML = dom.insertHTML,
		insertBefore = dom.insertBefore,
		children = dom.children,
		each = lib.array.each,
		on = lib.event.on,
		getStyle = dom.getStyle,
		addClass = dom.addClass,
		removeClass = dom.removeClass,
		show = dom.show,
		hide = dom.hide,
		indexOf = lib.array.indexOf,
		
		DOCUMENT = document;

	
	/**
	 * 获取元素内部宽度
	 * @private
	 */
	function getInnerWidth(el) {
		var style = el.style,
			paddingLeft = getStyle(el, "paddingLeft").match(/\d+/) || 0,
			paddingRight = getStyle(el, "paddingRight").match(/\d+/) || 0,
			borderLeftWidth = getStyle(el, "borderLeftWidth").match(/\d+/) || 0,
			borderRightWidth = getStyle(el, "borderRightWidth").match(/\d+/) || 0;

		return el.offsetWidth
				- borderLeftWidth - borderRightWidth 
				- paddingLeft - paddingRight;
	}

	/**
	 * 获取节点的outerHTML
	 */
	function outerHTML(node) {
		var el;
		if (node.outerHTML) {
			return node.outerHTML;
		} else if (node.parentNode && node.parentNode.nodeType == 1) {
			var el = document.createElement(node.parentNode.nodeName);
			el.appendChild( node.cloneNode(true) );
			return el.innerHTML;
		}
		return "";
	}
	

	/**
	 * 获取元素内部高度
	 * @private
	 */
	function getInnerWidth(el) {
		var	paddingTop = getStyle(el, "paddingTop").match(/\d+/) || 0,
			paddingBottom = getStyle(el, "paddingBottom").match(/\d+/) || 0,
			borderTopWidth = getStyle(el, "borderTopWidth").match(/\d+/) || 0,
			borderBottomWidth = getStyle(el, "borderBottomWidth").match(/\d+/) || 0;

		return el.offsetWidth
				- borderTopWidth - borderBottomWidth 
				- paddingTop - paddingBottom;
	}
	/**
	 * 渲染外层包含容器
	 * @private
	 */
	function drawWrapper(table, rand) {
		var oldWrapper = table.parentNode;
		var wrapper = DOCUMENT.createElement("div");

		wrapper.id = "ka-table-wrapper-" + rand;
		wrapper.className = "ka-table-wrapper";

		setStyles(wrapper, {
			position: "relative",
			overflow: "hidden",
			width: getInnerWidth(oldWrapper),
			height: oldWrapper.offsetHeight
		});

		insertBefore(wrapper, oldWrapper);
		wrapper.appendChild(oldWrapper);

		return wrapper;
	}

	/**
	 * 渲染横向的锁定表头
	 * @private
	 */
	function drawHHead(table, rand) {
		var oldHead = table.getElementsByTagName("thead")[0];
		var ths = oldHead.getElementsByTagName("th");
		var dummyTr = table.getElementsByTagName("tbody")[0]
				.getElementsByTagName("tr")[0];
		var dummyTrChild = children(dummyTr);

		//var s = new Date().getTime();

		each(dummyTrChild, function(n, i) {
			n.setAttribute("_nWidth", getInnerWidth(n));
		});
		each(ths, function(n, i) {
			n.setAttribute("_nWidth", getInnerWidth(n));
		});

		hide(dummyTr);
		hide(oldHead);

		//固定辅助行单元格的宽度
		each(dummyTrChild, function(n, i) {
			setStyle(n, "width", n.getAttribute("_nWidth") + "px");		
			n.removeAttribute("_nWidth");
		});

		//固定th格子的宽度
		each(ths, function(n, i) {
			setStyle(n, "width", n.getAttribute("_nWidth") + "px");		
			n.removeAttribute("_nWidth");
		});

		show(dummyTr);
		show(oldHead);

		//alert(new Date().getTime() - s);

		var html = oldHead.innerHTML;

		html = "<div id='ka-thhead-" + rand 
			+ "' style='position:absolute;overflow:hidden;z-index:1000;height:" 
			+ oldHead.offsetHeight + "px'><table style='width:" 
			+ getInnerWidth(table) + "px'>" 
			+ html
			+ "<tr style='visibility:hidden'>" + dummyTr.innerHTML + "</tr>" 
			+ "</table></div>";

		setStyles(table.parentNode, {
			top: oldHead.offsetHeight,
			position: "absolute",
			height: table.parentNode.offsetHeight - oldHead.offsetHeight
		});
		setStyle(oldHead, "display", "none");

		insertHTML(table.parentNode, "beforeBegin", html);

		var tHHead = g("ka-thhead-" + rand);

		return tHHead;

	}

	/**
	 * 渲染纵向锁定表头
	 * @private
	 */
	function drawVHead(table, rand) {
		var tbody = table.getElementsByTagName("tbody")[0];
		var trs = tbody.getElementsByTagName("tr");
		var tHHead = g("ka-thhead-" + rand);

		var html = "<div id='ka-tvhead-" + rand 
			+ "' style='position:absolute;z-index:999;top:"
			+ tHHead.offsetHeight + "px'><table>";
		var leftDis = 0;

		each(trs, function(n, i) {
			var ths = n.getElementsByTagName("th");		
			
			html += "<tr>";

			each(ths, function(m, j) {
				//TODO 获取outerHTML
				//(i == 0) && console.log(m);
				//html += ((i == 0) ? "<th style='width:" + getStyle(m, "width") + "'>" : "<th>") 
				//	+ m.innerHTML + "</th>";
				html += (i == 0) ? outerHTML(m) : "<th>" + m.innerHTML + "</th>";

				//i == 0 && (leftDis += m.offsetWidth);
				i == 0 && (leftDis += parseInt(getStyle(m, "width").match(/\d+/)));

				setStyle(m, "display", "none");
			});

			html += "</tr>";
		});

		html += "</table>";

		insertHTML(table.parentNode, "beforeBegin", html);

		var tVHead = g("ka-tvhead-" + rand);

		var tWidth = getInnerWidth(table) - leftDis;
		var bWidth = getInnerWidth(table.parentNode) - leftDis;

		setStyles(table.parentNode, {
			"left": leftDis + "px",
			"width": bWidth + "px"
		});
		setStyle(table, "width", tWidth);

		//setStyle(tVHead, "top", tHHead.offsetHeight);

		setStyles(tHHead, {
			"left": leftDis + "px",
			"width": (tHHead.offsetWidth - tVHead.offsetWidth) + "px"
		});

		tHHead.scrollLeft = tVHead.offsetWidth;
		return tVHead;
	}

	/**
	 * 渲染左上角表头
	 * @private
	 */
	function drawCHead(table, rand) {
		var tHHead = g("ka-thhead-" + rand),
			tVHead = g("ka-tvhead-" + rand);

		var html = outerHTML(tHHead);
		html = html.replace(/ka-thhead/, "ka-tchead");
		
		insertHTML(table.parentNode, "beforeBegin", html);

		var tCHead = g("ka-tchead-" + rand);

		setStyles(tCHead, {
			zIndex: "1001",
			left: "0",
			top: "0",
			width: tVHead.offsetWidth
		});

		return tCHead;
	}


	/**
	 * 表格滚动事件的回调函数
	 * @private
	 */
	function ontablescroll(rand) {
		var tHHead = g("ka-thhead-" + rand),
			tVHead = g("ka-tvhead-" + rand);
		return function() {
			setStyle(tHHead, "left",tVHead.offsetWidth - this.scrollLeft);
			setStyle(tVHead, "top", tHHead.offsetHeight - this.scrollTop);
		}
	}

	/**
	 * 单元格点击高亮
	 * @private
	 */
	function ontableclick(rand) {
		var oldrow, oldCellIndex;
		return function(e) {
			var target = lib.event.getTarget(e);
			var table = this;
			var rows = table.rows;
			var row = target.parentNode;
			var cells = row.getElementsByTagName("td");
			var cellIndex = indexOf(cells, target);
			var hlClass = "highlight";
			 
			//行高亮
			oldrow && removeClass(oldrow, hlClass);		
			addClass(row, hlClass);
			oldrow = row;

			//列高亮
			//var s = new Date().getTime();

/*
 *            each(rows, function(n, i) {
 *                var tds = n.getElementsByTagName("td");
 *                if (tds.length) {
 *                    oldCellIndex !== undefined && removeClass(tds[oldCellIndex], hlClass);
 *                    addClass(tds[cellIndex], hlClass);
 *                }
 *            });
 *
 */
           if (dom.getAttr(table,"noVhl") != "1"){
			var allCells = table.getElementsByTagName("td"); 
			//alert("hl: " + (new Date().getTime() - s));
			for (var i = 0; allCells[i]; i++) {
					oldCellIndex !== undefined 
						&& i % cells.length == oldCellIndex
						&& removeClass(allCells[i], hlClass);
					i % cells.length == cellIndex 
						&& addClass(allCells[i], hlClass);
			}

			oldCellIndex = cellIndex;
           }
		}
	}

	/**
	 * 隐藏纵向表头列
	 * @public
	 *
	 */
	function toggleVHeadCol(index, bShow) {
		var table = this.getElementsByTagName("table")[0];
		var tVHead = table._eTVHead;
		var tCHead = table._eTCHead;

		var tVHeadRows = tVHead.getElementsByTagName("table")[0].rows;
		var tCHeadEl = tCHead.getElementsByTagName("table")[0];
		var tCHeadHead = tCHeadEl.rows[0].cells[0];
		var tCHeadHeadColspan = tCHeadHead.colSpan;
		var tCHeadCell = tCHead.getElementsByTagName("table")[0].rows[1].cells[index];
		var tCHeadCell2 = tCHead.getElementsByTagName("table")[0].rows[2].cells[index];
		var tCHeadCellWidth =parseInt(tCHeadCell.style.width, 10);

		//var bShow = (getStyle(tVHeadRows[0].cells[index], "display") === "none");

		each(tVHeadRows, function(n, i) {
			var cell = n.cells[index];
			bShow ? show(cell) : hide(cell);
		});
	
		bShow ? show(tCHeadCell) : hide(tCHeadCell);
		bShow ? show(tCHeadCell2) : hide(tCHeadCell2);

		bShow ? tCHeadHead.colSpan = tCHeadHeadColspan + 1 : 
			tCHeadHead.colSpan =  tCHeadHeadColspan - 1;

		bShow ? tCHeadHead.style.width = (parseInt(tCHeadHead.style.width, 10) + tCHeadCellWidth) + "px": 
			tCHeadHead.style.width = (parseInt(tCHeadHead.offsetWidth, 10) - tCHeadCellWidth) + "px";

		bShow ? tCHeadEl.style.width = (parseInt(tCHeadEl.style.width, 10) + tCHeadCellWidth) + "px": 
			tCHeadEl.style.width = (parseInt(tCHeadEl.offsetWidth, 10) - tCHeadCellWidth) + "px";

	//	console.log(tCHeadHead.style.width);
		flushTable(table);
	}

	/**
	 * 刷新表格尺寸
	 * 以纵向锁定的表头为标准
	 * @private
	 */
	function flushTable(table) {
		var tVHead = table._eTVHead;
		var tHHead = table._eTHHead;
		var tCHead = table._eTCHead;
		var wrapper = table._eWrapper;

		var tVHeadWidth = tVHead.offsetWidth;

		setStyle(tHHead, "left", tVHeadWidth);
		setStyle(tCHead, "width", getInnerWidth(tVHead));
		setStyles(table.parentNode, {
			"left": tVHeadWidth,
			"width": getInnerWidth(wrapper) - tVHeadWidth
		});
	}
	
	/**
	 * DOM加载完毕之后开始渲染
	 */
	dom.ready(function() { 
		var tables = q("ka-table");

		each(tables, function(n, i) {
			var table = n.getElementsByTagName("table")[0];
			var rand =  new Date().getTime();

			//console.time("wrapper");
			table._eWrapper = drawWrapper(table, rand);
			//console.timeEnd("wrapper");

			//console.time("HHead");
			table._eTHHead = drawHHead(table, rand);	
			//console.timeEnd("HHead");

			//console.time("VHead");
			table._eTVHead = drawVHead(table, rand);	
			//console.timeEnd("VHead");

			//console.time("CHead");
			table._eTCHead = drawCHead(table, rand);
			//console.timeEnd("CHead");

			on(n, "scroll", ontablescroll(rand));
			on(table, "click", ontableclick(rand));

			n.toggleVHeadCol = toggleVHeadCol;
			
			//alert(new Date().getTime() - rand);
		});

	});
 })()
