import * as jsdom from "jsdom";

before(function () {
    const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
    const win = doc.defaultView;

    (global as any).document = doc;
    (global as any).window = win;

    (window as any).localStorage = (window as any).sessionStorage = {
        getItem: function (key:string) {
            return this[key];
        },
        setItem: function (key:string, value:Object) {
            this[key] = value;
        }
    };

    console.log("Successfully mocked a DOM with jsdom.");
});
