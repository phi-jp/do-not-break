/*
 * mainscene.js
 */



tm.define("MainScene", {
    superClass: "tm.app.Scene",

    init: function() {
        // 親の初期化
        this.superInit();

        // bgm 再生
        playMusic("bgm_game");

        blockGroup = tm.app.CanvasElement().addChildTo(this);
        //ボールグループ作成
        ballGroup = tm.app.CanvasElement().addChildTo(this);
        eballGroup = tm.app.CanvasElement().addChildTo(this);
        
        gameflg = 1;
        barsize =55;
        
        point = 0;
        combo = 0;

        //ボールの設定用
        this.LR = 0;    //左か右か
        this.vx = 0;    //横速度
        this.vy = 0     //縦速度
        this.speed = 1;
        this.timer = 1; //時間かうんと
        this.remit = 30;    //ボールの出る間隔   
        this.rtimer = 1;
        this.rspeed = 80;

        //弾幕ボールの設定
        this.danvx = 0;
        this.danvy = 0;
        this.danspeed = 0.1;
        this.dancnt = 0;        //弾幕カウント
        this.danend = 3;        //弾幕の回数
        this.danvx_remit = 5.0;
        this.dantimer = 0;
        this.danremit = 2;

        //入れ食いボール用
        this.etimer = 1;
        this.ebouns = 1500;

        this.nextmode = 1;

        this.btimer = 1;



        //ブロック配置用
        var fx = 7;
        var fy = 60;
        var Bcr = 360;



        //ブロック配置
        for(var y = 1; y <= 7; y += 1) {
            for(var x = 1; x <= 8; x += 1) {
                block = blocks("hsla({0}, 80%, 50%, 0.75)".format(Bcr)).addChildTo(blockGroup);
                block.x = fx;
                block.y = fy;
                fx += BLOCK_WIDTH+5;
            }
            fy += BLOCK_HEIGHT+5;
            fx = 7;
            Bcr -= 40;
        }


        //バーの生成
        bar = barclass();
        this.addChild(bar);

        //スコア生成
        this.fromJSON(UI_DATA.main);
        this.score.text = point;

        // ボーナス
        this.bonusSprite = tm.display.Sprite("img_bonus").addChildTo(this);
        this.bonusSprite.setPosition(SCREEN_CENTER_X, 400);
        this.bonusSprite.hide().sleep();
        this.bonusSprite.tweener.set({alpha:0}).wait(200).set({alpha:1}).wait(200).setLoop(true);

        //コンボ数表示

        this.comboLabel = ComboLabel().addChildTo(this).setPosition(120, 480).hide();


        //this.Out = tm.app.Label("↑out↑").addChildTo(this);
        //this.Out
        //    .setPosition(300, 35)
        //    .setFillStyle("hsla(360, 80%, 50%, 8.0)")
         //   .setFontSize(40);



        this.mode = tm.app.Label("").addChildTo(this);
        this.mode
            .setPosition(40, 300)
            .setFillStyle("hsla(60, 80%, 50%, 8.0)")
            .setFontSize(70);


            
            
        this.gameovertimer =0;

        return ;

        // adult button
        var debugButton = tm.display.CanvasElement().addChildTo(this);
        debugButton.x = SCREEN_WIDTH;
        debugButton.y = 0;
        debugButton.width = 100;
        debugButton.height= 100;
        debugButton.setInteractive(true);
        debugButton.originX = 1;
        debugButton.originY = 0;

        debugButton.setInteractive(true);
        debugButton.onpointingstart = function() {
            this.app.pushScene(ResultScene());
        }.bind(this);

        // adult button
        var debugButton2 = tm.display.CanvasElement().addChildTo(this);
        debugButton2.x = 0;
        debugButton2.y = 0;
        debugButton2.width = 100;
        debugButton2.height= 100;
        debugButton2.setInteractive(true);
        debugButton2.originX = 0;
        debugButton2.originY = 0;

        debugButton2.setInteractive(true);
        debugButton2.onpointingstart = function() {
            this.app.currentScene.sleep();
        }.bind(this);
    },

    update: function(app) {
        // カウントアップを行う
        
        
        switch(gameflg){
            //通常モード

            case 1: 
                // ボールの生成
                if (this.btimer % this.remit === 0) {
                        this.LR = rand(1);
                        this.vy = 10;
                        this.vx = (rand(200) -100) /10;
                        ball = balls(this.LR,this.vx * this.speed,this.vy * this.speed,0).addChildTo(ballGroup);

                        // // SE を鳴らす
                        // var sound = tm.asset.Manager.get("se_pon").clone();
                        // sound.play();

                        this.btimer = 1;

                }

                //の出る間隔を狭める :狭めるスピードだんだん遅く
                if(this.rtimer > this.rspeed && this.remit > 5){
                        this.remit -= 1;
                        this.rspeed += 3;
                        if(this.remit < 20){
                            this.rspeed += 10;
                        }


                        this.rtimer = 0;
                }

                //弾幕モードに移行
                if(this.timer % 500 === 0){
                    gameflg = 2;
                    //次から通常モードの玉が早くなる
                    this.speed += 0.1
                    //玉の出る間隔　ジョジョに上がりにくくする



                }
                //入れ食いモードに移行
                if(this.timer % this.ebouns === 0){
                    //インターバル挟んで入れ食いモードへ
                    gameflg = 9;
                    this.nextmode = 3;
                    this.ebouns += 500;
                    this.timer = 1;

                    // ボーナススプライトを表示
                    this.bonusSprite.show().wakeUp();
                    // bgm を変更する
                    stopMusic("bgm_game");
                    playMusic("bgm_bonus");
                }

                ++this.timer;
                ++this.rtimer;
                ++this.btimer;

            break;

            //弾幕モード
            case 2: 
                
                // 敵の生成(難易度をどんどん上げる)
                if (this.dantimer % 2 === 0) {                        
                        
                        this.danvy = 4;
                        ball = balls(this.LR,this.danvx,this.danvy,1).addChildTo(ballGroup);
                }
                if(this.danvx_remit > this.danvx){
                    this.danvx += this.danspeed;
                }
                //次の弾幕。玉の出る場所を反転
                else{
                    if(this.LR == 0){
                        this.LR = 1;
                    }
                    else{
                        this.LR = 0;
                    }
                    this.danvx = 0;

                    this.dancnt++;
                }

                //弾幕の終わり
                if(this.dancnt >= this.danend){
                    gameflg = 9;
                    this.nextmode = 1;
                    this.dancnt = 0;
                    this.danend++; //弾幕回数がだんだん上がる
                    this.danspeed += 0.01;
                }

                this.dantimer++;

            break;



            //入れ食いモード
            case 3:
                barsize = 80;
                
                if (this.etimer % 2 === 0) {
                        this.LR = rand(1);
                        this.evy = 0.5;
                        this.evx = (rand(80)) /10;
                        eball = eballs(this.LR,this.evx,this.evy).addChildTo(ballGroup);
                }
                this.etimer++;

                if(this.etimer > 500){
                    stopMusic("bgm_bonus");
                    playMusic("bgm_game");

                	this.bonusSprite.hide();
                    
                    this.etimer = 1;
                    this.mode.text = "";
                    barsize = 45;
                    gameflg = 9;
                    this.nextmode = 1;
                }


            break;

            //インターバル
            case 9:
                this.bg = ballGroup.children;
                this.ballNASI = 0;
                var self = this;
                //画面からボールが消えたら通常モードへ
                this.bg.each(function(ball) {
                    self.ballNASI = 1;

                    });
                if(this.ballNASI == 0){ 
                   gameflg = this.nextmode;
            }
                
            break;


            //ゲームオーバー時の処理
            case 0:
                this.comboLabel.hide();

                this.mba = ballGroup.children;
                this.mba.each(function(ball) {
                    ball.remove();
                 });

                //ボールを消す
                if(this.gameovertimer==0){
                    this.mbc = blockGroup.children;
                    this.mbc.each(function(block) {
                            block.vy = rand(40) - 10;
                            block.vx = rand(20) - 10;
                            block.rotation = 30; 
                        });
                    }
                    //ブロックを消す
                    if (this.gameovertimer > 40) {
                        this.mbc.each(function(block) {
                            block.remove();
                        });
                    }

                    if (this.gameovertimer > 100) {
                        app.pushScene(ResultScene());
//                        app.replaceScene(EndScene());
                    }


                    ++this.gameovertimer;
            break;
        }

           //ラベル更新
            this.score.text = "SCORE:" + point;
            if(combo > 0){
                this.comboLabel.setNumber(combo).show();
            }
            else{
                this.comboLabel.setNumber(combo).hide();
            }
        


    },
});

//ブロッククラス----------------------------------------------------------------

var blocks = tm.createClass({
    superClass: tm.app.CanvasElement,
    
    init: function(color) {
        this.superInit();
        
        this.color = color;
        this.width = BLOCK_WIDTH;
        this.height = BLOCK_HEIGHT;

        this.vx = 0;
        this.vy = 0;




        //this.v = tm.geom.Vector2(0, 0);
    },
    
    update: function(app) {

        this.L = this.x;
        this.R = this.x + this.width;
        this.T = this.y;
        this.B = this.y + this.height + 3;

        this.x += this.vx;
        this.y += this.vy;



    },
    
    draw: function(c) {
    c.globalCompositeOperation = "lighter";
    c.fillStyle = this.color;
    c.fillRect(0, 0, this.width, this.height, 8);
    },

});

//ボールクラス----------------------------------------------------------------
var balls = tm.createClass({
    superClass: tm.app.CanvasElement,
    
    init: function(LR,vx,vy,ballflg) {
        this.superInit();

        this.color = "hsla(10, 75%, 100%, 1)";

        this.flg=0;
        //当たり判定用
        this.L;
        this.R;
        this.T;
        this.B;

        this.ballflg = ballflg;
        
        var offset = 30;
        if(LR == 0){
                this.x = offset;
                this.vx = vx;
        }
        else{
                this.x = SCREEN_WIDTH-offset;
                this.vx = vx * -1;
        }
        this.y =280;


        this.vy = vy;




        //速度処理。幾何学っぽい動きをするらしい
        //this.v = tm.geom.Vector2(0, 0);
    },
    
    update: function(app) {

        //あたり判定用left right top bottom
        this.L = this.x+4;
        this.R = this.x + 6;
        this.T = this.y+4;
        this.B = this.y + 6;



        //バーとの当たり判定
        if(this.y >= bar.y - this.vy && this.y <= bar.y +5){
            //穴に入った
            if(this.x >= app.pointing.x - barsize && this.x <= app.pointing.x + barsize){
                if(this.flg==0){
                    point += 100 + combo * 10;
                    combo++;
                    this.flg = 1;

                    // se
                    playSound("se_pipon");
                }
            }
            else{
                combo = 0;
                this.vy *= -1;
                if(this.ballflg == 0){
                this.color = "hsla(18, 100%, 70%, 1)";
                }
                else if(this.ballflg == 1){
                this.color = "hsla(360, 75%, 50%, 0.8)";
                }

                // 跳ね返り
                playSound("se_pon");
            }
        }

        //ブロックとの当たり判定
        var bc = blockGroup.children;
        var self = this;
        bc.each(function(block) {
            if(clash(self,block)){
                self.vy *= -1;
                self.vx *= -1;
                block.remove();
                self.ballflg++;

                playSound("se_hit_block");
               }
             
        });

        //壁にあたったら反転
        if(this.L < 5 || this.R > SCREEN_WIDTH){
            this.vx *= -1;
        }

        //下に出たら消える
        if(this.y > SCREEN_HEIGHT){
            this.remove();
        }

        //玉が上にでた
        if(this.y < 0){
            //point += 100;
            //ゲームオーバーフラグ
            gameflg = 0;
            this.remove();

            // game over se
            playSound("se_gameover");
        }

        //ブロックに２回あたったら消える
        if(this.ballflg >= 2){
            this.remove();
            
        }

        this.y += this.vy;
        this.x += this.vx;


    
    //画面外にでた時の処理。後で使う
    //var bottom = app.canvas.height - this.height/2;
    //if (this.y > bottom) {
    //    }

    },
    
    draw: function(c) {
    c.globalCompositeOperation = "lighter";
    c.fillStyle = this.color;
    c.fillCircle(0, 0, ballsize);
    },

});


//バークラスーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
var barclass = tm.createClass({
    superClass: tm.app.CanvasElement,
    
    init: function(color) {
        this.superInit();
        

        this.color = color;
        this.y = BAR_POSITION_Y;
        this.WD = 50;
        this.LWD = SCREEN_WIDTH / 2 - barsize;
        this.RWD = SCREEN_WIDTH / 2 + barsize;
        //this.v = tm.geom.Vector2(0, 0);
    },
    
    update: function(app) {

        if (app.pointing.x + (barsize / 2)> 0 && app.pointing.x < SCREEN_WIDTH - (barsize / 2)) {
        this.LWD = app.pointing.x - barsize;
        this.RWD = app.pointing.x + barsize;
    }


    },
    
    draw: function(c) {
    c.globalCompositeOperation = "lighter";
    c.fillStyle = "hsla(0, 75%, 100%, 1)"
    c.fillRect(0, 0,this.LWD, 10, 8);
    c.fillRect(this.RWD, 0,SCREEN_WIDTH - this.RWD, 10, 8);


    },

});

//入れ食いボール
var eballs = tm.createClass({
    superClass: tm.app.CanvasElement,
    
    init: function(LR,vx,vy) {
        this.superInit();
        this.v = tm.geom.Vector2(0, 0);
        
        var offset = 30;
        if(LR == 0){
                this.x = offset;
                this.v.x = vx;
        }
        else{
                this.x = SCREEN_WIDTH-offset;
                this.v.x = vx * -1;
        }
        this.y =280;
        this.vy = vy;

        this.flg = 0;

        this.timer = 1;

        this.color = "hsla(100, 100%, 100%, 1)";

    },
    
    update: function(app) {
        this.v.y += this.vy;



        //壁にあたったら反転
        if(this.x < 5 || this.x > SCREEN_WIDTH){
            this.x = 5
            this.v.x *= -1;
            this.vx *= -1;
        }

        //バーにあたった
        if(this.y + 10 >= bar.y　&& this.y + 10<= bar.y + this.v.y ){
            //穴に入った
            if(this.x >= app.pointing.x - barsize && this.x <= app.pointing.x + barsize){
                if(this.flg==0){
                    point += 50 + combo;
                    combo++;
                    this.flg = 1;
                }
            }
            else{
                this.v.y *= -0.6;

            }
        }
        this.position.add(this.v);

        //時間が立ったら変色　＞　消える
        if(this.timer > 130){
            this.color = "hsla(360, 75%, 50%, 0.8)";
            if(this.timer > 160){
                this.remove();
            }

        }

        //下に出たら消える
        if(this.y > SCREEN_HEIGHT){
            this.remove();
        }

        this.timer++;


    },


    
    draw: function(c) {
    c.globalCompositeOperation = "lighter";
    c.fillStyle = this.color;
    c.fillCircle(0, 0, ballsize);

    },

});

tm.define("ComboLabel", {
    superClass: "tm.display.CanvasElement",

    init: function() {
        this.superInit();

        this.comboSprite = tm.display.Sprite("img_combo").addChildTo(this).setPosition(120, 0);

        this.hundredNumberSprite = tm.display.Sprite("img_number_sprite").addChildTo(this)
            .setPosition(-64, -6)
            .setSize(48, 56)
            .setFrameIndex(1);

        this.tenNumberSprite = tm.display.Sprite("img_number_sprite").addChildTo(this)
            .setPosition(-20, -6)
            .setSize(48, 56)
            .setFrameIndex(1);

        this.oneNumberSprite = tm.display.Sprite("img_number_sprite").addChildTo(this)
            .setPosition(22, -6)
            .setSize(48, 56)
            .setFrameIndex(1);

        this.setNumber(1);

        // this.num = 1;
    },

    update: function(app) {
        // this.num+=7;
        // this.setNumber(this.num);
    },

    setNumber: function(num) {
        num = Math.min(num, 999);
        var hundred = (num/100)|0;
        var ten = ((num%100)/10)|0;
        var one = (num%10);

        if (hundred == 0) {
            this.hundredNumberSprite.hide();
        }
        else {
            this.hundredNumberSprite.setFrameIndex(hundred-1).show();
        }

        if (hundred == 0 && ten == 0) {
            this.tenNumberSprite.hide();
        }
        else {
            if (ten == 0) {
                this.tenNumberSprite.setFrameIndex(9).show();
            }
            else {
                this.tenNumberSprite.setFrameIndex(ten-1).show();
            }
        }

        if (one == 0) {
            this.oneNumberSprite.setFrameIndex(9);
        }
        else {
            this.oneNumberSprite.setFrameIndex(one-1);
        }

        return this;
    }
})



//衝突用関数ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
function clash(a,b){
    //if (((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y)) < (a.radius+b.radius)*(a.radius+b.radius)) {
    //    return true;
    //}
    if((a.L <= b.R) && (a.R >= b.L) 
    && (a.T  <= b.B) && (a.B >= b.T))
    {
            return true
    }

    //if(a.x >= b.x && a.x <= b.x + b.width){
      //  if(a.y + a.vy >= b.y && a.y + a.vy <= b.y + b.height){
        //    return true
        //}
    //}

    return false;
    
}

function rand(n){
    return Math.floor(Math.random() * (n + 1));
}


