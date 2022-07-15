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
var _Login_instances, _Login_username, _Login_password, _Login_b64EncodeUnicode, _LoginController_localStorage, _a, _LoginGenerator_makeId;
import { verify } from './utils.js';
export class Login {
    constructor(username, password) {
        _Login_instances.add(this);
        _Login_username.set(this, void 0);
        _Login_password.set(this, void 0);
        verify(!username.includes(':'), 'No colon plz!');
        __classPrivateFieldSet(this, _Login_username, username, "f");
        __classPrivateFieldSet(this, _Login_password, password, "f");
    }
    get username() {
        return __classPrivateFieldGet(this, _Login_username, "f");
    }
    get password() {
        return __classPrivateFieldGet(this, _Login_password, "f");
    }
    get credentials() {
        const credentials = __classPrivateFieldGet(this, _Login_instances, "m", _Login_b64EncodeUnicode).call(this, `${__classPrivateFieldGet(this, _Login_username, "f")}:${__classPrivateFieldGet(this, _Login_password, "f")}`);
        return credentials;
    }
    get json() {
        const body = {
            username: this.username,
            password: this.password
        };
        return JSON.stringify(body);
    }
}
_Login_username = new WeakMap(), _Login_password = new WeakMap(), _Login_instances = new WeakSet(), _Login_b64EncodeUnicode = function _Login_b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (_match, p1) {
        return String.fromCharCode(parseInt(p1, 16));
    }));
};
export class LoginController {
    constructor() {
        _LoginController_localStorage.set(this, void 0);
        this.readLogin = this.readLogin.bind(this);
        this.write = this.write.bind(this);
        this.deleteLogin = this.deleteLogin.bind(this);
        __classPrivateFieldSet(this, _LoginController_localStorage, window.localStorage, "f");
    }
    readLogin() {
        const username = __classPrivateFieldGet(this, _LoginController_localStorage, "f").getItem('username');
        const password = __classPrivateFieldGet(this, _LoginController_localStorage, "f").getItem('password');
        const hasUsername = username != null;
        const hasPassword = password != null;
        if (hasUsername !== hasPassword)
            throw new Error("Bad local login state.");
        if (!hasUsername) {
            return undefined;
        }
        return new Login(username, password);
    }
    write(login) {
        __classPrivateFieldGet(this, _LoginController_localStorage, "f").setItem('username', login.username);
        __classPrivateFieldGet(this, _LoginController_localStorage, "f").setItem('password', login.password);
    }
    deleteLogin() {
        __classPrivateFieldGet(this, _LoginController_localStorage, "f").removeItem('username');
        __classPrivateFieldGet(this, _LoginController_localStorage, "f").removeItem('password');
    }
}
_LoginController_localStorage = new WeakMap();
export class LoginGenerator {
    static generateLogin(username) {
        const password = `${__classPrivateFieldGet(LoginGenerator, _a, "m", _LoginGenerator_makeId).call(LoginGenerator, 5)} ${__classPrivateFieldGet(LoginGenerator, _a, "m", _LoginGenerator_makeId).call(LoginGenerator, 5)} ${__classPrivateFieldGet(LoginGenerator, _a, "m", _LoginGenerator_makeId).call(LoginGenerator, 5)} ${__classPrivateFieldGet(LoginGenerator, _a, "m", _LoginGenerator_makeId).call(LoginGenerator, 5)} ${__classPrivateFieldGet(LoginGenerator, _a, "m", _LoginGenerator_makeId).call(LoginGenerator, 5)}`;
        return new Login(username || this.generateUsername(), password);
    }
    static generateUsername() {
        const colons = /:/g;
        const d = new Date();
        const username = `${d.toISOString().replace(colons, '')} - ${__classPrivateFieldGet(LoginGenerator, _a, "m", _LoginGenerator_makeId).call(LoginGenerator, 5)}`;
        return username;
    }
}
_a = LoginGenerator, _LoginGenerator_makeId = function _LoginGenerator_makeId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};
