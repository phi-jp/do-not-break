/*
 * main.js
 */

tm.main(function() {
    // app 生成 & 初期化
    var app = tm.display.CanvasApp("#world");
    app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
    app.fitWindow();

    var flow = tm.util.Flow(2, function() {
        var scene = tm.global[sceneName]();
        app.replaceScene(scene);
    });

    // query(http://...?{~}) からシーン名を取得
    var sceneName = QUERY.scene || "MainScene";

    // ローディングシーンを生成
    var loading = tm.ui.LoadingScene({
        assets: ASSETS,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        bgColor: "red",
    });
    // ロード完了時イベントリスナを登録
    loading.onload = function() {
        flow.pass();
    };
    // シーンきりかえ
    app.replaceScene(loading);

    // 言語取得
    LANGUAGE = (function() {
        return navigator.browserLanguage || navigator.language || navigator.userLanguage;
    })();

    yyjtk.api.getLanguage(function(lang) {
        LANGUAGE = lang;
        flow.pass();
    });
    
    // 実行
    app.run();
    
    window._pause = function() {
        app.pushScene(PauseScene());
    };

});


tm.define("TitleScene", {
    superClass : "tm.app.TitleScene",
 
    init : function() {
        this.superInit({
            title :  "ブロック崩さぬ",
            width :  SCREEN_WIDTH,
            height : SCREEN_HEIGHT
        });

        
        this.title = tm.app.Sprite("img_top", SCREEN_WIDTH, SCREEN_HEIGHT).addChildTo(this);
        this.title.position.set(SCREEN_WIDTH/2, SCREEN_HEIGHT/2);


        // 画面(シーンの描画箇所)をタッチした時の動作
        this.addEventListener("pointingend", function(e) {
            // シーンの遷移
            e.app.replaceScene(MainScene());
        });
    },
});

tm.define("EndScene", {
    superClass : "tm.app.ResultScene",
 
    init : function() {
        RESULT_PARAM.score = point;
        this.superInit(RESULT_PARAM);

        this.Name = tm.app.Label("つくったやつ:").addChildTo(this);
        this.Name
            .setPosition(80, 775)
            .setFillStyle("hsla(198, 80%, 80%, 8.0)")
            .setFontSize(25);
            var tweetButton = this.tweetButton = tm.ui.GlossyButton(180, 40, "red", "うちょ(utyo)").addChildTo(this);
            tweetButton.setPosition(350, 770);
            tweetButton.onclick = function() {
                window.open("https://twitter.com/utyo");
            };


    },

    onnextscene: function (e) {
        e.target.app.replaceScene(MainScene());
    },

});

