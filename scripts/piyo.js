

var isNative = (function() {
    var flag = /piyokawa/i.test(navigator.userAgent);
    return function() {
        return flag;
    };
})();



var yyjtk = {};

;(function() {
	var PROTOCOL = "piyo://";

    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    window.addEventListener("DOMContentLoaded", function() {
        document.body.appendChild(iframe);
    });

    // ネイティブAPI実行キュー
    var request_queue = [];

    // ネイティブAPI実行インターバル（0.1秒単位）
    setInterval(function() {
    	if (request_queue.length == 0) return ;
        
        var uri = request_queue.shift();
        
        if (isNative()) {
	        iframe.contentWindow.location = uri;
        }
        else {
        	console.log(uri);
        }
    }, 50);

    yyjtk.api = {
    	exec: function(uri) {
    		request_queue.push(PROTOCOL + uri);
    	},
    	closeView: function() {
    		this.exec("closeView");
    	},
    	playSound: function(name, param) {
    		param = param || {};

    		param.name = name;
    		param.callback = this.setCallbackFunction(param.callback);

    		this.exec("playSound?" + tm.util.QueryString.stringify(param));
    	},
        /**
         * サウンドを停止する
         */
        stopSound: function() {
            this.exec("stopSound");
        },
    	playMusic: function(name, param) {
    		param = param || {};

    		param.name = name;
    		param.callback = this.setCallbackFunction(param.callback);

    		this.exec("playMusic?" + tm.util.QueryString.stringify(param));
    	},
        /**
         * 音楽を停止する
         */
        stopMusic: function() {
            this.exec("stopMusic");
        },
        /**
         * 
         */
        sendScore: function(id, score, callback) {

            if (isNative()) {
	        	var param = {
	        		id: id,
	        		score: score,
	        		callback: callback,
	        	};
	    		param.callback = this.setCallbackFunction(param.callback);
	            this.exec("sendScore?" + tm.util.QueryString.stringify(param));
            }
            else {
            	callback && callback();
            }
        },
        /**
         * 
         */
        getRanking: function(id, callback) {

            if (isNative()) {
	        	var param = {
	        		id: id,
	        		callback: callback,
	        	};
	    		param.callback = this.setCallbackFunction(param.callback);
	            this.exec("getSelfRanking?" + tm.util.QueryString.stringify(param));
	        }
	        else {
            	callback && callback(512);
	        }
        },
        /**
         * 
         */
        viewRanking: function(id) {
        	var param = {
        		id: id,
        	};
            this.exec("viewRanking?" + tm.util.QueryString.stringify(param));
        },
        /**
         * 
         * text ... 
         * hashtags ... 
         * via ... 
         * url ... 
         */
        sendTwitter: function(params) {
            params.text = params.text || "";
            params.via = params.via || "";
            params.hashtags = params.hashtags || "";

            if (params.hashtags) {
                var tagsArr = params.hashtags.split(',');
                var tags = [];
                tagsArr.each(function(elm) {
                    tags.push("#" + elm);
                });
                params.hashtags = tags.join(' ');
            }
            else {
                params.hashtags = "";
            }

            var finalText = "{text} via @{via} {hashtags}".format(params);
            var param = {
                text: finalText,
                url: params.url || '',
            };

            this.exec("twitter?" + tm.util.QueryString.stringify(param));
        },
        sendFacebook: function(param) {
            param.text = param.text || "";
            param.url = param.url || "";

            this.exec("facebook?" + tm.util.QueryString.stringify(param));
        },
        sendLine: function(param) {
            param.text = param.text || "";
            param.url = param.url || "";

            this.exec("line?" + tm.util.QueryString.stringify(param));
        },

        getLanguage: function(callback) {
            if (isNative()) {
                callback = this.setCallbackFunction(callback);
                var param = {
                    callback: callback,
                };
                this.exec( "getLanguage?" + tm.util.QueryString.stringify(param) );
            }
            else {
                callback && callback("en"); // or ja
            }
        },

        setCallbackFunction: function(callback) {
            if (!callback) return null;

            window._yyjtkempFuncCount = window._yyjtkempFuncCount || 0;
            var funcName = "_yyjtkempFunc" + window._yyjtkempFuncCount++;
            window[funcName] = callback;
            return funcName;
        },

    };

})();
