enchant();

window.onload = function () {
	const game = new Game(400, 500);  				//画面サイズを400*500にする。（このサイズだとスマホでも快適なのでおススメ）

	/////////////////////////////////////////////////
	//ゲーム開始前に必要な画像・音を読み込む部分


	//クリック音読み込み
	const clickSndUrl = "click.wav";						//game.htmlからの相対パス
	game.preload([clickSndUrl]); 				//データを読み込んでおく

	//ふてくされ画像
	const zoyamaImgUrl = "futekusare.jpg";						//game.htmlからの相対パス
	game.preload([zoyamaImgUrl]);					//データを読み込んでおく

	//サングラス画像
	const sunglassImgUrl = "sunglass.jpg";						//game.htmlからの相対パス
	game.preload([sunglassImgUrl]);					//データを読み込んでおく

	//kill画像
	const killImgUrl = "kill_white.png";						//game.htmlからの相対パス
	game.preload([killImgUrl]);					//データを読み込んでおく

	//リトライボタン
	const retryImgUrl = "retry.png";						//game.htmlからの相対パス
	game.preload([retryImgUrl]);					//データを読み込んでおく

	//ツイートボタン
	const tweetImgUrl = "young_pantz.png";						//game.htmlからの相対パス
	game.preload([tweetImgUrl]);					//データを読み込んでおく		

	//読み込み終わり
	/////////////////////////////////////////////////


	game.onload = function () {					//ロードが終わった後にこの関数が呼び出されるので、この関数内にゲームのプログラムを書こう

		/////////////////////////////////////////////////
		//グローバル変数 

		let point = 0;									//ポイント
		let state = 0;								//現在のゲーム状態
		let time = 20;
		let flag1 = 0;
		let point_result = 0;
		let gameover_flag = 0;

		let oldTime;
		let newTime;
		let diff;

		//グローバル変数終わり
		/////////////////////////////////////////////////



		const mainScene = new Scene();					//シーン作成
		game.pushScene(mainScene);  					//mainSceneシーンオブジェクトを画面に設置
		mainScene.backgroundColor = "black"; 			//mainSceneシーンの背景は黒くした

		//ポイント表示テキスト
		const scoreText = new Label(); 					//テキストはLabelクラス
		scoreText.font = "20px Meiryo";				//フォントはメイリオ 20px 変えたかったらググってくれ
		scoreText.color = 'rgba(255,255,255,1)';		//色　RGB+透明度　今回は白
		scoreText.width = 400;							//横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる
		scoreText.moveTo(0, 30);						//移動位置指定
		mainScene.addChild(scoreText);					//mainSceneシーンにこの画像を埋め込む

		scoreText.text = "ザキマツの所持金：" + point;					//テキストに文字表示 Pointは変数なので、ここの数字が増える

		//時間表示テキスト
		const timeText = new Label(); 					//テキストはLabelクラス
		timeText.font = "14px Meiryo";				//フォントはメイリオ 20px 変えたかったらググってくれ
		timeText.color = 'rgba(255,255,255,1)';		//色　RGB+透明度　今回は白
		timeText.width = 400;							//横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる
		timeText.moveTo(300, 30);						//移動位置指定
		mainScene.addChild(timeText);					//mainSceneシーンにこの画像を埋め込む

		timeText.text = "残り時間：" + time;					//テキストに文字表示 Pointは変数なので、ここの数字が増える

		//ふてくされボタン
		const zoyamaImg = new Sprite(166, 221);				//画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		zoyamaImg.moveTo(118, 100);						//ぞう山ボタンの位置
		zoyamaImg.image = game.assets[zoyamaImgUrl];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		mainScene.addChild(zoyamaImg);					//mainSceneにこのぞう山画像を貼り付ける  

		//サングラスボタン
		const sunglassImg = new Sprite(166, 221);				//画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		
		//killボタン
		const killImg = new Sprite(116, 72);				//画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		killImg.moveTo(118, 400);						//ぞう山ボタンの位置
		killImg.image = game.assets[killImgUrl];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		mainScene.addChild(killImg);					//mainSceneにこのぞう山画像を貼り付ける  

		zoyamaImg.ontouchend = function () {				//ぞう山ボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			point += 10000;									//Pointを1増やす
			game.assets[clickSndUrl].clone().play();		//クリックの音を鳴らす。

			//クリックしたのでぞう山画像のｘ位置を戻す
			this.x = 100;							//this.xって何？と思った方、Zoyamaの関数内でぞう山の座標を動かすときにはthisを使います。

			//ポイントによって状態Stateを変更する
			if (point < 10000) {
				state = 1;
			} else if (point < 30000) {
				state = 2;
			} else if (point < 50000) {
				state = 3;
			} else if (point < 70000) {
				state = 4;
			} else if(point < 150000){
				state = 5;
			}else{
				state = 6;
			}

		};

		killImg.ontouchend = function() {
			point = 10000000;
		};

		///////////////////////////////////////////////////
		//メインループ　ここに主要な処理をまとめて書こう
		game.onenterframe = function () {
			newTime = Date.now();
			diff = newTime - oldTime;
			oldTime = Date.now();
			if(!isNaN(diff)){
				time = time - diff/1000;
			}
			

			if (state == 0) { 							//state=0のとき、初期セット状態(Pointの状態を０にして)
				zoyamaImg.x = 100;						//ぞう山のｘ座標を指定
				zoyamaImg.y = 100;						//ぞう山のy座標を指定
				sunglassImg.moveTo(-318, 100);
				point = 0;  							//point初期化
				state = 1;							//ゲームスタート状態に移行
			}
			if (state == 1) {							//ゲームスタート　状態１
				
				if(flag1 == 0 && zoyamaImg.x < 395){
					zoyamaImg.x += 5;
				}else if(flag1 == 0 && zoyamaImg.x ==395){
					flag1 = 1;
				}else if(flag1 == 1 && zoyamaImg.x > -150){
					zoyamaImg.x += -5;
				}else if(flag1 == 1 && zoyamaImg.x == -150){
					flag1 = 0;
				}
				
			}
			if (state == 2) {							//状態２（point３以上なら）
				//zoyamaImg.x += 15;
				if(flag1 == 0 && zoyamaImg.x < 395){
					zoyamaImg.x += 15;
				}else if(flag1 == 0 && zoyamaImg.x >=395){
					flag1 = 1;
				}else if(flag1 == 1 && zoyamaImg.x > -150){
					zoyamaImg.x += -15;
				}else if(flag1 == 1 && zoyamaImg.x <= -150){
					flag1 = 0;
				}
			}
			if (state == 3) {							//状態３（point６以上から）
				//zoyamaImg.x += 10;
				//zoyamaImg.y = 200 + Math.sin(zoyamaImg.x / 70) * 100; // ｙ座標を振幅100pxのサイン波で移動(Sinは便利なので慣れとくといいよ！)
				if(flag1 == 0 && zoyamaImg.x < 395){
					zoyamaImg.x += 15;
					zoyamaImg.y = 200 + Math.sin(zoyamaImg.x / 70) * 100;
				}else if(flag1 == 0 && zoyamaImg.x >=395){
					flag1 = 1;
				}else if(flag1 == 1 && zoyamaImg.x > -150){
					zoyamaImg.x += -15;
					zoyamaImg.y = 200 + Math.sin(zoyamaImg.x / 70) * 100;
				}else if(flag1 == 1 && zoyamaImg.x <= -150){
					flag1 = 0;
				}
			}
			if (state == 4) {							//状態４（point９以上から）　4は初期セット状態（state=4）と移動状態（state=4.1)の2つに状態をわける		
				//zoyamaImg.y = Math.random() * 400;			//ｙ座標の位置をランダムに決定
				//state = 4.1;
				if(flag1 == 0 && zoyamaImg.x < 395){
					zoyamaImg.x += 15;
					zoyamaImg.y = Math.random() * 400;
				}else if(flag1 == 0 && zoyamaImg.x >=395){
					flag1 = 1;
				}else if(flag1 == 1 && zoyamaImg.x > -150){
					zoyamaImg.x += -15;
					zoyamaImg.y = Math.random() * 400;
				}else if(flag1 == 1 && zoyamaImg.x <= -150){
					flag1 = 0;
				}
			}
			if (state == 5) {							//状態５（point１２以上から）　 ｙ軸が毎フレーム毎に変化する
				//zoyamaImg.x += 20;						//移動します。
				//zoyamaImg.y = Math.random() * 400;			//ｙ座標の位置を枚フレーム毎にランダム決定
				if(flag1 == 0 && zoyamaImg.x < 395){
					zoyamaImg.x = Math.random() * 350;
					zoyamaImg.y = Math.random() * 400;
				}else if(flag1 == 0 && zoyamaImg.x >=395){
					flag1 = 1;
				}else if(flag1 == 1 && zoyamaImg.x > -150){
					zoyamaImg.x = Math.random() * 350;
					zoyamaImg.y = Math.random() * 400;
				}else if(flag1 == 1 && zoyamaImg.x <= -150){
					flag1 = 0;
				}
			}
			if(state == 6){
				zoyamaImg.x = -400;
				zoyamaImg.y = -400;

				sunglassImg.moveTo(118, 100);						//ぞう山ボタンの位置
				sunglassImg.image = game.assets[sunglassImgUrl];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
				mainScene.addChild(sunglassImg);					//mainSceneにこのぞう山画像を貼り付ける
			}

			//現在のテキスト表示
			scoreText.text = "ザキマツの所持金：" + point+"円"; 				//point変数が変化するので、毎フレームごとにpointの値を読み込んだ文章を表示する
			let time_int = Math.ceil(time);
			timeText.text = "残り時間：" + time_int;

			//ゲームオーバー判定
			if (time <= 0 ) {	
									//残り時間が０で
				
				game.popScene();					//mainSceneシーンを外す
				game.pushScene(endScene);				//endSceneシーンを読み込ませる
				if(gameover_flag == 0){
					point_result = point;
					gameOverText.text = "GAMEOVER 記録：" + point_result + "円";
				}
				//ゲームオーバー後のテキスト表示
								//テキストに文字表示 
				gameover_flag = 1;
			}else if(point == 10000000){
				game.popScene();					//mainSceneシーンを外す
				game.pushScene(endScene);				//endSceneシーンを読み込ませる
				gameOverText.text = "GAMEOVER 記録： 死";
				gameover_flag = 1;
			}
			point -= 300;
		};



		////////////////////////////////////////////////////////////////
		//結果画面
		const endScene = new Scene();
		endScene.backgroundColor = "blue";

		//GAMEOVER
		const gameOverText = new Label(); 					//テキストはLabelクラス
		gameOverText.font = "20px Meiryo";				//フォントはメイリオ 20px 変えたかったらググってくれ
		gameOverText.color = 'rgba(255,255,255,1)';		//色　RGB+透明度　今回は白
		gameOverText.width = 400;							//横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる
		gameOverText.moveTo(0, 30);						//移動位置指定
		endScene.addChild(gameOverText);						//endSceneシーンにこの画像を埋め込む



		//リトライボタン
		const retryBtn = new Sprite(112, 70);				//画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		retryBtn.moveTo(50, 300);						//リトライボタンの位置
		retryBtn.image = game.assets[retryImgUrl];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		endScene.addChild(retryBtn);					//endSceneにこのリトライボタン画像を貼り付ける  

		retryBtn.ontouchend = function () {				//S_Retryボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			state = 0;
			time = 20;
			gameover_flag = 0;
			game.popScene();						//endSceneシーンを外す
			game.pushScene(mainScene);					//mainSceneシーンを入れる
		};

		//ツイートボタン
		const tweetBtn = new Sprite(147, 73);				//画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		tweetBtn.moveTo(230, 300);						//リトライボタンの位置
		tweetBtn.image = game.assets[tweetImgUrl];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		endScene.addChild(tweetBtn);					//endSceneにこのリトライボタン画像を貼り付ける  

		tweetBtn.ontouchend = function () {				//S_Tweetボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			//ツイートＡＰＩに送信
			//結果ツイート時にURLを貼るため、このゲームのURLをここに記入してURLがツイート画面に反映されるようにエンコードする
			//const url = encodeURI("https://hothukurou.com");
			//window.open("http://twitter.com/intent/tweet?text=頑張って" + point + "枚入手した&hashtags=ahoge&url=" + url); //ハッシュタグにahogeタグ付くようにした。
			window.open("https://twitcasting.tv/young_pantz/show/");
		};

	};
	game.start();
};