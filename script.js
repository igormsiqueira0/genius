function RNGBetween(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Genius {
	constructor(btnRedId, btnGreenId, btnBlueId, btnYellowId, btnStartId, levelDisplayId) {
		// elementos
		this.redBtn = document.getElementById(btnRedId);
		this.greenBtn = document.getElementById(btnGreenId);
		this.blueBtn = document.getElementById(btnBlueId);
		this.yellowBtn = document.getElementById(btnYellowId);
		this.btnsArr = [this.redBtn, this.greenBtn, this.blueBtn, this.yellowBtn];

		this.startBtn = document.getElementById(btnStartId);
		this.playerLevelDisplay = document.getElementById(levelDisplayId);

		// variaveis
		this.gameBtnsQueue = [RNGBetween(0, 3), RNGBetween(0, 3), RNGBetween(0, 3)];
		this.playerMove = [];
		this.playerLevel = 0;

		// binds
		this.playQueue = this.playQueue.bind(this);
		this.handlePlayerClick = this.handlePlayerClick.bind(this);
	}

	playQueue() {
		this.disableButtons();
		this.setMessage('Preste atenção!', 'darkblue');

		let queueIndex = 0;

		const interval = setInterval(
			() => {
				this.turnOnButton(this.btnsArr[this.gameBtnsQueue[queueIndex]]);
				queueIndex++;
				if (queueIndex >= this.gameBtnsQueue.length) {
					clearInterval(interval);
					this.startPlayerMove();
				}
			},
			this.playerLevel <= 10 ? 2500 - 100 * this.playerLevel : 2500 - 100 * 10,
		);
	}

	gameOver() {
		this.disableButtons();
		this.setMessage('Você perdeu! Reiniciar?', 'red');
		this.gameBtnsQueue = [RNGBetween(0, 3), RNGBetween(0, 3), RNGBetween(0, 3)];
		this.startBtn.disabled = false;
	}

	playerPass() {
		this.gameBtnsQueue.push(RNGBetween(0, 3));
		this.disableButtons();
		this.setMessage('Você passou! Prepare-se', 'green');
		this.playerLevel++;
		this.playerLevelDisplay.innerText = `Level alcançado: ${this.playerLevel}`;

		const timeout = setTimeout(() => {
			this.playQueue();
			clearTimeout(timeout);
		}, 3000);
	}

	disableButtons() {
		this.btnsArr.forEach((btn) => {
			btn.disabled = true;
		});
		this.startBtn.disabled = true;
	}

	enableButtons() {
		this.btnsArr.forEach((btn) => {
			btn.disabled = false;
		});
	}

	handlePlayerClick({ target }) {
		if (!target.disabled) {
			const btnIndex = +target.dataset.queue;

			this.playerMove.push(btnIndex);

			if (this.playerMove[this.playerMove.length - 1] !== this.gameBtnsQueue[this.playerMove.length - 1]) {
				this.gameOver();
			}

			if (this.playerMove.length === this.gameBtnsQueue.length) {
				this.playerPass();
			}
		}
	}

	startPlayerMove() {
		this.playerMove = [];

		const timeout = setTimeout(() => {
			this.enableButtons();
			this.setMessage('Clique na ordem mostrada!', 'darkgreen');
			clearTimeout(timeout);
		}, 2000);
	}

	turnOffButtons() {
		this.btnsArr.forEach((btn) => {
			btn.classList.remove('playing');
		});
	}

	turnOnButton(btnElement) {
		btnElement.classList.add('playing');

		const timeout = setTimeout(
			() => {
				this.turnOffButtons();
				clearTimeout(timeout);
			},
			this.playerLevel <= 10 ? 2000 - 100 * this.playerLevel : 2000 - 100 * 10,
		);
	}

	setMessage(message, color) {
		this.startBtn.innerText = message;
		this.startBtn.style.backgroundColor = color;
	}

	addEvents() {
		this.startBtn.addEventListener('click', this.playQueue);
		this.btnsArr.forEach((btn) => {
			btn.addEventListener('click', (e) => {
				this.handlePlayerClick(e);
			});
		});
		this.disableButtons();
		this.startBtn.disabled = false;
	}

	init() {
		this.addEvents();
	}
}

const genius = new Genius('red', 'green', 'blue', 'yellow', 'start', 'level');
genius.init();
