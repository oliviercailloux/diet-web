function makeId(length) {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var result = '';
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
}

function createButton(content, visible) {
	const button = document.createElement("button");
	{
		button.setAttribute("type", "button");
		button.setAttribute("class", "btn");
		let visibility;
		if (visible) {
			visibility = 'visible';
		} else {
			visibility = 'hidden';
		}
		button.setAttribute('style', `visibility:${visibility}`);

		const fasSpan = document.createElement('span');
		fasSpan.setAttribute("class", "fas");
		fasSpan.append(content);
		button.appendChild(fasSpan);
	}

	return button;
}

function createVeganIcon() {
	const fas = document.createElement('span');
	fas.setAttribute('class', 'fas fa-leaf');
	fas.setAttribute('style', 'color: Green');
	return fas;
}

function createMeatIcon() {
	const fas = document.createElement('span');
	fas.setAttribute('class', 'fas fa-drumstick-bite');
	fas.setAttribute('style', 'color: Red');
	return fas;
}

function createMixedIcon() {
	const faLayers = document.createElement('span');
	faLayers.setAttribute('class', 'fa-layers fa-fw');
	faLayers.setAttribute('style', 'background: MistyRose');
	
	const vegan = createVeganIcon();
	vegan.setAttribute('data-fa-transform', 'shrink-4 down-2 right-2');
	
	const meat = createMeatIcon();
	meat.setAttribute('data-fa-transform', 'shrink-4 up-2 left-2');
	
	faLayers.appendChild(vegan);
	faLayers.appendChild(meat);
	
	return faLayers;
}

function createRemainingIcon() {
	const faLayers = document.createElement('span');
	faLayers.setAttribute('class', 'fa-layers fa-fw');
	faLayers.setAttribute('style', 'background: MistyRose');
	
	const vegan = createVeganIcon();
	vegan.setAttribute('data-fa-transform', 'shrink-4 down-2 right-2');
	
	const meat = createMeatIcon();
	meat.setAttribute('data-fa-transform', 'shrink-4 up-2 left-2');
	
	faLayers.appendChild(vegan);
	faLayers.appendChild(meat);
	
	return faLayers;
}

class CountingRowContent {
	headerString;
	iconStyle;
	icon;

	hidingSpan;
	visibleSpan;
	leafSpans;
	countDaysOnlyVegan;
	withButtons;
	minusButton;
	plusButton;

	constructor(headerString, iconFunction, withButtons) {
		this.headerString = headerString;
		this.icon = iconFunction;
		this.withButtons = withButtons;
	}

	bindTo(element) {
		const headerDiv = document.createElement("div");
		headerDiv.setAttribute("class", "col");

		const headerP = document.createElement("p");
		const headerText = document.createTextNode(this.headerString);
		this.countDaysOnlyVegan = document.createTextNode(0);

		const barDiv = document.createElement("div");
		barDiv.setAttribute("class", "col-auto");

		this.hidingSpan = document.createElement("span");
		this.hidingSpan.setAttribute("style", "visibility:hidden");
		this.visibleSpan = document.createElement("span");

		this.leafSpans = [];
		for (let i = 0; i < 5; i++) {
			this.leafSpans[i] = this.icon.call();
		}

		const minusButton = createButton('', this.withButtons);
		const plusButton = createButton('', this.withButtons);
		if (this.withButtons) {
			this.minusButton = minusButton;
			this.plusButton = plusButton;
		} else {
			this.minusButton = null;
			this.plusButton = null;
		}

		element.appendChild(headerDiv);
		headerDiv.appendChild(headerP);
		headerP.appendChild(headerText);
		headerP.appendChild(this.countDaysOnlyVegan);

		element.appendChild(barDiv);
		barDiv.appendChild(minusButton);
		barDiv.appendChild(this.visibleSpan);
		barDiv.appendChild(this.hidingSpan);
		barDiv.appendChild(plusButton);
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
		this.minusButton.disabled = !enabled;
	}
	set plusEnabled(enabled) {
		this.plusButton.disabled = !enabled;
	}

	refresh(daysVegan) {
		for (let i = 0; i < daysVegan; i++) {
			this.visibleSpan.appendChild(this.leafSpans[i]);
		}
		for (let i = daysVegan; i < 5; i++) {
			this.hidingSpan.appendChild(this.leafSpans[i]);
		}
		this.countDaysOnlyVegan.textContent = daysVegan;
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
		const rowVegan = document.getElementById('row-vegan');
		this.veganRowContent = new CountingRowContent('Nombre de jours avec choix uniquement vegan : ', createVeganIcon, true);
		this.veganRowContent.bindTo(rowVegan);
		this.veganRowContent.minusOnClick = this.minusVegan.bind(this);
		this.veganRowContent.plusOnClick = this.plusVegan.bind(this);

		const rowMeat = document.getElementById('row-meat');
		this.meatRowContent = new CountingRowContent('Nombre de jours avec choix uniquement non-vegan : ', createMeatIcon, true);
		this.meatRowContent.bindTo(rowMeat);
		this.meatRowContent.minusOnClick = this.minusMeat.bind(this);
		this.meatRowContent.plusOnClick = this.plusMeat.bind(this);

		const rowMixed = document.getElementById('row-mixed');
		this.mixedRowContent = new CountingRowContent('Nombre de jours avec choix vegan et non-vegan : ', createMixedIcon, true);
		this.mixedRowContent.bindTo(rowMixed);
		this.mixedRowContent.minusOnClick = this.minusMixed.bind(this);
		this.mixedRowContent.plusOnClick = this.plusMixed.bind(this);

		const rowRemaining = document.getElementById('row-remaining');
		this.remainingRowContent = new CountingRowContent('Nombre de jours restant à répartir : ', createRemainingIcon, false);
		this.remainingRowContent.bindTo(rowRemaining);

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
