function makeId(length) {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var result = '';
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
}

function createButton(content) {
	const button = document.createElement("button");
	{
		button.setAttribute("type", "button");
		button.setAttribute("class", "btn");

		const fasSpan = document.createElement("span");
		fasSpan.setAttribute("class", "fas");
		fasSpan.append(content);
		button.appendChild(fasSpan);
	}

	return button;
}

class CountingRowContent {
	headerString;
	iconStyle;
	icon;

	hidingSpan;
	visibleSpan;
	leafSpans;
	countDaysOnlyVegan;
	minusButton;
	plusButton;

	constructor(headerString, icon, iconStyle) {
		this.headerString = headerString;
		this.iconStyle = iconStyle;
		this.icon = icon;
	}

	bindTo(rowVegan) {
		const headerDiv = document.createElement("div");
		headerDiv.setAttribute("class", "col");

		const headerP = document.createElement("p");
		const headerText = document.createTextNode(this.headerString);
		this.countDaysOnlyVegan = document.createTextNode(0);

		const barDiv = document.createElement("div");
		barDiv.setAttribute("class", "col-auto");

		this.minusButton = createButton('');

		this.hidingSpan = document.createElement("span");
		this.hidingSpan.setAttribute("style", "visibility:hidden");
		this.visibleSpan = document.createElement("span");

		this.leafSpans = [];
		for (let i = 0; i < 5; i++) {
			const fasSpanLeaf = document.createElement("span");
			fasSpanLeaf.setAttribute("class", "fas");
			fasSpanLeaf.setAttribute("style", this.iconStyle);
			fasSpanLeaf.append(this.icon);
			this.leafSpans[i] = fasSpanLeaf;
		}

		this.plusButton = createButton('');

		rowVegan.appendChild(headerDiv);
		headerDiv.appendChild(headerP);
		headerP.appendChild(headerText);
		headerP.appendChild(this.countDaysOnlyVegan);

		rowVegan.appendChild(barDiv);
		barDiv.appendChild(this.minusButton);
		barDiv.appendChild(this.visibleSpan);
		barDiv.appendChild(this.hidingSpan);
		barDiv.appendChild(this.plusButton);
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

	veganRowContent;

	constructor() {
		this.daysVegan = 3;
		this.daysMeat = 0;
		console.log(this.daysVegan);
	}

	bind() {
		const rowVegan = document.getElementById('row-vegan');
		this.veganRowContent = new CountingRowContent('Nombre de jours avec choix uniquement vegan : ', '', 'color: Green');
		this.veganRowContent.bindTo(rowVegan);
		this.veganRowContent.minusOnClick = this.minusVegan.bind(this);
		this.veganRowContent.plusOnClick = this.plusVegan.bind(this);
		this.refresh();
	}

	minusVegan() {
		if (this.daysVegan > 0)
			--this.daysVegan;
		console.log(`Minus vegan days, now: ${this.daysVegan}.`);
		this.refresh();
	}

	plusVegan() {
		if (this.daysVegan < 5)
			++this.daysVegan;
		console.log(`Plus vegan days, now: ${this.daysVegan}.`);
		this.refresh();
	}

	refresh() {
		this.veganRowContent.refresh(this.daysVegan);
	}
}
