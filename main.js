function makeId(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var result = '';
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

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

console.log(`Using id ${id}.`);
