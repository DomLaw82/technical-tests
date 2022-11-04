let dict = await Deno.readTextFile("./dictionary.txt");
dict = dict.split(/\n/);

const tileValues = {
	a: 1,
	b: 3,
	c: 3,
	d: 2,
	e: 1,
	f: 4,
	g: 2,
	h: 4,
	i: 1,
	j: 8,
	k: 5,
	l: 1,
	m: 3,
	n: 1,
	o: 1,
	p: 3,
	q: 10,
	r: 1,
	s: 1,
	t: 1,
	u: 1,
	v: 4,
	w: 4,
	x: 8,
	y: 4,
	z: 10,
};

class Tile {
	constructor(letter) {
		this.letter = letter;
		this.values = {
			a: 1,
			b: 3,
			c: 3,
			d: 2,
			e: 1,
			f: 4,
			g: 2,
			h: 4,
			i: 1,
			j: 8,
			k: 5,
			l: 1,
			m: 3,
			n: 1,
			o: 1,
			p: 3,
			q: 10,
			r: 1,
			s: 1,
			t: 1,
			u: 1,
			v: 4,
			w: 4,
			x: 8,
			y: 4,
			z: 10,
		};
		this.multiplier = 1;
	}

	value() {
		return this.values[this.letter];
	}

	showLetter() {
		return this.letter;
	}
}

class Word {
	constructor(tiles) {
		this.tiles = tiles;
	}
	wordScore() {
		return this.tiles.reduce((total, tile) => total + tile.value(), 0);
	}
	lettersString() {
		return this.tiles.reduce((total, tile) => total + tile.showLetter(), "");
	}
	validateWord() {
		for (let validWord of dict) {
			if (validWord === this.lettersString()) {
				return true;
			}
		}
		return;
	}
}

class Bag {
	constructor() {
		this.letters = [
			"a",
			"b",
			"c",
			"d",
			"e",
			"f",
			"g",
			"h",
			"i",
			"j",
			"k",
			"l",
			"m",
			"n",
			"o",
			"p",
			"q",
			"r",
			"s",
			"t",
			"u",
			"v",
			"w",
			"x",
			"y",
			"z",
		];
		this.amounts = {
			a: 9,
			b: 2,
			c: 2,
			d: 4,
			e: 12,
			f: 2,
			g: 3,
			h: 2,
			i: 9,
			j: 1,
			k: 1,
			l: 4,
			m: 2,
			n: 6,
			o: 8,
			p: 2,
			q: 1,
			r: 6,
			s: 4,
			t: 6,
			u: 4,
			v: 2,
			w: 2,
			x: 1,
			y: 2,
			z: 1,
		};
		this.contents = [];
		for (let letter of this.letters) {
			while (this.amounts[letter] > 0) {
				this.contents.push(new Tile(letter));
				--this.amounts[letter];
			}
		}
	}
	shuffleBag() {
		const maxIndex = this.contents.length;
		let seed = Date.now();
		for (let i = 0; i < this.contents.length; i++) {
			let swapPoint = Math.floor((Math.random() * seed) % maxIndex);
			let temp = this.contents[i];
			this.contents[i] = this.contents[swapPoint];
			this.contents[swapPoint] = temp;
		}
		return this.contents;
		// work out shuffle function
	}

	drawTile() {
		return this.contents.shift();
	}
}

class Player {
	constructor(name, bag) {
		this.name = name;
		this.rack = [];
		this.wordsPlayed = [];
		this.bag = bag;
		this.score = 0;
	}

	showRack() {
		return this.rack.reduce(
			(total, tile) => total + tile.showLetter() + ` `,
			`${this.name}: `
		);
	}
	fillRack() {
		let deficit = 7 - this.rack.length;
		for (let i = 0; i < deficit; i++) this.rack.push(this.bag.drawTile());
	}

	tilesToLetters() {
		return this.rack.map((i) => (i = i.showLetter()));
	}
	letterCount(letters) {
		let lettersSet = Array.from(new Set(letters)).sort();
		let countsList = [];
		for (let i of lettersSet) {
			let count = 0;
			for (let j of letters) {
				if (i === j) {
					++count;
				}
			}
			count > 1 ? countsList.push((i = `${i}${count}`)) : countsList.push(i);
		}
		return countsList;
	}
	longestValidWord() {
		const rackLetterCount = this.letterCount(this.tilesToLetters(this.rack));
		for (let i = this.rack.length; i > 2; i--) {
			for (let word of dict) {
				let wordLetterCount = this.letterCount(word.split(""));
				if (
					wordLetterCount.every((letter) => rackLetterCount.includes(letter)) &&
					word.length === i
				) {
					console.log(
						`%cLongest Possible Word: ${word} - ${word.length} letters`,
						"color: green; font-weight: bold"
					);
					return word;
				}
			}
		}
	}
	highestValueValidWord() {
		let highestValue = 0;
		let highestValueWord = [];
		const rackLetterCount = this.letterCount(this.tilesToLetters(this.rack));
		for (let i = this.rack.length; i > 2; i--) {
			for (let word of dict) {
				let wordLetterCount = this.letterCount(word.split(""));
				if (
					wordLetterCount.every((letter) => rackLetterCount.includes(letter))
				) {
					let wordValue = word
						.split("")
						.reduce((total, letter) => total + tileValues[letter], 0);
					if (wordValue > highestValue) {
						highestValue = wordValue;
						highestValueWord.pop();
						highestValueWord.push(word);
					}
				}
			}
		}
		console.log(
			`%cHighest Value Word: ${highestValueWord[0]} - ${highestValue} points\n`,
			"color: green; font-weight: bold"
		);
		return [highestValueWord, highestValue];
	}

	playTurn() {
		this.bag.contents.length > 0 && this.rack.length < 7 ? this.fillRack() : {};
		let playerOptions = this.showRack();
		console.log(playerOptions);
		let validChoice = true;
		while (validChoice) {
			let choice = prompt("What word would you like to play: ")
				.toLowerCase()
				.split("");
			for (let letter of choice) {
				// check player selected from letters in their rack
				if (!playerOptions.includes(letter)) {
					console.log(
						"\n%cYou selected a letter you don't have, try again!\n",
						"color: red; font-weight: bold"
					);
					validChoice = false;
					this.playTurn();
				}
			}
			// validate word choice with dict
			let word = [];
			for (let i of choice) {
				word.push(this.rack.find((tile) => tile.showLetter() === i));
			}
			let newWord = new Word(word);
			if (newWord.validateWord()) {
				// remove letters from rack
				console.log(
					`\nWord: ${newWord.lettersString()}\nScore: ${newWord.wordScore()}`
				);
				this.score += newWord.wordScore();
				this.longestValidWord();
				this.highestValueValidWord();
				for (let letter of choice) {
					let letterIndex = this.rack.findIndex(
						(tile) => tile.showLetter() === letter
					);
					this.rack.splice(letterIndex, 1);
				}
				// add word to list of words played
				this.wordsPlayed.push(choice);
				validChoice = false;
			} else {
				console.log(
					"\n%cInvalid word, try again!\n",
					"color: red; font-weight: bold"
				);
			}
		}
	}
}

class Game {
	constructor(players, bag) {
		this.players = players;
		this.bag = bag;
	}
	play() {
		for (let player of this.players) {
			player.playTurn();
		}
	}
}

function main() {
	let playing = prompt("Would you like to play a game of Scrabble? (y/n):");
	playing === "y" ? (playing = true) : (playing = false);
	while (playing) {
		let gameBag = new Bag();
		gameBag.shuffleBag();
		gameBag.shuffleBag();
		const noOfPlayers = prompt("How many players?");
		let players = [];
		for (let i = 0; i < noOfPlayers; i++) {
			let newPlayerName = prompt(`Player ${i + 1}'s name: `);
			players.push(new Player(newPlayerName, gameBag));
		}
		const game = new Game(players, gameBag);
		console.log("");
		while (gameBag.contents.length > 0) {
			game.play();
		}
		console.log("LAST WORDS...", "color: orange; font-weight: bold");
		game.play();
	}
}

main();

//insert check if player has joint longest word/highest value word
