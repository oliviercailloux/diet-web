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
var _SvgVideoGroup_e, _SvgVideos_instances, _SvgVideos_groups, _SvgVideos_clicked, _SvgVideos_hoveredOn, _SvgVideos_hoveredOff, _FrontVideoManager_instances, _FrontVideoManager_videosElement, _FrontVideoManager_videoFrontElement, _FrontVideoManager_dontHideOnEvent, _FrontVideoManager_localHideFrontVideoEventMethod, _FrontVideoManager_fireQuit, _FrontVideoManager_hideFrontVideoEvent, _VideosController_instances, _VideosController_videosElement, _VideosController_videosById, _VideosController_svgVideos, _VideosController_visible, _VideosController_frontVideoManager, _VideosController_considerShowing, _VideosController_showingBig, _InitializedVideosController_instances, _InitializedVideosController_videosById, _InitializedVideosController_svgVideos, _InitializedVideosController_showBigFullListener, _InitializedVideosController_fireShowBig, _InitializedVideosController_fireShowSmall, _InitializedVideosController_refreshVisibilities, _InitializedVideosController_visibilityStatus, _InitializedVideosController_getExisting;
import { checkDefined, asSvgElement, asVideo, asP, asFO, assertDefined, verify } from './utils.js';
class VideoDescription {
    constructor(e) {
        this.e = e;
        verify(e.childNodes.length == 2);
        verify(e.childNodes[0].nodeName.toUpperCase() === 'SPAN');
        verify(e.childNodes[1].nodeName.toUpperCase() === 'SPAN');
    }
    get element() {
        return this.e;
    }
    get id() {
        const inside = this.e.childNodes[1].textContent;
        assertDefined(inside);
        const n = Number(inside);
        verify(Number.isInteger(n));
        return n;
    }
}
class ForeignVideoDescription {
    constructor(e) {
        this.e = e;
        verify(e.childNodes.length == 1);
        verify(e.childNodes[0].nodeName.toUpperCase() === 'P');
    }
    get element() {
        return this.e;
    }
    get id() {
        return new VideoDescription(asP(this.e.childNodes[0])).id;
    }
}
class ForeignVideo {
    constructor(e) {
        this.e = e;
        verify(e.childNodes.length == 1);
        verify(e.childNodes[0].nodeName.toUpperCase() === 'VIDEO');
    }
    get element() {
        return this.e;
    }
    get videoElement() {
        return asVideo(this.e.childNodes[0]);
    }
    play() {
        const video = this.videoElement;
        video.hidden = false;
        video.play();
    }
    pause() {
        const video = this.videoElement;
        video.hidden = true;
        video.pause();
    }
}
class SvgVideoGroup {
    constructor(e) {
        _SvgVideoGroup_e.set(this, void 0);
        __classPrivateFieldSet(this, _SvgVideoGroup_e, e, "f");
        verify(e.childNodes.length == 4);
        verify(e.childNodes[0].nodeName.toUpperCase() === 'ELLIPSE');
        verify(e.childNodes[1].nodeName.toUpperCase() === 'FOREIGNOBJECT');
        new ForeignVideoDescription(asFO(__classPrivateFieldGet(this, _SvgVideoGroup_e, "f").childNodes[1]));
        verify(e.childNodes[2].nodeName.toUpperCase() === 'FOREIGNOBJECT');
        new ForeignVideo(asFO(__classPrivateFieldGet(this, _SvgVideoGroup_e, "f").childNodes[2]));
        verify(e.childNodes[3].nodeName.toUpperCase() === 'USE');
    }
    addClickListener(l) {
        __classPrivateFieldGet(this, _SvgVideoGroup_e, "f").addEventListener("click", l);
    }
    addHoverOnListener(l) {
        __classPrivateFieldGet(this, _SvgVideoGroup_e, "f").addEventListener('mouseenter', l);
    }
    addHoverOffListener(l) {
        __classPrivateFieldGet(this, _SvgVideoGroup_e, "f").addEventListener('mouseleave', l);
    }
    get foreignVideo() {
        return new ForeignVideo(asFO(__classPrivateFieldGet(this, _SvgVideoGroup_e, "f").childNodes[2]));
    }
    get playElement() {
        return asSvgElement(__classPrivateFieldGet(this, _SvgVideoGroup_e, "f").childNodes[3]);
    }
    get id() {
        return new ForeignVideoDescription(asFO(__classPrivateFieldGet(this, _SvgVideoGroup_e, "f").childNodes[1])).id;
    }
    set seen(seen) {
        const ell = asSvgElement(__classPrivateFieldGet(this, _SvgVideoGroup_e, "f").childNodes[0]);
        ell.classList.toggle('seen', seen);
    }
    set reachable(reachable) {
        const ell = asSvgElement(__classPrivateFieldGet(this, _SvgVideoGroup_e, "f").childNodes[0]);
        ell.classList.toggle('reachable', reachable);
    }
    set unreachable(unreachable) {
        const ell = asSvgElement(__classPrivateFieldGet(this, _SvgVideoGroup_e, "f").childNodes[0]);
        ell.classList.toggle('unreachable', unreachable);
    }
    play() {
        this.foreignVideo.play();
    }
}
_SvgVideoGroup_e = new WeakMap();
class SvgVideos {
    constructor(svg) {
        _SvgVideos_instances.add(this);
        _SvgVideos_groups.set(this, void 0);
        verify(svg.childNodes.length >= 1);
        const groupElements = svg.getElementsByTagName('g');
        __classPrivateFieldSet(this, _SvgVideos_groups, new Map(), "f");
        for (let groupElement of groupElements) {
            const vg = new SvgVideoGroup(groupElement);
            __classPrivateFieldGet(this, _SvgVideos_groups, "f").set(vg.id, vg);
        }
        for (let vg of __classPrivateFieldGet(this, _SvgVideos_groups, "f").values()) {
            vg.addClickListener((e) => __classPrivateFieldGet(this, _SvgVideos_instances, "m", _SvgVideos_clicked).call(this, e, vg.id));
            vg.addHoverOnListener(() => __classPrivateFieldGet(this, _SvgVideos_instances, "m", _SvgVideos_hoveredOn).call(this, vg.id));
            vg.addHoverOffListener(() => __classPrivateFieldGet(this, _SvgVideos_instances, "m", _SvgVideos_hoveredOff).call(this, vg.id));
        }
        this.showListener = () => { };
        this.hoverOnListener = () => { };
        this.hoverOffListener = () => { };
    }
    setStatus(id, status) {
        const g = __classPrivateFieldGet(this, _SvgVideos_groups, "f").get(id);
        assertDefined(g);
        g.seen = status === VideoVisibilityStatus.SEEN;
        g.reachable = status === VideoVisibilityStatus.REACHABLE;
        g.unreachable = status === VideoVisibilityStatus.UNREACHABLE;
    }
}
_SvgVideos_groups = new WeakMap(), _SvgVideos_instances = new WeakSet(), _SvgVideos_clicked = function _SvgVideos_clicked(e, id) {
    this.showListener(e, id);
}, _SvgVideos_hoveredOn = function _SvgVideos_hoveredOn(id) {
    this.hoverOnListener(id);
}, _SvgVideos_hoveredOff = function _SvgVideos_hoveredOff(id) {
    this.hoverOffListener(id);
};
class FrontVideoManager {
    constructor(videosElement) {
        _FrontVideoManager_instances.add(this);
        _FrontVideoManager_videosElement.set(this, void 0);
        _FrontVideoManager_videoFrontElement.set(this, void 0);
        _FrontVideoManager_dontHideOnEvent.set(this, void 0);
        _FrontVideoManager_localHideFrontVideoEventMethod.set(this, void 0);
        this.showVideoElement = this.showVideoElement.bind(this);
        this.hideFrontVideo = this.hideFrontVideo.bind(this);
        this.play = this.play.bind(this);
        __classPrivateFieldSet(this, _FrontVideoManager_videosElement, videosElement, "f");
        this.quitListener = () => { };
        __classPrivateFieldSet(this, _FrontVideoManager_localHideFrontVideoEventMethod, __classPrivateFieldGet(this, _FrontVideoManager_instances, "m", _FrontVideoManager_hideFrontVideoEvent).bind(this), "f");
    }
    showVideoElement(video) {
        verify(__classPrivateFieldGet(this, _FrontVideoManager_videoFrontElement, "f") === undefined);
        __classPrivateFieldSet(this, _FrontVideoManager_videoFrontElement, document.createElement('video'), "f");
        __classPrivateFieldGet(this, _FrontVideoManager_videoFrontElement, "f").setAttribute('width', '100%');
        __classPrivateFieldGet(this, _FrontVideoManager_videoFrontElement, "f").setAttribute('height', '100%');
        const source = document.createElement('source');
        __classPrivateFieldGet(this, _FrontVideoManager_videoFrontElement, "f").append(source);
        source.setAttribute('src', video.url);
        __classPrivateFieldGet(this, _FrontVideoManager_videoFrontElement, "f").classList.add('video-front');
        __classPrivateFieldGet(this, _FrontVideoManager_videoFrontElement, "f").controls = true;
        __classPrivateFieldGet(this, _FrontVideoManager_videosElement, "f").append(__classPrivateFieldGet(this, _FrontVideoManager_videoFrontElement, "f"));
        document.addEventListener('click', __classPrivateFieldGet(this, _FrontVideoManager_localHideFrontVideoEventMethod, "f"));
        document.addEventListener('keydown', __classPrivateFieldGet(this, _FrontVideoManager_localHideFrontVideoEventMethod, "f"));
    }
    play() {
        assertDefined(__classPrivateFieldGet(this, _FrontVideoManager_videoFrontElement, "f"));
        __classPrivateFieldGet(this, _FrontVideoManager_videoFrontElement, "f").play();
    }
    set dontHideOnEvent(e) {
        __classPrivateFieldSet(this, _FrontVideoManager_dontHideOnEvent, e, "f");
    }
    hideFrontVideo() {
        assertDefined(__classPrivateFieldGet(this, _FrontVideoManager_videoFrontElement, "f"));
        this.hideFrontVideoIfShown();
    }
    hideFrontVideoIfShown() {
        if (__classPrivateFieldGet(this, _FrontVideoManager_videoFrontElement, "f") === undefined)
            return;
        document.removeEventListener('click', __classPrivateFieldGet(this, _FrontVideoManager_localHideFrontVideoEventMethod, "f"));
        document.removeEventListener('keydown', __classPrivateFieldGet(this, _FrontVideoManager_localHideFrontVideoEventMethod, "f"));
        __classPrivateFieldGet(this, _FrontVideoManager_videoFrontElement, "f").remove();
        __classPrivateFieldSet(this, _FrontVideoManager_videoFrontElement, undefined, "f");
    }
}
_FrontVideoManager_videosElement = new WeakMap(), _FrontVideoManager_videoFrontElement = new WeakMap(), _FrontVideoManager_dontHideOnEvent = new WeakMap(), _FrontVideoManager_localHideFrontVideoEventMethod = new WeakMap(), _FrontVideoManager_instances = new WeakSet(), _FrontVideoManager_fireQuit = function _FrontVideoManager_fireQuit() {
    this.quitListener();
}, _FrontVideoManager_hideFrontVideoEvent = function _FrontVideoManager_hideFrontVideoEvent(event) {
    assertDefined(__classPrivateFieldGet(this, _FrontVideoManager_videoFrontElement, "f"));
    if (__classPrivateFieldGet(this, _FrontVideoManager_dontHideOnEvent, "f") === event) {
        //			console.log('Ignoring this one.');
        return;
    }
    verify(event.target instanceof Node);
    const clickOut = event.type === 'click' && !__classPrivateFieldGet(this, _FrontVideoManager_videoFrontElement, "f").contains(event.target);
    const keyOut = event instanceof KeyboardEvent && event.key === 'Escape';
    if (clickOut || keyOut) {
        __classPrivateFieldGet(this, _FrontVideoManager_instances, "m", _FrontVideoManager_fireQuit).call(this);
    }
};
var VideoVisibilityStatus;
(function (VideoVisibilityStatus) {
    VideoVisibilityStatus[VideoVisibilityStatus["SEEN"] = 0] = "SEEN";
    VideoVisibilityStatus[VideoVisibilityStatus["REACHABLE"] = 1] = "REACHABLE";
    VideoVisibilityStatus[VideoVisibilityStatus["UNREACHABLE"] = 2] = "UNREACHABLE";
})(VideoVisibilityStatus || (VideoVisibilityStatus = {}));
export class VideosController {
    constructor() {
        _VideosController_instances.add(this);
        _VideosController_videosElement.set(this, void 0);
        _VideosController_videosById.set(this, void 0);
        _VideosController_svgVideos.set(this, void 0);
        /**This is only a permission to show; this object will wait for complete initialization to show. */
        _VideosController_visible.set(this, void 0);
        _VideosController_frontVideoManager.set(this, void 0);
        this.importSvg = this.importSvg.bind(this);
        this.importVideos = this.importVideos.bind(this);
        this.showFrontVideo = this.showFrontVideo.bind(this);
        this.hideFrontVideo = this.hideFrontVideo.bind(this);
        this.play = this.play.bind(this);
        __classPrivateFieldSet(this, _VideosController_videosElement, checkDefined(document.getElementById('videos')), "f");
        __classPrivateFieldSet(this, _VideosController_frontVideoManager, new FrontVideoManager(__classPrivateFieldGet(this, _VideosController_videosElement, "f")), "f");
        __classPrivateFieldSet(this, _VideosController_visible, false, "f");
        this.readyListener = () => { };
    }
    set hideBigListener(l) {
        __classPrivateFieldGet(this, _VideosController_frontVideoManager, "f").quitListener = l;
    }
    showFrontVideo(video) {
        __classPrivateFieldGet(this, _VideosController_frontVideoManager, "f").showVideoElement(video);
    }
    hideFrontVideo() {
        __classPrivateFieldGet(this, _VideosController_frontVideoManager, "f").hideFrontVideo();
    }
    hideFrontVideoIfShown() {
        __classPrivateFieldGet(this, _VideosController_frontVideoManager, "f").hideFrontVideoIfShown();
    }
    play() {
        __classPrivateFieldGet(this, _VideosController_frontVideoManager, "f").play();
    }
    importSvg(svg) {
        const d = svg.documentElement;
        __classPrivateFieldSet(this, _VideosController_svgVideos, new SvgVideos(d), "f");
        __classPrivateFieldGet(this, _VideosController_videosElement, "f").append(d);
        __classPrivateFieldGet(this, _VideosController_instances, "m", _VideosController_considerShowing).call(this);
    }
    importVideos(seen, toSee) {
        const videos = seen.map(obj => ({ ...obj, seen: true })).concat(toSee.map(obj => ({ ...obj, seen: false })));
        __classPrivateFieldSet(this, _VideosController_videosById, new Map(), "f");
        videos.forEach(v => checkDefined(__classPrivateFieldGet(this, _VideosController_videosById, "f")).set(v.fileId, v));
        __classPrivateFieldGet(this, _VideosController_instances, "m", _VideosController_considerShowing).call(this);
    }
    get visible() {
        return __classPrivateFieldGet(this, _VideosController_visible, "f");
    }
    set visible(v) {
        const was = __classPrivateFieldGet(this, _VideosController_visible, "f");
        __classPrivateFieldSet(this, _VideosController_visible, v, "f");
        if (!was && v)
            __classPrivateFieldGet(this, _VideosController_instances, "m", _VideosController_considerShowing).call(this);
        __classPrivateFieldGet(this, _VideosController_videosElement, "f").hidden = !v;
    }
}
_VideosController_videosElement = new WeakMap(), _VideosController_videosById = new WeakMap(), _VideosController_svgVideos = new WeakMap(), _VideosController_visible = new WeakMap(), _VideosController_frontVideoManager = new WeakMap(), _VideosController_instances = new WeakSet(), _VideosController_considerShowing = function _VideosController_considerShowing() {
    if (!this.visible)
        return;
    if (__classPrivateFieldGet(this, _VideosController_svgVideos, "f") === undefined || __classPrivateFieldGet(this, _VideosController_videosById, "f") === undefined)
        return;
    const initialized = new InitializedVideosController(__classPrivateFieldGet(this, _VideosController_videosById, "f"), __classPrivateFieldGet(this, _VideosController_svgVideos, "f"), __classPrivateFieldGet(this, _VideosController_instances, "m", _VideosController_showingBig).bind(this));
    this.readyListener(initialized);
    __classPrivateFieldGet(this, _VideosController_videosElement, "f").hidden = false;
}, _VideosController_showingBig = function _VideosController_showingBig(e, _video) {
    /**We capture the show event so that if it
    leads to show the video (in the front manager), it
    won’t be instantaneously also used as a hide event. */
    __classPrivateFieldGet(this, _VideosController_frontVideoManager, "f").dontHideOnEvent = e;
};
export class InitializedVideosController {
    constructor(videosById, svgVideos, showBigFullListener) {
        _InitializedVideosController_instances.add(this);
        _InitializedVideosController_videosById.set(this, void 0);
        _InitializedVideosController_svgVideos.set(this, void 0);
        _InitializedVideosController_showBigFullListener.set(this, void 0);
        this.markSeen = this.markSeen.bind(this);
        this.video = this.video.bind(this);
        this.exists = this.exists.bind(this);
        __classPrivateFieldSet(this, _InitializedVideosController_videosById, videosById, "f");
        __classPrivateFieldSet(this, _InitializedVideosController_svgVideos, svgVideos, "f");
        this.showBigListener = () => { };
        this.showSmallListener = () => { };
        this.hideSmallListener = () => { };
        __classPrivateFieldSet(this, _InitializedVideosController_showBigFullListener, showBigFullListener, "f");
        __classPrivateFieldGet(this, _InitializedVideosController_svgVideos, "f").showListener = __classPrivateFieldGet(this, _InitializedVideosController_instances, "m", _InitializedVideosController_fireShowBig).bind(this);
        __classPrivateFieldGet(this, _InitializedVideosController_svgVideos, "f").hoverOnListener = __classPrivateFieldGet(this, _InitializedVideosController_instances, "m", _InitializedVideosController_fireShowSmall).bind(this);
        __classPrivateFieldGet(this, _InitializedVideosController_svgVideos, "f").hoverOffListener = () => this.hideSmallListener();
        __classPrivateFieldGet(this, _InitializedVideosController_instances, "m", _InitializedVideosController_refreshVisibilities).call(this);
    }
    markSeen(video) {
        const videoInMap = __classPrivateFieldGet(this, _InitializedVideosController_instances, "m", _InitializedVideosController_getExisting).call(this, video.fileId);
        verify(!videoInMap.seen);
        videoInMap.seen = true;
        __classPrivateFieldGet(this, _InitializedVideosController_instances, "m", _InitializedVideosController_refreshVisibilities).call(this);
    }
    exists(id) {
        if (!Number.isSafeInteger(id)) {
            throw new Error("Exists requires a numeric id");
        }
        return __classPrivateFieldGet(this, _InitializedVideosController_videosById, "f").has(id);
    }
    video(id) {
        return __classPrivateFieldGet(this, _InitializedVideosController_instances, "m", _InitializedVideosController_getExisting).call(this, id);
    }
}
_InitializedVideosController_videosById = new WeakMap(), _InitializedVideosController_svgVideos = new WeakMap(), _InitializedVideosController_showBigFullListener = new WeakMap(), _InitializedVideosController_instances = new WeakSet(), _InitializedVideosController_fireShowBig = function _InitializedVideosController_fireShowBig(e, id) {
    const video = __classPrivateFieldGet(this, _InitializedVideosController_instances, "m", _InitializedVideosController_getExisting).call(this, id);
    __classPrivateFieldGet(this, _InitializedVideosController_showBigFullListener, "f").call(this, e, video);
    this.showBigListener(video);
}, _InitializedVideosController_fireShowSmall = function _InitializedVideosController_fireShowSmall(id) {
    const video = __classPrivateFieldGet(this, _InitializedVideosController_instances, "m", _InitializedVideosController_getExisting).call(this, id);
    this.showSmallListener(video);
}, _InitializedVideosController_refreshVisibilities = function _InitializedVideosController_refreshVisibilities() {
    for (let v of __classPrivateFieldGet(this, _InitializedVideosController_videosById, "f").values()) {
        __classPrivateFieldGet(this, _InitializedVideosController_svgVideos, "f").setStatus(v.fileId, __classPrivateFieldGet(this, _InitializedVideosController_instances, "m", _InitializedVideosController_visibilityStatus).call(this, v));
    }
}, _InitializedVideosController_visibilityStatus = function _InitializedVideosController_visibilityStatus(video) {
    if (video.seen)
        return VideoVisibilityStatus.SEEN;
    const allSeen = video.countersFileIds.map(__classPrivateFieldGet(this, _InitializedVideosController_instances, "m", _InitializedVideosController_getExisting).bind(this)).every(v => v.seen);
    if (allSeen)
        return VideoVisibilityStatus.REACHABLE;
    return VideoVisibilityStatus.UNREACHABLE;
}, _InitializedVideosController_getExisting = function _InitializedVideosController_getExisting(id) {
    const video = __classPrivateFieldGet(this, _InitializedVideosController_videosById, "f").get(id);
    assertDefined(video);
    return video;
};
