import * as jsdom from "jsdom";
import * as localStorage from './polyfill/localStorage.js';

before(function () {
    const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
    const win = doc.defaultView;

    (global as any).document = doc;
    (global as any).window = win;

    localStorage.polyfill();

    console.log("Successfully mocked a DOM with jsdom and polyfilled localStorage.");
});
