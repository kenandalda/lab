var rigel = window.rigel || {};

rigel.isArray      = baidu.lang.isArray;
rigel.isFunction   = baidu.lang.isFunction;
rigel.isString     = baidu.lang.isString;
rigel.isElement    = baidu.lang.isElement;

rigel.isIE         = baidu.browser.ie;
rigel.isFF        = baidu.browser.firefox;

rigel.g            = baidu.dom.g;
G                  =rigel.g;//兼容以前老code
rigel.domReady     = baidu.dom.ready;
rigel.domQuery		   = baidu.dom.query;

rigel.on          = baidu.event.on;

rigel.emptyFunction = function () {};

rigel.toArray = baidu.lang.toArray;

rigel.string = {
    "format":		baidu.string.format,
    "encodeHTML":	baidu.string.encodeHTML,
    "trim":			baidu.string.trim,
    "toNumber":		function(str) {
    	return parseInt(str) || 0;
    }
};

rigel.array = {
    "indexOf":		baidu.array.indexOf,
    "each":			baidu.array.each
};

rigel.object = {
    "each": baidu.object.each
};

rigel.ajax = {
    "request":		baidu.ajax.request,
    "get":          baidu.ajax.get,
    "post":         baidu.ajax.post,
    "form":         baidu.ajax.form
};

rigel.url = {
    "queryToJson":	baidu.url.queryToJson,
    "jsonToQuery":  baidu.url.jsonToQuery
};

rigel.json = {
    "stringify":	baidu.json.stringify,
    "parse" :		baidu.json.parse
};

rigel.validate = {
    isEMAIL:		function (value) {
	return /^[_\w-]+(\.[_\w-]+)*@([\w-])+(\.[\w-]+)*((\.[\w]{2,})|(\.[\w]{2,}\.[\w]{2,}))$/.test(value);
    },
    
    isURL:			function (value) {
	return /^[^.。，]+(\.[^.，。]+)+$/.test(value); 
    },
    
    isZipCode:      function (value) {
        return /^\d{6}$/.test(value);
    },
    
    isTel:          function (value) {
        return  /^0\d{2,3}-\d{7,8}-\d{0,6}$/.test(value);
    },
    
    isMobile:       function (value) {
        return /^1\d{10}$/.test(value);
    },

    isNumber:       function (value) {
        return /^(?:0|[1-9][0-9]{0,8})$/.test(value);
    },

    isMoney:        function (value) {
        return /^(?:(?:[1-9]\d*)|0)(?:\.\d{1,2})?$/.test(value);
    },

    is24Time:       function (value) {
        return /^(?:[01][0-9]|2[0-3])[：:][0-5][0-9]$/.test(value);
    }
};

rigel.event = {
    on:				baidu.event.on,
    stop:			baidu.event.stop
};

rigel.dom = {
    getChildren:	baidu.dom.children,
    
    insertAfter:	baidu.dom.insertAfter,

    first:          baidu.dom.first,

    last:           baidu.dom.last,

    next:			baidu.dom.next,
    
    getAttr:	    baidu.dom.getAttr,
    
    show:			baidu.dom.show,
    
    hide:			baidu.dom.hide,
    
    addClass:		baidu.dom.addClass,

    removeClass:    baidu.dom.removeClass,
    
    remove:			baidu.dom.remove,
    
    query:			baidu.dom.query,
    
    getAncestorByTag: baidu.dom.getAncestorByTag,
    
    setText:        function (el, text) {
        el[rigel.isFF ? "textContent" : "innerText"] = text;
    },
    
    getText:        function (el) {
        return el[rigel.isFF ? "textContent" : "innerText"];
    },
    create:			baidu.dom.create,
    getEleByClass:  function (cls, parId) {
		var par = lib.G(parId) || document.body,
			className, res = [],
			children = par.getElementsByTagName('*');
		for (var i = 0, child; child = children[i]; i++) {
			className = ' ' + child.className.split(/\s+/).join(' ') + ' ';
			if (className.indexOf(' ' + cls + ' ') >=0 ) {
				res.push(child);
			}
		}
		return res;
    },
    
    getEleByName :	function (name, parId) {
		var ele = [], children;

		parId = rigel.g(parId) || document.body;
		if (parId.nodeName.toLowerCase() == 'form') {
			return parId[name];
		}
		else {
			children = parId.getElementsByTagName('*');
			for (var i = 0, child; child = children[i]; i++) {
				if (child.getAttribute('name') == name) {
					ele.push(child);
				}
			}
			return ele;
		}
    },
    
    createHiddenInput : function (container, includeHidden) {
		var sourceDiv = rigel.g(container);
		var toArray = rigel.toArray;
		if (!sourceDiv) return false;
		var allInputs = [];
		var allInputs1 = toArray(sourceDiv.getElementsByTagName("input"));
		var allInputs2 = toArray(sourceDiv.getElementsByTagName("select"));
		var allInputs3 = toArray(sourceDiv.getElementsByTagName("textarea"));
		allInputs = allInputs.concat(allInputs1, allInputs2, allInputs3);
		var html = [];
		for (var i = 0, tempLen = allInputs.length; i < tempLen; i++) {
			var item = allInputs[i];
			if (item.type == "radio" && ! item.checked) {
				continue;
			}
			if (item.type == "hidden" && ! includeHidden) {
				continue;
			}
			if (item.name.length <= 0) {
				continue;
			}
			html.push('<input type="hidden" name="' + item.name + '" value="' + rigel.string.encodeHTML(item.value) + '" />');
		}
		return html.join("");
    }
};

rigel.form = {
    getForm: function (el) {
		while (el) {
			if (el.tagName == 'FORM') {
			break;
			}
			el = el.parentNode;
			(el.tagName == 'BODY') && (el = null);
		}
		return el;
    }
};

rigel.mod = {};

rigel.mod.initMultiSelect = function (config, level) {
	for (var i = level !== undefined ? level : 0, info; info = config[i]; i++)	{
		// 获得select的DOM对象
		var select = rigel.g(info.id);

		if (info.data)
		{
			// 清空select
			while (select.length > 0) {
				//select.removeChild(select.options[select.length - 1]);
				select.options[select.length - 1] = null;
			}

			for (var idx = 0, map = {}, fix, item; item = info.data[idx] ; idx++) {
				if (item.parentId && (map[item.parentId] || map[item.parentId] == '')) {
					fix = map[item.parentId] + '　';	
				}
				else {
					fix = '';
				}
				map[item.value] = fix;
				select.options[idx] = new Option(fix + item.text, item.value);
			}
		}
		else
		{
			info.data = [];
		}

		// 设置选中项
		if (info.value !== undefined) {
			select.value = info.value;
		}

		// 将一些值带入select作为附加属性
		select.level = i;
		select.config = config;

		// 事件注册
		if (level === undefined) {
		  select._change = select.onchange;
		  select.onchange = rigel.mod.initMultiSelect.change;
		}
	}
};


rigel.mod.initMultiSelect.change = function(force) {
	var me = this;
	if (!me.config[me.level].url || (me._change && me._change() === false)) {
		return;
	}
	// 重置下级的事件和下拉选项值
	for (var i = me.level + 1, info; info = me.config[i]; i++) {
		info.data = [];
	}
	rigel.ajax.get(me.config[me.level].url + me.value, function(xhr, value) {
		var config = rigel.json.parse(value);
		var select = me;
		var o = select.config[select.level + 1];
		o.data = config;
		rigel.mod.initMultiSelect(select.config, select.level + 1);
		info = select.config[select.level + 1];
		(info.url) && (rigel.g(info.id).onchange());
	});
}
