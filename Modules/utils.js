export function verify(toVerify, message) {
    if (!toVerify) {
        throw new Error(message);
    }
}
export function check(toCheck, message) {
    if (!toCheck) {
        throw new Error(message);
    }
}
export function assertDefined(toCheck, message) {
    if ((toCheck === undefined) || (toCheck === null)) {
        throw new Error(message);
    }
}
export function checkDefined(toCheck, message) {
    if ((toCheck === undefined) || (toCheck === null)) {
        throw new Error(message);
    }
    return toCheck;
}
export function asArrayOrThrow(origin, message) {
    if (!Array.isArray(origin)) {
        throw new Error(message || `Expected array, got: ${origin}.`);
    }
    return origin;
}
export function asArrayOfIntegersOrThrow(origin, message) {
    const ar = asArrayOrThrow(origin);
    if (!ar.every(Number.isInteger)) {
        throw new Error(message || `Expected integers, got: ${origin}.`);
    }
    return ar;
}
export function asSetOfIntegersOrThrow(origin, message) {
    const ar = asArrayOfIntegersOrThrow(origin);
    const s = new Set(ar);
    if (ar.length !== s.size) {
        throw new Error(message || `Non-unique integers: ${origin}.`);
    }
    return s;
}
export function asHtmlElement(origin, message) {
    if (!(origin instanceof HTMLElement)) {
        throw new Error(message || `Not an HTML element: ${origin}.`);
    }
    return origin;
}
export function asSvgElement(origin, message) {
    if (!(origin instanceof SVGElement)) {
        throw new Error(message || `Not an SVG element: ${origin}.`);
    }
    return origin;
}
export function asAnchor(origin, message) {
    if (!(origin instanceof HTMLAnchorElement)) {
        throw new Error(message || `Not an anchor: ${origin}.`);
    }
    return origin;
}
export function asP(origin, message) {
    if (!(origin instanceof HTMLParagraphElement)) {
        throw new Error(message || `Not a paragraph: ${origin}.`);
    }
    return origin;
}
export function asInput(origin, message) {
    if (!(origin instanceof HTMLInputElement)) {
        throw new Error(message || `Not an input: ${origin}.`);
    }
    return origin;
}
export function asVideo(origin, message) {
    if (!(origin instanceof HTMLVideoElement)) {
        throw new Error(message || `Not a video: ${origin}.`);
    }
    return origin;
}
export function asFO(origin, message) {
    if (!(origin instanceof SVGForeignObjectElement)) {
        throw new Error(message || `Not a foreign object: ${origin}.`);
    }
    return origin;
}
export function asButton(origin, message) {
    if (!(origin instanceof HTMLButtonElement)) {
        throw new Error(message || `Not a button: ${origin}.`);
    }
    return origin;
}
