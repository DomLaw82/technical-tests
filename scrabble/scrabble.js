let dict = await Deno.readTextFile("./dictionary.txt");
dict = dict.split(/\n/);

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
	}

	showRack() {
		return this.rack.reduce(
			(total, tile) => total + tile.showLetter() + " ",
			""
		);
	}

	playTurn() {
		this.fillRack();
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
			for (let i in choice) {
				word.push(
					this.rack[
						this.rack.findIndex((tile) => tile.showLetter() === choice[i])
					]
				);
			}
			let newWord = new Word(word);
			if (newWord.validateWord()) {
				// remove letters from rack
				console.log(
					`\nWord: ${newWord.lettersString()}\nScore: ${newWord.wordScore()}`
				);
				this.rack = this.rack.filter(
					(tile) => !choice.includes(tile.showLetter())
				);
				// add word to list of words played
				this.wordsPlayed.push(choice);
				// fill player rack
				this.fillRack();
				validChoice = false;
			} else {
				console.log(
					"\n%cInvalid word, try again!\n",
					"color: red; font-weight: bold"
				);
			}
		}
	}

	fillRack() {
		while (this.rack.length < 7) {
			this.rack.push(this.bag.drawTile());
		}
	}
}

class Game {
	constructor(players, bag) {
		this.players = players;
		this.bag = bag;
	}
}

let hello = new Word([
	new Tile("h"),
	new Tile("e"),
	new Tile("l"),
	new Tile("l"),
	new Tile("o"),
]);
// console.log(hello.lettersString(), hello.wordScore());
// console.log(hello.validateWord());

let gameBag = new Bag();
gameBag.shuffleBag();
gameBag.shuffleBag();
const Dominic = new Player("Dominic", gameBag);
Dominic.playTurn();
