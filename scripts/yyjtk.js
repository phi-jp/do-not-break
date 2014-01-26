
var yyjtk = {};

;(function() {
	var PROTOCOL = "yyjtk://";
	var QUERY = tm.util.QueryString.parse(location.search.substr(1));

	yyjtk.isWebView = function() {
		return QUERY.env == "webview";
	};

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
        
        var uri = edu_native_queue.shift();
        
        if (isWebView()) {
	        iframe.contentWindow.location = uri;
        }
        else {
        	console.log(uri);
        }
    }, 100);

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
        	var param = {
        		id: id,
        		score: score,
        		callback: callback,
        	};
    		param.callback = this.setCallbackFunction(param.callback);
            this.exec("sendScore?" + tm.util.QueryString.stringify(param));
        },
        /**
         * 
         */
        getRanking: function(id, callback) {
        	var param = {
        		id: id,
        		callback: callback,
        	};
    		param.callback = this.setCallbackFunction(param.callback);
            this.exec("getRanking?" + tm.util.QueryString.stringify(param));
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

        	var finalText = "{text} via @{via} {hashtags}".format(params);
        	var param = {
        		text: finalText,
        		url: url,
        	};

            this.exec("twitter?" + tm.util.QueryString.stringify(param));
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
