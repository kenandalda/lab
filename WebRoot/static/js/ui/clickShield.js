(function (){
    var core = ecui,
	dom = core.dom,
	ui = core.ui,	
	util = core.util,
	ext = core.ext,
	lib = baidu,

	modalForm,

	$register = core.$register,
	setStyle = dom.setStyle,
    createDom = dom.create,
	removeDom = dom.remove,
	insertBefore = dom.insertBefore,
    attachEvent = util.attachEvent,
	standardEvent = core.event,
	toArray = lib.lang.toArray,
    each = lib.array.each,
    contains = lib.dom.contains,
    ieVersion = lib.browser.ie,

	_mapList = {},
	_unitList = [],
	_controls = {},
	_radioCheckedMap = {},
	_POLLINGTIME = 2000,

	EXT_CLICKSHIELD = ext.clickShield = {},
	EXT_CLICKSHIELD_RULES = ruleMethods = {};

    function getUId(el) {
		var id;
		if (typeof(el) != 'string') {
			(el.getUID) && (id = el.getUID()); 
			(!id) && (id = el.id);
		}
		return id ? id : el;
    }

	function getControl(id) {
		return _controls[id];
	}

    function getUnitListById(id) {
		return _unitList[_mapList[id]];
    }
    
    function wrapper(el, un) {
		var par, mask, next, checked = null;
		if (el.type && (el.type == 'radio' || el.type == 'checkbox')) {
			next = lib.dom.next(el);
			if (next.tagName != 'LABEL' || next.htmlFor != el.id) {
				next = null;
			}
			//IE7及其以下版本checkbox,radio进行DOM操作后checked状态无法保存(会恢复到原始状态)
			//将计就计defaultChecked搞定之
			(ieVersion <= 7) && (el.defaultChecked = el.checked);
		}
		if (un) {
			el.className = el.className.replace(/\s\bdisabled\b/, '');
			par = el.parentNode;
			insertBefore(el, par); //移动元素会导致checked属性回复默认值
			(next) && (insertBefore(next, par));
			removeDom(par);
		}
		else {
			el.className += ' disabled';
			par = createDom('', 'position:relative;display:inline-block', 'span');
			mask = createDom('', 'position:absolute;top:0px;left:0px;_background:#000;_filter:alpha(opacity=0)');
			par.appendChild(mask);
			insertBefore(par, el);
			par.appendChild(el);
			(next) && (par.appendChild(next));
			mask.style.height = par.offsetHeight + 'px';
			mask.style.width = par.offsetWidth + 'px';
		}
    }

	function polling(url, callback) {
		lib.ajax.get(url, function(xht, res) {
			res = eval('(' + lib.string.trim(res) + ')');
			if (res.isOK == 'true') {
				callback.call(null);
			}
			else {
				setTimeout(function (){polling.call(null, url, callback);}, _POLLINGTIME);
			}
		});
	}

	function maskFixed(un) {
		each(
			toArray(document.getElementsByTagName('select')),
			function (n, i) {
				if (un === false && n.getAttribute("data-maskhide") == "true") {
					n.style.visibility = "visible";
					n.removeAttribute("data-maskhide");
				}
				else if (n.style.visibility != "hidden" 
                            && !contains(modalForm.getOuter(), n)) {
					n.setAttribute("data-maskhide", "true");
					n.style.visibility = "hidden";
				}
		});
	}

    function initElement(id, type) {
		var el, ev = 'click';
		if (type == 'control') {
		   el = (typeof(id) == 'string') ? _controls[id] : id;
		   (el.onShieldInit) && (el.onShieldInit());
		}
		else {
			el = (typeof(id) == 'string') ? document.getElementById(id) : id;
			(el.tagName == 'SELECT') && (ev = 'change');
			attachEvent(el, ev, function (e) {
				EXT_CLICKSHIELD.lock(el);
			});
		}
    }

    EXT_CLICKSHIELD.lock = function (id, un) {
		var id = getUId(id),
			list = getUnitListById(id);
			
		if (list.lock === !un) {
			return;
		}
		else {
			list.lock = !un;
		}
		for (var i = 0, item; item = list[i]; i++) {
			EXT_CLICKSHIELD_RULES[item.type + 'Lock'](item.id, un);
		}
    };

    EXT_CLICKSHIELD.unlock = function (id) {
		this.lock(id, true);
    };

    EXT_CLICKSHIELD.register = function (id, type, unitIndex, config) {
		var list, o = {}, obj;
		if (type == 'control') {
			obj = (typeof(id) == 'string') ? core.get(id) : id;	
		}
		id = getUId(id);
		if (unitIndex || unitIndex == 0) {
			list = _unitList[unitIndex];
		}
		else {
			list = [];
			list.lock = false;
			_unitList.push(list);
			unitIndex = _unitList.length - 1;
		}
		o.id = id; 
		o.type = type;
		list.push(o);
		if (type == 'control') {
			_controls[id] = obj;
		}
		_mapList[id] = unitIndex;
		return unitIndex;
    };

    EXT_CLICKSHIELD.auto = function (id, type, unitIndex, config) {
		var idx = EXT_CLICKSHIELD.register(id, type, unitIndex, config);
		initElement(id, type);
		return idx;
    };

    EXT_CLICKSHIELD.load = function (list, unitIndex) {
		for (var i = 0, item; item = list[i]; i++) {
			unitIndex = EXT_CLICKSHIELD.register(item.id, item.type, unitIndex);
		}
		return unitIndex;
    };
    
    EXT_CLICKSHIELD_RULES.simpleLock = function (id, un) {
		var el = document.getElementById(id),
			tag = el.tagName;
		if (tag == 'INPUT' && 'submit|button'.indexOf(el.type.toLowerCase()) >= 0) {
			el.disabled = !(un == true);
		}
		else if (ieVersion <= 6 && tag == "SELECT") {
			if (un) {
				setStyle(el, 'visibility', 'visible');
			}
			else {
				setStyle(el, 'visibility', 'hidden');
			}
		}
		else {
			wrapper(el, un);
		}
    };

    EXT_CLICKSHIELD_RULES.controlLock = function (id, un) {
		var control = _controls[id];
		if (un) {
			(control.unlock) && (control.unlock());
		}
		else {
			(control.lock) && (control.lock());
		}
    };

    EXT_CLICKSHIELD_RULES.downloadLock = function (id, un) {
		var el;
		if (!modalForm) {
			el = createDom('floater', 'width:200px;height:50px;position:absolute');
			el.innerHTML = '<label>提示</label><div class="floater-content"><div class="floater-inner">正在下载，请稍候...</div></div>';
			document.body.appendChild(el);
			modalForm = ecui.create('form', {'element':el});
			modalForm.$getSection('Close').hide();
		}
		if (un) {
			modalForm.hide();
		}
		else {
			modalForm.showModal();
			modalForm.center();
			(ieVersion < 7) && (maskFixed());
		}
		el = document.getElementById(id).getAttribute('rel');
		if (!el || un) {
			return;
		}
		setTimeout(function (){polling.call(null, el, function (){EXT_CLICKSHIELD.unlock(id);});}, _POLLINGTIME);	
    };

    $register('shield', function (el, params) {
		var pars, idx;
		params.replace(/([A-Za-z0-9\-]+)\s*\(\s*([^)]+)\)/, function ($0, $1, $2){
			pars = $2.split(/\s+/);
			idx = _mapList[pars[0]];
			if(pars[1] == 'true') {
				idx = EXT_CLICKSHIELD.auto(el, $1, idx);
			}
			else {
				idx = EXT_CLICKSHIELD.register(el, $1, idx);
			}
			(!_mapList[pars[0]]) && (_mapList[pars[0]] = idx);
		});
    });

	(rigel) && (rigel.clickShield = EXT_CLICKSHIELD);

})();
