/*
 * asynMgr
 * Copyright 2010 Baidu Inc. All rights reserved.
 * 
 * path:    asynMgr.js
 * desc:    asynMgr是用于管理局部刷新情况下页面状态的保存
 * author:  lim
 */

var asynMgr = function () {
    /*
     * 预声明
     */
    var config_ = {             // 声明配置
            CONTROL_IFRAME_ID   : 'iframeRecorder',
            CONTROL_IFRAME_URL  : '',
            CONTROL_Input_ID    : 'inputRecorder',
            URL_STORAGE_LENGTH  : 2083,
            SERVER_GETTER_URL   : '',
            SERVER_SETTER_URL   : ''
        },
        asynRelation_ = [],     // 多组异步刷新时存在关系的元素
        repaintByMe_ = false,   // 是否需要异步管理回填状态和请求表格数据
        
        dataStorage_,           // 数据存储管理
        urlDataStorage_,        // URL方式存储
        serverDataStorage_,     // 服务器方式存储
        areaStateMgr_,          // 区域状态管理(获取状态-get，回填状态-set)
        formAreaStateMgr_;      // 表单区域状态管理
    
    /**
     * 数据存储管理模块
     * 
     * @desc
     *  分配给具体的存储模块存储数据
     */
    dataStorage_ = function () {

        /**
         * 存储数据
         * 
         * @public
         * @param {String|Object} data 需要存储的数据
         * @param {Object} options 附加参数
         * @      {String} mode = "url" 需要采用何种存储模式，默认为url方式存储，还有:server等
         * @      {Number} duration = 86400 需要保存多长时间，默认存储一天(某些存储方式需要，如server)
         * @      {Boolean} replace = false url存储方式，替换还是新增历史
         * @return {String|Boolean} 存储成功返回存储id，失败返回false
         */
        function saveData(data, options) {
            options = options ? options : {};

            var result = false,
                mode = options['mode'] || 'url';
                dataForStorage = {
                    id   : (Math.random() + '').substring(5, 13),
                    data : data
                };

            options['mode'] = options['mode'] || 'url';
            options['duration'] = options['duration'] || 86400;
            options['replace'] = options['replace'] === true ? true : false;

            try {
                result = eval(mode + 'DataStorage_').saveData(dataForStorage, options);
            } catch(e) {}

            return result;
        }

        /**
         * 获取存储过的数据
         * 
         * @public
         * @param {String} id 数据存储的标识
         * @param {String} mode = "url" 从何种存储模式中获得数据，默认为url方式
         * @param {null|String|Array} key
         *        null时返回该id对应的所有内容
         *        String时返回该key对应的数据
         *        Array时该组key对应的数据
         * @return {Object|String}
         */
        function getData(id, mode, key) {
            var result = rigel.isString(key) ? '' : {};
            mode = mode || 'url';

            try {
                result = eval(mode + 'DataStorage_').getData(id, mode, key);
            } catch(e) {}

            return result;
        }

        /**
         * 通过URL方式获取存储过的数据
         * 
         * @public
         * @param {null|String|Array} key
         *        null时返回该id对应的所有内
         *        String时返回该key对应的数据
         *        Array时返回该组key对应的数据
         * @return {Object|String}
         */
        function getDataByUrl(key) {
            return dataStorage_.getData('', null, key);
        }

        /**
         * 通过URL方式存储数据
         * 
         * @public
         * @param {String|Object} data 需要存储的数据
         * @param {String} replace 是否替换
         * @return {String|Boolean} 存储成功返回存储id，失败返回false
         */
        function saveDataByUrl(data, replace) {
            var options = {
                mode : 'url',
                replace : replace === true ? true : false
            };

            return dataStorage_.saveData(data, options);
        }

        /**
         * 根据制定key获得相应的数据
         * 
         * @public
         * @param {Object} data 数据对象
         * @param {null|String|Array} key
         *        null时返回该id对应的所有内
         *        String时返回该key对应的数据
         *        Array时返回该组key对应的数据
         * @return {Object|String}
         */
        function getSpecifyData(data, key) {
            var result = rigel.isString(key) ? '' : {};

            // 根据key参数返回具体的值
            if (rigel.isString(key)) {
                result = data['data'][key] || '';
            }
            else if (rigel.isArray(key)) {
                for (var i = 0, len = key.length; i < len; i++) {
                    var item = key[i];
                    result[item] = data['data'][item];
                }
            }
            else {
                result = data;
            }
            return result;
        }

        // 返回暴露的方法
        return {
            'saveData'        : saveData,
            'getData'         : getData,
            'getDataByUrl'    : getDataByUrl,
            'saveDataByUrl'   : saveDataByUrl,
            'getSpecifyData'  : getSpecifyData
        };
    }();

    /**
     * URL方式存储模块
     * 
     * @desc
     */
    urlDataStorage_ = function () {
        var enabled_           = false,       // 当前的历史状态轮询标识
            shouldEnable_      = false,       // only for IE
            docLoaded_         = false,       // only for IE document是否完成加载
            lastToken_         = '',          // 上一次保存的token
            timer_             = null,        // 轮询timer标识
            unsetIframe_       = true,        // iframe是否进行过状态设置
            hiddenIframe_, hiddenInput_,
            iframeSrc_         = config_.CONTROL_IFRAME_URL,
            baseUrl_           = window.location.href.split('#')[0] + '#',
            onHashChange_      = function(e) {
                var hash = getHash_(window);
                update_(hash);
            };

        var HAS_ONHASHCHANGE_  =  rigel.isIE && document.documentMode >= 8,
            INPUT_TEMPLATE_    = '<input type="text" name="#{0}" id="#{1}" style="display:none" />',
            IFRAME_TEMPLATE_   = '<iframe id="#{0}" style="display:none" #{1}></iframe>';

        /**
         * 创建或获得用于记录历史状态的iframe
         * @param @param {Element} iframeInPage 直接写在页面中的iframe元素
         * @param @return {Element}
         * @private
         */
        function initRecorderIframe_(iframeInPage) {
            if (HAS_ONHASHCHANGE_) {
                return null;
            }
            if (iframeInPage) {
                hiddenIframe_ = iframeInPage;
            }
            else {
                if (rigel.isIE && !iframeSrc_) {
                    iframeSrc_ = window.location.protocol == 'https' ? 'https:///' : 'javascript:""';
                }
                var srcAttribute = iframeSrc_ ? 'src="' + rigel.string.encodeHTML(iframeSrc_) + '"' : '',
                    iframeId     = config_.CONTROL_IFRAME_ID;

                document.write(rigel.string.format(IFRAME_TEMPLATE_, iframeId, srcAttribute));
                hiddenIframe_  = rigel.g(iframeId);
            }
            return hiddenIframe_;
        }

        /**
         * 创建或获得用于记录历史状态的Input
         * @param @param {Element} inputInPage 直接写在页面中的input元素
         * @param @return {Element}
         * @private
         */
        function initRecorderInput_(inputInPage) {
            if (inputInPage) {
                hiddenInput_ = inputInPage;
            }
            else {
                var inputId = config_.CONTROL_Input_ID;
                document.write(rigel.string.format(INPUT_TEMPLATE_, inputId, inputId));
                hiddenInput_ = rigel.g(inputId);
            }
            return hiddenInput_;
        }

        /**
         * URL存储方式初始化函数
         * @param @param {Element} inputInPage 直接写在页面中的input元素
         * @param @return {Element} iframeInPage 直接写在页面中的iframe元素
         * @public
         */
        function init(inputInPage, iframeInPage) {
            // 初始化Input
            initRecorderInput_(inputInPage);
            // 初始化Iframe
            initRecorderIframe_(iframeInPage);

            // IE 浏览器依赖input存储的值来恢复历史状态
            // input只有在页面加载完时才会被填入
            if (rigel.isIE && !HAS_ONHASHCHANGE_) {
                rigel.domReady(function() {
                    docLoaded_ = true;
                    if (hiddenInput_.value) {
                        setIframeToken_(hiddenInput_.value, true);
                    }
                    setEnabled(shouldEnable_);
                });
            }

            // 设置初始的历史状态
            setHash_(getToken(), true);

            // 开启轮询
            setEnabled(true);
        }

        /**
         * 设置开始或者停止历史状态变化轮询
         * @param {Boolean} enabled 开始或停止轮询
         *
         */
        function setEnabled(enabled) {
            if (enabled == enabled_) {
                return;
            }

            // IE下需等到页面加载完后开始轮询，否则会丢失上一次的状态
            if (rigel.isIE && !HAS_ONHASHCHANGE_ && !docLoaded_) {
                shouldEnable_ = enabled;
                return;
            }

            if (enabled) {
                if (HAS_ONHASHCHANGE_) {
                    baidu.on(window, 'hashchange', onHashChange_);
                }
                else if (!rigel.isIE || docLoaded_) {
                    lastToken_ = !rigel.isIE ? getToken() : lastToken_;
                    //开启轮询
                    timer_ = setInterval(poll_, 150);
                }
                enabled_ = true;
                // 执行页面，前进,后退,浏览回调，传入当前token
                if (arguments.callee.hasCalled) {
                    window.navCallback_ && window.navCallback_(getToken());
                }
                else {
                    arguments.callee.hasCalled = true;
                }
            }
            else {
                enabled_ = false;
                baidu.un(window, 'hashchange', onHashChange_);
                clearInterval(timer_);
            }
        }

        /**
         * 根据给定的值，更新当前历史状态。location改变时或轮询发现iframe状态改变时，触发
         * @param {string} token 新的历史状态
         *
         */
        function update_(token) {
            // 更新input和上一次token值
            lastToken_ = hiddenInput_.value = token;

            setHash_(token);

            // 设置历史状态
            if (rigel.isIE && !HAS_ONHASHCHANGE_) {
                setIframeToken_(token);
            }

            // 执行页面，前进,后退,浏览回调，传入当前token
            if (arguments.callee.hasCalled) {
                    window.navCallback_ && window.navCallback_(getToken());
            }
            else {
                arguments.callee.hasCalled = true;
            }
        }

        /**
         * 历史状态变化轮询函数
         * @param {Boolean} enabled 开始或停止轮询
         *
         */
        function poll_() {
            var hash = getHash_(window);
            //console.log(hash + "----" + lastToken_);
            if (hash != lastToken_) {
                update_(hash);
            }

            //IE下使用iframe来添加历史记录
            if (rigel.isIE && !HAS_ONHASHCHANGE_) {
                var token = getIframeToken_() || '';
                //console.log(token + "----" + lastToken_);
                if (token != lastToken_) {
                    update_(token);
                }
            }
        }

        /**
         * 获得历史状态
         * @return {String} token值
         *
         */
        function getToken() {
            return getHash_(window);
        }

        /**
         * 从Hash中获得历史状态
         * @return {String} token值
         *
         */
        function getHash_(w) {
             var loc = w.location.href;
             var index = loc.indexOf('#');
             return index < 0 ? '' : loc.substring(index + 1);
        }

        /**
         * 从Iframe中获得历史状态
         * @return {String} token值
         *
         */
        function getIframeToken_() {
            var iframeWindow = hiddenIframe_.contentWindow;
            if (rigel.isIE) {
                var doc = iframeWindow.document;
                return doc.body ? decodeURIComponent(doc.body.innerHTML) : '';
            }
            else {
                if (iframeWindow) {
                    var hash;
                    try {
                        // Iframe tokens are urlEncoded
                        hash = decodeURIComponent(getHash_(iframeWindow));
                    } catch (e) {}
                    return hash || '';
                } else {
                    return '';
                }
            }
        }

        /**
         * 设置历史状态
         * @param {String} token 新的历史状态
         * @param {String} title IE下设置iframe的title
         *
         */
        function setToken(token, title) {
            setHistoryState_(token, false, title);
        }

        /**
         * 更新当前历史状态而不添加新的历史记录
         * @param {String} token 新的历史状态
         * @param {String} title IE下设置iframe的title
         *
         */
        function replaceToken(token, title) {
            setHistoryState_(token, true, title);
        }

        /**
         * 设置历史状态(允许两种方式：1）新增 2）替换)
         * @param {String} token 历史状态
         * @param {Boolean} replace 是否替换
         * @param {String} title IE下设置iframe的title
         *
         */
        function setHistoryState_(token, replace, title) {
            if (getToken() != token) {
                setHash_(token, replace);
                if (!HAS_ONHASHCHANGE_) {
                    if (rigel.isIE) {
                        // IE must save state using the iframe.
                        setIframeToken_(token, replace, title);
                    }
                    if (enabled_) {
                        poll_();
                    }
                }
            }
        }

        /**
         * 在当前页面中记录hash值
         * @param {String} hash 历史状态
         * @param {Boolean} replace 是否替换
         *
         */
        function setHash_(hash, replace) {
            var url = baseUrl_ + (hash || ''),
                loc = window.location;
            if (url != loc.href) {
              if (replace) {
                loc.replace(url);
              } else {
                loc.href = url;
              }
            }
        }

        /**
         * 隐藏的iframe中记录token值
         * @param {String} token 历史状态
         * @param {Boolean} replace 是否替换
         * @param {String} title IE下设置iframe的title
         */
        function setIframeToken_(token, replace, title) {

            if (unsetIframe_ || token != getIframeToken_()) {
              unsetIframe_ = false;
              token = encodeURIComponent(token);
              var iframeWindow = hiddenIframe_.contentWindow;
        
              if (rigel.isIE) {
                var doc = iframeWindow.document;
                title = rigel.string.encodeHTML(title || window.document.title);

                doc.open('text/html', replace ? 'replace' : undefined);
                doc.write('<title>' + title + '</title><body>' + token + '</body>');
                doc.close();
              }
              else {
                var url = iframeSrc_ + '#' + token;
        
                if (iframeWindow) {
                  if (replace) {
                    iframeWindow.location.replace(url);
                  } else {
                    iframeWindow.location.href = url;
                  }
                }
              }
            }
        }

        /**
         * 存储数据
         * 
         * @public
         * @param {Object} data 需要存储的数据
         * @param {Object} options 附加参数
         * @      {Boolean} replace = false url存储方式，替换还是新增历史
         * @return {String|Boolean} 存储成功返回存储id，失败返回false
         */
        function saveData(data, options) {
            var replace = options['replace'] === true ? true : false;

            // 为data添加存储模式和次数
            var storedData = dataStorage_.getDataByUrl(),
                count = storedData['count'] || 0;

            if (rigel.json.stringify(storedData['data']) == rigel.json.stringify(data['data'])) {
                return false;
            }

            data['mode'] = 'url';
            count++;
            data['count'] = count;

            // 数据转化成url是否超长，超长则转为server存储
            var strData = rigel.json.stringify(data);
            var url = baseUrl_ + strData;

            if (url.length > config_.URL_STORAGE_LENGTH) {
                data['mode'] = 'server';
                serverDataStorage_.saveData(data, {mode : 'server'});

                delete data['data'];
                strData = rigel.json.stringify(data);
            }

            setToken(strData, replace);

            return data['id'];
        }

        /**
         * 获取存储过的数据
         *
         * @desc 参数/返回与dataStorage_的getData一致
         * @public
         */
        function getData(id, mode, key) {
            var result = rigel.isString(key) ? '' : {},
                storedDataStr = getToken(),
                storedDataObj = {};

            if (!storedDataStr) return result;

            storedDataStr = rigel.isIE ? storedDataStr : decodeURIComponent(storedDataStr);
            storedDataObj = rigel.json.parse(storedDataStr) || {};

            // 因为数据长存储到后端的情况
            if (storedDataObj['mode'] == 'server') {
                id = storedDataObj['id'];
                return serverDataStorage_.getData(id, 'server', key);
            }

            result = dataStorage_.getSpecifyData(storedDataObj, key);

            return result;
        }

        // 返回暴露的方法
        return {
            'init'           : init,
            'getToken'       : getToken,
            'setToken'       : setToken,
            'setEnabled'     : setEnabled,
            'replaceToken'   : replaceToken,
            'saveData'       : saveData,
            'getData'        : getData
        };
    }();

    /**
     * server方式数据存储模块
     * 
     * @desc
     */
    serverDataStorage_ = function () {
        /**
         * 存储数据
         * 
         * @public
         * @param {Object} data 需要存储的数据
         * @param {Object} options 附加参数
         * @      {Number} duration = 86400 需要保存多长时间，默认存储一天(某些存储方式需要，如server)
         * @return {String|Boolean} 存储成功返回存储id，失败返回false
         */
        function saveData(data, options) {
            data['mode'] = 'server';

            var id = data['id'],
                duration = options['duration'] ? options['duration'] : 86400,
                strData = encodeURIComponent(rigel.json.stringify(data)),
                params = 'id=' + id + '&data=' + strData + '&duration=' + duration;

            rigel.ajax.request(config_.SERVER_SETTER_URL, {
                method    : 'POST', 
                async     : false,
                noCache   : true,
                data      : params
            });
        }
        
        /**
         * 获取存储过的数据
         * @desc 参数/返回与dataStorage_的getData一致
         * 
         * @public
         */
        function getData(id, mode, key) {
            var result = baidu.isString(key) ? '' : {},
                params = 'id=' + id;

            rigel.ajax.request(config_.SERVER_SETTER_URL, {
                method    : 'GET', 
                async     : false,
                noCache   : false,
                data      : params,
                onsuccess : function(xhr, responseText) {
                    var data = rigel.json.parse(responseText) || {};
                    result = dataStorage_.getSpecifyData(data, key);
                }
            });
            return result;
        }

        // 返回暴露的方法
        return {
            'saveData'        : saveData,
            'getData'         : getData
        };
    }();

    /**
     * 区域状态管理模块
     * 
     * @desc 管理不同类型区域(表单，显示方式)获取状态，回填状态的方法
     */
    areaStateMgr_ = function () {
        /**
         * 回填状态
         * 
         * @public
         * @param {String} id 区域对应元素的ID
         * @param {String} stateData 具体的状态信息
         * @param {String} type = "form" 指定具体的类型区域，默认为form
         */
        function set(id, stateData, type) {
            type = type || 'form';

            try {
                eval(type + 'AreaStateMgr_').set(id, stateData);
            } catch(e) {}
        }
        
        /**
         * 获得状态
         * 
         * @public
         * @param {String} id 区域对应元素的ID
         * @param {String} type = "form" 指定具体的类型区域，默认为form
         * @return {Object|String}
         */
        function get(id, type) {
            type = type || 'form';
            var ret = '';

            try {
                ret = eval(type + 'AreaStateMgr_').get(id);
            } catch(e) {}
            return ret;
        }

        // 返回暴露的方法
        return {
            'get'        : get,
            'set'        : set
        };
    }();

    /**
     * 表单区域状态管理模块
     * 
     * @desc 提供表单区域获取状态，回填状态的方法
     */
    formAreaStateMgr_ = function () {
        /**
         * 回填状态
         * 
         * @public
         * @param {String} id 区域对应元素的ID
         * @param {String} stateData 具体的状态信息
         */
        function set(id, stateData) {
            // url2json
            var queryObj    = rigel.url.queryToJson(stateData),
                form        = rigel.g(id),
                item, oItem, i, len, opts,
                itemName, itemType, itemValue,
                itemArr, itemValueArr;

            queryObj = decodeKeywordInJson_(queryObj);

            // 遍历queryObj回填状态
            for (itemName in queryObj) {
                item = form[itemName.replace(/_$/, '')]; // 需要对后端屏蔽的数据恢复

                // 处理：存在对应状态的表单项
                if (item) {
                    itemValue = queryObj[itemName];
                    itemArr = item['nodeType'] == 1 ? [item] : item;
                    itemValueArr = rigel.isArray(itemValue) ? itemValue : [itemValue];
                    itemType = itemArr[0].type;

                    switch (itemType) {
                    case 'textarea':
                    case 'text':
                    case 'password':
                    case 'hidden':
                    case 'select-one':
                        for (i = 0, len = itemValueArr.length; i < len; i++) {
                            if (!itemArr[i]) continue;
                            itemArr[i].value = itemValueArr[i];
                        }
                        break;
                    case 'radio':
                        for(i = 0, len = itemArr.length; i < len; i++) {
                            if (itemArr[i].value == itemValueArr[0]) {
                                itemArr[i].checked = true;
                                break;
                            }
                        }
                        break;
                    case 'checkbox':
                        for(i = 0, len = itemArr.length; i < len; i++) {
                            if (rigel.array.indexOf(itemValueArr, itemArr[i].value) != -1) {
                                itemArr[i].checked = true;
                            }
                            else {
                                itemArr[i].checked = false;
                            }
                        }
                        break;
                        
                    // 多行选中select
                    case 'select-multiple':
                        opts = itemArr[0].options;
                        len = opts.length;
                        for (i = 0; i < len; i++) {
                            oItem = opts[i];
                            if (rigel.array.indexOf(itemValueArr, oItem.value) != -1) {
                                oItem.selected = true;
                            }
                            else {
                                oItem.selected = false;
                            }
                        }
                        break;
                    default :
                        break;
                    }
                }
            }
            form['onSetting'] && form['onSetting'](queryObj);
            form = null;
        }
        
        /**
         * 获得状态
         * 
         * @public
         * @param {String} id 区域对应元素的ID
         * @return {Object|String}
         */
        function get(id) {
            var form        = rigel.g(id),
                elements    = form.elements,
                len         = elements.length,
                replacer    = function (value, name) {
                    return value;
                },
                data = [],
                i, item, itemType, itemName, itemValue, 
                opts, oi, oLen, oItem;
                
            /**
             * 向缓冲区添加参数数据
             * @private
             */
            function addData(name, value) {
                value = encodeKeyword_ ? encodeKeyword_(value) : value;
                data.push(name + '=' + value);
            }
            
            for (i = 0; i < len; i++) {
                item = elements[i];
                itemName = item.name;
                dataShield = item.getAttribute('data-shield');
                
                // 处理：可用并包含表单name的表单项
                if (!item.disabled && itemName) {
                    itemType = item.type;
                    itemValue = item.value;
                    itemName = dataShield ? itemName + '_' : itemName; // 需要对后端屏蔽的数据添加_
                
                    switch (itemType) {
                    // radio和checkbox被选中时，拼装queryString数据
                    case 'radio':
                    case 'checkbox':
                        if (!item.checked) {
                            break;
                        }
                        
                    // 默认类型，拼装queryString数据
                    case 'textarea':
                    case 'text':
                    case 'password':
                    case 'hidden':
                    case 'select-one':
                        addData(itemName, replacer(itemValue, itemName));
                        break;
                        
                    // 多行选中select，拼装所有选中的数据
                    case 'select-multiple':
                        opts = item.options;
                        oLen = opts.length;
                        for (oi = 0; oi < oLen; oi++) {
                            oItem = opts[oi];
                            if (oItem.selected) {
                                addData(itemName, replacer(oItem.value, itemName));
                            }
                        }
                        break;
                    default :
                        break;
                    }
                }
            }
            form = null;
            return data.join('&');
        }

        /**
         * 对数据中存在的特殊字符进行编码
         * & 转成 ~1~
         * = 转成 ~2~
         *
         * @param {String}  data 需要转码的数据
         * @return {String}
         * @public
         */
        function encodeKeyword_(data) {
            data = data || '';
            data = data.replace(/\&/g, '~1~');
            data = data.replace(/\=/g, '~2~');
            return data;
        }

        /**
         * 对数据中存在的特殊字符进行反转
         * ~1~ 转成 & 
         * ~2~ 转成 =
         *
         * @param {String}  data 需要反转的数据
         * @return {String}
         * @public
         */
        function decodeKeyword_(data) {
            data = data || '';
            data = data.replace(/\~1\~/g, '&');
            data = data.replace(/\~2\~/g, '=');
            return data;
        }

        /**
         * 对queryJson中存在的特殊字符进行反转
         * ~1~ 转成 & 
         * ~2~ 转成 =
         *
         * @param {Object} queryJson query类型Json
         * @param {Object}
         * @public
         */
        function decodeKeywordInJson_(queryJson) {
            var retJson = {},
                name, value, i, len;
            for (name in queryJson) {
                value = queryJson[name];
                if (rigel.isString(value)) {
                    value = decodeKeyword_(value);
                }
                else {
                    for (i = 0, len = value.length; i < len; i++) {
                        value[i] = decodeKeyword_(value[i]);
                    }
                }
                retJson[name] = value;
            }
            return retJson;
        }


        // 返回暴露的方法
        return {
            'get'        : get,
            'set'        : set
        };
    }();

    /**
     * 刷选区域状态管理模块
     * 
     * @desc 提供条件刷选区域获取状态，回填状态的方法
     */
    filterAreaStateMgr_ = function () {
        /**
         * 回填状态
         * 
         * @public
         * @param {String} id 区域对应元素的ID
         * @param {String} stateData 具体的状态信息
         */
        function set(id, stateData) {
            var filterAreaEl = rigel.g(id),
                itemEls      = filterAreaEl.getElementsByTagName('input'),
                i, len, itemEl, value;

            value = stateData.split('=')[1];

            for (i = 0, len = itemEls.length; i < len; i++) {
                itemEl = itemEls[i];
                if (itemEl.value == value) {
                    itemEl.checked = true;
                    break;
                }
            }
        }
        
        /**
         * 获得状态
         * 
         * @public
         * @param {String} id 区域对应元素的ID
         * @return {Object|String}
         */
        function get(id) {
            var filterAreaEl = rigel.g(id),
                itemEls      = filterAreaEl.getElementsByTagName('input'),
                i, len, itemEl, ret, name, value;

            for (i = 0, len = itemEls.length; i < len; i++) {
                itemEl = itemEls[i];
                if (itemEl.checked) {
                    name = itemEl.name;
                    value = itemEl.value;
                    ret = name + "=" + value;
                    break;
                }
            }
            return ret;
        }

        // 返回暴露的方法
        return {
            'get'        : get,
            'set'        : set
        };
    }();

    /**
     * 将对象格式Query数据转化成URL形式
     *
     * @param {Object} objQueryData 
     * @return {String}
     * @public
     */
    function convertToUrl(objQueryData) {
        var ret = [],
            retStr, dataStr;
        for (var o in objQueryData) {
            dataStr = objQueryData[o];
            if (dataStr) {
                dataStr = dataStr.replace(/&?[^&=]+_=[^&=]*/g, "").replace(/^&/, ""); // 去除对后端屏蔽的数据
                dataStr = dataStr.replace(/\&/g, '(*1*)').replace(/\=/g, '(*2*)');
                dataStr = dataStr.replace(/\~1\~/g, '&').replace(/\~2\~/g, '=');
                dataStr = encodeURIComponent(dataStr);
                dataStr = dataStr.replace(/\(\*1\*\)/g, '&').replace(/\(\*2\*\)/g, '=');
                ret.push(dataStr);
            }
        }
        retStr = ret.join('&');
        return retStr;
    }

    /**
     * 异步管理是否开启状态
     *
     * @return {Boolean} 异步管理是否处于可用状态
     * @public
     */
    function isOn_() {
        return getAsynRelation_().length > 0;
    }

    /**
     * 是否有存储过数据
     *
     * @return {Boolean} 异步管理是否有存储过数据
     * @public
     */
    function hasStore_() {
        return !!dataStorage_.getDataByUrl()['id'];
    }

    /**
     * 是否由异步管理回填状态和刷新表格
     * @param {Boolean}
     * @public
     */
    function setRepaintByMe(state) {
        repaintByMe_ = state;
    }

    /**
     * 是否由异步管理回填状态和刷新表格
     * @return {Boolean} 
     * @public
     */
    function getRepaintByMe() {
        return repaintByMe_;
    }

    /**
     * 获取异步关系
     *
     * @param {null|String} stateAreaId 空时获得所有关系，制定stateAreaId时获取所在组的关系 
     * @return {Array} 异步关系
     * @public
     */
    function getAsynRelation_(stateAreaId) {
        var i = 0,
            len = asynRelation_.length;
        if (!stateAreaId) {
            return asynRelation_;
        }

        // 遍历asynRelation_
        for (; i < len; i++) {
            var relationItem = asynRelation_[i];
            for (var j = 0; j < relationItem.length; j++) {
                var areaItem = relationItem[j];
                if (areaItem['id'] === stateAreaId) {
                    return relationItem;
                }
            }
        }

        return [];
    }

    /**
     * 初始化配置的异步关系列表
     *
     * @return {Array} eg: [[{id : "fm1", type, "form"}, {id : "tb1", type : "table"}],...]
     * @public
     */
    function initAsynRelation_() {
        // 遍历asynRelation_
        var i = 0,
            len = asynRelation_.length,
            tempArr = [];
        for (; i < len; i++) {
            var relationItem = asynRelation_[i];
            tempArr[i] = [];
            for (var j = 0; j < relationItem.length; j++) {
                tempArr[i][j] = {};
                var areaItem = relationItem[j];
                var areaItemArr = areaItem.split('#');
                tempArr[i][j]['type'] = areaItemArr[0];
                tempArr[i][j]['id'] = areaItemArr[1];
            }
        }
        asynRelation_ = tempArr;
    }

    /**
     * 根据条件刷新具体的表格数据
     *
     * @param {String} stateAreaId 触发更新状态区域的标识
     * @public
     */
    function repaintTable(stateAreaId) {
        // 获得异步关系
        var curAreaId = stateAreaId,
            curAreaType = '',
            relation = getAsynRelation_(curAreaId),
            tableAreaId = '',
            otherAreaIdList = [];                    // 除表格及当前触发区域外的其它区域标识

        // 获得表格标识，当前触发区ID、类型
        for (var i = 0, len = relation.length; i < len; i++) {
            var item = relation[i];
            if ( item['id'] == curAreaId) {
                curAreaType = item['type'];
            }
            else if ( item['type'] == 'table') {
                tableAreaId = item['id'];
            }
            else {
                otherAreaIdList.push(item['id']);
            }
        }

        var curAreaStateData = areaStateMgr_.get(curAreaId, curAreaType),        // 当前区域状态数据
            areaStateData = dataStorage_.getDataByUrl(otherAreaIdList);          // 其它关联区域存储过的数据

        areaStateData[curAreaId] = curAreaStateData;
        
        // 调用表格更新接口，更新数据
        var tbControl = ecui.get(tableAreaId);
        tbControl && tbControl.asynQuery(areaStateData);
    }

    /**
     * 刷新页面中的所有表格
     *
     * @public
     */
    function repaintTables() {
        if (!hasStore_()) {
            return;
        }
        var relation = getAsynRelation_(),
            item, itemRelation, hasTb, i, iLen, j, jLen,
            id, type, tbId, areaIdList, areaStateData;

        for (i = 0, iLen = relation.length; i < iLen; i++) {
            itemRelation = relation[i];
            hasTb = false;
            areaIdList = [];
            for (j = 0, jLen = itemRelation.length; j < jLen; j++) {
                item = itemRelation[j];
                id = item['id'];
                type = item['type'];
                if (type == 'table') {
                    hasTb = true;
                    tbId = id;
                }
                areaIdList.push(id);
            }
            if (hasTb) {
                areaStateData = dataStorage_.getDataByUrl(areaIdList);
                tbControl = ecui.get(tbId);
                tbControl && tbControl.recover(areaStateData);
            }
        }
    }

    /**
     * 获得数据
     *
     * @param {String} stateAreaId 状态区域Id
     * @return {Object}
     * @public
     */
    function getCurState(stateAreaId) {
        var relation = getAsynRelation_(stateAreaId),
            areaIdList = [];

        // 获得表格标识，当前触发区ID、类型
        for (var i = 0, len = relation.length; i < len; i++) {
            areaIdList.push(relation[i]['id']);
        }

        //console.log("-----------------get--------------");
        //console.dir(dataStorage_.getDataByUrl(areaIdList));
        //console.log("-----------------get--------------");
        return dataStorage_.getDataByUrl(areaIdList);
    }

    /**
     * 更新状态数据
     *
     * @param {Object} data 需要存储的数据
     * @return {String|Boolean} 存储成功返回存储id，失败返回false
     * @public
     */
    function updateStateData(data, replace) {
        var ret = false;
        // 获得已有的状态数据，解析成对象形式
        //console.log("-----------------set--------------");
        //console.dir(data);
        //console.log("-----------------set--------------");
        if (rigel.json.stringify(data) == '{}') {
            return ret;
        }

        var historyStateData = dataStorage_.getDataByUrl(),
            stateData = historyStateData['data'] || {};

        // 根据data更新已有的状态对象
        for (var key in data) {
            stateData[key] = data[key];
        }

        // 更新状态数据，返回存储情况
        setRepaintByMe(false);
        ret = dataStorage_.saveDataByUrl(stateData, replace);
        return ret;
    }
    
    /**
     * 根据存储的状态回填数据，如：前进后退时
     *
     * @desc 回填状态
     * @public
     */
    function backfillState() {
        // 判断是否配置过异步关系及存储过数据
        if (!isOn_() || !hasStore_()) {
            return;
        }

        // 遍历asynRelation_回填状态
        var i = 0,
            len = asynRelation_.length;
        for (; i < len; i++) {
            var relationItem = asynRelation_[i];
            for (var j = 0; j < relationItem.length; j++) {
                var areaItem = relationItem[j];
                var stateData = dataStorage_.getDataByUrl(areaItem['id']);
                areaStateMgr_.set(areaItem['id'], stateData, areaItem['type']);
            }
        }
    }

    /**
     * 存储初次状态
     *
     * @desc
     * @public
     */
    function storeFirstState() {
        // 判断是否配置过异步关系及存储过数据
        if (!isOn_() || hasStore_()) {
            return;
        }

        // 遍历asynRelation_初始化状态
        var i = 0,
            j = 0,
            len = asynRelation_.length,
            relationItem, areaItem, dataItem,
            data = {};
        for (; i < len; i++) {
            relationItem = asynRelation_[i];
            for (j = 0; j < relationItem.length; j++) {
                areaItem = relationItem[j];
                dataItem = areaStateMgr_.get(areaItem['id'], areaItem['type']);
                if (dataItem) {
                    data[areaItem['id']] = dataItem;
                }
            }
        }
        updateStateData(data, true);
    }

    /**
     * asynMgr初始化方法
     *
     * @desc 参数1...n-1为数组用于配置具有异步请求关系的一组元素， n为回调函数，用于页面onload时逻辑处理
     *       示例：asynMgr.init(["form#fm1", "table#tb1", "switch#sw1"], function(){})
     * @public
     */
    function init() {
        urlDataStorage_.init();

        var callback = function(){},
            args = arguments,
            len = args.length;

        // 获取参数，初始化asynRelation_变量
        for (var i = 0; i < len; i++) {
            if (rigel.isArray(args[i])) {
                asynRelation_.push(args[i]);
            }
        }
        initAsynRelation_();

        if (rigel.isFunction(args[len - 1])) {
            callback = args[len - 1];
        }

        rigel.domReady(function() {
            backfillState();
            callback();
        });

        // 修复从外站回跳后倒数第二个链接无法更新状态的问题
        if (hasStore_()) {
            setRepaintByMe(true);
        }
        // 修复无法回到最初状态的问题
        //else {
        //    storeFirstState();
        //}

        window.navCallback_ = function() {
            if (!getRepaintByMe()) {
                setRepaintByMe(true);
            }
            else {
                repaintTables();
                backfillState();
            }
        };
    }

    // 返回asynMgr主object，暴露相应的模块
    return {
        dataStorage          : dataStorage_,
        urlDataStorage       : urlDataStorage_,
        repaintTable         : repaintTable,
        repaintTables        : repaintTables,
        backfillState        : backfillState,
        updateStateData      : updateStateData,
        getCurState          : getCurState,
        setRepaintByMe       : setRepaintByMe,
        getRepaintByMe       : getRepaintByMe,
        convertToUrl         : convertToUrl,
        init                 : init
    };
}();