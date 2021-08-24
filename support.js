/**
 * Converts a JS string to a UTF-8 "byte" array.
 * @param {string} str 16-bit unicode string.
 * @return {!Array<number>} UTF-8 byte array.
 * From https://github.com/google/closure-library/blob/master/closure/goog/crypt/crypt.js#L114
 */
function stringToUtf8ByteArray(str) {
	let out = [], p = 0;
	for (let i = 0; i < str.length; i++) {
		const c = str.charCodeAt(i);
		if (c < 128) {
			out[p++] = c;
		} else if (c < 2048) {
			out[p++] = (c >> 6) | 192;
			out[p++] = (c & 63) | 128;
		} else if (
			((c & 0xFC00) == 0xD800) && (i + 1) < str.length &&
			((str.charCodeAt(i + 1) & 0xFC00) == 0xDC00)) {
			// Surrogate Pair
			c = 0x10000 + ((c & 0x03FF) << 10) + (str.charCodeAt(++i) & 0x03FF);
			out[p++] = (c >> 18) | 240;
			out[p++] = ((c >> 12) & 63) | 128;
			out[p++] = ((c >> 6) & 63) | 128;
			out[p++] = (c & 63) | 128;
		} else {
			out[p++] = (c >> 12) | 224;
			out[p++] = ((c >> 6) & 63) | 128;
			out[p++] = (c & 63) | 128;
		}
	}
	return out;
};

/** I convert to UTF-8 because it seems much more prevalent (https://en.wikipedia.org/wiki/Popularity_of_text_encodings). Code taken from https://stackoverflow.com/a/9458996. */
function stringToUtf8ToBase64(input) {
	const utf8 = stringToUtf8ByteArray(input);
	let result = '';
	for (let i = 0; i < utf8.length; i++) {
		result += String.fromCharCode(utf8[i]);
	}
	const encoded = window.btoa(result);
	console.log(`Encoded ${input} to ${encoded}.`);
	return encoded;
}

function makeId(length) {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
}

function visibleKeyword(visible) {
	if (visible) {
		return "visibility:visible";
	}
	else {
		return "visibility:hidden";
	}
}

function getFetchInitWithAuth(login) {
	let headers = new Headers();
	const credentials = window.btoa(`${stringToUtf8ToBase64(login.username)}:${stringToUtf8ToBase64(login.password)}`)
	const authString = `Basic ${credentials}`;
	headers.set('Authorization', authString);
	console.log(`Appended ${authString}.`);
	headers.set('Accept', 'application/json');
	const init = {
		headers: headers
	};
	return init;
}

class Login {
	hadId;

	username;
	password;

	constructor(username, password) {
		const uUndef = username == undefined;
		const pUndef = password == undefined;
		if (uUndef != pUndef)
			throw new Error("Bad login use.");

		if (uUndef) {
			let l = window.localStorage;
			console.log(l);

			this.hadId = l.getItem('id') != null;
			if (!this.hadId) {
				const d = new Date();
				l.setItem('id', `${d.toISOString()} - ${makeId(5)}`);
				l.setItem('pw', `${makeId(5)} ${makeId(5)} ${makeId(5)} ${makeId(5)} ${makeId(5)}`);
			}

			this.username = l.getItem('id');
			this.password = l.getItem('pw');
		} else {
			this.username = username;
			this.password = password;
			this.hadId = true;
		}
	}
}

class Controller {
	url;
	meUrl;

	login;

	acceptElement;
	judgmentElement;
	videosElement;

	judgmentController;
	videosController;

	constructor() {
		this.url = 'http://localhost:8080/v0/';
		this.meUrl = 'http://localhost:8080/v0/me/';

		//		this.login = new Login();
		this.login = new Login("user0", "user");

		console.log(`Using id ${this.login.username}.`);

		this.acceptElement = document.getElementById('conditions');
		console.log(`Accept element: ${this.acceptElement}.`)
		this.acceptElement.onclick = () => {
			console.log('Conditions accepted.');
			const init = getFetchInitWithAuth(this.login);
			init.method = 'PUT';
			fetch(`${this.meUrl}accept`, init).then((r) => this.statusResponse.call(this, r));
		};

		this.judgmentController = new JudgmentController();
		this.judgmentElement = document.getElementById('judgment');
		this.judgmentElement.onclick = () => {
			console.log(`Judgment given on: ${this}.`);
			const init = getFetchInitWithAuth(this.login);
			init.method = 'POST';
			const body = {
				daysVegan: this.judgmentController.daysVegan,
				daysMeat: this.judgmentController.daysMeat
			}
			init.body = JSON.stringify(body);
			init.headers.set('content-type', 'application/json');
			console.log('Sending ', init.body, '.');
			fetch(`${this.meUrl}judgment`, init).then((r) => this.statusResponse.call(this, r));
		}
		this.judgmentController.init();

		this.videosElement = document.getElementById('videos');
		this.videosController = new VideosController(this);
	}

	statusQuery() {
		console.log(`Had id in status query: ${this.login.hadId}.`);
		if (this.login.hadId) {
			const init = getFetchInitWithAuth(this.login);
			fetch(`${this.meUrl}status`, init).then((r) => this.statusResponse.call(this, r));
		} else {
			this.refresh(null);
		}
	}

	statusResponse(response) {
		console.log('Response status: ', response.status, '');
		if (!response.ok) {
			throw new Error(`Got status ${response.status}.`);
		}
		console.log(`Had id in status response: ${this.login.hadId}.`);
		response.json().then((r) => this.refresh.call(this, r));
	}

	refresh(status) {
		console.log('Refreshing given status:', status, '.');

		const events = (status == null) ? [] : status.events;
		console.log(`Events: ${events}.`);
		let hasJudgment = false;
		for (let i = 0; i < status.events.length; ++i) {
			const event = events[i];
			console.log("Considering event", event, ".");
			if (event.hasOwnProperty("judgment")) {
				hasJudgment = true;
				break;
			}
		}
		console.log(`Has judgment: ${hasJudgment}.`);

		this.acceptElement.hidden = true;
		this.judgmentElement.hidden = true;
		this.videosElement.hidden = true;

		if (status == null || status.events.length == 0) {
			console.log(`Enabling accept.`);
			this.acceptElement.hidden = false;
		} else if (!hasJudgment) {
			console.log(`Enabling judgment.`);
			this.judgmentElement.hidden = false;
		} else {
			console.log(`Enabling videos.`);
			this.videosController.populate(status.toSee, VideoSection.TO_SEE);
			this.videosController.populate(status.seen, VideoSection.SEEN);
			this.videosElement.hidden = false;
		}
	}

	markSeen(video) {
		const init = getFetchInitWithAuth(this.login);
		init.method = 'PUT';
		const target = this.url + 'video/' + video.fileId;
		console.log('Marking video', video.fileId, 'seen to', target, '.');
		fetch(`${target}`, init).then((r) => this.statusResponse.call(this, r));
	}
}

class CountingRowContent {
	keyword;
	icons;
	icon;

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

		this.icon = document.getElementById(`${this.keyword}-icon`);

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

class JudgmentController {
	daysVegan;
	daysMeat;
	daysMixed;

	veganRowContent;
	meatRowContent;
	mixedRowContent;
	remainingRowContent;

	contentSubmitElement;
	btnSubmitElement;

	constructor() {
		this.daysVegan = 0;
		this.daysMeat = 0;
		this.daysMixed = 5;
	}

	init() {
		this.contentSubmitElement = document.getElementById('content-submit');
		this.btnSubmitElement = document.getElementById('btn-submit');

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

		const canSubmit = (this.daysRemaining == 0);
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

const VideoSection = {
	TO_SEE: "to see",
	SEEN: "seen"
}

class VideosController {
	controller;

	videosToSeeElement;
	videosSeenElement;
	videoEntryPrototypeElement;

	constructor(controller) {
		this.controller = controller;

		this.videosToSeeElement = document.getElementById("videos-to-see");
		this.videosSeenElement = document.getElementById("videos-seen");
		this.videoEntryPrototypeElement = this.videosToSeeElement.children[0];
		this.videoPrototypeElement = this.videoEntryPrototypeElement.children[0];
		console.log(`Videos to see element: `, this.videosToSeeElement, '.');
		console.log(`First video entry element: `, this.videoEntryPrototypeElement, '.');
		this.videoEntryPrototypeElement.remove();
	}

	populate(videos, section) {
		let element;
		switch (section) {
			case VideoSection.TO_SEE:
				element = this.videosToSeeElement;
				break;
			case VideoSection.SEEN:
				element = this.videosSeenElement;
				break;
		}
		while (element.lastChild) {
			element.removeChild(element.lastChild);
		}
		for (let i = 0; i < videos.length; ++i) {
			this.addVideo(element, videos[i], section);
		}
	}

	addVideo(parentElement, video, section) {
		console.log('Adding video: ', video, '.');
		let entry = this.videoEntryPrototypeElement.cloneNode(true);
		//		const id = 
		this.setVideo(entry, video, section);
		parentElement.appendChild(entry);
		//		videojs(id);
	}

	setVideo(videoEntryElement, video, section) {
		const videoElement = videoEntryElement.children[0];
		videoElement.id = "video-" + video.fileId;

		const srcMp4Element = videoElement.children[0];
		const srcWebmElement = videoElement.children[0];
		srcMp4Element.setAttribute('src', video.url);

		const descrElement = videoEntryElement.children[1];
		const textElement = descrElement.children[0];
		const btnElement = descrElement.children[1];
		textElement.append(video.description);
		switch (section) {
			case VideoSection.TO_SEE:
				btnElement.onclick = () => {
					console.log('Clicked', video);
					this.controller.markSeen(video);
				};
				break;
			case VideoSection.SEEN:
				btnElement.remove();
				break;
		}
		return videoElement.id;
	}

}