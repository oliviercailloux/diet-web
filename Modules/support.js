var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Controller_instances, _Controller_state, _Controller_localProcessFragmentMethod, _Controller_initLogin, _Controller_initState, _Controller_accepted, _Controller_judged, _Controller_show, _Controller_processFragment, _Controller_processFragmentWhenInitialized, _Controller_videoControllerInitialized, _Controller_showBigVideoAndPush, _Controller_showBigVideo, _Controller_hideBigVideoAndPush, _Controller_hideBigVideo, _Controller_setTitleSuffix;
import { verify, check, checkDefined } from './utils.js';
import { LoginController, LoginGenerator } from './login.js';
import { Requester } from './requester.js';
import { JudgmentController } from './judgment.js';
import { VideosController } from './video.js';
var State;
(function (State) {
    State[State["WAIT"] = 0] = "WAIT";
    State[State["ACCEPT"] = 1] = "ACCEPT";
    State[State["JUDGE"] = 2] = "JUDGE";
    State[State["VIDEOS"] = 3] = "VIDEOS";
})(State || (State = {}));
export class Controller {
    constructor() {
        _Controller_instances.add(this);
        _Controller_state.set(this, void 0);
        _Controller_localProcessFragmentMethod.set(this, void 0);
        __classPrivateFieldSet(this, _Controller_state, State.WAIT, "f");
        this.originalTitle = document.title;
        this.requester = new Requester();
        this.loginController = new LoginController();
        this.acceptElement = checkDefined(document.getElementById('conditions'));
        this.acceptElement.onclick = () => {
            const login = LoginGenerator.generateLogin();
            this.loginController.write(login);
            this.requester.accept(login).then(__classPrivateFieldGet(this, _Controller_instances, "m", _Controller_accepted).bind(this));
        };
        this.judgmentController = new JudgmentController();
        this.judgmentElement = checkDefined(document.getElementById('judgment'));
        this.judgmentController.init();
        const btnSubmitJudgmentElement = this.judgmentController.btnSubmitElement;
        const onSubmitJudgment = () => {
            const body = {
                daysVegan: this.judgmentController.daysVegan,
                daysMeat: this.judgmentController.daysMeat
            };
            const login = checkDefined(this.loginController.readLogin());
            this.requester.judge(login, body).then(__classPrivateFieldGet(this, _Controller_instances, "m", _Controller_judged).bind(this));
        };
        btnSubmitJudgmentElement.onclick = onSubmitJudgment;
        this.videosController = new VideosController();
        this.videosController.readyListener = __classPrivateFieldGet(this, _Controller_instances, "m", _Controller_videoControllerInitialized).bind(this);
        this.videosController.hideBigListener = __classPrivateFieldGet(this, _Controller_instances, "m", _Controller_hideBigVideoAndPush).bind(this);
        __classPrivateFieldSet(this, _Controller_localProcessFragmentMethod, __classPrivateFieldGet(this, _Controller_instances, "m", _Controller_processFragment).bind(this), "f");
        window.addEventListener('hashchange', __classPrivateFieldGet(this, _Controller_localProcessFragmentMethod, "f"));
        window.addEventListener('popstate', __classPrivateFieldGet(this, _Controller_localProcessFragmentMethod, "f"));
    }
    init() {
        this.requester.svg().then(this.videosController.importSvg);
        const login = this.loginController.readLogin();
        if (login === undefined) {
            console.log('No login, starting fresh.');
            __classPrivateFieldSet(this, _Controller_state, State.ACCEPT, "f");
            __classPrivateFieldGet(this, _Controller_instances, "m", _Controller_show).call(this);
            __classPrivateFieldGet(this, _Controller_instances, "m", _Controller_processFragment).call(this);
        }
        else {
            __classPrivateFieldSet(this, _Controller_state, State.WAIT, "f");
            this.requester.status(login).then(__classPrivateFieldGet(this, _Controller_instances, "m", _Controller_initLogin).bind(this));
            __classPrivateFieldGet(this, _Controller_instances, "m", _Controller_show).call(this);
        }
    }
}
_Controller_state = new WeakMap(), _Controller_localProcessFragmentMethod = new WeakMap(), _Controller_instances = new WeakSet(), _Controller_initLogin = function _Controller_initLogin(status) {
    if (status === null) {
        const login = this.loginController.readLogin();
        if (login !== undefined) {
            console.log('Local id', login.username, 'rejected remotely; deleting.');
            this.loginController.deleteLogin();
        }
        verify(this.loginController.readLogin() === undefined);
        __classPrivateFieldSet(this, _Controller_state, State.ACCEPT, "f");
        __classPrivateFieldGet(this, _Controller_instances, "m", _Controller_show).call(this);
        __classPrivateFieldGet(this, _Controller_instances, "m", _Controller_processFragment).call(this);
    }
    else {
        __classPrivateFieldGet(this, _Controller_instances, "m", _Controller_initState).call(this, status);
    }
}, _Controller_initState = function _Controller_initState(status) {
    const events = status.events;
    let hasJudgment = false;
    for (let i = 0; i < events.length; ++i) {
        const event = events[i];
        if (event.hasOwnProperty("judgment")) {
            hasJudgment = true;
            break;
        }
    }
    if (events.length === 0) {
        __classPrivateFieldSet(this, _Controller_state, State.ACCEPT, "f");
    }
    else if (!hasJudgment) {
        __classPrivateFieldSet(this, _Controller_state, State.JUDGE, "f");
    }
    else {
        __classPrivateFieldSet(this, _Controller_state, State.VIDEOS, "f");
    }
    this.videosController.importVideos(status.seen, status.toSee);
    __classPrivateFieldGet(this, _Controller_instances, "m", _Controller_show).call(this);
    __classPrivateFieldGet(this, _Controller_instances, "m", _Controller_processFragment).call(this);
}, _Controller_accepted = function _Controller_accepted(status) {
    check(__classPrivateFieldGet(this, _Controller_state, "f") === State.ACCEPT);
    __classPrivateFieldGet(this, _Controller_instances, "m", _Controller_initState).call(this, status);
    verify(__classPrivateFieldGet(this, _Controller_state, "f") === State.JUDGE);
}, _Controller_judged = function _Controller_judged() {
    verify(__classPrivateFieldGet(this, _Controller_state, "f") === State.JUDGE);
    __classPrivateFieldSet(this, _Controller_state, State.VIDEOS, "f");
    __classPrivateFieldGet(this, _Controller_instances, "m", _Controller_show).call(this);
}, _Controller_show = function _Controller_show() {
    this.acceptElement.hidden = __classPrivateFieldGet(this, _Controller_state, "f") !== State.ACCEPT;
    this.judgmentElement.hidden = __classPrivateFieldGet(this, _Controller_state, "f") !== State.JUDGE;
    this.videosController.visible = __classPrivateFieldGet(this, _Controller_state, "f") === State.VIDEOS;
}, _Controller_processFragment = function _Controller_processFragment() {
    verify(__classPrivateFieldGet(this, _Controller_state, "f") !== State.WAIT);
    if (window.location.hash.length === 0) {
        return;
    }
    verify(window.location.hash[0] === '#');
    const requested = window.location.hash.substring(1);
    if (requested === '') {
        return;
    }
    const id = parseInt(requested, 10);
    if (Number.isNaN(id)) {
        console.log('Non numeric id requested, can’t do', requested);
        window.history.replaceState(null, '', location.href.replace(location.hash, ''));
        return;
    }
    if (__classPrivateFieldGet(this, _Controller_state, "f") === State.VIDEOS) {
        /* Quite frequent because when init state we process as we dont know whether
        we are initialized already; more generally, it seems hard to guarantee that
        we won’t have a concurrent raise here and there. */
        console.log('Ignoring fragment for now, waiting for initialization.', __classPrivateFieldGet(this, _Controller_state, "f"));
    }
    else {
        console.log('Non video state, not honoring fragment.');
        window.history.replaceState(null, '', location.href.replace(location.hash, ''));
    }
}, _Controller_processFragmentWhenInitialized = function _Controller_processFragmentWhenInitialized(v) {
    if (window.location.hash.length === 0) {
        this.videosController.hideFrontVideoIfShown();
        return;
    }
    verify(window.location.hash[0] === '#');
    const requested = window.location.hash.substring(1);
    if (requested === '') {
        return;
    }
    const id = parseInt(requested, 10);
    if (Number.isNaN(id)) {
        console.log('Non numeric id requested, can’t do', requested);
        window.history.replaceState(null, '', location.href.replace(location.hash, ''));
        return;
    }
    const exists = v.exists(id);
    if (!exists) {
        console.log('Non existant id requested, can’t do', requested);
        window.history.replaceState(null, '', location.href.replace(location.hash, ''));
        return;
    }
    console.log('Asked for navigation to', requested, ', existing.');
    const video = v.video(id);
    __classPrivateFieldGet(this, _Controller_instances, "m", _Controller_showBigVideo).call(this, v, video);
}, _Controller_videoControllerInitialized = function _Controller_videoControllerInitialized(v) {
    v.showBigListener = (video) => __classPrivateFieldGet(this, _Controller_instances, "m", _Controller_showBigVideoAndPush).call(this, v, video);
    window.removeEventListener('hashchange', __classPrivateFieldGet(this, _Controller_localProcessFragmentMethod, "f"));
    window.removeEventListener('popstate', __classPrivateFieldGet(this, _Controller_localProcessFragmentMethod, "f"));
    window.addEventListener('hashchange', () => __classPrivateFieldGet(this, _Controller_instances, "m", _Controller_processFragmentWhenInitialized).call(this, v));
    window.addEventListener('popstate', () => __classPrivateFieldGet(this, _Controller_instances, "m", _Controller_processFragmentWhenInitialized).call(this, v));
    __classPrivateFieldGet(this, _Controller_instances, "m", _Controller_processFragmentWhenInitialized).call(this, v);
}, _Controller_showBigVideoAndPush = function _Controller_showBigVideoAndPush(v, video) {
    const newUrl = new URL(window.location.href);
    newUrl.hash = `#${video.fileId}`;
    window.history.pushState(null, '', newUrl);
    __classPrivateFieldGet(this, _Controller_instances, "m", _Controller_showBigVideo).call(this, v, video);
}, _Controller_showBigVideo = function _Controller_showBigVideo(v, video) {
    /* Might be playing already, if used a fragment then another fragment.*/
    this.videosController.hideFrontVideoIfShown();
    this.videosController.showFrontVideo(video);
    this.videosController.play();
    if (!video.seen)
        v.markSeen(video);
    __classPrivateFieldGet(this, _Controller_instances, "m", _Controller_setTitleSuffix).call(this, video.description);
    const login = checkDefined(this.loginController.readLogin());
    this.requester.markSeen(login, video.fileId);
}, _Controller_hideBigVideoAndPush = function _Controller_hideBigVideoAndPush() {
    const newUrl = new URL(window.location.href);
    newUrl.hash = '';
    window.history.pushState(null, '', newUrl);
    __classPrivateFieldGet(this, _Controller_instances, "m", _Controller_hideBigVideo).call(this);
}, _Controller_hideBigVideo = function _Controller_hideBigVideo() {
    this.videosController.hideFrontVideo();
    __classPrivateFieldGet(this, _Controller_instances, "m", _Controller_setTitleSuffix).call(this, '');
}, _Controller_setTitleSuffix = function _Controller_setTitleSuffix(suffix) {
    let suffixShort;
    if (suffix.length <= 25) {
        suffixShort = suffix;
    }
    else {
        suffixShort = suffix.substring(0, 20) + '…';
    }
    const baseTitle = this.originalTitle;
    if (suffix === '') {
        document.title = baseTitle;
    }
    else {
        document.title = `${baseTitle} – ${suffixShort}`;
    }
};
