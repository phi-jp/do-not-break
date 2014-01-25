/*
 * result scene
 */

tm.define("ResultScene", {
    superClass: "tm.app.Scene",
    
    init: function(param) {
        this.superInit();
        
        
        this.fromJSON(UI_DATA.result);
        
        this.scoreLabel.text = point || 999;
        
        var ss = tm.display.Sprite("img_result").addChildTo(this).setOrigin(0, 0);
        ss.alpha = 0.0;
        ss.y += 60;
    },
    
    incrementScore: function() {
        
    },
    
    onpointingstart: function(e) {
        var p = e.app.pointing;
        
        console.log(p.x, p.y);
    }
});
