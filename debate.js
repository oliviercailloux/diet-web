if (window.location.protocol !== 'https:' && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") {
  throw new Error('Protocol should be https.');
}

l = window.localStorage;
console.log(l);

if (l.getItem('id') === null) {
  d = new Date();
  l.setItem('id', `${d.toISOString()} - ${makeId(5)}`);
  l.setItem('pw', `${makeId(5)} ${makeId(5)} ${makeId(5)} ${makeId(5)} ${makeId(5)}`);
}
const id = l.getItem('id');
const pw = l.getItem('pw');
console.log(`Using id ${id}.`);

const idExists = fetch('res');

const accept = document.getElementById('accept-conditions');
accept.onclick = function () {
    console.log('Conditions accepted.');
    
}