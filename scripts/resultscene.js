/*
 * result scene
 */

// point = 3003;
// rank = 430;

tm.define("ResultScene", {
    superClass: "tm.app.Scene",
    
    init: function(param) {
        this.superInit();

        tm.asset.Manager.get("bgm_game").setLoop(true).stop();

        tm.asset.Manager.get("se_show").clone().play();
        
        this.fromJSON(UI_DATA.result);
        
        this.scoreLabel.text = 0;
        this.messageLabel.alpha = 0;
        this.ui.hide().sleep();
        
        // var ss = tm.display.Sprite("img_result").addChildTo(this).setOrigin(0, 0);
        // ss.alpha = 0.5;
        // ss.y += 60;
        
        this.score = 0;
        this.rank = 0;

        var comment = (LANGUAGE == "ja") ?
            "守りたい。そのブロック" : "Want to defence. The block.";
        var hashtags = (LANGUAGE == "ja") ?
            "ブロック崩さぬ" : "breakguard";
        var message = "SCORE: {0}, {1} ".format(point, comment);
        var url = "http://itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=807484470&mt=8";

        this.messageLabel.text = comment;

        // tweet
        this.ui.btnTweet
            .setInteractive(true)
            .setBoundingType("rect")
            .on("pointingstart", function() {
                yyjtk.api.sendTwitter({
                    text: message,
                    via: "utyo",
                    hashtags: hashtags,
                    url: url
                });
                tm.asset.Manager.get("se_pi").clone().play();
            });
        // facebook
        this.ui.btnFacebook
            .setInteractive(true)
            .setBoundingType("rect")
            .on("pointingstart", function() {
                yyjtk.api.sendFacebook({
                    text: message,
                    url: url
                });
                tm.asset.Manager.get("se_pi").clone().play();
            });
        // line
        this.ui.btnLine
            .setInteractive(true)
            .setBoundingType("rect")
            .on("pointingstart", function() {
                yyjtk.api.sendLine({
                    text: message,
                    url: url
                });
                tm.asset.Manager.get("se_pi").clone().play();
            });

        this.ui.btnTitle
            .setInteractive(true)
            .setBoundingType("rect")
            .on("pointingstart", function() {
                var app = this.app;
                yyjtk.api.closeView();
                tm.asset.Manager.get("se_pi").clone().play();
            }.bind(this));
        // コンティニュー
        this.ui.btnContinue
            .setInteractive(true)
            .setBoundingType("rect")
            .on("pointingstart", function() {
                var app = this.app;

                app.popScene();
                app.replaceScene(MainScene());
                tm.asset.Manager.get("se_pi").clone().play();
            }.bind(this));
        // ランキング
        this.ui.btnRanking
            .setInteractive(true)
            .setBoundingType("rect")
            .on("pointingstart", function() {
                yyjtk.api.viewRanking(RANKING_ID);
                tm.asset.Manager.get("se_pi").clone().play();
            }.bind(this));

        // ランキング送信
        var self = this;
        yyjtk.api.sendScore(RANKING_ID, point, function() {
            yyjtk.api.getRanking(RANKING_ID, function(ranking) {
                rank = ranking;

                self.scoreLabel.show();
                self.scoreImage.show();
                self.update = self.incrementScore;
            });
        });
        
    },
    
    incrementScore: function(app) {
        var p = app.pointing;
        
        this.score += 7;

        if (app.frame % 4 == 0) { 
            tm.asset.Manager.get("se_pi").clone().play();
        }

        if (p.getPointingStart() == false && point >= this.score) {
            this.scoreLabel.text = this.score;
        }
        else {
            this.scoreLabel.text = point;
            
            this.rankLabel.show();
            this.rankImage.show();
            this.update = this.incrementRank;
            tm.asset.Manager.get("se_show").clone().play();
        }
    },
    
    incrementRank: function(app) {
        var p = app.pointing;
        
        this.rank += 1;

        if (app.frame % 4 == 0) {
            tm.asset.Manager.get("se_pi").clone().play();
        }

        if (p.getPointingStart() == false && rank >= this.rank) {
            this.rankLabel.text = this.rank + "";
        }
        else {
            this.rankLabel.text = rank + "";
            this.update = null;
            
            // メッセージをフェードイン
            this.fadeMessage();
            tm.asset.Manager.get("se_show").clone().play();
        }
    },
    
    fadeMessage: function() {
        this.messageLabel.show();
        this.messageLabel.tweener.wait(500).fadeIn().call(function() {
            this.fadeUI();
        }.bind(this));
    },
    
    fadeUI: function() {
        this.ui.show().wakeUp();
        this.ui.alpha = 0;
        this.ui.tweener.wait(500).fadeIn(10);
    },
    
    onpointingstart: function(e) {
        var p = e.app.pointing;
        
        console.log(p.x, p.y);
    }
});
