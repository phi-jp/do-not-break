/*
 * result scene
 */

rank = 430;

tm.define("ResultScene", {
    superClass: "tm.app.Scene",
    
    init: function(param) {
        this.superInit();
        
        
        this.fromJSON(UI_DATA.result);
        
        this.scoreLabel.text = point || 0;
        this.messageLabel.alpha = 0;
        this.ui.hide().sleep();
        
        var ss = tm.display.Sprite("img_result").addChildTo(this).setOrigin(0, 0);
        ss.alpha = 0.0;
        ss.y += 60;
        
        this.score = 0;
        this.rank = 0;
        
        // スコア表示
        this.tweener.wait(500).call(function() {
            this.scoreLabel.show();
            this.scoreImage.show();
            this.update = this.incrementScore;
        }.bind(this));
    },
    
    incrementScore: function(app) {
        var p = app.pointing;
        
        this.score += 7;
        
        if (p.getPointingStart() == false && point >= this.score) {
            this.scoreLabel.text = this.score;
        }
        else {
            this.scoreLabel.text = point;
            
            this.rankLabel.show();
            this.rankImage.show();
            this.update = this.incrementRank;
        }
    },
    
    incrementRank: function(app) {
        var p = app.pointing;
        
        this.rank += 1;
        
        if (p.getPointingStart() == false && rank >= this.rank) {
            this.rankLabel.text = this.rank + "位";
        }
        else {
            this.rankLabel.text = rank + "位";
            this.update = null;
            
            // メッセージをフェードイン
            this.fadeMessage();
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
