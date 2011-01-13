/**
 * 翻转图片
 */
(function() {
	/**
	 * 获取不同步数对应的旋转参数
	 * @private
	 *
	 * @param {HTMLElement} img 图片元素
	 * @param {String} step 步数(90度的倍数) 
	 * @return {Object} step对应的参数, 其中w,h表示canvas的宽高, rx,ry表示图像对于canvas的偏移
	 */
	function getConfig(img, step) {
		var config = {
			"0" : {"w" : img.width, "h" : img.height, rx : 0, ry: 0},
			"1" : {"w" : img.height, "h" : img.width, rx : 0, ry: -img.height},
			"2" : {"w" : img.width, "h" : img.height, rx : -img.width, ry: -img.height},
			"3" : {"w" : img.height, "h" : img.width, rx : -img.width, ry: 0}
		};
		return config[step];
	}

	/**
	 * 旋转图片
	 * @public
	 *
	 * @param {String|HTMLElement} img 图片元素/id
	 * @param {String} step 步数(90度的倍数) 
	 *
	 * TODO ie8 img外加上div标签
	 */
	this.rotateImage = function(img, step) {
		var img = typeof img === "string" ? baidu.g(img) : img;	
		var ieVersion = baidu.browser.ie;

		if (ieVersion) {
			img.style.filter = 'progid:DXImageTransform.Microsoft.BasicImage(rotation='+ step +')';	
		}
		else {
			var canvas = baidu.g(img.id + "-canvas");
			var context = canvas.getContext("2d");
			var curConfig = getConfig(img, step);

			img.style.position = "absolute";
			img.style.visibility = "hidden";

			canvas.setAttribute("width", curConfig.w);
			canvas.setAttribute("height", curConfig.h);

			context.rotate(90 * step * Math.PI / 180);
			context.drawImage(img, curConfig.rx, curConfig.ry);
		}
	}

	/**
	 * 顺时针旋转, 自动记忆step
	 * @public
	 *
	 * @param {String|HTMLElement} img 图片元素/id
	 */
	this.rotateImageCW = function(img) {
		var img = typeof img === "string" ? baidu.g(img) : img;	
		var step = img.getAttribute("data-step") || 0; 
		step == 3 ? step = 0 : step++;	
		rotateImage(img, step);
		img.setAttribute("data-step", step);
	};

	/**
	 * 逆时针旋转, 自动记忆step
	 * @public
	 *
	 * @param {String|HTMLElement} img 图片元素/id
	 */
	this.rotateImageCCW = function(img) {
		var img = typeof img === "string" ? baidu.g(img) : img;	
		var step = img.getAttribute("data-step") || 0; 
		step == 0 ? step = 3 : step--;	
		rotateImage(img, step);
		img.setAttribute("data-step", step);
	};
})();
