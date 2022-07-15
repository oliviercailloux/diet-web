import { verify, asHtmlElement } from './utils.js';
const c1 = asHtmlElement(document.getElementById('champion-1'));
const c2 = asHtmlElement(document.getElementById('champion-2'));
const champions = asHtmlElement(document.getElementById('champions'));
verify(champions == c1.parentElement);
verify(champions == c2.parentElement);
let first;
let second;
if (Math.floor(Math.random() * 2) >= 1) {
    first = c1;
    second = c2;
}
else {
    first = c2;
    second = c1;
}
console.log('Chosen as first', first.id);
champions.append(second);
c1.hidden = false;
c2.hidden = false;
