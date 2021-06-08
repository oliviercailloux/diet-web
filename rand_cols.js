const c1 = document.getElementById('champion-1');
const c2 = document.getElementById('champion-2');

var toChange;
if (Math.floor(Math.random() * 2) >= 1) {
    toChange = c1;
} else {
    toChange = c2;
}
console.log(`Chosen as first: ${toChange.id}.`)
toChange.classList.add('order-first');
c1.removeAttribute('hidden');
c2.removeAttribute('hidden');
