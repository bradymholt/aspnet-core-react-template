import jsdom = require("jsdom");

before(function () {
    const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
    const win = doc.defaultView;

    (global as any).document = doc;
    (global as any).window = win;

    console.log("Successfully mocked a DOM with jsdom.");
});
