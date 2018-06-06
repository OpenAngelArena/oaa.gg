!(function() {
    var rootObjectName = window.__GRN;

    window[rootObjectName].ready(function() {
        /**
         * @type {{
         *   searchParams:      Function,
         *   searchParamExists: Function,
         *   searchParamValue:  Function,
         *   anchorParams:      Function,
         *   anchorParamExists: Function,
         *   anchorParamValue:  Function,
         * }} window[rootObjectName].URL
         */
        window[rootObjectName].URL = (function () {
            var searchParams = {};
            var anchorParams   = {};

            var handleDecodeParam = function(value) {
                var newValue = decodeURIComponent(value);

                while (newValue !== value) {
                    value = newValue;

                    newValue = decodeURIComponent(value);
                }

                return newValue;
            };

            var parts = window.location.search.replace(/^\?/, '').split('&');
            var keyValuePair;
            var i = 0;
            var j = parts.length;

            for (i; i < j; i++) {
                if (parts[i].indexOf('=') > -1) {
                    keyValuePair = parts[i].split('=');

                    if (keyValuePair[1]) {
                        searchParams[keyValuePair[0]] = handleDecodeParam(keyValuePair[1]);
                    } else {
                        searchParams[keyValuePair[0]] = null;
                    }
                } else {
                    searchParams[parts[i]] = null;
                }
            }

            parts = window.location.hash.replace(/^#/, '').split('&');
            i = 0;
            j = parts.length;

            for (i; i < j; i++) {
                if (parts[i].indexOf('=') > -1) {
                    keyValuePair = parts[i].split('=');

                    if (anchorParams[1]) {
                        searchParams[keyValuePair[0]] = handleDecodeParam(keyValuePair[1]);
                    } else {
                        anchorParams[keyValuePair[0]] = null;
                    }
                } else {
                    anchorParams[parts[i]] = null;
                }
            }

            return {
                get searchParams() {
                    return searchParams;
                },
                searchParamExists: function(param) {
                    return searchParams.hasOwnProperty(param);
                }.bind(this),
                searchParamValue: function(param) {
                    return searchParams[param];
                }.bind(this),


                get anchorParams() {
                    return anchorParams;
                },
                anchorParamExists: function(param) {
                    return anchorParams.hasOwnProperty(param);
                }.bind(this),
                anchorParamValue: function(param) {
                    return anchorParams[param];
                }.bind(this),
            }
        }());

        window[rootObjectName].modulePrepared('URL');
    });
}());
