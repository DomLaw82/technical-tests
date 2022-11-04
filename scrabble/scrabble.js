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

	letter() {
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
	wordString() {
		return this.tiles.reduce((total, tile) => total + tile.letter(), "");
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
		this.bag = [];
		for (let letter in letters) {
			while (this.amounts[letter] > 0) {
				this.bag.push(new Tile(letter));
				--this.amounts[letter];
			}
		}
	}

	shuffleBag() {
		let seed = Date.now();
		// work out shuffle function
	}

	drawTile() {
		return this.bag.shift();
	}
}

class Player {
	constructor(name, bag) {
		this.name = name;
		this.rack = [];
		this.bag = bag;
	}

	playTurn() {}

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
