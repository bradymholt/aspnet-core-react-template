module.exports = {
    polyfill: function () {
        window.localStorage = window.sessionStorage = {
            getItem: function (key) {
                return this[key];
            },
            setItem: function (key, value) {
                this[key] = value;
            }
        };
    }
}

