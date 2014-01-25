/*
 * param
 */


var SCREEN_WIDTH    = 640;
var SCREEN_HEIGHT   = 960;
var SCREEN_CENTER_X = SCREEN_WIDTH/2;
var SCREEN_CENTER_Y = SCREEN_HEIGHT/2;

var BLOCK_WIDTH  = 74;
var BLOCK_HEIGHT = 25;

var BAR_POSITION_Y = 700;

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
                x: 320, y: 165,
                visible: false,
            },
            {
                type: "tm.display.Sprite",
                name: "rankImage",
                init: ["img_text_rank"],
                x: 320, y: 311,
                visible: false,
            },
            
            {
                type: "tm.display.Label",
                name: "scoreLabel",
                x: 320, y: 250,
                text: "2222225",
                align: "center",
                fontSize: 64,
                fillStyle: "black",
                visible: false,
            },
            {
                type: "tm.display.Label",
                name: "rankLabel",
                x: 320, y: 380,
                text: "222位",
                align: "center",
                fontSize: 40,
                fillStyle: "black",
                visible: false,
            },
            {
                type: "tm.display.Label",
                name: "messageLabel",
                x: 320, y: 550,
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
                    // button
                    {
                        type: "tm.display.Sprite",
                        name: "btnTweet",
                        init: ["img_btn_tweet"],
                        x: 320, y: 455,
                    },
                    {
                        type: "tm.display.Sprite",
                        name: "btnTop",
                        init: ["img_btn_top"],
                        x: 320-100, y: 620,
                    },
                    {
                        type: "tm.display.Sprite",
                        name: "btnAgain",
                        init: ["img_btn_again"],
                        x: 320+100, y: 620,
                    },

                    {
                        type: "tm.display.Label",
                        x: 365, y: 720,
                        text: "つくったひと:",
                        align: "right", fontSize: 24, fontWeight: "bold", fillStyle: "black",
                    },
                    {
                        type: "tm.display.Label",
                        x: 365, y: 770,
                        text: "音楽:",
                        align: "right", fontSize: 24, fontWeight: "bold", fillStyle: "black",
                    },
                    {
                        type: "tm.display.Label",
                        x: 365, y: 820,
                        text: "アプリ:",
                        align: "right", fontSize: 24, fontWeight: "bold", fillStyle: "black",
                    },
                    {
                        type: "tm.display.Label",
                        x: 385, y: 720,
                        text: "うちょ(ucho)",
                        align: "left", fontSize: 24, fontWeight: "bold", fillStyle: "black",
                    },
                    {
                        type: "tm.display.Label",
                        x: 385, y: 770,
                        text: "魔王魂",
                        align: "left", fontSize: 24, fontWeight: "bold", fillStyle: "black",
                    },
                    {
                        type: "tm.display.Label",
                        x: 385, y: 820,
                        text: "悠々自適",
                        align: "left", fontSize: 24, fontWeight: "bold", fillStyle: "black",
                    },

                ],
            }
        ]
    }
};

var ASSETS = {
    "img_btn_again": "images/btn_again.png",
    "img_btn_rank": "images/btn_rank.png",
    "img_btn_start": "images/btn_start.png",
    "img_btn_top": "images/btn_top.png",
    "img_btn_tweet": "images/btn_tweet.png",
    "img_text_rank": "images/text_rank.png",
    "img_text_score": "images/text_score.png",

    "se_pon": "./sounds/puu.wav",
    
    // TODO: 消す
    "img_top": "images/ss/block_top.png",
    "img_result": "images/ss/block_result.png",
};
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