function makeId(length) {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var result = '';
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
}

class CountingRowContent {
	keyword;
	icons;

	countDays;
	minusButton;
	plusButton;

	constructor(keyword) {
		this.keyword = keyword;
		this.icons = new Array(5);
	}

	init() {
		this.countDays = document.getElementById(`days-${this.keyword}`);

		for (let i = 1; i <= 5; i++) {
			this.icons[i] = document.getElementById(`${this.keyword}-${i}`);
		}

		this.minusButton = document.getElementById(`btn-minus-${this.keyword}`);
		this.plusButton = document.getElementById(`btn-plus-${this.keyword}`);
		console.log(`Plus button: ${this.plusButton}`);
	}

	/**
	 * @param {any} f
	 */
	set minusOnClick(f) {
		this.minusButton.onclick = f;
		console.log('Set minus button on click.');
	}

	/**
	 * @param {any} f
	 */
	set plusOnClick(f) {
		this.plusButton.onclick = f;
		console.log('Set plus button on click.');
	}

	set minusEnabled(enabled) {
		if (this.minusButton == null) {
			throw new Error('No minus button, can’t enable it.');
		}
		this.minusButton.disabled = !enabled;
	}
	set plusEnabled(enabled) {
		if (this.plusButton == null) {
			throw new Error('No plus button, can’t enable it.');
		}
		this.plusButton.disabled = !enabled;
	}

	refresh(nbDays) {
		console.log(`Row ${this.keyword} refresh to ${nbDays}.`);
		for (let i = 1; i <= nbDays; i++) {
			this.icons[i].setAttribute("style", "visibility:visible");
		}
		for (let i = nbDays + 1; i <= 5; i++) {
			this.icons[i].setAttribute("style", "visibility:hidden");
		}
		this.countDays.textContent = nbDays;
	}
}

class Controller {
	daysVegan;
	daysMeat;
	daysMixed;

	veganRowContent;
	meatRowContent;
	mixedRowContent;
	remainingRowContent;

	constructor() {
		this.daysVegan = 0;
		this.daysMeat = 0;
		this.daysMixed = 0;
	}

	bind() {
		this.veganRowContent = new CountingRowContent('vegan');
		this.veganRowContent.init();
		this.veganRowContent.minusOnClick = this.minusVegan.bind(this);
		this.veganRowContent.plusOnClick = this.plusVegan.bind(this);

		this.meatRowContent = new CountingRowContent('meat');
		this.meatRowContent.init();
		this.meatRowContent.minusOnClick = this.minusMeat.bind(this);
		this.meatRowContent.plusOnClick = this.plusMeat.bind(this);

		this.mixedRowContent = new CountingRowContent('mixed');
		this.mixedRowContent.init();
		this.mixedRowContent.minusOnClick = this.minusMixed.bind(this);
		this.mixedRowContent.plusOnClick = this.plusMixed.bind(this);

		this.remainingRowContent = new CountingRowContent('remaining');
		this.remainingRowContent.init();

		this.refresh();
	}

	minusVegan() {
		if (this.daysVegan >= 1)
			--this.daysVegan;
		console.log(`Minus vegan days, now: ${this.daysVegan}.`);
		this.refresh();
	}

	plusVegan() {
		if (this.daysRemaining >= 1)
			++this.daysVegan;
		console.log(`Plus vegan days, now: ${this.daysVegan}.`);
		this.refresh();
	}

	minusMeat() {
		if (this.daysMeat >= 1)
			--this.daysMeat;
		console.log(`Minus meat days, now: ${this.daysMeat}.`);
		this.refresh();
	}

	plusMeat() {
		if (this.daysRemaining >= 1)
			++this.daysMeat;
		console.log(`Plus meat days, now: ${this.daysMeat}.`);
		this.refresh();
	}

	minusMixed() {
		if (this.daysMixed >= 1)
			--this.daysMixed;
		console.log(`Minus mixed days, now: ${this.daysMixed}.`);
		this.refresh();
	}

	plusMixed() {
		if (this.daysRemaining >= 1)
			++this.daysMixed;
		console.log(`Plus mixed days, now: ${this.daysMixed}.`);
		this.refresh();
	}

	get daysDetermined() {
		const tot = this.daysVegan + this.daysMeat + this.daysMixed;
		if (tot < 0 || tot > 5)
			throw new Error(`Tot: ${tot}.`);
		return tot;
	}

	get daysRemaining() {
		const remaining = 5 - this.daysDetermined;
		if (remaining < 0 || remaining > 5)
			throw new Error(`Remaining: ${remaining}.`);
		return remaining;
	}

	refresh() {
		console.log('Controller refresh.');
		this.veganRowContent.refresh(this.daysVegan);
		this.meatRowContent.refresh(this.daysMeat);
		this.mixedRowContent.refresh(this.daysMixed);
		this.remainingRowContent.refresh(this.daysRemaining);

		this.veganRowContent.minusEnabled = (this.daysVegan >= 1);
		this.meatRowContent.minusEnabled = (this.daysMeat >= 1);
		this.mixedRowContent.minusEnabled = (this.daysMixed >= 1);
		this.veganRowContent.plusEnabled = (this.daysRemaining >= 1);
		this.meatRowContent.plusEnabled = (this.daysRemaining >= 1);
		this.mixedRowContent.plusEnabled = (this.daysRemaining >= 1);
	}
}
