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
	function getInnerHeight(el) {
		var	paddingTop = getStyle(el, "paddingTop").match(/\d+/) || 0,
			paddingBottom = getStyle(el, "paddingBottom").match(/\d+/) || 0,
			borderTopWidth = getStyle(el, "borderTopWidth").match(/\d+/) || 0,
			borderBottomWidth = getStyle(el, "borderBottomWidth").match(/\d+/) || 0;

		return el.offsetHeight
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

		var tWidth = 0;
		each(dummyTrChild, function(n, i) {
			var width = 
				!!n.style.width ? parseInt(n.style.width, 10) : getInnerWidth(n); 
			n.setAttribute("_nWidth", width);
		});
		each(ths, function(n, i) {
			var width = 
				!!n.style.width ? parseInt(n.style.width, 10) : getInnerWidth(n); 
			n.setAttribute("_nWidth", width);
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
		/*	+ "<tr style='visibility:hidden'>" + dummyTr.innerHTML + "</tr>" */
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

		if (trs[0].getElementsByTagName("th").length > 0) {
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
					//i == 0 && (leftDis += parseInt(getStyle(m, "width").match(/\d+/)));

					setStyle(m, "display", "none");
				});

				html += "</tr>";
			});
		} else {
			var noTVHead = true;
		}

		html += "</table></div>";

		insertHTML(table.parentNode, "beforeBegin", html);

		var tVHead = g("ka-tvhead-" + rand);

		//leftDis = tVHead.offsetWidth;
		leftDis = noTVHead ? 0 : tHHead.getElementsByTagName("table")[0].rows[0].cells[0].offsetWidth;

		var tWidth = getInnerWidth(tHHead) - leftDis;
		var bWidth = getInnerWidth(table.parentNode) - leftDis;


		setStyles(table.parentNode, {
			"left": leftDis + "px",
			"width": bWidth + "px"
		});
		setStyle(table, "width", tWidth);

		//setStyle(tVHead, "top", tHHead.offsetHeight);
		setStyle(tVHead, "width", leftDis);
		setStyle(tVHead.getElementsByTagName("table")[0], "width", leftDis);

		setStyles(tHHead, {
			"left": leftDis + "px",
			"width": (tHHead.offsetWidth - tVHead.offsetWidth) + "px"
		});

		tHHead.scrollLeft = leftDis;
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

		var tVHeadEl = tVHead.getElementsByTagName("table")[0]; 
		var tVHeadRows = tVHeadEl.rows;
		var tCHeadEl = tCHead.getElementsByTagName("table")[0];
		var tCHeadHead = tCHeadEl.rows[0].cells[0];
		var tCHeadHeadColspan = tCHeadHead.colSpan;
		var tCHeadCell = tCHead.getElementsByTagName("table")[0].rows[1].cells[index];
		//var tCHeadCell2 = tCHead.getElementsByTagName("table")[0].rows[2].cells[index];
		var tCHeadCellWidth =parseInt(tCHeadCell.style.width, 10);

		var bShow = bShow !== undefined ? bShow : (getStyle(tVHeadRows[0].cells[index], "display") === "none");

		//纵向表头
		each(tVHeadRows, function(n, i) {
			var cell = n.cells[index];
			bShow ? show(cell) : hide(cell);
		});
	
		//左上角表头相关单元格
		bShow ? show(tCHeadCell) : hide(tCHeadCell);
	//	bShow ? show(tCHeadCell2) : hide(tCHeadCell2);

		//左上角表头单元格的colspan
		bShow ? tCHeadHead.colSpan = tCHeadHeadColspan + 1 : 
			tCHeadHead.colSpan =  tCHeadHeadColspan - 1;

		//左上角表头单元格的宽度
		bShow ? tCHeadHead.style.width = (parseInt(tCHeadHead.style.width, 10) + tCHeadCellWidth) + "px": 
			tCHeadHead.style.width = (parseInt(tCHeadHead.style.width, 10) - tCHeadCellWidth) + "px";

		//左上角表头表格的宽度
		bShow ? tCHeadEl.style.width = (parseInt(tCHeadEl.style.width, 10) + tCHeadCellWidth) + "px": 
			tCHeadEl.style.width = (parseInt(tCHeadEl.style.width, 10) - tCHeadCellWidth) + "px";
		//左锁定咧的宽度
		tVHead.style.width 
			= tVHeadEl.style.width 
			= bShow ? (parseInt(tVHead.style.width) + tCHeadCellWidth) + "px":
				(parseInt(tVHead.style.width) - tCHeadCellWidth) + "px";

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
	 * 计算表格宽度
	 */
	function genWidth(table) {
		if (!table.getAttribute("customWidth")) {
			var idx = table.getAttribute("data-idx") || 0,
				ths = table.rows[idx].cells,
				width = 0;
			each(ths, function(n, i) {
				width += !!n.style.width ? parseInt(n.style.width) : n.offsetWidth;		
			});
			width = width + "px";
			table.style.width = width;
		}
		else {
			table.setCustomWidth.call(null, table);
		}
	}
	
	/**
	 * DOM加载完毕之后开始渲染
	 */
	dom.ready(function() { 
		var tables = q("ka-table");

		each(tables, function(n, i) {
			var table = n.getElementsByTagName("table")[0];
			var rand =  new Date().getTime();
			
			genWidth(table);
			table._eWrapper = drawWrapper(table, rand);
			table._eTHHead = drawHHead(table, rand);	
			table._eTVHead = drawVHead(table, rand);	
			table._eTCHead = drawCHead(table, rand);

			on(n, "scroll", ontablescroll(rand));
			on(table, "click", ontableclick(rand));

			n.toggleVHeadCol = toggleVHeadCol;

			n.onTableReady && n.onTableReady.call(n);
			
			//alert(new Date().getTime() - rand);
		});

	});
 })()
