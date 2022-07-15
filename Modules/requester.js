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
var _a, _Requester_url, _Requester_meUrl, _Requester_getFetchInit, _Requester_getErrorHandlerExpecting;
import { verify } from './utils.js';
export class Requester {
    constructor() {
        _Requester_url.set(this, void 0);
        _Requester_meUrl.set(this, void 0);
        /* Thanks to https://stackoverflow.com/a/57949518/. */
        const isLocalhost = window.location.hostname === 'localhost' ||
            // [::1] is the IPv6 localhost address.
            window.location.hostname === '[::1]' ||
            // 127.0.0.1/8 is considered localhost for IPv4.
            (window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/) !== null);
        if (isLocalhost) {
            __classPrivateFieldSet(this, _Requester_url, `http://${window.location.hostname}:8080/v0/`, "f");
        }
        else {
            __classPrivateFieldSet(this, _Requester_url, 'https://diet-serv.herokuapp.com/v0/', "f");
        }
        __classPrivateFieldSet(this, _Requester_meUrl, `${__classPrivateFieldGet(this, _Requester_url, "f")}me/`, "f");
        console.log('Talking to', __classPrivateFieldGet(this, _Requester_url, "f"));
        this.accept.bind(this);
    }
    accept(login) {
        const initial = __classPrivateFieldGet(Requester, _a, "m", _Requester_getFetchInit).call(Requester, 'PUT');
        const init = {
            ...initial,
            body: login.json
        };
        const errorHandler = __classPrivateFieldGet(Requester, _a, "m", _Requester_getErrorHandlerExpecting).call(Requester, 200, 'accept');
        return fetch(`${__classPrivateFieldGet(this, _Requester_meUrl, "f")}create-accept`, init).then(errorHandler)
            .then(r => this.saveAndReturnStatus(r));
    }
    status(login) {
        const init = __classPrivateFieldGet(Requester, _a, "m", _Requester_getFetchInit).call(Requester, 'GET', login);
        const errorHandler = __classPrivateFieldGet(Requester, _a, "m", _Requester_getErrorHandlerExpecting).call(Requester, new Set([200, 401]), 'status');
        return fetch(`${__classPrivateFieldGet(this, _Requester_meUrl, "f")}status`, init).then(errorHandler)
            .then(r => {
            if (r.status === 401) {
                return null;
            }
            else {
                return this.saveAndReturnStatus(r);
            }
        });
    }
    saveAndReturnStatus(r) {
        const p = r.json();
        p.then(s => this.lastStatus = s);
        return p;
    }
    judge(login, body) {
        const initial = __classPrivateFieldGet(Requester, _a, "m", _Requester_getFetchInit).call(Requester, 'POST', login);
        const init = {
            ...initial,
            body: JSON.stringify(body)
        };
        const errorHandler = __classPrivateFieldGet(Requester, _a, "m", _Requester_getErrorHandlerExpecting).call(Requester, 200, 'judge');
        return fetch(`${__classPrivateFieldGet(this, _Requester_meUrl, "f")}judgment`, init).then(errorHandler)
            .then(r => this.saveAndReturnStatus(r));
    }
    markSeen(login, videoId) {
        const target = `${__classPrivateFieldGet(this, _Requester_url, "f")}video/${videoId}`;
        const init = __classPrivateFieldGet(Requester, _a, "m", _Requester_getFetchInit).call(Requester, 'PUT', login);
        const errorHandler = __classPrivateFieldGet(Requester, _a, "m", _Requester_getErrorHandlerExpecting).call(Requester, 200, 'judge');
        return fetch(target, init).then(errorHandler)
            .then(r => this.saveAndReturnStatus(r));
    }
    svg() {
        const target = `${__classPrivateFieldGet(this, _Requester_url, "f")}video/svg`;
        const initial = __classPrivateFieldGet(Requester, _a, "m", _Requester_getFetchInit).call(Requester, 'GET', undefined, 'application/svg+xml');
        const errorHandler = __classPrivateFieldGet(Requester, _a, "m", _Requester_getErrorHandlerExpecting).call(Requester, 200, 'svg');
        return fetch(target, initial).then(errorHandler)
            .then(r => r.text()).then(s => new DOMParser().parseFromString(s, 'image/svg+xml'));
    }
}
_a = Requester, _Requester_url = new WeakMap(), _Requester_meUrl = new WeakMap(), _Requester_getFetchInit = function _Requester_getFetchInit(method = 'GET', login, accept) {
    let headers = new Headers();
    const init = {
        headers: headers,
        method: method
    };
    if (login !== undefined) {
        const credentials = login.credentials;
        const authString = `Basic ${credentials}`;
        init.headers.set('Authorization', authString);
    }
    if (method === 'POST' || method === 'PUT') {
        init.headers.set('content-type', 'application/json');
    }
    if (accept === undefined) {
        accept = 'application/json';
    }
    init.headers.set('Accept', accept);
    return init;
}, _Requester_getErrorHandlerExpecting = function _Requester_getErrorHandlerExpecting(expectedStatus, requestName) {
    return function handle(response) {
        const expectedStatuses = (expectedStatus instanceof Set) ? expectedStatus : new Set().add(expectedStatus);
        verify(expectedStatuses.has(response.status), `Unexpected response status to ${requestName}: ${response.status}`);
        return response;
    };
};
