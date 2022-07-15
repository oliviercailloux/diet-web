import { verify, checkDefined, asHtmlElement, asButton } from './utils.js';
function visibleKeyword(visible) {
    if (visible) {
        return "visibility:visible";
    }
    else {
        return "visibility:hidden";
    }
}
class CountingRowContent {
    constructor(keyword) {
        this.keyword = keyword;
        this.icons = new Array(5);
        this.countDays = asHtmlElement(document.getElementById(`days-${this.keyword}`));
        for (let i = 1; i <= 5; i++) {
            this.icons[i] = asHtmlElement(document.getElementById(`${this.keyword}-${i}`));
        }
        this.icon = asHtmlElement(document.getElementById(`${this.keyword}-icon`));
        if (this.keyword !== 'remaining') {
            this.minusButton = asButton(document.getElementById(`btn-minus-${this.keyword}`));
            this.plusButton = asButton(document.getElementById(`btn-plus-${this.keyword}`));
        }
    }
    set minusOnClick(f) {
        checkDefined(this.minusButton).onclick = f;
    }
    set plusOnClick(f) {
        checkDefined(this.plusButton).onclick = f;
    }
    set minusEnabled(enabled) {
        if (this.minusButton === null) {
            throw new Error('No minus button, can’t enable it.');
        }
        checkDefined(this.minusButton).disabled = !enabled;
    }
    set plusEnabled(enabled) {
        if (this.plusButton === null) {
            throw new Error('No plus button, can’t enable it.');
        }
        checkDefined(this.plusButton).disabled = !enabled;
    }
    refresh(nbDays) {
        for (let i = 1; i <= nbDays; i++) {
            this.icons[i].setAttribute("style", "visibility:visible");
        }
        for (let i = nbDays + 1; i <= 5; i++) {
            this.icons[i].setAttribute("style", "visibility:hidden");
        }
        this.countDays.textContent = `${nbDays}`;
    }
}
export class JudgmentController {
    constructor() {
        this.daysVegan = 0;
        this.daysMeat = 0;
        this.daysMixed = 0;
        this.contentSubmitElement = asHtmlElement(document.getElementById('content-submit'));
        this.btnSubmitElement = asHtmlElement(document.getElementById('btn-submit-judgment'));
        this.veganRowContent = new CountingRowContent('vegan');
        this.veganRowContent.minusOnClick = this.minusVegan.bind(this);
        this.veganRowContent.plusOnClick = this.plusVegan.bind(this);
        this.meatRowContent = new CountingRowContent('meat');
        this.meatRowContent.minusOnClick = this.minusMeat.bind(this);
        this.meatRowContent.plusOnClick = this.plusMeat.bind(this);
        this.mixedRowContent = new CountingRowContent('mixed');
        this.mixedRowContent.minusOnClick = this.minusMixed.bind(this);
        this.mixedRowContent.plusOnClick = this.plusMixed.bind(this);
        this.remainingRowContent = new CountingRowContent('remaining');
    }
    init() {
        this.refresh();
    }
    minusVegan() {
        if (this.daysVegan >= 1)
            --this.daysVegan;
        this.refresh();
    }
    plusVegan() {
        if (this.daysRemaining >= 1)
            ++this.daysVegan;
        this.refresh();
    }
    minusMeat() {
        if (this.daysMeat >= 1)
            --this.daysMeat;
        this.refresh();
    }
    plusMeat() {
        if (this.daysRemaining >= 1)
            ++this.daysMeat;
        this.refresh();
    }
    minusMixed() {
        if (this.daysMixed >= 1)
            --this.daysMixed;
        this.refresh();
    }
    plusMixed() {
        if (this.daysRemaining >= 1)
            ++this.daysMixed;
        this.refresh();
    }
    get daysDetermined() {
        const tot = this.daysVegan + this.daysMeat + this.daysMixed;
        verify(tot >= 0 && tot <= 5, `Tot: ${tot}.`);
        return tot;
    }
    get daysRemaining() {
        const remaining = 5 - this.daysDetermined;
        verify(remaining >= 0 && remaining <= 5, `Remaining: ${remaining}.`);
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
        const canSubmit = (this.daysRemaining === 0);
        this.btnSubmitElement.setAttribute("style", visibleKeyword(canSubmit));
        this.contentSubmitElement.textContent = '';
        for (let i = 1; i <= this.daysVegan; ++i) {
            this.contentSubmitElement.append(this.veganRowContent.icon.cloneNode(true));
        }
        for (let i = 1; i <= this.daysMeat; ++i) {
            this.contentSubmitElement.append(this.meatRowContent.icon.cloneNode(true));
        }
        for (let i = 1; i <= this.daysMixed; ++i) {
            this.contentSubmitElement.append(this.mixedRowContent.icon.cloneNode(true));
        }
    }
}
