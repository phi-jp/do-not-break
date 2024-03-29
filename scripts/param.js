/*
 * param
 */


var SCREEN_WIDTH    = 640;
var SCREEN_HEIGHT   = 960;
var SCREEN_CENTER_X = SCREEN_WIDTH/2;
var SCREEN_CENTER_Y = SCREEN_HEIGHT/2;

var RANKING_ID = "donotbreak_world";

var BLOCK_WIDTH  = 74;
var BLOCK_HEIGHT = 25;

var BAR_POSITION_Y = 700;

var PATH_FORMAT_IMAGES = "images/{0}";
var PATH_FORMAT_SOUNDS = "sounds/{0}";
var LANGUAGE = "ja";

var UI_DATA = {
    main: { // MainScene用ラベル
        children: [{
            type: "Label",
            name: "score",
            align: "left",
            fontSize: 32,
            fillStyle: "White",
            shadowColor: "blue",
            shadowBlur: 4,
            x: 10,
            y: 30,
            baseline: "middle",
        }]
    },
    result: {
        children: [
            {
                type: "tm.display.RectangleShape",
                init: [SCREEN_WIDTH*0.8, SCREEN_HEIGHT*0.8, {
                    strokeStyle: "transparent",
                    fillStyle: "white",
                }],
                name: "frame",
                x: SCREEN_CENTER_X,
                y: SCREEN_CENTER_Y,
            },
            {
                type: "tm.display.Sprite",
                name: "scoreImage",
                init: ["img_text_score"],
                x: 320, y: 150,
                visible: false,
            },
            {
                type: "tm.display.Sprite",
                name: "rankImage",
                init: ["img_text_rank"],
                x: 320, y: 270,
                visible: false,
            },
            
            // スコア
            {
                type: "tm.display.Label",
                name: "scoreLabel",
                x: 320, y: 225,
                text: " ",
                align: "center",
                fontSize: 46,
                fillStyle: "black",
                fontWeight: "bold",
                visible: false,
            },
            {
                type: "tm.display.Label",
                name: "rankLabel",
                x: 320, y: 350,
                text: " ",
                align: "center",
                fontSize: 40,
                fillStyle: "black",
                fontWeight: "bold",
                visible: false,
            },
            {
                type: "tm.display.Label",
                name: "messageLabel",
                x: 320, y: 405,
                text: "守りたい。そのブロック",
                align: "center",
                fontSize: 24,
                fontWeight: "bold",
                fillStyle: "black",
                visible: false,
            },
            
            {
                type: "tm.display.CanvasElement",
                name: "ui",
                visible: false,
                children: [
                    // social button
                    {
                        type: "tm.display.Sprite",
                        name: "btnTweet",
                        init: ["img_btn_tweet"],
                        x: 320-150, y: 470,
                    },
                    {
                        type: "tm.display.Sprite",
                        name: "btnFacebook",
                        init: ["img_btn_facebook"],
                        x: 320, y: 470,
                    },
                    {
                        type: "tm.display.Sprite",
                        name: "btnLine",
                        init: ["img_btn_line"],
                        x: 320+150, y: 470,
                    },

                    // title and continue and ranking
                    {
                        type: "tm.display.Sprite",
                        name: "btnTitle",
                        init: ["img_btn_title"],
                        x: 320-100, y: 560,
                    },
                    {
                        type: "tm.display.Sprite",
                        name: "btnContinue",
                        init: ["img_btn_continue"],
                        x: 320+100, y: 560,
                    },
                    {
                        type: "tm.display.Sprite",
                        name: "btnRanking",
                        init: ["img_btn_ranking"],
                        x: 320, y: 635,
                    },

                    {
                        type: "tm.display.Label",
                        x: 365, y: 720,
                        text: "IDEA:",
                        align: "right", fontSize: 24, fontWeight: "bold", fillStyle: "black",
                    },
                    {
                        type: "tm.display.Label",
                        x: 365, y: 770,
                        text: "SOUND:",
                        align: "right", fontSize: 24, fontWeight: "bold", fillStyle: "black",
                    },
                    {
                        type: "tm.display.Label",
                        x: 365, y: 820,
                        text: "DEVELOP:",
                        align: "right", fontSize: 24, fontWeight: "bold", fillStyle: "black",
                    },
                    {
                        type: "tm.display.Label",
                        x: 385, y: 720,
                        text: "うちょ(utyo)",
                        align: "left", fontSize: 24, fontWeight: "bold", fillStyle: "rgb(24,215,9)",
                    },
                    {
                        type: "tm.display.RectangleShape",
                        init: [165, 2, {
                            fillStyle: "rgb(24,215,9)",
                            strokeStyle: "transparent",
                        }],
                        x: 385, y: 725,
                        originX: 0
                    },
                    {
                        type: "tm.display.Label",
                        x: 385, y: 770,
                        text: "魔王魂",
                        align: "left", fontSize: 24, fontWeight: "bold", fillStyle: "rgb(24,215,9)",
                    },
                    {
                        type: "tm.display.RectangleShape",
                        init: [75, 2, {
                            fillStyle: "rgb(24,215,9)",
                            strokeStyle: "transparent",
                        }],
                        x: 385, y: 775,
                        originX: 0
                    },
                    {
                        type: "tm.display.Label",
                        x: 385, y: 820,
                        text: "flowork",
                        align: "left", fontSize: 24, fontWeight: "bold", fillStyle: "rgb(24,215,9)",
                    },

                ],
            }
        ]
    }
};

if (isNative() == false) {
    var ASSETS = {
        "img_btn_continue": PATH_FORMAT_IMAGES.format("btn_continue.png"),
        "img_btn_ranking": PATH_FORMAT_IMAGES.format("btn_ranking.png"),
        "img_btn_start": PATH_FORMAT_IMAGES.format("btn_start.png"),
        "img_btn_title": PATH_FORMAT_IMAGES.format("btn_title.png"),
        "img_btn_tweet": PATH_FORMAT_IMAGES.format("btn_tweet.png"),
        "img_btn_line": PATH_FORMAT_IMAGES.format("btn_line.png"),
        "img_btn_facebook": PATH_FORMAT_IMAGES.format("btn_facebook.png"),
        "img_text_rank": PATH_FORMAT_IMAGES.format("text_rank.png"),
        "img_text_score": PATH_FORMAT_IMAGES.format("text_score.png"),
        "img_bonus": PATH_FORMAT_IMAGES.format("bonus.png"),
        "img_combo": PATH_FORMAT_IMAGES.format("combo.png"),
        "img_number_sprite": PATH_FORMAT_IMAGES.format("number_sprite.png"),
        
        // sounds
        "bgm_game": PATH_FORMAT_SOUNDS.format("bgm_game.mp3"),
        "bgm_bonus": PATH_FORMAT_SOUNDS.format("bgm_bonus.mp3"),
        "se_hit_block": PATH_FORMAT_SOUNDS.format("se_hit_block.wav"),
        "se_gameover": PATH_FORMAT_SOUNDS.format("se_gameover.wav"),
        "se_show": PATH_FORMAT_SOUNDS.format("se_show.wav"),
        "se_pon": PATH_FORMAT_SOUNDS.format("se_pon.wav"),
        "se_pi": PATH_FORMAT_SOUNDS.format("se_pi.wav"),
        "se_pipon": PATH_FORMAT_SOUNDS.format("se_pipon.wav"),
        "se_gagagagaga": PATH_FORMAT_SOUNDS.format("se_gagagagaga.wav"),
    };
}
else {
    ASSETS.$extend({
        "bgm_game": PATH_FORMAT_SOUNDS.format("bgm_game.mp3"),
        "bgm_bonus": PATH_FORMAT_SOUNDS.format("bgm_bonus.mp3"),
        "se_hit_block": PATH_FORMAT_SOUNDS.format("se_hit_block.wav"),
        "se_gameover": PATH_FORMAT_SOUNDS.format("se_gameover.wav"),
        "se_show": PATH_FORMAT_SOUNDS.format("se_show.wav"),
        "se_pon": PATH_FORMAT_SOUNDS.format("se_pon.wav"),
        "se_pi": PATH_FORMAT_SOUNDS.format("se_pi.wav"),
        "se_pipon": PATH_FORMAT_SOUNDS.format("se_pipon.wav"),
        "se_gagagagaga": PATH_FORMAT_SOUNDS.format("se_gagagagaga.wav"),
    });
}

var QUERY = tm.util.QueryString.parse(location.search.substr(1));

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
var gagagagaga = false;


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


