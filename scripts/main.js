/*
 * constant
 */
var SCREEN_WIDTH   = 450;
var SCREEN_HEIGHT   = 800;
var SCREEN_CENTER_X = SCREEN_WIDTH/2;
var SCREEN_CENTER_Y = SCREEN_HEIGHT/2;



var UI_DATA = {
    main: { // MainScene用ラベル
        children: [{
            type: "Label",
            name: "score",
            fontSize: 32,
            fillStyle: "White",
            shadowColor: "blue",
            shadowBlur: 4,
            x: 20,
            y: 30,
        }]

    }
};

var ASSETS = {
    "title":  "./image/title.png",
};

var barsize;
// 定数
var ballsize   = 10;
var bar;
var block;
var ball;
var eball;

var ballGroup;
var eballGroup;
var blockGroup;

var point;
var combo =0;
var gameflg;


var RESULT_PARAM = {
        score: 0,
        msg:      "守りたい。そのブロック",
        url:      "http://cachacacha.com/BlockKUZUSAZU/",
        hashtags: "ブロック崩さぬ",
        width:    SCREEN_WIDTH,
        height:   SCREEN_HEIGHT,
        related:  "tmlib.js Tutorial testcording",
};


var speed;


tm.preload(function() {
    //tm.sound.WebAudioManager.add("sound", "http://jsrun.it/static/assets/svggirl/01/svg_girl_theme.mp3");
});



tm.main(function() {
    var app = tm.app.CanvasApp("#world");
    app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
    app.fitWindow();

    var loading = tm.app.LoadingScene({
        assets: ASSETS,
        nextScene: TitleScene,
     //   nextScene: EndScene,
    });
    
    app.replaceScene(loading);

    //app.replaceScene(TitleScene());
    //app.replaceScene(MainScene());

    
    //音楽
    //tm.sound.SoundManager.add("bound", "https://github.com/phi1618/tmlib.js/raw/0.1.0/resource/se/puu89.wav");
    

    
    app.run();
});

tm.define("TitleScene", {
    superClass : "tm.app.TitleScene",
 
    init : function() {
        this.superInit({
            title :  "ブロック崩さぬ",
            width :  SCREEN_WIDTH,
            height : SCREEN_HEIGHT
        });


        this.title = tm.app.Sprite("title", SCREEN_WIDTH, SCREEN_HEIGHT).addChildTo(this);
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



tm.define("MainScene", {
    superClass: "tm.app.Scene",

    init: function() {
        // 親の初期化
        this.superInit();

        blockGroup = tm.app.CanvasElement().addChildTo(this);
        //ボールグループ作成
        ballGroup = tm.app.CanvasElement().addChildTo(this);
        eballGroup = tm.app.CanvasElement().addChildTo(this);
        
        gameflg = 1;
        barsize =45;
        
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
        this.danvx_remit = 4.5;
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
                fx += 55;

            }
            fy += 25;
            fx = 7;
            Bcr -= 40;
        }


        //バーの生成
        bar = barclass();
        this.addChild(bar);

        //スコア生成
        this.fromJSON(UI_DATA.main);
        this.score.text = point;


        //コンボ数表示
        this.Combolabel = tm.app.Label("").addChildTo(this);
        this.Combolabel
            .setPosition(40, 500)
            .setFillStyle("hsla(123, 80%, 50%, 8.0)")
            .setFontSize(40);


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
                        //var audio = tm.sound.WebAudioManager.get("pon");
                        //audio.volume = 0.5;
                        //audio.play();
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
                this.mode.text = "入れ食い\nボーナス！！！"
                
                if (this.etimer % 2 === 0) {
                        this.LR = rand(1);
                        this.evy = 0.5;
                        this.evx = (rand(80)) /10;
                        eball = eballs(this.LR,this.evx,this.evy).addChildTo(ballGroup);
                }
                this.etimer++;

                if(this.etimer > 500){
                    
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
                this.Combolabel.text = "";

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

                    if (this.gameovertimer > 70) {
                        app.replaceScene(EndScene());
                    }


                    ++this.gameovertimer;
            break;
        }

           //ラベル更新
            this.score.text = "SCORE:" + point;
            if(combo > 0){
                this.Combolabel.text = combo + " Combo!";
            }
            else{
                this.Combolabel.text = "";   
            }
        


    },
});

//ブロッククラス----------------------------------------------------------------

var blocks = tm.createClass({
    superClass: tm.app.CanvasElement,
    
    init: function(color) {
        this.superInit();
        
        this.color = color;
        this.width = 55;
        this.height = 25;

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
    c.fillRect(0, 0, 50, 20, 8);
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

        if(LR == 0){
                this.x = 30;
                this.vx = vx;
        }
        else{
                this.x = 420;
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
        this.y = 650;
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

        if(LR == 0){
                this.x = 30;
                this.v.x = vx;
        }
        else{
                this.x = 420;
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


