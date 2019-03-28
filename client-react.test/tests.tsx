import { JSDOM } from "jsdom";
import * as localStorage from "./polyfill/localStorage.js";

before(function() {
    const dom = new JSDOM("<!doctype html><html><body></body></html>");

    (global as any).window = dom.window;
    (global as any).document = dom.window.document;

    localStorage.polyfill();

    console.log(
        "Successfully mocked a DOM with jsdom and polyfilled localStorage."
    );
});
