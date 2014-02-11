/*
 * pausescene.js
 */


tm.define("PauseScene", {
	superClass: "tm.app.Scene",

	init: function() {
		this.superInit();

        tm.asset.Manager.get("bgm_game").setLoop(true).stop();
		this.fromJSON({
			children: {
				"bg": {
					type: "tm.display.RectangleShape",
					init: [SCREEN_WIDTH, SCREEN_HEIGHT, {
						// strokeStyle: "transparent",
						fillStyle: "rgba(0, 0, 0, 0.8)"
					}],
					originX: 0,
					originY: 0,
				},
				"label": {
					type: "tm.display.Label",
					text: "Pause",
					x: SCREEN_CENTER_X,
					y: SCREEN_CENTER_Y,
					fillStyle: "white",
					fontSize: 48,
				},
			},
		})

	},

	onpointingstart: function() {
        tm.asset.Manager.get("bgm_game").setLoop(true).play();
		this.app.popScene();
	},
})